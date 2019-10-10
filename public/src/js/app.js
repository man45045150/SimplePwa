
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification(){
  var options = {
    body: 'You successfully subscribed to our Notification service!',
    icon: '/src/images/icons/app-icon-96x96.png',
    images: '/src/images/sf-boat.jpg',
    dir : 'ltr',
    lang : 'en-US',
    vibrate: [100,50,200],
    badge : '/src/images/icons/app-icon-96x96.png',
    tag : 'confirm-notification',
    renotify : true,
    data : 'test',
    actions : [
      { action : 'confirm' , title : 'Okay' },
      { action : 'cancel' , title : 'Cancel' }
    ]
  };
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready
      .then(function(swreg){
        swreg.showNotification('Successfully subscribed(SW)',options);
      });
  }
  
  // new Notification('Successfully subscribed',options);
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      displayConfirmNotification();
    }
  });
}

if ('Notification' in window) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}