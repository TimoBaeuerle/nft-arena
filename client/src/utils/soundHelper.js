export function fadeOutSound(target, interval) {
    var vol = 1;
    var audioElement = document.getElementById(target);
    if (audioElement.volume === 1) {
        var intervalID = setInterval(function() {
            if (vol > 0) {
                vol -= 0.05;
                audioElement.volume = vol.toFixed(2);
            } else {
                clearInterval(intervalID);
            }
        }, interval);
    }
}

export function fadeInSound(target, interval) {
    var vol = 1;
    var audioElement = document.getElementById(target);
    if (audioElement.volume === 0) {
        var intervalID = setInterval(function() {
            if (vol < 1) {
                vol += 0.05;
                audioElement.volume = vol.toFixed(2);
            } else {
                clearInterval(intervalID);
            }
        }, interval);
    }
}

export function playSound(target) {
    var audioElement = document.getElementById(target);
    audioElement.play();
    if (!getVolumeState() && !audioElement.muted) {
        audioElement.muted = true;
    }
}

export function hasStarted(target) {
    var audioElement = document.getElementById(target);
    return audioElement.played.length > 0;
}

export function setGameBackgroundMusic(source) {
    setBackgroundMusic('game-bgm');
    var audioElement = document.getElementById('game-bgm');
    audioElement.src = source;
    audioElement.volume = 1;
}

export function setBackgroundMusic(newBackgroundMusic) {
    window.backgroundMusic = newBackgroundMusic;
}

export function getBackgroundMusic() {
    return window.backgroundMusic !== undefined ? window.backgroundMusic : '';
}

export function setVolumeState(newState) {
    window.volumeState = newState;
}

export function getVolumeState() {
    return window.volumeState === true ? true : false;
}