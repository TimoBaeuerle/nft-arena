const MultisigManager = artifacts.require("MultisigManager");
const NFTAToken = artifacts.require("NFTAToken");
const TeamFund  = artifacts.require("TeamFund");
const MasterWallet = artifacts.require("MasterWallet");
const Accountant = artifacts.require("Accountant");
const MarketingFund = artifacts.require("MarketingFund");
const EcosystemFund = artifacts.require("EcosystemFund");
const PlayToEarnFund = artifacts.require("PlayToEarnFund");
const PublicSaleFund = artifacts.require("PublicSaleFund");
const StakingFund = artifacts.require("StakingFund");
const MultikeyNFT = artifacts.require("MultikeyNFT");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(MultisigManager, accounts[1], accounts[2]);
    await deployer.deploy(NFTAToken);
    await deployer.deploy(TeamFund, MultisigManager.address, NFTAToken.address);
    await deployer.deploy(MasterWallet, MultisigManager.address, TeamFund.address);
    await deployer.deploy(Accountant, MultisigManager.address, MasterWallet.address);
    await deployer.deploy(MarketingFund, MultisigManager.address, NFTAToken.address);
    await deployer.deploy(EcosystemFund, MultisigManager.address, NFTAToken.address);
    await deployer.deploy(PlayToEarnFund, MultisigManager.address, NFTAToken.address);
    await deployer.deploy(PublicSaleFund, MultisigManager.address, NFTAToken.address, MasterWallet.address, MarketingFund.address);
    await deployer.deploy(StakingFund, MultisigManager.address, NFTAToken.address);
    await deployer.deploy(MultikeyNFT, MultisigManager.address);
};