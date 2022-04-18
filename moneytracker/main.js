balance = 1234.51;
rate = 0.001;
decimals = 3;
notificationLimit = balance + rate * 300;

setInterval(displayNumber, 50);

//TODO: don't create new div, instead change content of old divs

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

//MODAL
var modal = document.getElementById("modalElement");
var closeBtn = document.getElementById("close");

closeBtn.onclick = function(){
  modal.style.display = "none"
}

window.onclick = function(e){
  if(e.target == modal){
    modal.style.display = "none"
  }
}

function addListing(){
    modal.style.display = "block";
    addRow(Math.random());
}

function addRow(name){
    var table = document.getElementById('cashFlowList');
    var row = table.insertRow(0);

    var nameCell = row.insertCell(0);
    var buttonCell = row.insertCell(1);

    nameCell.innerHTML = name;
    buttonCell.innerHTML = "<Button />";
}