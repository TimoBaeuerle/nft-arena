import React, {useState, useEffect } from 'react';
import { Web3Provider } from '../../utils/Web3Context';
import { setBackgroundMusic } from '../../utils/soundHelper';
import { startCountdown, updateCountdown } from '../../utils/countdownHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faPlayCircle, faBook, faStar } from '@fortawesome/free-solid-svg-icons';
import VolumeButton from '../elements/VolumeButton';
import SocialLinks from '../elements/SocialLinks';
import Modal from '../elements/Modal';
import SaleModal from '../elements/SaleModal';
import PreviewModal from '../elements/PreviewModal';
import skyline from '../../assets/images/city-skyline.png';
import gradient from '../../assets/images/city-skyline-gradient.png';
import gate from '../../assets/images/city-gate.webp';
import key from '../../assets/images/sprites/key.png';
import deepspace from '../../assets/music/music-deepspace.mp3';
import trailer from '../../assets/videos/trailer.mp4';
import $ from 'jquery';
import '../../assets/css/salespage.css';

export default function SalespageView() {
    const [saleStarted, setSaleStarted] = useState(false);
    const [modal, setModal] = useState(window.sessionStorage.getItem('currentModal') || 'sale');
    const countDownDate = new Date(Date.UTC(2022, 3, 7, 19, 7, 0, 0)).getTime();

    const showPreview = () => {
        $('#preview-modal button').trigger('click');
        window.sessionStorage.setItem('currentModal', 'preview');
        setModal('preview');
    }

    useEffect(() => {
        //Define background music
        setBackgroundMusic('bg-deepspace');

        //Init timer
        updateCountdown(countDownDate, 'Sale started!');
        startCountdown(countDownDate, 'Sale started!');

        //Preload preview
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('keys')) {
            window.sessionStorage.setItem('currentModal', 'preview');
            setModal('preview')
            setTimeout(function() {
                $('#preview-modal button').trigger('click');
            }, 300);
        }

        setTimeout(function() {
            $('.salespage-key').addClass('pulse');
            setTimeout(function() {
                $('.salespage-key').removeClass('pulse');
                setTimeout(function() {
                    $('.salespage-key').removeClass('move');
                }, 700);
            }, 600);
        }, 300);

        $('#countdown').on('DOMSubtreeModified', function() {
            console.log('changed..');
            if (this.innerHTML == 'Sale started!') {
                setSaleStarted(true);
            }
        })

        $(document).on('click', '[data-modal="video-modal"]', function() {
            $('video')[0].play();
        });
        $(document).on('click', '#video-modal span.close', function() {
            $('video')[0].pause();
        });
        $(document).on('click', function(event) {
            var modal = document.getElementById('video-modal');
            if (event.target == modal) {
                $('video')[0].pause();
            }
        });
        $(document).on('click', '[data-modal="sale-modal"]', function() {
            var previous = window.sessionStorage.getItem('currentModal');
            window.sessionStorage.setItem('currentModal', 'sale');
            if (previous != 'sale') {
                setModal('sale');
            }
        });
        $(document).on('click', '[data-modal="preview-modal"]', function() {
            var previous = window.sessionStorage.getItem('currentModal');
            window.sessionStorage.setItem('currentModal', 'preview');
            if (previous != 'preview') {
                setModal('preview');
            }
        });
    }, []);

    return (
        <div className="salespage-view">
            <audio id="bg-deepspace" src={deepspace} type="audio/mpeg" autoPlay loop></audio>
            <div className="salespage-city">
                <div className="position-relative overflow-hidden">
                    <img src={skyline} alt="Images can not be loaded on your browser" className="city-skyline" width="3840" height="638" />
                    <img src={gradient} alt="Images can not be loaded on your browser" className="city-skyline city-skyline-gradient" width="3840" height="638" />
                </div>
            </div>
            <div className="d-flex justify-center">
                <img src={gate} alt="Images can not be loaded on your browser" className="city-gate w-100" width="800" height="450" />
            </div>
            <div className="salespage-content">
                <div>
                    <div className="content-container">
                        <div className="d-flex">
                            <div className="w-100 w-md-75 layer-1">
                                <div className="d-flex">
                                    <a href="/" className="btn btn-primary px-3"><FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" /><span>Back to homepage</span></a>
                                    <a href="https://medium.com/@nftarenas/nft-multiverse-key-sale-c1271c585f85" target="_blank" rel="noopener noreferrer" className="btn btn-primary ml-3 px-3"><FontAwesomeIcon icon={faBook} className="mr-2" /><span>Medium article</span></a>
                                </div>
                                <div className="d-flex">
                                    <button data-modal="video-modal" className="btn btn-primary px-3"><FontAwesomeIcon icon={faPlayCircle} className="mr-2" /><span>Video</span></button>
                                    <button data-modal="preview-modal" className="btn btn-primary ml-3 px-3"><FontAwesomeIcon icon={faStar} className="mr-2" /><span>NFT Preview</span></button>
                                </div>
                                <h1>Multiverse Key</h1>
                                <span id="countdown">00:00:00</span>
                                {saleStarted &&
                                    <button data-modal="sale-modal" className="btn btn-primary btn-mint">🗝️ Mint now!</button>
                                }
                                <p>Welcome to Niftalis, the planet where multiverse dreams come true. Niftalis has a giant energy talisman at its core, which allows multiversal travelers to visit our world. Early access to the capital city of Niftalis is only available with an NFT key. Once the countdown is over, a few hundred NFT keys will be available for sale. Discover the utility of the custom forged keys ✨🗝💫</p>
                                <h2>Limited keys with magical power</h2>
                                <p>The most valuable NFT keys were forged in the core of Niftalis beside the sacred talisman and contains some of its energy. The sacred talisman provides Niftalis with energy and his magical power allows multiversal travelers to visit Niftalis. Every single key gets early access to the capital city at a certain time. In the city, the arena, bank and later other buildings, such as the gallery can be visited.</p>
                                <h2>Early and exclusive content</h2>
                                <p>The keys grant you early access to the capital city of Niftalis. Whenever new features are released, key holders can enter and test them in advance. There are also exclusive locations, which are only accessible to a few keyholders.</p>
                                <h2>Access to exclusive groups</h2>
                                <p>The circle of key holders is small and exclusive. They call themself "The key holders" Only with one of these empowering keys you can enter secret communities. There you can drink Niftalis finest wines and talk with like-minded people about the world of Niftalis and the battles in the arena. If you sell your key, you will also lose access to these groups.</p>
                                <h2>Events and Giveaways</h2>
                                <p>Events are the driver of a prosperous world, there will be some of them on a regular basis. As a key holder you will enjoy benefits, rewards and unique utilities. There are also giveaways in which only NFT key holders can participate. So you can look forward to some great actions!</p>
                                <h2>Project supporter</h2>
                                <p className="mb-0">As a key holder you belong to a circle of the very first NFT Arena supporters. These are extremely important to bring the project to life with the necessary resources right from the start. Marketing costs like listings, ads, influencers or employees are financed with it. So you contribute to make the project skyrocket.</p>
                                <SocialLinks
                                    addClass="mt-4 mb-5"
                                    instagram={process.env.REACT_APP_INSTAGRAM}
                                    twitter={process.env.REACT_APP_TWITTER}
                                    discord={process.env.REACT_APP_DISCORD}
                                    telegram={process.env.REACT_APP_TELEGRAM}
                                    large={false}
                                />
                            </div>
                            <div className="w-0 w-md-25 overflow-hidden">
                                <img src={key} alt="Images can not be loaded on your browser" draggable="false" className="salespage-key move" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal id="video-modal">
                <video controls>
                    <source src={trailer} type="video/mp4"/>
                </video>
            </Modal>
            <Web3Provider>
                <SaleModal modal={modal} showPreview={showPreview} />
            </Web3Provider>
            <Web3Provider>
                <PreviewModal modal={modal} />
            </Web3Provider>
            <VolumeButton />
        </div>
    );
}