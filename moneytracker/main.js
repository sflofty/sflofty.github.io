balance = 1234.51;
rate = 0.001;
decimals = 3;
notificationLimit = balance + rate * 300;

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
    if (balance > notificationLimit) {
        notificationLimit = balance + rate * 300;
        displayNotification('limit reached');
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

function displayNotification(body){
    console.log(Notification.permission);
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }else if (Notification.permission == 'granted'){
        navigator.serviceWorker.getRegistrations()
            .then(reg => {
                const options = {
                    body: body,
                    vibrate: [100, 50, 100]
                }
                reg.showNotification('Hello', options);
            });
    }else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            var notification = new Notification(body);
          }else if(permission == "denied") {
              alert('permission denied');
          }
        });
      }

}