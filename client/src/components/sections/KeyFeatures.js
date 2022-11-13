import React from 'react';
import Headline from '../elements/Headline';
import TextBlock from '../elements/TextBlock';
import ContainerSlider from '../elements/ContainerSlider';
import TextWreath from '../elements/TextWreath';
import TextImage from '../elements/TextImage';
import keyfactOne from '../../assets/images/sprites/keyfact-1.webp';
import keyfactTwo from '../../assets/images/sprites/keyfact-2.webp';
import keyfactThree from '../../assets/images/sprites/keyfact-3.webp';
import keyfactFour from '../../assets/images/sprites/keyfact-4.webp';
import bigswordbase from '../../assets/images/sprites/big-sword-base.png';
import bigswordblade from '../../assets/images/sprites/big-sword-blade.png';
import '../../assets/css/keyfeatures.css';

export default function KeyFeatures() {

    return (
        <div className="keyfeatures-section">
            <Headline title="Multiverse" aligned="center" />
            <TextBlock aligned="center">
                <div className="w-md-75 w-lg-50 mx-3 fs-lg">
                    It's not just a Buzzword. It's the esscence of the arena. We connect the NFT space on a whole new level and provide real utility. The arena is waiting for you. Let's Battle for tokens and glory.
                </div>
            </TextBlock>
            <ContainerSlider className="mt-3" mobileInfinite="true">
                <TextWreath><span className="fs-lg">Play to</span> Earn</TextWreath>
                <TextWreath>All NFT <span className="fs-md">Ecosystems</span></TextWreath>
                <TextWreath>Many <span className="fs-md">Partners</span></TextWreath>
                <TextWreath><span className="fs-lg">Own NFT</span> <span className="fs-lg">Gallery</span></TextWreath>
                <TextWreath><span className="fs-md">Secure via</span> <span className="fs-lg">Multisig</span></TextWreath>
            </ContainerSlider>
            <div className="d-flex flex-row mt-5 mx-auto w-75">
                <div className="d-flex flex-column flex-grow layer-2">
                    <TextImage title="NFT Rating" image={keyfactOne} className="align-center mb-4">To earn valuable tokens, you need to have your nft rated. Go to our fighting trainer Allen in our arena, he will give you the fighting permission. Choose your favorite NFTs and you are ready to fight.</TextImage>
                    <TextImage title="Battle" image={keyfactTwo} className="align-center mb-4">Ready to rumble! Yeah! When you enter the arena, you will be assigned to a random NFT opponent. Your enemy can be from various nft projects. So ignore the screaming of the fans and get ready for the fight. May the better one win. The fights are 100% onchain. After an exciting match the worthy winner will be crowned and get the opponents soul.</TextImage>
                    <TextImage title="Ranking" image={keyfactThree} className="align-center mb-4">In the arena you take many lives. For every win you gain a valuable $SOUL. You can sell them or even better, upgrade the Rank of your NFT to enter a new league. The ranking system will contain up to 3 different ranks: Rookie, Fighter and Champion!</TextImage>
                    <TextImage title="Tokenomics" image={keyfactFour} className="align-center mb-4">The total supply of the $NFTA Token will be fixed to 240.000.000 Tokens. The $NFTA Token delivers a long term oriented staking system, the Ecosystem Fund System and many more utilities.</TextImage>
                </div>
                <div className="d-flex flex-column flex-grow big-sword-container w-md-25 layer-1">
                    <div className="position-relative h-100">
                        <img src={bigswordblade} alt="Images can not be loaded on your browser" className="position-absolute"/>
                        <img src={bigswordbase} alt="Images can not be loaded on your browser" className="position-absolute"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
