// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Multisig Manager Interface
interface IMultisigManager {
    function switchOwnershipPermission() external;
    
    function switchMembershipPermission() external;
    
    function switchMasterPermission(address target, string memory name) external;
    
    function switchMemberAPermission(address target, string memory name) external;
    
    function switchMemberBPermission(address target, string memory name) external;

    function resetFunctionPermission(string memory name) external;
    
    function checkFunctionPermission(address target, string memory name) external view returns(bool permission);

    function checkTransferOwnershipPermission(address target) external view returns(bool permission);
    
    function checkTransferMembershipPermission(address target) external view returns(bool permission);
    
    function checkSingleMemberPermission(string memory name) external view returns (bool permission);
    
    function checkMemberPermission(string memory name) external view returns (bool permission);
    
    function checkMasterPermission(string memory name) external view returns (bool permission);
    
    function checkMasterSingleMemberPermission(string memory name) external view returns (bool permission);
    
    function checkAllPermission(string memory name) external view returns (bool permission);

    function senderIsMember(address sender) external view returns(bool result);
    
    function senderIsMasterOrMember(address sender) external view returns(bool result);
    
    function senderIsMaster(address sender) external view returns(bool result);

    function getMemberA() external view returns(address member);

    function getMemberB() external view returns(address member);
}