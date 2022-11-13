// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./TeamFund.sol";

contract MasterWallet {
    MultisigManager private multisigManager;
    TeamFund private teamFund;
    bool private lpInitialized;
    uint256 private lastTransfer;
    mapping(address => uint256) private lpAmountAgreement;
    mapping(address => bool) private validatedTargets;

    event Withdrawn(uint256 amount);
    event Transferred(address indexed target, uint256 amount);
    event ChangedLPAmount(address indexed target, uint256 etherAmount);
    event SwitchedTargetPermission(address indexed target, bool permitted);

    constructor(address _multisigManager, address payable _teamFund) {
        multisigManager = MultisigManager(_multisigManager);
        teamFund = TeamFund(_teamFund);
        lpInitialized = false;
    }
    
    fallback () external payable {}
    
    receive() external payable {}

    function withdraw(uint256 amount) external {
        require(multisigManager.senderIsMember(msg.sender), "You are not authorized to call the withdraw function");
        require(multisigManager.checkMemberPermission("withdraw"), "Withdraw function is not authorized");
        require(address(this).balance >= amount && amount > 0, "Withdraw amount exceeds contract balance");
        require(lpInitialized, "Liquidity provider is not initialized");
        uint256 halfAmount = amount / 2;
        payable(multisigManager.getMemberA()).transfer(halfAmount);
        payable(multisigManager.getMemberB()).transfer(halfAmount);
        emit Withdrawn(amount);
    }

    function secureTransfer(address target, uint256 amount) external {
        require(multisigManager.senderIsMember(msg.sender), "You are not authorized to call the transfer function");
        require(multisigManager.checkMemberPermission("transfer"), "Transfer function is not authorized");
        require(lpInitialized, "Liquidity provider is not initialized");
        require(validatedTargets[target], "Transfer target is not validated");
        require(amount <= 5 ether && address(this).balance >= amount && amount > 0, "Your transfer amount must be lower than 5 ether/bnb");
        uint256 timediff = block.timestamp - lastTransfer;
        require(timediff > 1 days, "You can only transfer once within 24 hours");
        payable(target).transfer(amount);
        lastTransfer = block.timestamp;
        multisigManager.resetFunctionPermission("transfer");
        emit Transferred(target, amount);
    }

    function initLiquidityProvider(uint256 etherPrice) external {
        //Check basic requirements
        require(multisigManager.senderIsMaster(msg.sender), "You are not authorized to call the init function");
        require(address(this).balance > 0, "Contract balance is zero");

        //Check liquidity providing amount is valid and set by master and members
        require(lpAmountAgreement[multisigManager.getMemberA()] > 0 && lpAmountAgreement[multisigManager.getMemberB()] > 0 && lpAmountAgreement[multisigManager.owner()] > 0, "Some amount agreements are zero");
        require(lpAmountAgreement[multisigManager.getMemberA()] == lpAmountAgreement[multisigManager.getMemberB()] && lpAmountAgreement[multisigManager.getMemberB()] == lpAmountAgreement[multisigManager.owner()], "Amount agreements are not equal");
        require(lpAmountAgreement[multisigManager.owner()] <= address(this).balance, "Contract balance is below amount agreement");
        
        //Call team fund function to init liquidity provider
        teamFund.initLiquidityProvider{value: lpAmountAgreement[multisigManager.owner()]}(etherPrice);

        //Finish liquidity provider initialization
        lpInitialized = true;
    }

    function setLPAmountAgreement(uint256 weiAmount) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        lpAmountAgreement[msg.sender] = weiAmount;
        emit ChangedLPAmount(msg.sender, weiAmount);
    }

    function switchTargetPermission(address target) external {
        require(multisigManager.senderIsMember(msg.sender));
        require(multisigManager.checkAllPermission("target"));
        validatedTargets[target] = !validatedTargets[target];
        multisigManager.resetFunctionPermission("target");
        emit SwitchedTargetPermission(target, validatedTargets[target]);
    }

    function checkLPAmountAgreement(address target) external view returns(uint256 result) {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        return lpAmountAgreement[target];
    }

    function checkLPInitialized() external view returns(bool result) {
        return lpInitialized;
    }
}