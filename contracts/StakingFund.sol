// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./NFTAToken.sol";

contract StakingFund {
    MultisigManager private multisigManager;
    NFTAToken private nftaToken;
    uint256 private scaleRate;
    uint256 private totalStaked;
    uint256 private totalStakeSupply;
    uint256 private unlockPercentage;
    uint256 private unlockTimestamp;
    uint256 private unlockMonth;
    uint256 private unlockYear;
    uint256 private unlockedTokens;
    uint256 private claimedRewards;
    uint256 private stakingRewardPeriod;
    mapping(address => uint256) private stakes;
    mapping(address => uint256) private stakingTimestamps;
    mapping(address => uint256) private blockedTimestamps;
    mapping(address => uint256) private securedRewards;
    mapping(address => bool) private isStakeholder;

    event StakingInitialized();
    event StakeDeposited(address indexed stakeholder, uint256 stake);
    event StakeWithdrawn(address indexed stakeholder, uint256 stake);
    event UnlockPercentageReduced(uint256 percentage);
    event UnlockedTokens(uint256 amount);
    event RewardsSecured(address indexed stakeholder, uint256 secured);
    event ChangedScaleRate(uint256 rate);
    
    constructor(address _multisigManager, address _nftaToken) {
        multisigManager = MultisigManager(_multisigManager);
        nftaToken = NFTAToken(_nftaToken);
        unlockPercentage = 30;
        unlockMonth = 0;
        stakingRewardPeriod = 1 hours;
        scaleRate = 12000;
    }

    function initStaking() external {
        require(multisigManager.senderIsMasterOrMember(msg.sender), "You have no permission to call this function");
        require(multisigManager.checkAllPermission("init"), "This function call is not authorized");
        require(unlockTimestamp == 0, "The staking contract is already initialized");
        totalStakeSupply = nftaToken.balanceOf(address(this));
        require(totalStakeSupply > 0, "The staking contract has no token balance");
        unlockTimestamp = block.timestamp;
        unlockTokens();
        multisigManager.resetFunctionPermission("init");
        emit StakingInitialized();
    }

    function reduceUnlockPercentage() private {
        if (unlockPercentage > 10) {
            unlockPercentage -= 5;
            emit UnlockPercentageReduced(unlockPercentage);
        }
    }

    function unlockTokens() private {
        uint256 newUnlockedTokens = (((unlockPercentage * 1000) / 12) * (totalStakeSupply / 1000)) / 100;
        if (unlockedTokens + newUnlockedTokens > totalStakeSupply) {
            emit UnlockedTokens(totalStakeSupply - unlockedTokens);
            unlockedTokens = totalStakeSupply;
        } else {
            unlockedTokens += newUnlockedTokens;
            emit UnlockedTokens(newUnlockedTokens);
        }
    }

    function depositStake(uint256 amount) external {
        //Check requirements
        require(!isStakeholder[msg.sender], "You are already a stakeholder");
        require(unlockTimestamp > 0, "Staking Fund contract is not initialized");
        require(block.timestamp - blockedTimestamps[msg.sender] > 3 days, "You have to wait 3 days after your withdrawal before you can deposit again");

        //Staking minimum equals 1 token
        require(amount > 1*10**18, "You have to stake at least 1 Token");

        //Update state & deposit tokens
        totalStaked += amount;
        stakes[msg.sender] = amount;
        stakingTimestamps[msg.sender] = block.timestamp;
        isStakeholder[msg.sender] = true;
        nftaToken.transferFrom(msg.sender, address(this), amount);
        emit StakeDeposited(msg.sender, amount);
    }

    function withdrawStake() external {
        //Check requirements
        require(isStakeholder[msg.sender], "You are no stakeholder");
        uint256 timediff = block.timestamp - stakingTimestamps[msg.sender];
        require(timediff > stakingRewardPeriod, "You have to stake at least one hour");

        //Unlock new tokens if needed
        uint256 currentStakingMonth = (block.timestamp - unlockTimestamp) / 60 / 60 / 24 / 30;
        if ((currentStakingMonth / 12) - unlockYear >= 1) {
            reduceUnlockPercentage();
            unlockYear += 1;
        }
        if (currentStakingMonth - unlockMonth >= 1) {
            unlockTokens();
            unlockMonth += 1;
        }

        //Calculate rewards
        uint256 rewards = ((timediff - (timediff % stakingRewardPeriod)) / stakingRewardPeriod) * (stakes[msg.sender] / scaleRate);
        if (claimedRewards + (rewards - securedRewards[msg.sender]) > unlockedTokens) {
            rewards = (unlockedTokens - claimedRewards) + securedRewards[msg.sender];
        }

        //Update state & withdraw tokens
        uint256 amount = stakes[msg.sender] + rewards;
        claimedRewards += (rewards - securedRewards[msg.sender]);
        totalStaked -= stakes[msg.sender];
        stakes[msg.sender] = 0;
        securedRewards[msg.sender] = 0;
        isStakeholder[msg.sender] = false;
        blockedTimestamps[msg.sender] = block.timestamp;
        nftaToken.transfer(msg.sender, amount);
        emit StakeWithdrawn(msg.sender, amount);
    }

    function secureRewards() external {
        //Check requirements
        require(isStakeholder[msg.sender], "You are no stakeholder");
        uint256 timediff = block.timestamp - stakingTimestamps[msg.sender];
        require(timediff > stakingRewardPeriod, "You have to stake at least one hour");

        //Unlock new tokens if needed
        uint256 currentStakingMonth = (block.timestamp - unlockTimestamp) / 60 / 60 / 24 / 30;
        if ((currentStakingMonth / 12) - unlockYear >= 1) {
            reduceUnlockPercentage();
            unlockYear += 1;
        }
        if (currentStakingMonth - unlockMonth >= 1) {
            unlockTokens();
            unlockMonth += 1;
        }

        //Secure rewards
        uint256 rewards = ((timediff - (timediff % stakingRewardPeriod)) / stakingRewardPeriod) * (stakes[msg.sender] / scaleRate);
        if (claimedRewards + (rewards - securedRewards[msg.sender]) <= unlockedTokens) {
            claimedRewards += rewards - securedRewards[msg.sender];
            securedRewards[msg.sender] = rewards;
        } else {
            rewards = (unlockedTokens - claimedRewards) + securedRewards[msg.sender];
            claimedRewards = unlockedTokens;
            securedRewards[msg.sender] = rewards;
        }

        emit RewardsSecured(msg.sender, securedRewards[msg.sender]);
    }

    function setScaleRate(uint256 _scaleRate) external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkAllPermission("scalerate"));
        require(_scaleRate > 0);
        scaleRate = _scaleRate;
        multisigManager.resetFunctionPermission("scalerate");
        emit ChangedScaleRate(_scaleRate);
    }

    //External view functions
    function isWithdrawable() external view returns(bool result) {
        uint256 timediff = block.timestamp - stakingTimestamps[msg.sender];
        if (isStakeholder[msg.sender] && timediff > stakingRewardPeriod) {
            return true;
        }
        return false;
    }

    function checkTimestamp() external view returns(uint256 result) {
        return stakingTimestamps[tx.origin];
    }

    function checkStaked() external view returns(uint256 result) {
        return stakes[tx.origin];
    }

    function checkIsStakeholder() external view returns(bool result) {
        return isStakeholder[tx.origin];
    }

    function checkStakingReward() external view returns(uint256 result) {
        uint256 rewards = 0;
        if (isStakeholder[msg.sender]) {
            uint256 timediff = block.timestamp - stakingTimestamps[msg.sender];
            if (timediff > stakingRewardPeriod) {
                rewards = ((timediff - (timediff % stakingRewardPeriod)) / stakingRewardPeriod) * (stakes[msg.sender] / scaleRate);
                if (claimedRewards + (rewards - securedRewards[msg.sender]) > unlockedTokens) {
                    rewards = (unlockedTokens - claimedRewards) + securedRewards[msg.sender];
                }
            }
        }
        return rewards;
    }

    function checkSecuredRewards() external view returns(uint256 result) {
        return securedRewards[msg.sender];
    }

    function checkTotalStaked() external view returns(uint256 result) {
        return totalStaked;
    }

    function checkClaimedRewards() external view returns(uint256 result) {
        return claimedRewards;
    }

    function checkUnlockPercentage() external view returns(uint256 result) {
        return unlockPercentage;
    }

    function checkUnlockedTokens() external view returns(uint256 result) {
        return unlockedTokens;
    }

    function checkTotalStakeSupply() external view returns(uint256 result) {
        return totalStakeSupply;
    }

    function checkAPR() external view returns(uint256 result) {
        return (((100 * 10000) / scaleRate) * (365 days / stakingRewardPeriod)) / 10000;
    }

    function checkInitialized() external view returns(bool result) {
        return unlockTimestamp > 0;
    }
}