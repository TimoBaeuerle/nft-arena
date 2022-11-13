import React from 'react';
import TextBlock from '../elements/TextBlock';
import labordesk from '../../assets/images/labor-desk.webp';
import desktop from '../../assets/images/roadmap-desk-top.svg';
import gallery from '../../assets/images/sprites/roadmap-gallery.webp';
import tower from '../../assets/images/sprites/roadmap-tower.webp';
import arena from '../../assets/images/sprites/roadmap-mini-arena.webp';
import tribes from '../../assets/images/sprites/roadmap-tribes.webp';
import logo from '../../assets/images/sprites/logo.webp';
import '../../assets/css/roadmap.css';

export default function Roadmap() {
    return(
        <div className="roadmap-section">
            <img src={labordesk} alt="Images can not be loaded on your browser" />
            <div id="roadmap" className="desk-container">
                <div className="desk-top">
                    <img src={desktop} alt="Images can not be loaded on your browser" className="w-100"/>
                    <div>
                        <img src={logo} alt="Images can not be loaded on your browser" className="w-100"/>
                        <span>Roadmap</span>
                    </div>
                </div>
                <div className="desk-middle">
                    <div>
                    <TextBlock className="right">
                        <div className="table-img gallery">
                            <img src={gallery} alt="Images can not be loaded on your browser" />
                        </div>
                        <div>
                            <h3>NFT Gallery</h3>
                            <p>
                                There is finally a place where your NFTs can be admired. The Multiverse NFT Gallery adds a ton of NFT utility to any project. Here you can not only admire your collection with pleasant sounds and a glass of wine, but there will also be other features such as special stats, insights and collector points.
                            </p>
                        </div>
                    </TextBlock>
                    <TextBlock className="left">
                        <div>
                            <h3>Multiverse</h3>
                            <p>
                                The most important thing is the community in the NFT space. That's why we created this multiverse to connect all projects and add new utility to them. We constantly integrate and present new projects to you guys. These will be integrated into the arena to fight, but also get special integration in our gallery and for exhibitions. We also want to bring certain prizes and incentives for big collectors.
                            </p>
                        </div>
                        <div className="table-img tower">
                            <img src={tower} alt="Images can not be loaded on your browser" />
                        </div>
                    </TextBlock>
                    <TextBlock className="right">
                        <div className="table-img arena">
                            <img src={arena} alt="Images can not be loaded on your browser" />
                        </div>
                        <div>
                            <h3>NFT Arena</h3>
                            <p>
                                Our Arena is the reason why so many beings take the journey into our universe. They want to fight, explore and win. The heart of our multiverse is the NFT Arena, which will be the central component for duels, events and battles. Fight your way up from rookie to champion. Upgrade your skills intelligently and become the undisputed universes number one. Receive not only tokens but also especially valuable NFTs. This and much more will await you in our arena.
                            </p>
                        </div>
                    </TextBlock>
                    <TextBlock className="left">
                        <div>
                            <h3>Galactic Tribes</h3>
                            <p>
                                The Galactic Federation is made up of a wide variety of tribes. We are a multiverse project and therefore at home on all chains. Let's connect existing NFTs and merge them galactically in a completely new way. Your eyes wont believe what they see.
                            </p>
                        </div>
                        <div className="table-img tribes">
                            <img src={tribes} alt="Images can not be loaded on your browser" />
                        </div>
                    </TextBlock>
                    </div>
                </div>
            </div>
        </div>
    )
}