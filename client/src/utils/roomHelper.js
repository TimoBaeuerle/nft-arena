import $ from 'jquery';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function switchRoom() {
    var switcher = $('#room-switch');
    switcher.fadeIn(500);
    await sleep(500);
    setTimeout(function() {
        switcher.fadeOut(500);
    }, 500);
}

export function setPortrait() {
    if (window.innerHeight > window.innerWidth) {
        $('.room').addClass('portrait');
    } else {
        $('.room').removeClass('portrait');
    }
}