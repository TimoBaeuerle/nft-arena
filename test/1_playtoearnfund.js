const PlayToEarnFund = artifacts.require("PlayToEarnFund");

contract("PlayToEarnFund", accounts => {
    it("should be able to set address permission", async () => {
        let pteInstance = await PlayToEarnFund.deployed();
        let success = true;
        let approved = false;

        try {
            await pteInstance.switchMasterPermission(accounts[3], {from: accounts[0]});
            await pteInstance.switchMemberAPermission(accounts[3], {from: accounts[1]});
            await pteInstance.switchMemberBPermission(accounts[3], {from: accounts[2]});
            approved = await pteInstance.checkAddressPermission(accounts[3], {from: accounts[0]})
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.ok(approved);
    });

    it("should be able to approve contract", async () => {
        let pteInstance = await PlayToEarnFund.deployed();
        let success = true;
        let approved = false;

        try {
            await pteInstance.switchEarningContractApprovement(accounts[3], {from: accounts[0]});
            approved = await pteInstance.isEarningContractApproved(accounts[3], {from: accounts[0]})
        } catch (err) {
            success = false;
        }

        assert.ok(success);
        assert.ok(approved);
    });
});