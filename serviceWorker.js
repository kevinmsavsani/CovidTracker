

(function () {
  'use strict';

  var staticFilesToCache = [
    '.',
    'index.html',
    '/dist/app.bundle.js',
    '/offline.html',
    '/src/assets/covid19.png',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
    'https://fonts.gstatic.com/s/roboto/v16/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2'
  ];

  var apiToCache = [
    'http://localhost:8081/api'
  ]

  var staticCaches = 'appshell-cache';
  var apiCaches = "api-cache";


  self.addEventListener('install', function (event) {
    console.log('%c##Service Worker##',
      'background: #008000	; color: #fff',
      'Attempting to install service worker and cache static assets');
    event.waitUntil(
      Promise.all([
        caches.open(staticCaches)
          .then(function (cache) {
            return cache.addAll(staticFilesToCache);
          }),
        caches.open(apiCaches)
          .then(function (cache) {
            return cache.addAll(apiToCache);
          })
      ]).then(function () {
        self.skipWaiting().then(function (res) {
          console.log('%c##Service Worker##',
            'background: #0D47A1; color:#fff',
            'Skip Waiting ran.....', res);
        });
      })
        .catch(function (error) {
          console.log('%c##Service Worker##',
            'background: #D50000; color:#fff',
            'Install Step failed with errors', error);
        })
    );
  });

  self.addEventListener('activate', function (event) {
    console.log('%c##Service Worker##',
      'background: #008000	; color: #fff',
      'Activating new service worker...');

    var cacheWhitelist = [staticCaches, apiCaches];

    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
        .then(function (val) {
          return self.clients.claim().then(function (res) {
            console.log('%c##Service Worker##',
              'background: #0D47A1; color:#fff',
              'Client claiming', res);
          });
        })
    );
  });
  self.addEventListener('periodicsync', event => {
    console.log('periodic sync call')
  });

  self.addEventListener('fetch', function (event) {
    const cached = caches.match(event.request);
    const fetched = fetch(event.request);
    const fetchedCopy = fetched.then(resp => resp.clone());

    // Call respondWith() with whatever we get first.
    // If the fetch fails (e.g disconnected), wait for the cache.
    // If there’s nothing in cache, wait for the fetch. 
    // If neither yields a response, return a 404.
    event.respondWith(
      Promise.race([fetched.catch(_ => cached), cached])
        .then(resp => resp || fetched)
        .catch(_ => new Response(null, { status: 404 }))
    );

    // Update the cache with the version we fetched
    event.waitUntil(
      Promise.all([fetchedCopy, caches.open('cache-v1')])
        .then(([response, cache]) => cache.put(event.request, response))
        .catch(_ => {/* eat any errors */ })
    );
  });

})();
