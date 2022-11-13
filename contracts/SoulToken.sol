// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MultisigManager.sol";

contract SoulToken is ERC20 {
    MultisigManager private multisigManager;
    mapping(address => bool) private approvedMinters;
    mapping(address => bool) private approvedBurners;

    event MinterApproved(address target);
    event MinterRemoved(address target);
    event BurnerApproved(address target);
    event BurnerRemoved(address target);
    event Minted(address indexed target, uint256 amount);
    event Burned(address indexed target, uint256 amount);

    constructor(address _multisigManager) ERC20("Soul Token", "SOUL") {
        multisigManager = MultisigManager(_multisigManager);
    }
    
    function decimals() public pure override returns (uint8) {  
        return 0;
    }

    function approvedMint(address target, uint256 amount) external {
        require(msg.sender != tx.origin, "Sender is not a contract");
        require(approvedMinters[msg.sender], "Sender is not approved to call this function");
        _mint(target, amount);
        emit Minted(target, amount);
    }

    function approvedBurn(address target, uint256 amount) external {
        require(msg.sender != tx.origin, "Sender is not a contract");
        require(approvedBurners[msg.sender], "Sender is not approved to call this function");
        _burn(target, amount);
        emit Burned(target, amount);
    }

    function approveMinter(address target) external {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to approve new minters");
        require(multisigManager.checkAllPermission("approveMinter"), "This function is not authorized to be called");
        approvedMinters[target] = true;
        multisigManager.resetFunctionPermission("approveMinter");
        emit MinterApproved(target);
    }

    function removeMinter(address target) external {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to remove minters");
        require(multisigManager.checkAllPermission("removeMinter"), "This function is not authorized to be called");
        approvedMinters[target] = false;
        multisigManager.resetFunctionPermission("removeMinter");
        emit MinterRemoved(target);
    }

    function approveBurner(address target) external {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to approve new burners");
        require(multisigManager.checkAllPermission("approveBurner"), "This function is not authorized to be called");
        approvedBurners[target] = true;
        multisigManager.resetFunctionPermission("approveBurner");
        emit BurnerApproved(target);
    }

    function removeBurner(address target) external {
        require(multisigManager.senderIsMasterOrMember(tx.origin), "You are not authorized to remove burners");
        require(multisigManager.checkAllPermission("removeBurner"), "This function is not authorized to be called");
        approvedBurners[target] = false;
        multisigManager.resetFunctionPermission("removeBurner");
        emit BurnerRemoved(target);
    }

    function checkApprovedMinter(address target) external view returns(bool) {
        return approvedMinters[target];
    }

    function checkApprovedBurner(address target) external view returns(bool) {
        return approvedBurners[target];
    }
}