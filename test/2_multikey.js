const MultikeyNFT = artifacts.require("MultikeyNFT");
const MultisigManager = artifacts.require("MultisigManager");

contract("MultikeyNFT", accounts => {
    it("should be able to mint all tokens", async () => {
        let multisigInstance = await MultisigManager.deployed();
        let mtkInstance = await MultikeyNFT.deployed();
        let success = true;

        try {
            await multisigInstance.switchMasterPermission(mtkInstance.address, "increase", {from: accounts[0]});
            await multisigInstance.switchMemberAPermission(mtkInstance.address, "increase", {from: accounts[1]});
            await multisigInstance.switchMemberBPermission(mtkInstance.address, "increase", {from: accounts[2]});
            await mtkInstance.increaseMintable(1000, {from: accounts[0]});
            for (i = 4; i <= 777; i++) {
                await mtkInstance.mint(1, {from: accounts[0]});
            }
            let totalSupply = await mtkInstance.totalSupply({from: accounts[0]});
            if (totalSupply == 777) {
                success = true;
            } else {
                success = false;
            }
        } catch (err) {
            success = false;
        }

        assert.ok(success, "assert failed.");
    });
});