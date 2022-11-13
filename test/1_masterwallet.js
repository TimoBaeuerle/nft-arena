const MasterWallet = artifacts.require("MasterWallet");
const MultisigManager = artifacts.require("MultisigManager");
const NFTAToken = artifacts.require("NFTAToken");
const TeamFund = artifacts.require("TeamFund");

contract("MasterWallet", accounts => {
    it("should not be able to init lp", async () => {
        let mwInstance = await MasterWallet.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = false;

        try {
            await web3.eth.sendTransaction({from: accounts[3], to: mwInstance.address, value: "11000000000000000000"});
            await multisigInstance.switchMasterPermission(mwInstance.address, "initLP", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(mwInstance.address, "initLP", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(mwInstance.address, "initLP", {from: accounts[2]});
        } catch (err) {
            success = false;
        }

        try {
            await mwInstance.initLiquidityProvider(3145, {from: accounts[0]});
        } catch (err) {
            success = true;
        }

        assert.ok(success);
    });

    it("should be able to set lp amount agreement", async () => {
        let mwInstance = await MasterWallet.deployed();
        let success = true;
        let lpAmount = 0;

        try {
            await mwInstance.setLPAmountAgreement("10000000000000000000", {from: accounts[0]});
            await mwInstance.setLPAmountAgreement("10000000000000000000", {from: accounts[1]});
            await mwInstance.setLPAmountAgreement("10000000000000000000", {from: accounts[2]});
            lpAmount = await mwInstance.checkLPAmountAgreement(accounts[0], {from: accounts[0]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.equal(lpAmount.toString(), "10000000000000000000")
    });

    it("should be able to init lp", async () => {
        let mwInstance = await MasterWallet.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let teamfundInstance = await TeamFund.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let oldBalance = await web3.eth.getBalance(accounts[6]);

        try {
            let currentState = await mwInstance.checkLPInitialized();
            assert.ok(!currentState);
        } catch (err) {
            success = false;
        }

        try {
            await multisigInstance.switchMasterPermission(teamfundInstance.address, "initLP", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(teamfundInstance.address, "initLP", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(teamfundInstance.address, "initLP", {from: accounts[2]});
            await multisigInstance.switchMasterPermission(teamfundInstance.address, "setLPA", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(teamfundInstance.address, "setLPA", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(teamfundInstance.address, "setLPA", {from: accounts[2]});
            await teamfundInstance.setLiquidityProviderAddress(accounts[6], {from: accounts[0]});
            await nftaTokenInstance.transfer(teamfundInstance.address, "48000000000000000000000000", {from: accounts[0]});
            await mwInstance.initLiquidityProvider(3145, {from: accounts[0]})
        } catch (err) {
            success = false;
        }

        try {
            let currentState = await mwInstance.checkLPInitialized();
            assert.ok(currentState);
        } catch (err) {
            success = false;
        }

        let tokenBalance = (await nftaTokenInstance.balanceOf(accounts[6])).toString();
        let etherBalance = await web3.eth.getBalance(accounts[6]) - oldBalance;

        assert.ok(success);
        assert.equal(tokenBalance, "157250000000000000000000");
        assert.equal(etherBalance, "10000000000000000000");
    });

    it("should be able to transfer tokens", async () => {
        let mwInstance = await MasterWallet.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;
        let oldBalance = await web3.eth.getBalance(accounts[7]);

        try {
            await multisigInstance.switchMasterPermission(mwInstance.address, "target", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(mwInstance.address, "target", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(mwInstance.address, "target", {from: accounts[2]});
            await mwInstance.switchTargetPermission(accounts[7], {from: accounts[1]});
            await multisigInstance.switchMemberAPermission(mwInstance.address, "transfer", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(mwInstance.address, "transfer", {from: accounts[2]});
            await mwInstance.secureTransfer(accounts[7], "500000000000000000", {from: accounts[1]});
        } catch (err) {
            success = false;
        }

        let newBalance = await web3.eth.getBalance(accounts[7]) - oldBalance;

        assert.ok(success);
        assert.equal(newBalance, "500000000000000000");
    });

    it("should be able to withdraw tokens", async () => {
        let mwInstance = await MasterWallet.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;
        let oldBalance = await web3.eth.getBalance(accounts[1]);

        try {
            await multisigInstance.switchMemberAPermission(mwInstance.address, "withdraw", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(mwInstance.address, "withdraw", {from: accounts[2]});
            await mwInstance.withdraw("500000000000000000", {from: accounts[2]});
        } catch (err) {
            success = false;
        }

        let newBalance = await web3.eth.getBalance(accounts[1]);

        assert.ok(success);
        assert.ok(parseInt(newBalance) > parseInt(oldBalance));
    });
});