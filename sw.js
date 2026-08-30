const C = 'java1000-v2';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(C).then(cache =>
            cache.addAll([
                './',
                './index.html',
                './data.json',
                './manifest.webmanifest',
                './sw.js'
            ])
        )
    );

    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== C)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();

                caches.open(C).then(cache => {
                    cache.put(event.request, copy);
                });

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});