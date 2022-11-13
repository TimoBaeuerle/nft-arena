import React, { useState, useContext, useEffect } from 'react';
import { Web3Context } from '../../utils/Web3Context';
import { detectProvider } from '../../utils/providerHelper';
import { switchRoom } from '../../utils/roomHelper';
import { setGameBackgroundMusic, getBackgroundMusic, fadeOutSound } from '../../utils/soundHelper';
import Modal from '../elements/Modal';
import takeoff from '../../assets/music/music-takeoff.mp3';
import skyline from '../../assets/images/city-skyline.png';
import gradient from '../../assets/images/city-skyline-gradient.png';
import gate from '../../assets/images/city-gate.webp';
import '../../assets/css/connect.css';

export default function Connect(props) {
    const [web3State, ctxFunctions] = useContext(Web3Context);
    const [isConnecting, setIsConnecting] = useState(false);
    const [provider, setProvider] = useState(window.ethereum);
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

    const onLogin = async () => {
        setIsConnecting(true);
        await provider.request({
            method: 'eth_requestAccounts'
        })
        if (props.ingame) {
            fadeOutSound(getBackgroundMusic(), 50);
        }
        await switchRoom();
        setIsConnecting(false);
        ctxFunctions.init(provider);
    }

    useEffect(() => {
        if (provider) {
            if (provider !== window.ethereum) {
                console.error('Not window.ethereum provider. Do you have multiple wallet installed?');
            }
            setIsMetamaskInstalled(true);
        }
    }, [provider])

    useEffect(() => {
        //Init provider
        setProvider(detectProvider());

        //Set background music
        if (props.ingame) {
            setGameBackgroundMusic(takeoff);
        }
    }, []);

    return (
        <div className="connect-room room">
            <div className="city-container">
                <div className="position-relative overflow-hidden">
                    <img src={skyline} alt="Images can not be loaded on your browser" className="city-skyline" width="3840" height="638" />
                    <img src={gradient} alt="Images can not be loaded on your browser" className="city-skyline city-skyline-gradient" width="3840" height="638" />
                </div>
            </div>
            <div className="gate-container">
                <img src={gate} alt="Images can not be loaded on your browser" className="city-gate w-100" width="800" height="450" />
            </div>
            <Modal id={props.id ? props.id : 'connect-modal'} title={props.title ? props.title : ''} open={props.open ? props.open : ''} closable={props.closable || props.closable == false ? props.closable : true}>
                {isMetamaskInstalled &&
                    <div className="w-100">
                        {props.info &&
                            <p className="text-center mx-auto">{props.info}</p>
                        }
                        <button className="btn btn-primary w-100" type="button" onClick={onLogin}>{isConnecting ? 'Connecting...' : 'Connect'}</button>
                        <span className="error">{web3State.errorMessage}</span>
                    </div>
                }
                {!isMetamaskInstalled &&
                    <a className="btn btn-primary w-100" href="https://metamask.io" target="_blank" rel="noopener noreferrer">Install Metamask</a>
                }
            </Modal>
        </div>
    )
}
