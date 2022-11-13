// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./NFTAToken.sol";

contract TeamFund {
    MultisigManager private multisigManager;
    NFTAToken private nftaToken;
    uint256 private unlockingTimestamp;
    uint256 private withdrawnTokens;
    uint256 private unlockPerMonth;
    address private LPAddress;

    event Withdrawn(uint256 amount);
    event ChangedLPAddress(address indexed sender, address target);

    constructor(address _multisigManager, address _nftaToken) {
        multisigManager = MultisigManager(_multisigManager);
        nftaToken = NFTAToken(_nftaToken);
    }
    
    fallback () external payable {}
    
    receive() external payable {}

    function withdraw(uint256 amount) external {
        //Check requirements
        require(multisigManager.senderIsMember(msg.sender));
        require(unlockingTimestamp > 0);

        //Check contract balance
        uint256 contractBalance = nftaToken.balanceOf(address(this));
        require(amount <= contractBalance);

        //Calculate withdrawable token amount
        uint256 daysGone = (block.timestamp - unlockingTimestamp) / 60 / 60 / 24;
        uint256 monthGone = daysGone / 30;
        uint256 withdrawable = (monthGone * unlockPerMonth) - withdrawnTokens;

        //Withdraw amount
        require(withdrawable > 0);
        require(amount <= withdrawable);
        withdrawnTokens += amount;
        nftaToken.transfer(multisigManager.getMemberA(), amount/2);
        nftaToken.transfer(multisigManager.getMemberB(), amount/2);
        emit Withdrawn(amount);
    }

    function initLiquidityProvider(uint256 etherPrice) external payable {
        //Check requirements
        require(multisigManager.senderIsMaster(tx.origin), "You are not authorized to call the init function");
        require(multisigManager.checkAllPermission("initLP"), "Init function is not authorized");
        require(msg.sender != tx.origin, "Transaction sender is not a contract");
        require(LPAddress != address(0), "LP address is not set");
        require(unlockingTimestamp == 0, "Unlocking timestamp is already set");

        //Calculate tokenbits
        uint256 tokenBits = (etherPrice * 5) * msg.value; // 5 Token per dollar = 0.20$USD

        //Transfer liquidity to liquidity provider
        payable(LPAddress).transfer(msg.value);
        nftaToken.transfer(LPAddress, tokenBits);

        //Init unlocking process & set unlock rate for 5 years
        unlockingTimestamp = block.timestamp;
        unlockPerMonth = nftaToken.balanceOf(address(this)) / 60;

        //Reset function permission
        multisigManager.resetFunctionPermission("initLP");
    }

    function setLiquidityProviderAddress(address _LPAddress) external {
        //Set address of the liquidity provider contract
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("setLPA"));
        LPAddress = _LPAddress;
        multisigManager.resetFunctionPermission("setLPA");
        emit ChangedLPAddress(msg.sender, _LPAddress);
    }

    function getUnlockingTimestamp() external view returns(uint256 result) {
        return unlockingTimestamp;
    }

    function getWithdrawnTokens() external view returns(uint256 result) {
        return withdrawnTokens;
    }

    function getUnlockPerMonth() external view returns(uint256 result) {
        return unlockPerMonth;
    }

    function getLPAddress() external view returns(address result) {
        return LPAddress;
    }
}