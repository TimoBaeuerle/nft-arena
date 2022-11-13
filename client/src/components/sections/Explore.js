import React, { useEffect } from 'react';
import { playSound, setBackgroundMusic } from '../../utils/soundHelper';
import { ParallaxProvider } from 'react-scroll-parallax';
import Header from './Header';
import PartnerHero from './PartnerHero';
import KeyFeatures from './KeyFeatures';
import Labor from './Labor';
import Roadmap from './Roadmap';
import Skyline from './Skyline';
import deepspace from '../../assets/music/music-deepspace.mp3';
import $ from 'jquery'
import '../../assets/css/explore.css';

export default function Explore() {
    useEffect(() => {
        //Define background music
        setBackgroundMusic('bg-deepspace');

        //Fade out menu
        $('.hero-menu').addClass('fadeOut');
        $('.volume-button').addClass('fadeOut');

        //Stop animation & set current margin
        $('.hero-arena').addClass('stop-animation');
        var mtValue = $('.hero-arena').css('margin-top');
        $('.hero-arena').css('margin-top', mtValue);

        setTimeout(function() {
            //Change arena layer
            //$('.hero-arena').addClass('layer-3');
            //Parallax fix
            $('.hero-ship').css('z-index', '0');

            //Hide menu
            $('.hero-menu').addClass('d-none');
            
            //Centerize arena
            $('.hero-arena').addClass('centerize-arena');
            $('.hero-city-bg').addClass('centerize-down');
            $('.hero-city').addClass('centerize-left');
            $('.hero-astronaut-bg').addClass('centerize-down');
            $('.hero-astronaut').addClass('centerize-left');
            $('.hero-planet').addClass('centerize-planet');

            setTimeout(function() {
                //Zoom into arena
                $('.hero-arena').addClass('zoom-in-arena');

                //Show overlay
                setTimeout(function() {
                    $('.zoom-overlay').addClass('show');
                    setTimeout(function() {
                        //Switch to explore page
                        $('.hero-section').addClass('d-none');
                        $('.explore-section').removeClass('d-none');
                        $('.volume-button').removeClass('fadeOut');
                    }, 1000)
                }, 500);


                //Init explore page
                setTimeout(function() {
                    //Start background music
                    playSound('bg-deepspace');

                    //Handle visuals
                    $('.zoom-overlay').removeClass('show');
                    setTimeout(function() {
                        $('.zoom-overlay').addClass('d-none');
                        $('.partnerhero-section .partnerhero-spacestation').addClass('fly-in');
                        setTimeout(function() {
                            $('.partnerhero-section .partnerhero-spacestation').addClass('moving');
                        }, 3000);
                    }, 1000);
                }, 2000);
            }, 2000);
        }, 500);
    });

    return (
        <div>
            <div className="zoom-overlay layer-4"></div>
            <div className="explore-section d-none">
                <audio id="bg-deepspace" src={deepspace} type="audio/mpeg" loop></audio>
                <ParallaxProvider>
                    <Header />
                    <PartnerHero />
                    <KeyFeatures />
                    <Labor />
                    <Roadmap />
                    <Skyline />
                </ParallaxProvider>
            </div>
        </div>
    )
}