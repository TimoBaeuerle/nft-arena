// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IRouter.sol";
import "./IMultisigManager.sol";
import "./SoulToken.sol";
import "./Player.sol";

contract Ranking is VRFConsumerBase {
    struct RankInformation {
        string name;
        uint256 rate;
        uint256 stats;
    }

    struct RequestInformation {
        address sender;
        bytes32 playerId;
        uint256 souls;
    }

    IMultisigManager private multisigManager;
    SoulToken private soulToken;
    Player private playerContract;
    IRouter private routerContract;
    RankInformation[] private ranks;
    address private wethToken;
    bytes32 private keyHash;
    uint256 private fee;
    mapping(address => uint256) private deposits;
    mapping(bytes32 => RequestInformation) private requests;

    event UpgradeSucceeded(bytes32 indexed playerId, uint256 newRank, uint256 attempts);
    event UpgradeFailed(bytes32 indexed playerId, uint256 newRank, uint256 attempts);
    event Deposited(address indexed target, string indexed from, uint256 amount);
    event AddedRank(address indexed sender, uint256 rankId, string rankName);
    event ChangedFeeAmount(address indexed sender, uint256 amount);

    //Check network dependent parameter before deployment
    constructor(address _multisigManager, address _soulToken, address _playerContract, address _routerContract, address _weth, address _vrfc, address _link, bytes32 _keyhash, uint256 _fee) VRFConsumerBase(_vrfc, _link) {
        multisigManager = IMultisigManager(_multisigManager);
        soulToken = SoulToken(_soulToken);
        playerContract = Player(_playerContract);
        routerContract = IRouter(_routerContract);
        wethToken = _weth;
        keyHash = _keyhash;
        fee = _fee * 10 ** 17; //0.(_fee) LINK
    }

    function getRandomNumber() private returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK token.");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(requests[requestId].souls > 0, "The request does not exist.");
        RequestInformation memory request = requests[requestId];

        //Iterate ranking up
        uint256 totalSouls = request.souls;
        bool upgradeSuccess = false;
        Player.PlayerObject memory player = playerContract.getPlayer(request.playerId);
        RankInformation memory nextRank = ranks[player.rank + 1];
        while (!upgradeSuccess && request.souls > 0) {
            uint256 random = (uint(keccak256(abi.encodePacked(randomness, (block.timestamp / request.souls)))) % nextRank.rate) + 1;
            request.souls -= 1;
            if (random == 1) {
                upgradeSuccess = true;
            }
        }

        //Burn souls
        soulToken.approvedBurn(request.sender, totalSouls - request.souls);

        //Upgrade players rank if succeeded
        if (upgradeSuccess) {
            playerContract.changeRank(request.playerId, player.rank + 1);
            playerContract.addStatPoints(request.playerId, nextRank.stats);
            emit UpgradeSucceeded(request.playerId, player.rank + 1, totalSouls - request.souls);
        } else {
            emit UpgradeFailed(request.playerId, player.rank + 1, totalSouls - request.souls);
        }
    }

    function deposit() external payable {
        require(msg.value > 0, "You have to send coins to pay this function");
        uint deadline = block.timestamp + 1000;
        address[] memory path = new address[](2);
        path[0] = wethToken;
        path[1] = address(LINK);
        uint[] memory resultAmounts = routerContract.swapExactETHForTokens{value: msg.value}(0, path, address(this), deadline);
        deposits[tx.origin] += resultAmounts[1];
        emit Deposited(tx.origin, "coin", resultAmounts[1]);
    }

    function depositLink(uint256 amount) external {
        require(LINK.balanceOf(tx.origin) >= amount, "You do not have enough LINK token to deposit the requested amount.");
        LINK.transferFrom(msg.sender, address(this), amount);
        deposits[tx.origin] += amount;
        emit Deposited(tx.origin, "link", amount);
    }

    function upgrade(bytes32 playerId, uint256 soulAmount) external returns(bytes32) {
        //Check requirements
        require(soulToken.checkApprovedBurner(address(this)), "This contract is not approved to burn souls");
        require(deposits[msg.sender] >= fee, "Your deposit balance is too low.");
        require(playerContract.isPlayer(playerId), "The target player does not exist.");
        Player.PlayerObject memory player = playerContract.getPlayer(playerId);
        IERC721 target = IERC721(player.tokenContract);
        address targetOwner = target.ownerOf(player.tokenId);
        require(msg.sender == targetOwner, "You are not allowed upgrade the rank for NFT's that you do not own.");
        require(player.rank < getHighestRank(), "You are already at the maximum rank.");
        require(soulToken.balanceOf(msg.sender) >= soulAmount, "Your soul token balance is too low.");
        require(soulAmount > 0, "You have to burn at least one soul");

        //Get random number
        bytes32 newRequestId = getRandomNumber();
        deposits[msg.sender] -= fee;
        requests[newRequestId] = RequestInformation(
            msg.sender,
            player.id,
            soulAmount
        );
        return newRequestId;
    }

    function addRank(string memory name, uint256 rate, uint256 statPoints) external {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to add new ranks");
        require(multisigManager.checkAllPermission("addRank"), "This function is not authorized to be called");
        ranks.push(
            RankInformation(
                name,
                rate,
                statPoints
            )
        );
        multisigManager.resetFunctionPermission("addRank");
        emit AddedRank(tx.origin, ranks.length - 1, name);
    }

    function changeFeeAmount(uint256 newFee) external {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to change fee");
        require(multisigManager.checkAllPermission("changeFee"), "This function is not authorized to be called");
        fee = newFee;
        multisigManager.resetFunctionPermission("changeFee");
        emit ChangedFeeAmount(tx.origin, newFee);
    }

    function getHighestRank() public view returns(uint256) {
        return ranks.length - 1;
    }

    function getRankName(uint256 rank) external view returns(string memory) {
        return ranks[rank].name;
    }

    function getRanks() external view returns(RankInformation[] memory) {
        return ranks;
    }

    function getLinkBalance() external view returns(uint256) {
        return LINK.balanceOf(address(this));
    }

    function hasFeeAmount() external view returns(bool) {
        return LINK.balanceOf(address(this)) >= fee;
    }

    function getFeeAmount() external view returns(uint256) {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to check fee amount");
        return fee;
    }
}