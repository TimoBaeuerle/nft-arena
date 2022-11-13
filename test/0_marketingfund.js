const MarketingFund = artifacts.require("MarketingFund");
const MultisigManager = artifacts.require("MultisigManager");
const NFTAToken = artifacts.require("NFTAToken");

contract("MarketingFund", accounts => {
    it("should be able to transfer tokens", async () => {
        let marketingInstance = await MarketingFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let balance = 0;

        try {
            await nftaTokenInstance.transfer(marketingInstance.address, "19200000000000000000000000", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(marketingInstance.address, "transfer", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(marketingInstance.address, "transfer", {from: accounts[2]});
            await marketingInstance.transferTokens(accounts[5], "90000000000000000000000", {from: accounts[1]});
            balance = await nftaTokenInstance.balanceOf(accounts[5], {from: accounts[5]}); 
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.equal(balance.toString(), "90000000000000000000000");
    });

    it("should be able to set transfer limit", async () => {
        let marketingInstance = await MarketingFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;
        let limit = 0;

        try {
            await multisigInstance.switchMasterPermission(marketingInstance.address, "setLimit", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(marketingInstance.address, "setLimit", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(marketingInstance.address, "setLimit", {from: accounts[2]});
            await marketingInstance.setTransferLimit("10000000000000000000000", {from: accounts[1]});
            limit = await marketingInstance.getTransferLimit({from: accounts[1]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.equal(limit.toString(), "10000000000000000000000");
    });

    it("should not be able to exceed transfer limit", async () => {
        let marketingInstance = await MarketingFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = false;

        try {
            await multisigInstance.switchMemberAPermission(marketingInstance.address, "transfer", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(marketingInstance.address, "transfer", {from: accounts[2]});
        } catch {
            //ignore
        }

        try {
            await marketingInstance.transferTokens(accounts[5], "10000000000000000000001", {from: accounts[1]});
        } catch (err) {
            success = true;
        }

        assert.ok(success);
    });
});