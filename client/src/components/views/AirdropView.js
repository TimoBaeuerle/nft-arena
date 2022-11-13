import React, { useEffect } from 'react';
import Modal from '../elements/Modal';
import spacestation from '../../assets/images/sprites/space-station.png';
import $ from 'jquery';
import '../../assets/css/airdrop.css';

export default function AirdropView() {
    useEffect(() => {
        setTimeout(function() {
            $('.airdrop-spacestation').addClass('fly-in');
            setTimeout(function() {
                $('.airdrop-spacestation').addClass('moving');
            }, 3000);
        }, 1000);
    });

    return (
        <div className="airdrop-view">
            <img src={spacestation} alt="Images can not be loaded on your browser" className="airdrop-spacestation" />
            <Modal open={true} title="NFT Arena Airdrop - 150k $NFTA">
                <div className="airdrop-steps">
                    <p>
                        You are on one of the greatest adventures the galaxy has ever seen. ✨💫
                    </p>
                    <p>
                        As one of the first players who came across NFT Arena, you have a chance to get free $NFTA tokens.💎👨‍🚀
                    </p>
                    <p>
                        Exclusively for our beginner community we will give away a total of 150k $NFTA - tokens worth of $30k. 🏆🏅✨
                    </p>
                    <div className="d-flex flex-column mt-4">
                        <a href="https://forms.gle/KaJmHr2UanTLMxdA7" className="btn btn-primary w-75 glow mx-auto">Go to airdrop</a>
                        <a href="https://medium.com/@nftarenas/nft-arena-airdrop-150k-nfta-and-nfts-9b69a7b20af5" className="btn btn-primary w-75 mx-auto">Medium article</a>
                        <a href="https://nft-arenas.com/" className="btn btn-primary w-75 mx-auto">Back to homepage</a>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
