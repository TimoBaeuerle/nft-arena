import React from 'react';
import SocialLinks from '../elements/SocialLinks';
import '../../assets/css/header.css';

export default function Header() {
    return(
        <div className="header-section layer-3">
            <div className="header-bg w-100 w-xl-75 mx-auto">
                <div className="d-flex justify-between">
                    <div className="d-flex align-center justify-between flex-grow">
                        <div className="d-flex justify-evenly w-100">
                            <a href={process.env.REACT_APP_WHITEPAPER} target="_blank" className="d-none d-lg-block mr-3 spacer">Whitepaper</a>
                            <a href="#roadmap" className="d-none d-md-block mr-1">Roadmap</a>
                        </div>
                        <div>
                            <SocialLinks
                                instagram={process.env.REACT_APP_INSTAGRAM}
                                twitter={process.env.REACT_APP_TWITTER}
                                large={false}
                            />
                        </div>
                    </div>
                    <a href="https://nft-arenas.com/sale" className="cta-anchor">
                        <div className="cta-container layer-3">
                            <span>Play</span>
                        </div>
                    </a>
                    <div className="d-flex align-center justify-between flex-grow">
                        <div>
                            <SocialLinks
                                discord={process.env.REACT_APP_DISCORD}
                                telegram={process.env.REACT_APP_TELEGRAM}
                                large={false}
                            />
                        </div>
                        <div className="d-flex justify-evenly w-100">
                            <a href={process.env.REACT_APP_MEDIUM} target="_blank" className="d-none d-md-block mr-3">News</a>
                            <a href="#founders" className="d-none d-lg-block mr-0">Founders</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}