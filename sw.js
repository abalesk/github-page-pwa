var GHPATH = '/github-page-pwa';
var APP_PREFIX = 'abalesk_';
var VERSION = 'version_002';

const CACHE_NAME = 'react-pwa-cache-v2';

var urlsToCache = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/img/icon-128x128.png`,
  `${GHPATH}/img/icon-512x512.png`
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache new requests for future offline use
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // Fallback when both cache and network fail
        return caches.match('/offline.html'); // Optional: create this fallback page
      })
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});