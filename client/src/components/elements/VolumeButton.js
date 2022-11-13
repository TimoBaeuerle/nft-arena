import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { playSound, hasStarted, setVolumeState, getBackgroundMusic } from '../../utils/soundHelper';
import $ from 'jquery';


export default function VolumeButton(props) {
    const [volume, setVolume] = useState(false);
    const [autoplayable, setAutoplayable] = useState(false);
    var loaded = false;
    var volumeButton = <FontAwesomeIcon icon={faVolumeMute} />;
    if (volume) {
        volumeButton = <FontAwesomeIcon icon={faVolumeUp} />;
    }

    const switchVolume = () => {
        if (volume) {
            //Turn volume off
            $('audio').each(function(i, element) {
                element.muted = true;
                setVolumeState(false);
            });
        } else {
            //Turn volume on
            $('audio').each(function(i, element) {
                //Initial background sound trigger
                var bgm = getBackgroundMusic();
                if (bgm.length > 0 && !hasStarted(bgm)) {
                    playSound(bgm);
                }

                element.muted = false;
                setVolumeState(true);
            });
        }
        setVolume(!volume);
    }

    useEffect(() => {
        $('button').on('click', function() {
            setAutoplayable(true);
        });

        //Check autoplayability
        setTimeout(function() {
            loaded = true;
        }, 200);

        try {
            var audio = new Audio();
            var src = `data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf`
                + `///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+`
                + `CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AK`
                + `qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`;
            audio.autoplay = true;
            audio.volume = 0;
            $(audio).on('play', function() {
                if (!loaded && !autoplayable) {
                    setVolume(true);
                    setVolumeState(true);
                }
                setAutoplayable(true);
            });
            audio.src = src;
        } catch(e) {
            //ignore
        }
    });

    return (
        <div className="volume-button layer-3">
            <button onClick={() => switchVolume()} className="btn btn-icon d-flex align-center justify-center">
                {volumeButton}
            </button>
        </div>
    )
}