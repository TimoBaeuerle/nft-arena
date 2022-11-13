const MultisigManager = artifacts.require("MultisigManager");

contract("MultisigManager", accounts => {
    it("should have set members", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let memberA = await multisigInstance.getMemberA({from: accounts[0]});
        let memberB = await multisigInstance.getMemberB({from: accounts[0]});
        assert.equal(memberA, accounts[1], "Member A was not account '1'.");
        assert.equal(memberB, accounts[2], "Member B was not account '2'.");
    });

    it("should not be able to renounce ownership", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let error = null;

        try {
            await multisigInstance.renounceOwnership({from: accounts[0]});
        } catch (err) {
            error = err;
        }

        assert.ok(error instanceof Error);
    });

    it("should only be able to switch ownership permission by members", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let error = null;
        let success = true;

        try {
            await multisigInstance.switchOwnershipPermission({from: accounts[3]});
        } catch (err) {
            error = err;
        }

        try {
            await multisigInstance.switchOwnershipPermission({from: accounts[1]});
        } catch (err) {
            success = false;
        }

        let ownershipPermission = await multisigInstance.checkTransferOwnershipPermission(accounts[1], {from: accounts[0]});

        assert.ok(error instanceof Error);
        assert.ok(success);
        assert.ok(ownershipPermission);
    });

    it("should only be able to switch membership permission by members", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let error = null;
        let success = true;

        try {
            await multisigInstance.switchMembershipPermission({from: accounts[3]});
        } catch (err) {
            error = err;
        }

        try {
            await multisigInstance.switchMembershipPermission({from: accounts[1]});
        } catch (err) {
            success = false;
        }

        let membershipPermission = await multisigInstance.checkTransferMembershipPermission(accounts[1], {from: accounts[0]});

        assert.ok(error instanceof Error);
        assert.ok(success);
        assert.ok(membershipPermission);
    });

    it("should only be able to switch master permission from master address", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let error = null;
        let success = true;

        try {
            await multisigInstance.switchMasterPermission(accounts[3], 'test', {from: accounts[3]});
        } catch (err) {
            error = err;
        }

        try {
            await multisigInstance.switchMasterPermission(accounts[3], 'test', {from: accounts[0]});
        } catch (err) {
            success = false;
        }

        let masterPermission = await multisigInstance.checkMasterPermission('test', {from: accounts[3]});

        assert.ok(error instanceof Error);
        assert.ok(success);
        assert.ok(masterPermission);
    });

    it("should only be able to switch memberA permission from memberA address", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let error = null;
        let success = true;

        try {
            await multisigInstance.switchMemberAPermission(accounts[3], 'test', {from: accounts[3]});
        } catch (err) {
            error = err;
        }

        try {
            await multisigInstance.switchMemberAPermission(accounts[3], 'test', {from: accounts[1]});
        } catch (err) {
            success = false;
        }

        let memberAPermission = await multisigInstance.checkSingleMemberPermission('test', {from: accounts[3]});

        assert.ok(error instanceof Error);
        assert.ok(success);
        assert.ok(memberAPermission);
    });

    it("should only be able to switch memberB permission from memberB address", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let error = null;
        let success = true;

        try {
            await multisigInstance.switchMemberBPermission(accounts[3], 'test', {from: accounts[3]});
        } catch (err) {
            error = err;
        }

        try {
            await multisigInstance.switchMemberBPermission(accounts[3], 'test', {from: accounts[2]});
        } catch (err) {
            success = false;
        }

        let memberBPermission = await multisigInstance.checkSingleMemberPermission('test', {from: accounts[3]});

        assert.ok(error instanceof Error);
        assert.ok(success);
        assert.ok(memberBPermission);
    });

    it("should validate if sender is member", async () => {
        let multisigInstance = await MultisigManager.deployed();
        assert.ok(!(await multisigInstance.senderIsMember(accounts[3], {from: accounts[0]})));
        assert.ok(!(await multisigInstance.senderIsMember(accounts[3], {from: accounts[4]})));
        assert.ok(await multisigInstance.senderIsMember(accounts[2], {from: accounts[1]}));
        assert.ok(await multisigInstance.senderIsMember(accounts[2], {from: accounts[2]}));
    });
    
    it("should validate if sender is master or member", async () => {
        let multisigInstance = await MultisigManager.deployed();
        assert.ok(!(await multisigInstance.senderIsMember(accounts[3], {from: accounts[4]})));
        assert.ok(await multisigInstance.senderIsMember(accounts[2], {from: accounts[0]}));
        assert.ok(await multisigInstance.senderIsMember(accounts[2], {from: accounts[1]}));
        assert.ok(await multisigInstance.senderIsMember(accounts[2], {from: accounts[2]}));
    });

    it("should validate if sender is master", async () => {
        let multisigInstance = await MultisigManager.deployed();
        assert.ok(!(await multisigInstance.senderIsMember(accounts[3], {from: accounts[1]})));
        assert.ok(!(await multisigInstance.senderIsMember(accounts[3], {from: accounts[2]})));
        assert.ok(!(await multisigInstance.senderIsMember(accounts[3], {from: accounts[4]})));
        assert.ok(await multisigInstance.senderIsMember(accounts[2], {from: accounts[0]}));
    });
});
