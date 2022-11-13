import React, { useEffect } from 'react';
import { fadeOutSound, playSound, setBackgroundMusic } from '../../utils/soundHelper';
import SocialLinks from '../elements/SocialLinks';
import planet from '../../assets/images/planet.webp';
import arena from '../../assets/images/arena.png';
import ship from '../../assets/images/ship.svg';
import citybg from '../../assets/images/city-bg.webp';
import city from '../../assets/images/city-skyline.webp';
import astronautbg from '../../assets/images/astronaut-bg.webp';
import astronaut from '../../assets/images/astronaut.webp';
import logo from '../../assets/images/logo.webp';
import takeoff from '../../assets/music/music-takeoff.mp3';
import submit from '../../assets/music/sound-submit.mp3';
import $ from 'jquery';
import Parallax from 'parallax-js';
import '../../assets/css/hero.css';

export default function Hero(props) {
    useEffect(() => {
        //Define background music
        setBackgroundMusic('bg-takeoff');

        //Handle button click sounds
        $('button.btn-primary').on('click', function() {
            playSound('sound-submit');
            fadeOutSound('bg-takeoff', 200);
        });

        //Init parallax
        var scene = document.getElementById('scene');
        new Parallax(scene);
    }, []);

    return (
        <div className="hero-section">
            <audio id="bg-takeoff" src={takeoff} type="audio/mpeg" autoPlay loop></audio>
            <audio id="sound-submit" src={submit} type="audio/mpeg"></audio>
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <img src={planet} className="hero-planet layer-1" alt="Images can not be loaded on your browser" />
                <div id="scene">
                    <img data-depth="0.3" data-limit-x="50" src={citybg} className="hero-city-bg layer-1" alt="Images can not be loaded on your browser" />
                    <div data-depth="0.2" className="d-flex align-center justify-center">
                        <img src={arena} className="hero-arena layer-1" alt="Images can not be loaded on your browser" />
                    </div>
                    <img data-depth="0.2" src={city} className="hero-city layer-2" alt="Images can not be loaded on your browser" />
                    <img data-depth="0.1" src={astronautbg} className="hero-astronaut-bg layer-2" alt="Images can not be loaded on your browser" />
                </div>
                <img src={ship} className="hero-ship layer-1 spaceship-flight" alt="Images can not be loaded on your browser" />
                <img src={astronaut} className="hero-astronaut layer-2" alt="Images can not be loaded on your browser" />
            </div>
            <div className="position-absolute h-100 w-100 layer-3">
                <div className="hero-menu layer-3 d-flex flex-column align-center justify-center">
                    <img src={logo} className="hero-logo mb-3" alt="Images can not be loaded on your browser" width="300" height="300" />
                    {props.setExplore &&
                        <button onClick={() => props.setExplore(true)} className="btn btn-primary w-100">Discover</button>
                    }
                    <SocialLinks
                        discord={process.env.REACT_APP_DISCORD}
                        telegram={process.env.REACT_APP_TELEGRAM}
                        twitter={process.env.REACT_APP_TWITTER}
                        whitepaper={process.env.REACT_APP_WHITEPAPER}
                        large={false}
                        addClass="w-100"
                    />
                </div>
            </div>
        </div>
    )
}
