const TeamFund = artifacts.require("TeamFund");
const MultisigManager = artifacts.require("MultisigManager");
const MasterWallet = artifacts.require("MasterWallet");
const NFTAToken = artifacts.require("NFTAToken");

contract("TeamFund", accounts => {
    it("should be able to set lp address", async () => {
        let teamfundInstance = await TeamFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;
        let lpAddress = false;

        try {
            await multisigInstance.switchMasterPermission(teamfundInstance.address, "setLPA", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(teamfundInstance.address, "setLPA", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(teamfundInstance.address, "setLPA", {from: accounts[2]});
            await teamfundInstance.setLiquidityProviderAddress(accounts[6], {from: accounts[0]});
            lpAddress = await teamfundInstance.getLPAddress({from: accounts[4]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.equal(accounts[6], lpAddress);
    });

    it("should be able to get unlocking timestamp", async () => {
        let teamfundInstance = await TeamFund.deployed();
        let success = true;

        try {
            await teamfundInstance.getUnlockingTimestamp({from: accounts[4]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should be able to get withdrawn tokens", async () => {
        let teamfundInstance = await TeamFund.deployed();
        let success = true;

        try {
            await teamfundInstance.getWithdrawnTokens({from: accounts[4]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should be able to get unlock per month", async () => {
        let teamfundInstance = await TeamFund.deployed();
        let success = true;

        try {
            await teamfundInstance.getUnlockPerMonth({from: accounts[4]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should be able to get lp address", async () => {
        let teamfundInstance = await TeamFund.deployed();
        let success = true;

        try {
            await teamfundInstance.getLPAddress({from: accounts[4]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should be able to receive nfta tokens", async () => {
        let teamfundInstance = await TeamFund.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let balance = 0;

        try {
            await nftaTokenInstance.transfer(teamfundInstance.address, "48000000000000000000000000", {from: accounts[0]});
            balance = await nftaTokenInstance.balanceOf(teamfundInstance.address, {from: accounts[0]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.equal(balance.toString(), "48000000000000000000000000");
    });
});