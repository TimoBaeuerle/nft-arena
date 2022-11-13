// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./NFTAToken.sol";

contract MarketingFund {
    MultisigManager private multisigManager;
    NFTAToken private nftaToken;
    uint256 private transferLimit;

    event TokensTransferred(address indexed target, uint256 amount);
    event TransferLimitChanged(uint256 limit);
    
    constructor(address _multisigManager, address _nftaToken) {
        multisigManager = MultisigManager(_multisigManager);
        nftaToken = NFTAToken(_nftaToken);
        transferLimit = 100000 * 10**18;
    }

    function transferTokens(address target, uint256 amount) external {
        //Check requirements
        require(multisigManager.senderIsMember(msg.sender));
        require(multisigManager.checkMemberPermission("transfer"));
        require(transferLimit > 0 && amount <= transferLimit);
        require(target != multisigManager.getMemberA() && target != multisigManager.getMemberB() && target != multisigManager.owner());
        
        //Check contract balance
        uint256 contractBalance = nftaToken.balanceOf(address(this));
        require(amount <= contractBalance);

        //Transfer tokens
        nftaToken.transfer(target, amount);

        //Reset function permission
        multisigManager.resetFunctionPermission("transfer");
        emit TokensTransferred(target, amount);
    }

    function setTransferLimit(uint256 newLimit) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("setLimit"));
        transferLimit = newLimit;
        multisigManager.resetFunctionPermission("setLimit");
        emit TransferLimitChanged(newLimit);
    }

    function getTransferLimit() external view returns(uint256 limit) {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        return transferLimit;
    }
}