// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./NFTAToken.sol";

contract EcosystemFund {
    MultisigManager private multisigManager;
    NFTAToken private nftaToken;
    mapping(address => bool) private approvedEvents;
    mapping(address => bool) private memberAPermission;
    mapping(address => bool) private memberBPermission;
    mapping(address => bool) private masterPermission;

    event Withdrawn(uint256 amount);
    event SwitchedEventApprovement(address indexed eventAddress, bool approved);
    event SwitchedMasterPermission(address indexed target, bool permitted);
    event SwitchedMemberAPermission(address indexed target, bool permitted);
    event SwitchedMemberBPermission(address indexed target, bool permitted);
    event PermissionResetted(address indexed target);
    
    constructor(address _multisigManager, address _nftaToken) {
        multisigManager = MultisigManager(_multisigManager);
        nftaToken = NFTAToken(_nftaToken);
    }

    function withdrawToken(uint256 amount) external {
        //Check if event is approved and sender is contract
        require(isEventApproved(msg.sender));
        require(msg.sender != tx.origin);

        //Check contract balance
        uint256 contractBalance = nftaToken.balanceOf(address(this));
        require(amount <= contractBalance);

        //Transfer tokens to event
        nftaToken.transfer(msg.sender, amount);
        emit Withdrawn(amount);
    }

    function switchEventApprovement(address eventAddress) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(checkAddressPermission(eventAddress));
        approvedEvents[eventAddress] = !approvedEvents[eventAddress];
        resetAddressPermission(eventAddress);
        emit SwitchedEventApprovement(eventAddress, approvedEvents[eventAddress]);
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
        emit PermissionResetted(target);
    }

    //Check address permission function
    function isEventApproved(address target) public view returns(bool approved) {
        return approvedEvents[target];
    }
    
    function checkAddressPermission(address target) public view returns (bool permission) {
        return (masterPermission[target] && memberAPermission[target] && memberBPermission[target]);
    }
}