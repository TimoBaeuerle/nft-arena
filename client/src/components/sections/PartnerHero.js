import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Headline from '../elements/Headline';
import Gradient from '../elements/Gradient';
import ContainerSlider from '../elements/ContainerSlider';
import drone from '../../assets/images/sprites/drone.png';
import dronelight from '../../assets/images/sprites/drone-light.png';
import spacestation from '../../assets/images/sprites/space-station.png';
import crowd from '../../assets/images/crowd.webp';
import bsc from '../../assets/images/bsc-logo.webp';
import chainlink from '../../assets/images/chainlink-logo.webp';
import nftOne from '../../assets/images/sprites/nft-1.webp';
import nftTwo from '../../assets/images/sprites/nft-2.webp';
import nftThree from '../../assets/images/sprites/nft-3.webp';
import nftFour from '../../assets/images/sprites/nft-4.webp';
import nftFive from '../../assets/images/sprites/nft-5.webp';
import '../../assets/css/partnerhero.css';

export default function PartnerHero() {
    return (
        <div className="partnerhero-section">
            <div className="partnerhero-banner">
                <img src={spacestation} alt="Images can not be loaded on your browser" className="partnerhero-spacestation" />
                <div className="partnerhero-drone">
                    <img src={drone} alt="Images can not be loaded on your browser" />
                    <img src={dronelight} alt="Images can not be loaded on your browser" className="light" />
                </div>
                <div className="partnerhero-bannertext layer-2">
                    <h1>For real<br/>NFT Champions</h1>
                    <span>Play with your favorite NFT projects in our arena, so fortune and glory will be yours.</span>
                    <a href="#explore"><FontAwesomeIcon icon={faAngleDown} /></a>
                </div>
                <div className="position-relative overflow-hidden h-100">
                    <img src={crowd} className="partnerhero-crowd layer-1" alt="Images can not be loaded on your browser" />
                </div>
            </div>
            <div id="explore" className="partnerhero-partners">
                <Headline title="We work and integrate with..." aligned="center" className="mb-3" />
                <div className="d-flex flex-column flex-md-row align-center justify-center">
                    <Gradient name="bsc" className="layer-1" />
                    <img src={bsc} className="partner-logo spacer" alt="Images can not be loaded on your browser" />
                    <Gradient name="chainlink" className="layer-1" />
                    <img src={chainlink} className="partner-logo mobile-spacer" alt="Images can not be loaded on your browser" />
                </div>
            </div>
            <div className="partnerhero-nfts">
                <ContainerSlider className="mt-3" mobileInfinite="true">
                    <div>
                        <img src={nftOne} className="" alt="Images can not be loaded on your browser" />
                    </div>
                    <div>
                        <img src={nftTwo} className="" alt="Images can not be loaded on your browser" />
                    </div>
                    <div>
                        <img src={nftThree} className="" alt="Images can not be loaded on your browser" />
                    </div>
                    <div>
                        <img src={nftFour} className="" alt="Images can not be loaded on your browser" />
                    </div>
                    <div>
                        <img src={nftFive} className="" alt="Images can not be loaded on your browser" />
                    </div>
                </ContainerSlider>
            </div>
            <div className="partnerhero-gradient"></div>
        </div>
    )
}