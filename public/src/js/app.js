
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

function configurePushSub(){
  if(!('serviceWorker' in navigator))
    return;
  
  var reg;
  navigator.serviceWorker.ready
    .then(function(swreg){
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub){
      if( sub === null){
        // Create a new subscription
        // Protect by VAPID
        var vapidPublicKey = 'BKSZxlrZqLEHcwz4kFcf20Cim8oSijs_qzUyDEXFuUuIhjc_4oPZ-pCbthE2_nZuhWEWx2sSPyNnLOK_uk5jzzo';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly : true,
          applicationServerKey: convertedVapidPublicKey
        });
      }else{
        // We have a subscription

      }
    })
    .then(function(newSub){
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'text/plain');
      myHeaders.append('Accept', 'application/json, text/plain, */*');
    
    return fetch('https://localhost:5001/api/messages/subscription', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(newSub),
        mode : 'no-cors',
        credentials: 'same-origin'
      })
    })
    .then(function(res) {
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      configurePushSub();
      // displayConfirmNotification();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}