balance = 1234.51;
rate = 0.001;
decimals = 3;
notificationLimit = balance + rate * 300;

setInterval(displayNumber, 50);

function displayNumber() {
    //balance += Math.random() + Math.floor(Math.random() * 5);
    balance += rate;
    if (balance > notificationLimit) {
        notificationLimit = balance + rate * 300;
    }

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
