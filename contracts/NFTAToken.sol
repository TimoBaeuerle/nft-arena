// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NFTAToken is ERC20 {
    constructor() ERC20("NFT Arena", "NFTA") {
        //Creates limited 240 million NFTA Tokens with 18 decimals
        _mint(msg.sender, 240000000000000000000000000);
    }
}