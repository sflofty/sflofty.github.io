navigator.serviceWorker.register('sw.js');

function showNotification() {
    console.log("showNotification()");
    Notification.requestPermission(function(result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification('Vibration Sample', {
                body: 'Buzz! Buzz!',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                });
            });
        }else {
            console.log("no permission");
        }
    });
}