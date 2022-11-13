import React from 'react';
import { useParallax } from 'react-scroll-parallax';
import TextImage from '../elements/TextImage';
import Headline from '../elements/Headline';
import ground from '../../assets/images/labor-ground.webp';
import background from '../../assets/images/labor-bg.webp';
import sapphire from '../../assets/images/sapphire.webp';
import luvulith from '../../assets/images/luvulith.webp'
import glass from '../../assets/images/sprites/labor-glass.webp';
import '../../assets/css/labor.css';

export default function Labor() {
    const top = '-' + window.screen.width * 0.3 + 'px';
    const aniLabor = useParallax({
        easing: 'easeOutQuad',
        translateY: [top, '0px']
    });

    return(
        <div className="labor-section">
            <img className="position-relative" src={ground} alt="Images can not be loaded on your browser" />
            <div id="founders">
                <img src={background} alt="Images can not be loaded on your browser" />
                <div ref={aniLabor.ref} className="founders d-flex flex-column">
                    <Headline title="Main Founders" className="mb-3" />
                    <div className="d-flex flex-column flex-md-row justify-between w-100">
                        <TextImage title="Dr. Sapphire" image={sapphire}>When he's not burning off his eyebrows again in the lab, he's coding day and night. Sapphire is the lead developer of the team. As a full stack developer he sits in the catacombs of the arena and make the most important coding decisions.</TextImage>
                        <TextImage title="Prof. Luvulith" image={luvulith}>The creative mind behind the styles and design of the arena. He is probably the one and only creator, who created himself. Always on the run for exciting partnerships and new features. Some people say that his mustache has magical abilities, probably just rumors.</TextImage>
                    </div>
                </div>
                <div className="position-relative">
                    <img className="glass position-absolute" src={glass} alt="Images can not be loaded on your browser" />
                </div>
            </div>
        </div>
    )
}