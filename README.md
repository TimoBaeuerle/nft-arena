## NFT Arena
![](https://raw.githubusercontent.com/TimoBaeuerle/nft-arena/main/client/src/assets/images/nft-arena-preview.png)
### Project description
This repository contains the NFT-Arena project files. To run application:
1. Switch to `client` folder
2. Run `npm install` to install dependencies
3. Run `npm run start` to start application
4. Enjoy!

### Toolbox
The Toolbox of this project contains following development tools:

* [Truffle](https://www.trufflesuite.com/), for testing solidity contracts
* [React](https://reactjs.org/), for developing a spa web application
* [Web3.js](https://web3js.readthedocs.io/), for interacting with ethereum blockchain from the web application

### How to install?
##### Local install:
1. Clone this repository to your local system with `git clone`
2. Install truffle, if not already done with `npm install -g truffle`
3. Start truffle development console with `truffle develop`
4. Compile smart contracts with `compile`
5. Migrate smart contract on your local blockchain instance with `migrate`
6. Open a second terminal and switch to projects `client`-Folder
7. Install dependencies with `npm install`
8. Start react web application with `npm start`
9. Connect MetaMask-Wallet to your local blockchain network, generally on `port 8545`
10. Generate MetaMask-Wallet with the seed-phrase shown after starting the truffle development console
11. Switch to web application running in your browser and start exploring


##### Productive install
1. Clone this repository to your local system with `git clone`
2. Install truffle, if not already done with `npm install -g truffle`
3. Open a second terminal and switch to projects `client`-Folder
4. Build react web application with `npm build`
5. Configure server to react web application