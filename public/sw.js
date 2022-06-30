const staticCacheName = 'Static-Website-v1';
const assets = [
    '/',
    'CSS/style.css',
    'pleuris.js',
    'images/logoRijks.png',
    'error.html',
    'CSS/fonts/Dosis-Light.ttf',
    'CSS/fonts/Dosis-Medium.ttf'
];

//Install event
self.addEventListener('install', (event) => {
    event.waitUntil( 
     caches.open(staticCacheName)
        .then(cache => {
        console.log('I am caching items!');
        cache.addAll(assets);
        })
    ); 
});

//Activate event
self.addEventListener('activate', (event) => {
    //console.log('The server worker has been activated');
  event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
                )
        })
    )
});

//Fetch event
self.addEventListener('fetch', (event)=> {
    // console.log('An fetch event has taken place', event);
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            return cacheResponse || fetch(event.request)
        })
    );
})