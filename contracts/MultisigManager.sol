// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MultisigManager is Ownable {
    address private memberA;
    address private memberB;
    mapping(address => mapping(string => bool)) private memberAPermission;
    mapping(address => mapping(string => bool)) private memberBPermission;
    mapping(address => mapping(string => bool)) private masterPermission;
    mapping(address => bool) private transferOwnershipPermission;
    mapping(address => bool) private transferMembershipPermission;

    event TransferredOwnership(address sender, address target);
    event TransferredMemberA(address sender, address target);
    event TransferredMemberB(address sender, address target);

    //Init memberA and memberB
    constructor(address _memberA, address _memberB) {
        memberA = _memberA;
        memberB = _memberB;
    }
    
    //Secure ownership transfer
    function transferOwnership(address newOwner) public override onlyOwner {
        require(transferOwnershipPermission[memberA] && transferOwnershipPermission[memberB]);
        transferOwnershipPermission[memberA] = false;
        transferOwnershipPermission[memberB] = false;
        super.transferOwnership(newOwner);
        emit TransferredOwnership(msg.sender, newOwner);
    }
    
    //Secure membership transfer
    function transferMemberA(address newMemberA) external onlyOwner {
        require(transferMembershipPermission[memberA]);
        transferMembershipPermission[memberA] = false;
        memberA = newMemberA;
        emit TransferredMemberA(msg.sender, newMemberA);
    }
    
    function transferMemberB(address newMemberB) external onlyOwner {
        require(transferMembershipPermission[memberB]);
        transferMembershipPermission[memberB] = false;
        memberB = newMemberB;
        emit TransferredMemberB(msg.sender, newMemberB);
    }
    
    //Remove renounceOwnership from Ownable contract
    function renounceOwnership() public view override onlyOwner {
        revert("No ownership renounce possible");
    }
    
    //Permission switches for owner- and membership transfer
    function switchOwnershipPermission() external {
        require(msg.sender == memberA || msg.sender == memberB);
        transferOwnershipPermission[msg.sender] = !transferOwnershipPermission[msg.sender];
    }
    
    function switchMembershipPermission() external {
        require(msg.sender == memberA || msg.sender == memberB);
        transferMembershipPermission[msg.sender] = !transferMembershipPermission[msg.sender];
    }
    
    //Permission switches for master and members
    function switchMasterPermission(address target, string memory name) external onlyOwner {
        masterPermission[target][name] = !masterPermission[target][name];
    }
    
    function switchMemberAPermission(address target, string memory name) external {
        require(msg.sender == memberA);
        memberAPermission[target][name] = !memberAPermission[target][name];
    }
    
    function switchMemberBPermission(address target, string memory name) external {
        require(msg.sender == memberB);
        memberBPermission[target][name] = !memberBPermission[target][name];
    }

    //Reset permissions for contracts function permission
    function resetFunctionPermission(string memory name) external {
        require(tx.origin == owner() || tx.origin == memberA || tx.origin == memberB);
        require(msg.sender != tx.origin);
        masterPermission[msg.sender][name] = false;
        memberAPermission[msg.sender][name] = false;
        memberBPermission[msg.sender][name] = false;
    }
    
    //Check transfer permission functions
    function checkFunctionPermission(address target, string memory name) external view returns(bool permission) {
        require(msg.sender == owner() || msg.sender == memberA || msg.sender == memberB);
        if (msg.sender == owner()) {
            return masterPermission[target][name];
        } else if (msg.sender == memberA) {
            return memberAPermission[target][name];
        } else if (msg.sender == memberB) {
            return memberBPermission[target][name];
        }
    }

    function checkTransferOwnershipPermission(address target) external view returns(bool permission) {
        require(msg.sender == owner() || msg.sender == memberA || msg.sender == memberB);
        return transferOwnershipPermission[target];
    }
    
    function checkTransferMembershipPermission(address target) external view returns(bool permission) {
        require(msg.sender == owner() || msg.sender == memberA || msg.sender == memberB);
        return transferMembershipPermission[target];
    }
    
    //Check master and members permission functions
    function checkSingleMemberPermission(string memory name) external view returns (bool permission) {
        return (memberAPermission[msg.sender][name] || memberBPermission[msg.sender][name]);
    }
    
    function checkMemberPermission(string memory name) external view returns (bool permission) {
        return (memberAPermission[msg.sender][name] && memberBPermission[msg.sender][name]);
    }
    
    function checkMasterPermission(string memory name) external view returns (bool permission) {
        return masterPermission[msg.sender][name];
    }
    
    function checkMasterSingleMemberPermission(string memory name) external view returns (bool permission) {
        return (masterPermission[msg.sender][name] && (memberAPermission[msg.sender][name] || memberBPermission[msg.sender][name]));
    }
    
    function checkAllPermission(string memory name) external view returns (bool permission) {
        return (masterPermission[msg.sender][name] && memberAPermission[msg.sender][name] && memberBPermission[msg.sender][name]);
    }
    
    //Check role functions
    function senderIsMember(address sender) external view returns(bool result) {
        return (sender == memberA || sender == memberB);
    }
    
    function senderIsMasterOrMember(address sender) external view returns(bool result) {
        return (sender == owner() || sender == memberA || sender == memberB);
    }
    
    function senderIsMaster(address sender) external view returns(bool result) {
        return (sender == owner());
    }

    //Getter functions
    function getMemberA() external view returns(address member) {
        return memberA;
    }

    function getMemberB() external view returns(address member) {
        return memberB;
    }
}