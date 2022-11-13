// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";

contract Accountant {
    MultisigManager private multisigManager;
    address private masterWallet;

    event Withdrawn();
    event MasterWalletSet(address newMasterWallet);
    
    constructor(address _multisigManager, address _masterWallet) {
        multisigManager = MultisigManager(_multisigManager);
        masterWallet = _masterWallet;
    }
    
    fallback () external payable {}
    
    receive() external payable {}
    
    function withdraw() external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        uint256 twentieth = address(this).balance / 20;
        uint256 masterAmount = twentieth * 14; // 70%
        uint256 memberAmount = twentieth * 3; // 15%
        payable(multisigManager.getMemberA()).transfer(memberAmount);
        payable(multisigManager.getMemberB()).transfer(memberAmount);
        payable(masterWallet).transfer(masterAmount);
        emit Withdrawn();
    }

    function setMasterWallet(address _masterWallet) external {
        //Set address of master wallet contract
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("setMW"));
        masterWallet = _masterWallet;
        multisigManager.resetFunctionPermission("setMW");
        emit MasterWalletSet(_masterWallet);
    }
    
    function getContractBalance() external view returns(uint256 balance) {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        return address(this).balance;
    }

    function getMasterWallet() external view returns(address masterWalletAddress) {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        return masterWallet;
    }
}