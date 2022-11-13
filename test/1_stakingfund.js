const { time } = require('@openzeppelin/test-helpers');
const StakingFund = artifacts.require("StakingFund");
const MultisigManager = artifacts.require("MultisigManager");
const NFTAToken = artifacts.require("NFTAToken");

contract("StakingFund", accounts => {
    it("should be able to init staking", async () => {
        let stakingInstance = await StakingFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let initialized = false;

        try {
            await nftaTokenInstance.transfer(stakingInstance.address, "72000000000000000000000000", {from: accounts[0]});
            await multisigInstance.switchMasterPermission(stakingInstance.address, "init", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(stakingInstance.address, "init", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(stakingInstance.address, "init", {from: accounts[2]});
            await stakingInstance.initStaking({from: accounts[1]});
        } catch (err) {
            success = false;
        }

        initialized = await stakingInstance.checkInitialized({from: accounts[0]});

        assert.ok(success);
        assert.ok(initialized);
    });

    it("should be able to deposit stake", async () => {
        let stakingInstance = await StakingFund.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let isStakeholder = false;

        try {
            await nftaTokenInstance.approve(stakingInstance.address, "10000000000000000000000", {from: accounts[0]});
            await stakingInstance.depositStake("10000000000000000000000", {from: accounts[0]});
        } catch (err) {
            success = false;
        }

        isStakeholder = await stakingInstance.checkIsStakeholder({from: accounts[0]});

        assert.ok(success);
        assert.ok(isStakeholder);
    });

    it("should be able to secure rewards", async () => {
        let stakingInstance = await StakingFund.deployed();
        let success = true;

        try {
            duration = 86400;
            await time.increase(duration);
            await stakingInstance.secureRewards({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let securedRewards = await stakingInstance.checkSecuredRewards({from: accounts[0]});
        let checkClaimedRewards = await stakingInstance.checkClaimedRewards({from: accounts[0]});

        assert.ok(success);
        assert.ok(parseInt(securedRewards) > 0);
        assert.ok(parseInt(checkClaimedRewards) > 0);
    });

    it("should be able to reduce unlock percentage", async () => {
        let stakingInstance = await StakingFund.deployed();
        let success = true;
        let oldUnlockPercentage = await stakingInstance.checkUnlockPercentage({from: accounts[0]});

        try {
            duration = 86400 * 400;
            await time.increase(duration);
            await stakingInstance.secureRewards({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let newUnlockPercentage = await stakingInstance.checkUnlockPercentage({from: accounts[0]});

        assert.ok(success);
        assert.ok(parseInt(oldUnlockPercentage) > parseInt(newUnlockPercentage));
        assert.ok(parseInt(newUnlockPercentage) == 25);
    });

    it("should not exceed total stake supply", async () => {
        let stakingInstance = await StakingFund.deployed();
        
        for (let i = 90; i > 0; i--) {
            duration = 86400 * 30;
            await time.increase(duration);
            await stakingInstance.secureRewards({from: accounts[0]});
        }

        let unlockedTokens = await stakingInstance.checkUnlockedTokens({from: accounts[0]});
        let totalSupply = await stakingInstance.checkTotalStakeSupply({from: accounts[0]});
        assert.equal(unlockedTokens.toString(), totalSupply.toString());
    });

    it("should be able to withdraw stake", async () => {
        let stakingInstance = await StakingFund.deployed();
        let success = true;
        let isStakeholder = true;

        try {
            duration = 86400;
            await time.increase(duration);
            await stakingInstance.withdrawStake({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        isStakeholder = await stakingInstance.checkIsStakeholder({from: accounts[0]});

        assert.ok(success);
        assert.ok(!isStakeholder);
    });
});