export function updateCountdown(countDownDate, text) {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (distance < 0) {
        document.getElementById("countdown").innerHTML = text;
    } else {
        document.getElementById("countdown").innerHTML = (days > 0 ? (days + ' days, ') : '') + (hours < 10 ? '0' : '')  + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
    return distance;
}

export function startCountdown(countDownDate, text) {
    setTimeout(function() {
        var distance = updateCountdown(countDownDate, text);
        if (distance >= 0) {
            startCountdown(countDownDate, text)
        }
    }, 1000);
}