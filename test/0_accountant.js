const Accountant = artifacts.require("Accountant");
const MasterWallet = artifacts.require("MasterWallet");
const MultisigManager = artifacts.require("MultisigManager");

contract("Accountant", accounts => {
    it("should have no balance", async () => {
        let accountantInstance = await Accountant.deployed();
        let balance = await accountantInstance.getContractBalance({from: accounts[0]});
        assert.equal(balance, 0, "Balance was not equal 0!");
    });

    it("should have balance after transaction", async () => {
        let accountantInstance = await Accountant.deployed();
        await web3.eth.sendTransaction({from: accounts[3], to: accountantInstance.address, value: "10000000000000000000"});
        let balance = await accountantInstance.getContractBalance({from: accounts[0]});
        assert.equal(balance, "10000000000000000000", "Balance was not increased to 10!");
    });

    it("should not be usable from unauthorized accounts", async () => {
        let accountantInstance = await Accountant.deployed();
        let error = null;

        try {
            await accountantInstance.getContractBalance({from: accounts[3]});
        } catch (err) {
            error = err;
        }

        assert.ok(error instanceof Error);
    });

    it("should be usable from master or members", async () => {
        let accountantInstance = await Accountant.deployed();
        let success = true;

        try {
            await accountantInstance.getContractBalance({from: accounts[0]});
            await accountantInstance.getContractBalance({from: accounts[1]});
            await accountantInstance.getContractBalance({from: accounts[2]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should be able to set master wallet", async () => {
        let accountantInstance = await Accountant.deployed();
        let multisigInstance = await MultisigManager.deployed();
        let mwInstance = await MasterWallet.deployed();
        let success = true;
        let mwAddress = false;

        try {
            await multisigInstance.switchMasterPermission(accountantInstance.address, "setMW", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(accountantInstance.address, "setMW", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(accountantInstance.address, "setMW", {from: accounts[2]});
            await accountantInstance.setMasterWallet(mwInstance.address, {from: accounts[0]});
        } catch (err) {
            success = false;
        }
        
        try {
            mwAddress = await accountantInstance.getMasterWallet({from: accounts[0]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.equal(mwInstance.address, mwAddress);
    });
});
