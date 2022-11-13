import React from 'react';
import { useParallax } from 'react-scroll-parallax';
import Gradient from '../elements/Gradient';
import deskbottom from '../../assets/images/roadmap-desk-bottom.webp';
import buildingOne from '../../assets/images/sprites/skyline-building-1.webp';
import buildingTwo from '../../assets/images/sprites/skyline-building-2.webp';
import buildingThree from '../../assets/images/sprites/skyline-building-3.webp';
import buildingFour from '../../assets/images/sprites/skyline-building-4.webp';
import '../../assets/css/skyline.css';

export default function Skyline() {
    const start = window.screen.width >= 768 ? (window.screen.width >= 992 ? (window.screen.width >= 1400 ? '500px' : '250px') : '150px') : '80px';
    const aniBuilding = useParallax({
        easing: 'easeOutQuad',
        translateY: [start, '0px']
    });
    const zoomText = useParallax({
        easing: 'easeOutQuad',
        scale: [0.8, 1]
    });
    
    return(
        <div className="skyline-section">
            <div className="position-relative layer-1">
                <div ref={aniBuilding.ref} className="building-container">
                    <img src={buildingOne} alt="Images can not be loaded on your browser" className="one" />
                    <img src={buildingTwo} alt="Images can not be loaded on your browser" className="two" />
                    <img src={buildingThree} alt="Images can not be loaded on your browser" className="three" />
                    <img src={buildingFour} alt="Images can not be loaded on your browser" className="four" />
                </div>
            </div>
            <div className="desk-bottom">
                <img src={deskbottom} alt="Images can not be loaded on your browser" className="w-100"/>
                <div className="d-flex flex-column align-center justify-center">
                    <div className="position-relative">
                        <div className="logo-container">
                            <Gradient name="logo" />
                        </div>
                    </div>
                    <h3 ref={zoomText.ref}>Welcome in the<br/>Multiverse</h3>
                    <a href="https://nft-arenas.com/sale" className="btn btn-primary"><span>Play now</span></a>
                </div>
            </div>
        </div>
    )
}