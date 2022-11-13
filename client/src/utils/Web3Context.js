import React, {useState, createContext, useEffect} from 'react';
import { detectProvider } from './providerHelper';
import { switchRoom } from './roomHelper';
import Web3 from 'web3';

export const Web3Context = createContext();

export const Web3Provider = ({children}) => {
    const [isConnected, setIsConnected] = useState(window.sessionStorage.getItem('isConnected') === 'true');
    const [currentAccount, setCurrentAccount] = useState(null);
    const [provider, setProvider] = useState(window.ethereum);
    const [chainId, setChainId] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const allowedChainIds = [
        //97, //BSC Testnet
        56 //BSC Mainnet
    ];

    const errorMessages = {
        'chain-error': 'Invalid chain. Switch to BSC mainnet and reconnect.',
        'connect-metamask': 'Please connect to metamask.'
    }

    const onLogout = async () => {
        await switchRoom();
        window.sessionStorage.setItem('isConnected', false);
        window.sessionStorage.removeItem('location');
        setIsConnected(false);
        setCurrentAccount(null);
    }

    const initWeb3 = async (provider) => {
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (allowedChainIds.indexOf(chainId) < 0) {
            setErrorMessage(errorMessages['chain-error']);
            onLogout();
        } else {
            if (accounts.length === 0) {
                setErrorMessage(errorMessages['connect-metamask']);
                onLogout();
            } else if (accounts[0] !== currentAccount) {
                setErrorMessage(null);
                setProvider(provider);
                setChainId(chainId);
                setCurrentAccount(accounts[0]);
                setWeb3(web3);
                setIsConnected(true);
                window.sessionStorage.setItem('isConnected', true);
            }
        }
    }

    const getBalance = async () => {
        try {
            let balance = await web3.eth.getBalance(currentAccount);
            return balance > 0 ? balance : 0;
        } catch (e) {
            console.log('error when getting balance')
            return 0;
        }
    }

    useEffect(() => {
        const handleAccountsChanged = async (accounts) => {
            //Previous:
            //const web3Accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                onLogout();
            } else if (accounts[0] !== currentAccount) {
                setCurrentAccount(accounts[0]);
            }
        }

        const handleChainChanged = async (chainId) => {
            //Previous:
            //const web3ChainId = await web3.eth.getChainId();
            //setChainId(web3ChainId);
            setChainId(chainId);
            let chainIdInteger = parseInt(chainId, 16);
            console.log('Chain changed.');
            if (chainIdInteger % 1 === 0 && allowedChainIds.indexOf(chainIdInteger) < 0) {
                console.log('Chain changed invalid.');
                setErrorMessage(errorMessages['chain-error']);
                onLogout();
            }
        }

        if (isConnected) {
            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (isConnected) {
                provider.removeListener('accountsChanged', handleAccountsChanged);
                provider.removeListener('chainChanged', handleChainChanged);
            }
        }
    }, [isConnected]);

    useEffect(() => {
        if (window.sessionStorage.getItem('isConnected') === 'true') {
            let provider = detectProvider();
            initWeb3(provider);
        }
    }, []);

    const ctxRead = {
        isConnected: isConnected,
        currentAccount: currentAccount,
        provider: provider,
        chainId: chainId,
        web3: web3,
        errorMessage: errorMessage
    }
    
    const ctxFunctions = {
        logout: onLogout,
        init: initWeb3,
        getBalance: getBalance
    }

    return (
        <Web3Context.Provider value={[ctxRead, ctxFunctions]}>
            {children}
        </Web3Context.Provider>
    );
}