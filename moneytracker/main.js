balance = 1234.51;
rate = 0.0001;
decimals = 4;

if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('service worker registered');
            }).catch(err => {
                console.log('service worker failed');
            });
    });
}

setInterval(displayNumber, 50);

function displayNumber() {
    //balance += Math.random() + Math.floor(Math.random() * 5);
    balance += rate;

    // reset number display
    var div = document.getElementById("numberDisplay");
    div.innerHTML = "";

    // add digits in front of decimal
    var digits = balance.toFixed(decimals).toString().split('');
    digits.forEach(digit => addDigitSpan(div, digit));
}

function addDigitSpan(div, digit){
    var digitSpan = document.createElement("span");
    digitSpan.className = "digit";
    digitSpan.innerHTML = digit;
    div.append(digitSpan);
}