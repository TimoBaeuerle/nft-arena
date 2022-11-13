// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./NFTAToken.sol";

contract PlayToEarnFund {
    MultisigManager private multisigManager;
    NFTAToken private nftaToken;
    mapping(address => bool) private approvedEarningContracts;
    mapping(address => bool) private memberAPermission;
    mapping(address => bool) private memberBPermission;
    mapping(address => bool) private masterPermission;

    event Withdrawn(address indexed target, uint256 amount);
    event SwitchedEarningContractApprovement(address indexed target, bool approved);
    event SwitchedMasterPermission(address indexed target, bool permitted);
    event SwitchedMemberAPermission(address indexed target, bool permitted);
    event SwitchedMemberBPermission(address indexed target, bool permitted);
    
    constructor(address _multisigManager, address _nftaToken) {
        multisigManager = MultisigManager(_multisigManager);
        nftaToken = NFTAToken(_nftaToken);
    }

    function withdrawToken(uint256 amount) external {
        //Check if earning contract is approved and sender is contract
        require(isEarningContractApproved(msg.sender));
        require(msg.sender != tx.origin);

        //Check contract balance
        uint256 contractBalance = nftaToken.balanceOf(address(this));
        require(amount <= contractBalance);

        //Transfer tokens to event
        nftaToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function switchEarningContractApprovement(address earningContractAddress) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(checkAddressPermission(earningContractAddress));
        approvedEarningContracts[earningContractAddress] = !approvedEarningContracts[earningContractAddress];
        resetAddressPermission(earningContractAddress);
        emit SwitchedEarningContractApprovement(earningContractAddress, approvedEarningContracts[earningContractAddress]);
    }

    //Permission switches for master and members
    function switchMasterPermission(address target) external {
        require(multisigManager.senderIsMaster(msg.sender));
        masterPermission[target] = !masterPermission[target];
        emit SwitchedMasterPermission(target, masterPermission[target]);
    }
    
    function switchMemberAPermission(address target) external {
        require(multisigManager.getMemberA() == msg.sender);
        memberAPermission[target] = !memberAPermission[target];
        emit SwitchedMemberAPermission(target, memberAPermission[target]);
    }

    function switchMemberBPermission(address target) external {
        require(multisigManager.getMemberB() == msg.sender);
        memberBPermission[target] = !memberBPermission[target];
        emit SwitchedMemberBPermission(target, memberBPermission[target]);
    }

    //Reset permissions for contracts address permission
    function resetAddressPermission(address target) private {
        masterPermission[target] = false;
        memberAPermission[target] = false;
        memberBPermission[target] = false;
    }

    //Check address permission function
    function isEarningContractApproved(address target) public view returns(bool approved) {
        return approvedEarningContracts[target];
    }
    
    function checkAddressPermission(address target) public view returns (bool permission) {
        return (masterPermission[target] && memberAPermission[target] && memberBPermission[target]);
    }
}