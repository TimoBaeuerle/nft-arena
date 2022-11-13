// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IRouter.sol";
import "./IMultisigManager.sol";

contract Player {
    struct PlayerObject {
        bytes32 id; //keccak of token contract & token id
        address tokenContract; //players token contract
        uint256 tokenId; //players token id
        string username; //players pseudonym
        uint256 created; //players created timestamp
        uint256 str; //players strength stats
        uint256 sta; //players stamina stats
        uint256 dex; //players dexterity stats
        uint256 luc; //players luck stats
        uint256 statPoints; //players available statpoints
        uint256 rank; //players rank
    }

    IMultisigManager private multisigManager;
    IERC20 private nftaToken;
    IRouter private routerContract;
    address private rankingContract;
    address private ecosystemFund;
    address private wethToken;
    uint256 private nftaRatingPrice;
    uint256 private coinRatingPrice;
    uint256 private playerCounter;
    bool private launched;
    address[] private owners;
    bytes32[] private playerIds;
    mapping(address => bool) private changeAdditionalsPermission;
    mapping(address => bool) private hasOwner;
    mapping(string => bool) private hasUsername;
    mapping(bytes32 => PlayerObject) private players;
    mapping(bytes32 => mapping(string => uint256)) private playerAdditionalNumbers;
    mapping(bytes32 => mapping(string => address)) private playerAdditionalAddresses;

    event ChangedNFTARatingPrice(address indexed sender, uint256 price);
    event ChangedCoinRatingPrice(address indexed sender, uint256 price);
    event ChangedRankingContract(address indexed sender, address newContract);
    event ChangedRouterContract(address indexed sender, address newContract);
    event ChangedAdditionalsPermission(address indexed target, bool value);
    event RatedPlayer(address indexed sender, bytes32 playerId, string username, uint256 str, uint256 sta, uint256 dex, uint256 luc);
    event ChangedUsername(bytes32 indexed playerId, string oldUsername, string newUsername);

    constructor(address _multisigManager, address _nftaToken, address _ecosystemFund, address _routerContract, address _wethToken) {
        multisigManager = IMultisigManager(_multisigManager);
        nftaToken = IERC20(_nftaToken);
        routerContract = IRouter(_routerContract);
        ecosystemFund = _ecosystemFund;
        wethToken = _wethToken;
        nftaRatingPrice = 1 * 10 ** 18; //1 NFTA Token
        coinRatingPrice = 1 * 10 ** 17; //0.1 Coin
    }

    function setNFTARatingPrice(uint256 newPrice) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("nftaRatingPrice"));
        nftaRatingPrice = newPrice;
        multisigManager.resetFunctionPermission("nftaRatingPrice");
        emit ChangedNFTARatingPrice(tx.origin, newPrice);
    }

    function setCoinRatingPrice(uint256 newPrice) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("coinRatingPrice"));
        coinRatingPrice = newPrice;
        multisigManager.resetFunctionPermission("coinRatingPrice");
        emit ChangedCoinRatingPrice(tx.origin, newPrice);
    }

    function setRankingContract(address newRankingContract) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("setRankingContract"));
        rankingContract = newRankingContract;
        multisigManager.resetFunctionPermission("setRankingContract");
        emit ChangedRankingContract(tx.origin, newRankingContract);
    }

    function setRouterContract(address newRouterContract) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("setRouterContract"));
        routerContract = IRouter(newRouterContract);
        multisigManager.resetFunctionPermission("setRouterContract");
        emit ChangedRouterContract(tx.origin, newRouterContract);
    }

    function launchContract() external {
        require(!launched, "This contract is already launched.");
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("launch"));
        launched = true;
        multisigManager.resetFunctionPermission("launch");
    }

    function switchAdditionalsPermission(address target) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("setAdditionalsPermission"));
        changeAdditionalsPermission[target] = !changeAdditionalsPermission[target];
        multisigManager.resetFunctionPermission("setAdditionalsPermission");
        emit ChangedAdditionalsPermission(target, changeAdditionalsPermission[target]);
    }

    function rating(address tokenContract, uint256 tokenId, string memory username, bool nftaPayment) external payable {
        //Check basic requirements
        require(launched, "This function is not available, please wait for project launch.");
        if (nftaPayment) {
            require(nftaRatingPrice > 0, "The price for ratings paid with NFTA tokens has not been set.");
            require(nftaToken.balanceOf(msg.sender) >= nftaRatingPrice, "Your NFTA Token balance is too low.");
        } else {
            require(coinRatingPrice > 0, "The price for ratings paid with the current network coin has not been set.");
            require(msg.value >= coinRatingPrice, "Your transfered value is too low.");
        }

        //Check target NFT & ownership
        IERC721 target = IERC721(tokenContract);
        address targetOwner = target.ownerOf(tokenId);
        require(msg.sender == targetOwner, "You do not own the target NFT.");

        //Check target NFT is not already rated
        bytes32 newPlayerId = keccak256(abi.encodePacked(tokenContract, tokenId));
        require(players[newPlayerId].created == 0, "Your target NFT is already rated.");

        //Check username is available
        require(!hasUsername[username], "Username has already been taken.");

        //Apply payment
        if (nftaPayment) {
            nftaToken.transferFrom(msg.sender, ecosystemFund, nftaRatingPrice);
        } else {
            uint deadline = block.timestamp + 1000;
            address[] memory path = new address[](2);
            path[0] = wethToken;
            path[1] = address(nftaToken);
            uint[] memory resultAmounts = routerContract.swapExactETHForTokens{value: msg.value}(0, path, address(this), deadline);
            if (resultAmounts[1] > 0) {
                uint256 contractBalance = nftaToken.balanceOf(address(this));
                nftaToken.transfer(ecosystemFund, contractBalance);
            }
        }

        //Calculate stats
        uint256 varPoints = 20;
        uint256 pseudoRand = (uint256(newPlayerId) % 11);
        uint256 strength = 5 + pseudoRand;
        varPoints -= pseudoRand;
        pseudoRand = (uint256(keccak256(abi.encodePacked(tokenContract, block.timestamp))) % 11);
        uint256 stamina = 5 + pseudoRand;
        varPoints -= pseudoRand;
        uint256 dexterity = 5;
        uint256 luck = 5;
        if (varPoints > 0) {
            pseudoRand = (uint256(keccak256(abi.encodePacked(tokenId, block.timestamp))) % 11);
            if (varPoints >= pseudoRand) {
                dexterity += pseudoRand;
                varPoints -= pseudoRand;
            } else {
                dexterity += varPoints;
                varPoints = 0;
            }
        }
        if (varPoints > 0) {
            luck += varPoints;
            varPoints = 0;
        }

        //Create new player
        PlayerObject memory newPlayerObject = PlayerObject(
            newPlayerId, //keccak of token contract & token id
            tokenContract, //players token contract
            tokenId, //players token id
            username, //players pseudonym
            block.timestamp, //players created timestamp
            strength, //players strength stats
            stamina, //players stamina stats
            dexterity, //players dexterity stats
            luck, //players luck stats
            10, //players available statpoints
            0 //players rank
        );
        playerAdditionalNumbers[newPlayerId]["initialStrength"] = strength;
        playerAdditionalNumbers[newPlayerId]["initialStamina"] = stamina;
        playerAdditionalNumbers[newPlayerId]["initialDexterity"] = dexterity;
        playerAdditionalNumbers[newPlayerId]["initialLuck"] = luck;
        hasUsername[username] = true;
        players[newPlayerId] = newPlayerObject;
        playerIds.push(newPlayerId);
        playerCounter += 1;
        if (!hasOwner[msg.sender]) {
            owners.push(msg.sender);
            hasOwner[msg.sender] = true;
        }
        emit RatedPlayer(tx.origin, newPlayerId, username, strength, stamina, dexterity, luck);
    }

    function changeUsername(bytes32 targetPlayerId, string memory newUsername) external {
        require(!hasUsername[newUsername], "Username has already been taken.");
        require(players[targetPlayerId].created > 0, "The target player does not exist.");
        IERC721 target = IERC721(players[targetPlayerId].tokenContract);
        address targetOwner = target.ownerOf(players[targetPlayerId].tokenId);
        require(msg.sender == targetOwner, "You do not own the target NFT.");
        hasUsername[newUsername] = true;
        hasUsername[players[targetPlayerId].username] = false;
        emit ChangedUsername(targetPlayerId, players[targetPlayerId].username, newUsername);
        players[targetPlayerId].username = newUsername;
    }

    function setStatPoints(bytes32 targetPlayerId, uint256 str, uint256 sta, uint256 dex, uint256 luc) external {
        require(players[targetPlayerId].created > 0, "The target player does not exist.");
        require(players[targetPlayerId].statPoints > 0, "The target player has no remaining statpoints.");
        require(players[targetPlayerId].statPoints >= (str + sta + dex + luc), "The target player has not enough statpoints.");
        IERC721 target = IERC721(players[targetPlayerId].tokenContract);
        address targetOwner = target.ownerOf(players[targetPlayerId].tokenId);
        require(msg.sender == targetOwner, "You do not own the target NFT.");
        players[targetPlayerId].str += str;
        players[targetPlayerId].sta += sta;
        players[targetPlayerId].dex += dex;
        players[targetPlayerId].luc += luc;
        players[targetPlayerId].statPoints -= (str + sta + dex + luc);
    }

    function changeRank(bytes32 playerId, uint256 newRank) external {
        require(players[playerId].created > 0, "The target player does not exist.");
        require(msg.sender == rankingContract, "The sender is not approved.");
        require(msg.sender != tx.origin, "Sender is not a contract");
        players[playerId].rank = newRank;
    }

    function addStatPoints(bytes32 playerId, uint256 amount) external {
        require(players[playerId].created > 0, "The target player does not exist.");
        require(msg.sender == rankingContract, "The sender is not approved.");
        require(msg.sender != tx.origin, "Sender is not a contract");
        players[playerId].statPoints += amount;
    }

    function removeStatPoints(bytes32 playerId, uint256 amount) external {
        require(players[playerId].created > 0, "The target player does not exist.");
        require(msg.sender == rankingContract, "The sender is not approved.");
        require(msg.sender != tx.origin, "Sender is not a contract");
        players[playerId].statPoints -= amount;
    }

    function resetStatPoints(bytes32 playerId) external {
        require(players[playerId].created > 0, "The target player does not exist.");
        IERC721 target = IERC721(players[playerId].tokenContract);
        address targetOwner = target.ownerOf(players[playerId].tokenId);
        require(msg.sender == targetOwner, "You do not own the target NFT.");
        uint256 allStatPoints = (players[playerId].str + players[playerId].sta + players[playerId].dex + players[playerId].luc + players[playerId].statPoints) - 40;
        players[playerId].str = playerAdditionalNumbers[playerId]["initialStrength"];
        players[playerId].sta = playerAdditionalNumbers[playerId]["initialStamina"];
        players[playerId].dex = playerAdditionalNumbers[playerId]["initialDexterity"];
        players[playerId].luc = playerAdditionalNumbers[playerId]["initialLuck"];
        players[playerId].statPoints = allStatPoints;
    }

    function changeAdditionalNumbers(bytes32 playerId, string memory key, uint256 value) external {
        require(players[playerId].created > 0, "The target player does not exist.");
        require(changeAdditionalsPermission[msg.sender], "The sender is not approved.");
        require(msg.sender != tx.origin, "Sender is not a contract");
        playerAdditionalNumbers[playerId][key] = value;
    }

    function changeAdditionalAddresses(bytes32 playerId, string memory key, address value) external {
        require(players[playerId].created > 0, "The target player does not exist.");
        require(changeAdditionalsPermission[msg.sender], "The sender is not approved.");
        require(msg.sender != tx.origin, "Sender is not a contract");
        playerAdditionalAddresses[playerId][key] = value;
    }

    //View functions
    function isUsernameUsed(string memory username) external view returns(bool) {
        return hasUsername[username];
    }

    function isPlayer(bytes32 playerId) external view returns(bool) {
        return players[playerId].created > 0;
    }

    function isOwnerOfPlayer(address playerOwner, bytes32 playerId) external view returns(bool) {
        bool result = false;
        if (players[playerId].created > 0) {
            IERC721 target = IERC721(players[playerId].tokenContract);
            address targetOwner = target.ownerOf(players[playerId].tokenId);
            result = playerOwner == targetOwner;
        }
        return result;
    }

    function getPlayer(bytes32 playerId) external view returns(PlayerObject memory) {
        return players[playerId];
    }

    function getPlayers() external view returns(PlayerObject[] memory) {
        PlayerObject[] memory result = new PlayerObject[](playerIds.length);
        for (uint256 i = 0; i < playerIds.length; i++) {
            result[i] = players[playerIds[i]];
        }
        return result;
    }

    function getPlayerIdByTokenValues(address tokenContract, uint256 tokenId) external view returns(bytes32) {
        bytes32 result;
        if (players[keccak256(abi.encodePacked(tokenContract, tokenId))].created > 0) {
            result = keccak256(abi.encodePacked(tokenContract, tokenId));
        }
        return result;
    }
    
    function getAdditionalNumbers(bytes32 playerId, string memory key) external view returns(uint256) {
        return playerAdditionalNumbers[playerId][key];
    }

    function getAdditionalAddresses(bytes32 playerId, string memory key) external view returns(address) {
        return playerAdditionalAddresses[playerId][key];
    }

    function getHasOwner(address owner) external view returns(bool) {
        return hasOwner[owner];
    }

    function getOwners() external view returns(address[] memory) {
        return owners;
    }

    function getPlayerIds() external view returns(bytes32[] memory) {
        return playerIds;
    }

    function getPlayerAmount() external view returns(uint256) {
        return playerCounter;
    }

    function getRatingPrice(bool nftaPayment) external view returns(uint256) {
        if (nftaPayment) {
            return nftaRatingPrice;
        } else {
            return coinRatingPrice;
        }
    }

    function getRankingContractAddress() external view returns(address) {
        return rankingContract;
    }

    function getEcosystemContractAddress() external view returns(address) {
        return ecosystemFund;
    }

    function hasAdditionalsPermission(address target) external view returns(bool) {
        return changeAdditionalsPermission[target];
    }

    function isLaunched() external view returns(bool) {
        return launched;
    }
}