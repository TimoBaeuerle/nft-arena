import React, {useState, useContext, useEffect } from 'react';
import { Web3Context } from '../../utils/Web3Context';
import '../../assets/css/walletstatus.css';

export default function WalletStatus() {
    const [balance, setBalance] = useState(0);
    const [web3State, ctxFunctions] = useContext(Web3Context);

    useEffect(() => {
        async function updateBalance() {
            if (web3State.web3 != null && web3State.currentAccount != null) {
                let newBalance = await ctxFunctions.getBalance();
                setBalance(newBalance);
            }
        }
    
        updateBalance()
    }, [web3State.currentAccount, web3State.chainId]);

    return(
        <div className="wallet-status d-flex align-center">
            <div>
                <span>{(balance / 10**18) >= 0.0001 ? ((balance / 10**18) < 1000 ? (balance / 10**18).toFixed(4) : (balance / 10**18).toFixed(0)) : 0} BNB</span>
                <span className="mr-3">{web3State.currentAccount ? web3State.currentAccount.substr(0, 4) + '...' + web3State.currentAccount.substr(38, 42) : '0x00...0000'}</span>
            </div>
            <button className="btn btn-primary mb-0 px-3 fs-xs" type="button" onClick={ctxFunctions.logout}>Disconnect</button>
        </div>
    )
}