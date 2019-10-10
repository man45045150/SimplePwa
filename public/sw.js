self.addEventListener('install',function(event){
  console.log('[Service Worker] Installing Service Worker ...',event);
});
self.addEventListener('activate',function(event){
  console.log('[Service Worker] Activating Service Worker ...',event);
  return  self.clients.claim();
});
// self.addEventListener('fetch',function(event){
//   console.log('[Service Worker] Fetching Service Worker ...',event);
//   event.respondWith(fetch( event.request));
// });

// self.addEventListener('notificationclick', function(event) {
//   console.log(event.notification.data);
  
//   // console.log('notificationclick');
//   // clients.openWindow("https://www.khaosod.co.th/entertainment/news_2961666?utm_source=izooto&utm_medium=push_notifications&utm_campaign=campaign_entertainment&utm_content=entertainment&utm_term=");
//   var found = false;
//   clients.matchAll().then(function(clientsArr) {
//     for (i = 0; i < clientsArr.length; i++) {
//       if (clientsArr[i].url === 'http://localhost:3000/index.html') {
//         // We already have a window to use, focus it.
//         found = true;
//         // clientsArr[i].focus();
//         clientsArr[i].navigate('https://notifyjs.jpillora.com').isTabActive = true;
//         // clientsArr[i].isTabActive = true;
//         // self.isTabActive = true;
//         window.focus();
//         break;
//       }
//     }
//     if (!found) {
//       // Create a new window.
//       var test = 'https://www.khaosod.co.th/entertainment/news_2961666?utm_source=izooto&utm_medium=push_notifications&utm_campaign=campaign_entertainment&utm_content=entertainment&utm_term=';
//       clients.openWindow(test).then(function(windowClient) {
//         // do something with the windowClient.
//       });
//     }
//     console.log('found:',found);
//   });
// }
// ,false);


addEventListener('notificationclick', event => {
  event.waitUntil(async function() {
    const allClients = await clients.matchAll({
      includeUncontrolled: true
    });


    event.notification.close();
    if (event.action === 'confirm') {
      // Archive action was clicked
      console.log('click confirm');
    } else {
      // Main body of notification was clicked
      console.log('click cancel');
    }

    let chatClient;
    let host = 'localhost:3000';

    // Let's see if we already have a chat window open:
    for (const client of allClients) {
      const url = new URL(client.url);
      console.log(url);
      if (url.host == host) {
        // Excellent, let's use it!
        client.focus();
        chatClient = client;
        break;
      }
    }

    // If we didn't find an existing chat window,
    // open a new one:
    if (!chatClient) {
      chatClient = await clients.openWindow('/index.html');
    }
  
    // Message the client:
    chatClient.postMessage("New chat messages!");
  }());
});



self.addEventListener('DOMContentLoaded', function() {
  if (!Notification) {
   alert('Desktop notifications not available in your browser. Try Chromium.');
   return;
  }
 
  if (Notification.permission !== 'granted')
   Notification.requestPermission();
  else{
    console.log('granted');
  }
 });