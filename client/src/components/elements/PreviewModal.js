import React, { useEffect, useContext, useState } from 'react';
import { Web3Context } from '../../utils/Web3Context';
import MVKContractBuild from '../../contracts/MultikeyNFT.json';
import Connect from '../rooms/Connect';
import ContainerSlider from './ContainerSlider';
import Loader from './Loader';
import Modal from './Modal';
import frame from '../../assets/images/sprites/mvk-frame.png';
import $ from 'jquery';

export default function SaleModal(props) {
    const [web3State, ctxFunctions] = useContext(Web3Context);
    const [keys, setKeys] = useState('');

    async function updateKeys() {
        var web3 = web3State.web3;
        if (web3) {
            //const contractAddress = '0xC10940000bD920DFd45D2e7e50396E04cAa8acFf'; //Test contract
            const contractAddress = '0xD84b9d60Feab927DE7672fb38D43dB92813D421a'; //Live contract
            const mvkContract = new web3.eth.Contract(MVKContractBuild.abi, contractAddress);
            var done = false;
            var index = 0;
            var tokenIds = [];
            while(!done) {
                try {
                    var result = await mvkContract.methods.tokenOfOwnerByIndex(web3State.currentAccount, index).call();
                    tokenIds.push(result);
                } catch (e) {
                    done = true;
                }
                index++;
            }
            if (tokenIds.length <= 0) {
                //Show empty message
                $('.loader-container').html('<div>There are no Multiverse Keys in your wallet. You can mint your own Multiverse Keys on "Mint Now".</div>');
                $('#preview-modal .modal-content').addClass('alert');
            }
            var newKeys = tokenIds.map(function(tokenId) {
                return <div className="token-container" key={tokenId}><img src={'https://niftalis.com/nfts/keys/'+tokenId} /></div>;
            });
            setKeys(newKeys);
        }
    }

    useEffect(() => {
        $(document).on('click', '#preview-modal span.close', function() {
            ctxFunctions.logout();
        });
        $(document).on('click', function(event) {
            var modal = document.getElementById('preview-modal');
            if (event.target == modal) {
                ctxFunctions.logout();
            }
        });
    }, []);

    useEffect(() => {
        if (web3State.isConnected) {
            updateKeys();
        }
    }, [web3State.web3]);


    useEffect(() => {
        if (web3State.isConnected) {
            updateKeys();
        }
    }, [web3State.isConnected]);

    return(
        <div>
            {web3State.isConnected &&
                <Modal id="preview-modal" className="loaded" open={props.modal == "preview"}>
                    {keys.length > 0 &&
                        <div className=" w-100">
                        <div className="position-relative">
                            <img src={frame} className="frame" />
                        </div>
                            <ContainerSlider amount={1} className="">
                                {keys}
                            </ContainerSlider>
                        </div>
                    }
                    {keys.length <= 0 &&
                        <div className="loader-container d-flex justify-center">
                            <span className="position-absolute"><b>Load blockchain data...</b></span>
                            <Loader />
                        </div>
                    }
                </Modal>
            }
            {!web3State.isConnected &&
                <Connect id="preview-modal" title="Wallet connection" open={false} info="At first you have to connect to your wallet. After building up a successful wallet connection, you can see your Multikey NFTs!" fixed="true" />
            }
        </div>
    )
}