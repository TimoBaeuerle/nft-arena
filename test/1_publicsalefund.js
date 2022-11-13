const PublicSaleFund = artifacts.require("PublicSaleFund");
const MasterWallet = artifacts.require("MasterWallet");
const MarketingFund = artifacts.require("MarketingFund");
const MultisigManager = artifacts.require("MultisigManager");
const NFTAToken = artifacts.require("NFTAToken");

contract("PublicSaleFund", accounts => {
    it("should be able to init presale", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;

        try {
            await nftaTokenInstance.transfer(psInstance.address, "24000000000000000000000000", {from: accounts[0]});
            await multisigInstance.switchMasterPermission(psInstance.address, "setPresaleRate", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "setPresaleRate", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "setPresaleRate", {from: accounts[2]});
            await psInstance.setPresaleRate(10, {from: accounts[0]});
            await multisigInstance.switchMasterPermission(psInstance.address, "setPresaleTimestamp", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "setPresaleTimestamp", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "setPresaleTimestamp", {from: accounts[2]});
            await psInstance.setPresaleTimestamp(1635103613, {from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let rate = await psInstance.getPresaleRate({from: accounts[0]});
        
        assert.ok(success);
        assert.equal(rate, 10);
    });

    it("should be able to buy tokens in presale", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let oldBalance = await nftaTokenInstance.balanceOf(accounts[7], {from: accounts[7]});

        try {
            await psInstance.buyPresale({from: accounts[7], value: "2000000000000000000"});
        } catch (err) {
            success = false;
        }
        
        let newBalance = await nftaTokenInstance.balanceOf(accounts[7], {from: accounts[7]});
        
        assert.ok(success);
        assert.ok(parseInt(newBalance) > parseInt(oldBalance));
    });

    it("should be able to close presale", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;

        try {
            await multisigInstance.switchMasterPermission(psInstance.address, "closePresale", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "closePresale", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "closePresale", {from: accounts[2]});
            await psInstance.closePresale({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let presaleDone = await psInstance.isPresaleDone({from: accounts[0]});
        
        assert.ok(success);
        assert.ok(presaleDone);
    });

    it("should be able to rebalance ico amount", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;

        try {
            await multisigInstance.switchMemberAPermission(psInstance.address, "rebalance", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "rebalance", {from: accounts[2]});
            await psInstance.rebalanceICOAmount({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should be able to init ico", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;

        try {
            await multisigInstance.switchMasterPermission(psInstance.address, "setICORate", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "setICORate", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "setICORate", {from: accounts[2]});
            await psInstance.setICORate(10, {from: accounts[0]});
            await multisigInstance.switchMasterPermission(psInstance.address, "setICOTimestamp", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "setICOTimestamp", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "setICOTimestamp", {from: accounts[2]});
            await psInstance.setICOTimestamp(1635103613, {from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let rate = await psInstance.getICORate({from: accounts[0]});
        
        assert.ok(success);
        assert.equal(rate, 10);
    });

    it("should be able to buy tokens in ico", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = true;
        let oldBalance = await nftaTokenInstance.balanceOf(accounts[7], {from: accounts[7]});

        try {
            await psInstance.buyICO({from: accounts[7], value: "2000000000000000000"});
        } catch (err) {
            success = false;
        }
        
        let newBalance = await nftaTokenInstance.balanceOf(accounts[7], {from: accounts[7]});
        
        assert.ok(success);
        assert.ok(parseInt(newBalance) > parseInt(oldBalance));
    });

    it("should be able to close ico", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let success = true;

        try {
            await multisigInstance.switchMasterPermission(psInstance.address, "closeICO", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "closeICO", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "closeICO", {from: accounts[2]});
            await psInstance.closeICO({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let icoDone = await psInstance.isICODone({from: accounts[0]});
        
        assert.ok(success);
        assert.ok(icoDone);
    });

    it("should be able to finalize sales", async () => {
        let psInstance = await PublicSaleFund.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let marketingInstance = await MarketingFund.deployed();
        let mwInstance = await MasterWallet.deployed();
        let success = true;
        let oldTokenBalance = await nftaTokenInstance.balanceOf(marketingInstance.address, {from: accounts[0]});
        let oldBalance = await web3.eth.getBalance(mwInstance.address);

        try {
            await multisigInstance.switchMasterPermission(psInstance.address, "finalize", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(psInstance.address, "finalize", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(psInstance.address, "finalize", {from: accounts[2]});
            await psInstance.finalizeSales({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let newTokenBalance = await nftaTokenInstance.balanceOf(marketingInstance.address, {from: accounts[0]});
        let newBalance = await web3.eth.getBalance(mwInstance.address);

        assert.ok(success);
        assert.ok(parseInt(newTokenBalance) > parseInt(oldTokenBalance));
        assert.ok(parseInt(newBalance) > parseInt(oldBalance));
    });
});