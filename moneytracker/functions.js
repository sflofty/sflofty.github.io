balance = 1234.51;
rate = 0;
decimals = 5;

function displayNumber() {
    balance += Math.random() + Math.floor(Math.random() * 5);

    // reset number display
    var div = document.getElementById("numberDisplay");
    div.innerHTML = "";

    // add digits in front of decimal
    var digits = balance.toFixed(decimals).toString().split('');
    digits.forEach(digit => addDigitSpan(div, digit));

    var digitsBeforeDecimalPoint = balance.toString().length;
}

function addDigitSpan(div, digit){
    var digitSpan = document.createElement("span");
    digitSpan.className = "digit";
    digitSpan.innerHTML = digit;
    div.append(digitSpan);
}