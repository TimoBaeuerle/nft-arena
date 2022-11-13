// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IMultisigManager.sol";

contract MultikeyNFT is ERC721, ERC721Enumerable {
    using Strings for uint256;

    IMultisigManager private multisigManager;
    uint256 public maxSupply = 777;
    uint256 public mintable = 200;
    uint256 public mintPrice = 1 * 10**18; //1 BNB
    uint256 private mintPerTx = 3;
    mapping(uint256 => uint256) private maxTypeId;
    mapping(uint256 => uint256) private currentTypeId;
    mapping(address => uint256) private winnerList;


    constructor(address _multisigManager) ERC721("Multikeys", "MTK") {
        //Set multisig manager
        multisigManager = IMultisigManager(_multisigManager);

        //Premint process
        _presetVariables();
    }

    function withdraw() external {
        require(multisigManager.senderIsMember(msg.sender), "You are not authorized to call the withdraw function");
        require(multisigManager.checkMemberPermission("withdraw"), "Withdraw function is not authorized");
        uint256 halfAmount = address(this).balance / 2;
        payable(multisigManager.getMemberA()).transfer(halfAmount);
        payable(multisigManager.getMemberB()).transfer(halfAmount);
        multisigManager.resetFunctionPermission("withdraw");
    }

    function increaseMintable(uint256 addValue) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("increase"));
        if (mintable + addValue > maxSupply) {
            //Set mintable to 777
            mintable = maxSupply;
        } else {
            //Increase mintable amount
            mintable += addValue;
        }
        multisigManager.resetFunctionPermission("increase");
    }

    function mint(uint256 amount) external payable {
        //Check basic requirements
        require(block.timestamp >= 1649358420, "This function is not available, please wait for sale launch.");
        require(totalSupply() < maxSupply, "All NFTs has already been minted.");
        require(totalSupply() < mintable, "Sale is closed at the moment.");
        require(amount <= mintPerTx, "You cannot mint that many tokens at once.");
        if (winnerList[msg.sender] > 0) {
            require(amount <= winnerList[msg.sender], "As a giveaway winner you cannot mint more tokens than you have won.");
        } else {
            require(msg.value >= (mintPrice * amount), "Your transfered value is too low.");
        }

        //Mint token
        uint256 usedWei = 0;
        for (uint256 i = 0; i < amount; i++) {
            if (totalSupply() < maxSupply && totalSupply() < mintable) {
                uint256 tokenId = generateTokenID();
                if (winnerList[msg.sender] > 0) {
                    winnerList[msg.sender] = winnerList[msg.sender] - 1;
                } else {
                    usedWei += mintPrice;
                }
                _safeMint(msg.sender, tokenId);
            } else {
                break;
            }
        }

        //Refund unused coins
        uint256 unusedWei = msg.value - usedWei;
        if (unusedWei > 0) {
            payable(msg.sender).transfer(unusedWei);
        }
    }

    function generateTokenID() private returns(uint256) {
        uint256 tokenId = 0;
        bool valid = false;
        uint256 random = (uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, totalSupply()))) % 4);
        while(!valid) {
            if (currentTypeId[random] < maxTypeId[random]) {
                tokenId = currentTypeId[random] + 1;
                currentTypeId[random] = tokenId;
                valid = true;
            } else {
                if (random == 4) {
                    random = 0;
                } else {
                    random++;
                }
            }
        }
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmYAmrvxV15JcfrchESjeZyZfUtgcQknSJPb3Yrk1wh3Lg/";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _presetVariables() private {
        require(multisigManager.senderIsMasterOrMember(msg.sender));

        //Mint partner nfts
        _safeMint(msg.sender, 1);
        _safeMint(msg.sender, 2);
        _safeMint(msg.sender, 3);

        //Set type infos
        currentTypeId[0] = 3;
        maxTypeId[0] = 99;
        currentTypeId[1] = 99;
        maxTypeId[1] = 210;
        currentTypeId[2] = 210;
        maxTypeId[2] = 329;
        currentTypeId[3] = 329;
        maxTypeId[3] = 508;
        currentTypeId[4] = 508;
        maxTypeId[4] = 777;

        //Init giveaway winner list
        winnerList[0x0DA180bAfcDBe5F8852B7751f347E57b3a3D783e] = 2;
        winnerList[0xDAAA81e0b4D596212E2AEe2F0d08136204597646] = 2;
        winnerList[0x14617a60E41674b8493539c1eA39161f4e6777C5] = 1;
        winnerList[0x9B0e8c959681B62050Bb5a2B3C0627B073DD9670] = 1;
        winnerList[0x2289565f6cb84e930Dfb70dd4bEf406abECC3311] = 1;
        winnerList[0x3c976eb9aF852CA7d14Ee59fd09276be564eff71] = 1;
        winnerList[0x933652847EDfBC5defBa238697eBBCD67a6Ea1ee] = 1;
        winnerList[0x4156FCbFfA5De01005FaD1f705377d0057afDb37] = 1;
        winnerList[0x84Cf222abbcfbA5163BC054Ad5fCdDF85c740e7E] = 1;
    }
}