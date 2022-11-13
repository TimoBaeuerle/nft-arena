const EcosystemFund = artifacts.require("EcosystemFund");
const NFTAToken = artifacts.require("NFTAToken");

contract("EcosystemFund", accounts => {
    it("should be able to approve events", async () => {
        let ecosystemInstance = await EcosystemFund.deployed();
        let success = true;

        try {
            await ecosystemInstance.switchMasterPermission(accounts[0], {from: accounts[0]});
            await ecosystemInstance.switchMemberAPermission(accounts[0], {from: accounts[1]});
            await ecosystemInstance.switchMemberBPermission(accounts[0], {from: accounts[2]});
            lpAddress = await ecosystemInstance.checkAddressPermission(accounts[0], {from: accounts[4]});
        } catch (err) {
            success = false;
        }

        assert.ok(success);
    });

    it("should not be able to withdraw tokens with account", async () => {
        let ecosystemInstance = await EcosystemFund.deployed();
        let nftaTokenInstance = await NFTAToken.deployed();
        let success = false;

        try {
            await nftaTokenInstance.transfer(ecosystemInstance.address, "12000000000000000000000000", {from: accounts[0]});
        } catch (err) {
            //ignore
        }

        try {
            await ecosystemInstance.withdrawToken(1 * 10**18, {from: accounts[0]});
        } catch (err) {
            success = true;
        }

        assert.ok(success);
    });
});