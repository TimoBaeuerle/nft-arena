// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigManager.sol";
import "./NFTAToken.sol";

contract PublicSaleFund {
    MultisigManager private multisigManager;
    NFTAToken private nftaToken;
    address private masterWallet;
    address private marketingFund;
    uint256 private presaleRate;
    uint256 private presaleAmount;
    uint256 private presaleWeiRaised;
    uint256 private presaleTimestamp;
    uint256 private icoRate;
    uint256 private icoAmount;
    uint256 private icoWeiRaised;
    uint256 private icoTimestamp;
    bool private presaleDone;
    bool private icoDone;

    event ChangedPresaleRate(uint256 rate);
    event ChangedICORate(uint256 rate);
    event ChangedPresaleTimestamp(uint256 timestamp);
    event ChangedICOTimestamp(uint256 timestamp);
    event RebalancedICOAmount(uint256 amount);
    event PresaleClosed();
    event ICOClosed();
    event SalesFinalized();
    event TokenSold(address indexed buyer, uint256 tokenAmount);
    
    constructor(address _multisigManager, address _nftaToken, address _masterWallet, address _marketingFund) {
        multisigManager = MultisigManager(_multisigManager);
        nftaToken = NFTAToken(_nftaToken);
        masterWallet = _masterWallet;
        marketingFund = _marketingFund;
        presaleAmount = 12000000 * 10**18;
        icoAmount = 12000000 * 10**18;
    }
    
    fallback () external payable {}
    
    receive() external payable {}

    //Sale modifier
    function setPresaleRate(uint256 _presaleRate) external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("setPresaleRate"));
        require(!presaleDone && (presaleTimestamp == 0 || presaleTimestamp > block.timestamp));
        presaleRate = _presaleRate;
        multisigManager.resetFunctionPermission("setPresaleRate");
        emit ChangedPresaleRate(_presaleRate);
    }

    function setICORate(uint256 _icoRate) external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("setICORate"));
        require(!icoDone && (icoTimestamp == 0 || icoTimestamp > block.timestamp));
        icoRate = _icoRate;
        multisigManager.resetFunctionPermission("setICORate");
        emit ChangedICORate(_icoRate);
    }

    function setPresaleTimestamp(uint256 newTimestamp) external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("setPresaleTimestamp"));
        require(nftaToken.balanceOf(address(this)) >= presaleAmount);
        require(!presaleDone && (presaleTimestamp == 0 || presaleTimestamp > block.timestamp));
        presaleTimestamp = newTimestamp;
        multisigManager.resetFunctionPermission("setPresaleTimestamp");
        emit ChangedPresaleTimestamp(newTimestamp);
    }

    function setICOTimestamp(uint256 newTimestamp) external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("setICOTimestamp"));
        require(nftaToken.balanceOf(address(this)) == icoAmount);
        require(!icoDone && (icoTimestamp == 0 || icoTimestamp > block.timestamp));
        icoTimestamp = newTimestamp;
        multisigManager.resetFunctionPermission("setICOTimestamp");
        emit ChangedICOTimestamp(newTimestamp);
    }

    function rebalanceICOAmount() external {
        require(multisigManager.senderIsMasterOrMember(msg.sender));
        require(multisigManager.checkMemberPermission("rebalance"));
        require(presaleDone && !icoDone && (icoTimestamp == 0 || icoTimestamp > block.timestamp));
        uint256 contractBalance = nftaToken.balanceOf(address(this));
        icoAmount = contractBalance;
        multisigManager.resetFunctionPermission("rebalance");
        emit RebalancedICOAmount(contractBalance);
    }

    //Sale closer
    function closePresale() external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("closePresale"));
        presaleDone = true;
        multisigManager.resetFunctionPermission("closePresale");
        emit PresaleClosed();
    }

    function closeICO() external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("closeICO"));
        icoDone = true;
        multisigManager.resetFunctionPermission("closeICO");
        emit ICOClosed();
    }

    function finalizeSales() external {
        require(multisigManager.senderIsMaster(msg.sender));
        require(multisigManager.checkAllPermission("finalize"));
        require(presaleDone && icoDone);
        payable(masterWallet).transfer(address(this).balance);
        uint256 contractBalance = nftaToken.balanceOf(address(this));
        nftaToken.transfer(marketingFund, contractBalance);
        emit SalesFinalized();
    }

    //Sale functions
    function buyPresale() external payable {
        //Check general requirements
        require(!presaleDone, "Presale is already done");
        require(block.timestamp > presaleTimestamp, "Presale has not started yet");
        require(presaleRate > 0, "Presale is not initialized");

        //Require a minimum of 0.1 ether/bnb
        require(msg.value >= 1 * 10**17);

        //Calculate token amount
        uint256 weiAmount = msg.value;
        uint256 tokenAmount = weiAmount * presaleRate;
        uint256 unusedWei = 0;
        if (tokenAmount > presaleAmount) {
            unusedWei = presaleAmount / presaleRate;
            tokenAmount = presaleAmount;
        }

        //Update state
        presaleWeiRaised += weiAmount - unusedWei;
        presaleAmount -= tokenAmount;

        //Transfer token and unused wei
        nftaToken.transfer(msg.sender, tokenAmount);
        if (unusedWei > 0) {
            payable(msg.sender).transfer(unusedWei);
            presaleDone = true;
            emit PresaleClosed();
        }

        emit TokenSold(msg.sender, tokenAmount);
    }

    function buyICO() external payable {
        //Check general requirements
        require(presaleDone && !icoDone, "ICO has not started or is already done");
        require(block.timestamp > icoTimestamp, "ICO has not started");
        require(icoRate > 0, "ICO is not initialized");

        //Require a minimum of 0.1 ether
        require(msg.value > 1 * 10**17);

        //Calculate token amount
        uint256 weiAmount = msg.value;
        uint256 tokenAmount = weiAmount * icoRate;
        uint256 unusedWei = 0;
        if (tokenAmount > icoAmount) {
            unusedWei = icoAmount / icoRate;
            tokenAmount = icoAmount;
        }

        //Update state
        icoWeiRaised += weiAmount - unusedWei;
        icoAmount -= tokenAmount;

        //Transfer token and unused wei
        nftaToken.transfer(msg.sender, tokenAmount);
        if (unusedWei > 0) {
            payable(msg.sender).transfer(unusedWei);
            icoDone = true;
            emit ICOClosed();
        }

        emit TokenSold(msg.sender, tokenAmount);
    }

    //Getter functions
    function presaleRaised() external view returns(uint256 result) {
        return presaleWeiRaised;
    }

    function icoRaised() external view returns(uint256 result) {
        return icoWeiRaised;
    }

    function getPresaleRate() external view returns(uint256 result) {
        return presaleRate;
    }

    function getPresaleTimestamp() external view returns(uint256 result) {
        return presaleTimestamp;
    }

    function getICORate() external view returns(uint256 result) {
        return icoRate;
    }

    function getICOTimestamp() external view returns(uint256 result) {
        return icoTimestamp;
    }

    function getPresaleAmount() external view returns(uint256 result) {
        return presaleAmount;
    }

    function getICOAmount() external view returns(uint256 result) {
        return icoAmount;
    }

    function isPresaleDone() external view returns(bool result) {
        return presaleDone;
    }

    function isICODone() external view returns(bool result) {
        return icoDone;
    }
}