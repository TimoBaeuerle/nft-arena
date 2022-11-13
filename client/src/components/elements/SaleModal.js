import React, { useEffect, useContext, useState } from 'react';
import { Web3Context } from '../../utils/Web3Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import MVKContractBuild from '../../contracts/MultikeyNFT.json';
import Connect from '../rooms/Connect';
import Modal from './Modal';
import $ from 'jquery';

export default function SaleModal(props) {
    const [web3State, ctxFunctions] = useContext(Web3Context);
    const [hasMinted, setHasMinted] = useState(false);

    useEffect(() => {
        $(document).on('click', '#sale-modal span.close', function() {
            ctxFunctions.logout();
        });
        $(document).on('click', function(event) {
            var modal = document.getElementById('sale-modal');
            if (event.target == modal) {
                ctxFunctions.logout();
            }
        });
    });

    const subAmount = () => {
        let value = $('#mint-amount').attr('value');
        let parsed = parseInt(value);
        if (!isNaN(parsed) && parsed > 1) {
            if (parsed < 5) {
                $('#mint-amount').val(parsed-1);
                $('#mint-amount').attr('value', parsed-1);
                $('span.amount').text(parsed-1);
                updateCosts(parsed-1);
            }
        }
    }
    const addAmount = () => {
        let value = $('#mint-amount').attr('value');
        let parsed = parseInt(value);
        if (!isNaN(parsed)) {
            if (parsed < 3) {
                $('#mint-amount').attr('value', parsed+1);
                $('span.amount').text(parsed+1);
                updateCosts(parsed+1);
            }
        }
    }
    const updateCosts = (newCosts) => {
        $('.price-sum').text(newCosts);
    }

    const sendTransaction = async () => {
        $('.send-tx').text('Handle transaction...');
        $('.send-tx').addClass('pulse-animation');
        let value = $('#mint-amount').attr('value');
        let parsed = parseInt(value);
        if (!isNaN(parsed)) {
            if (parsed > 0 && parsed <= 3) {
                //Send mint call to contract via web3
                let web3 = web3State.web3;
                //const contractAddress = '0xC10940000bD920DFd45D2e7e50396E04cAa8acFf'; //Test contract
                const contractAddress = '0xD84b9d60Feab927DE7672fb38D43dB92813D421a'; //Live contract
                const mvkContract = new web3.eth.Contract(MVKContractBuild.abi, contractAddress);
                try {
                    var result = await mvkContract.methods.mint(parsed).send({ from: web3State.currentAccount });
                    if (result.blockNumber) {
                        //Open success modal
                        setHasMinted(true);
                    }
                } catch (error) {
                    $('.send-tx').text('Send transaction');
                    $('.send-tx').removeClass('pulse-animation');
                }
            }
        } else {
            alert('An error occured. Please contact support.')
        }
    }

    return (
        <div className="sale-modal-container">
            {web3State.isConnected &&
                <Modal id="sale-modal" title="Mint your Multikey" open={props.modal == "sale"}>
                    {hasMinted &&
                        <div className="d-flex flex-column w-100">
                            <div className="d-flex">
                                <label className="fs-lg mr-3">Congratulations, you have successfully minted your Multiverse Key. You can view your minted key very soon!</label>
                            </div>
                            <button className="btn btn-primary mt-4" onClick={props.showPreview}>Show Multiverse Key</button>
                        </div>
                    }
                    {!hasMinted &&
                        <div className="d-flex flex-column w-100">
                            <input id="mint-amount" className="d-none" type="number" value="1" onChange={updateCosts}></input>
                            <div className="d-flex">
                                <label className="fs-lg mr-3 w-50">How many Multikeys do you want to mint?</label>
                                <div className="d-flex align-center justify-end flex-grow">
                                    <button className="sub mr-1" onClick={subAmount}><FontAwesomeIcon icon={faMinus} /></button>
                                    <span className="amount mr-1">1</span>
                                    <button className="add" onClick={addAmount}><FontAwesomeIcon icon={faPlus} /></button>
                                </div>
                            </div>
                            <span className="fs-lg mt-4 align-self-end">Total costs: <span className="price-sum">1</span> BNB</span>
                            <button className="btn btn-primary mt-3 send-tx" onClick={sendTransaction}>Send transaction</button>
                        </div>
                    }
                </Modal>
            }
            {!web3State.isConnected &&
                <Connect id="sale-modal" title="Wallet connection" open={false} info="At first you have to connect to your wallet. After building up a successful wallet connection, you can mint your own Multikey NFT!" fixed="true" />
            }
        </div>
    )
}
