let config = {
    staticCacheItems: [
        '/desktop/source/draggable-window.html',
        '/desktop/source/expandable-menu-item.html',
        '/desktop/source/image/chat-icon.png',
        '/desktop/source/image/memory-icon.png',
        '/desktop/source/image/gallery-icon.png',
        '/desktop/source/image/desktop-background.jpg',
        '/desktop/source/image/draggable-window-border.png',
        '/desktop/source/js/desktop.js',
        '/desktop/source/stylesheet/style.css',
        '/desktop/source/index.html'
    ]
};

let CACHE_VERSION = 'v1';


self.addEventListener('install', event => {

    function onInstall () {
        return caches.open(CACHE_VERSION)
            .then(cache => cache.addAll([
                '/desktop/source/draggable-window.html',
                '/desktop/source/expandable-menu-item.html',
                '/desktop/source/image/chat-icon.png',
                '/desktop/source/image/memory-icon.png',
                '/desktop/source/image/gallery-icon.png',
                '/desktop/source/image/desktop-background.jpg',
                '/desktop/source/image/draggable-window-border.png',
                '/desktop/source/js/desktop.js',
                '/desktop/source/stylesheet/style.css',
                '/desktop/source/index.html'
                ])
            );
    }

    event.waitUntil(onInstall(event));

});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    function onFetch (event, opts) {
        let request = event.request;
        let acceptHeader = request.headers.get('Accept');
        let resourceType = 'static';
        let cacheKey;

        if (acceptHeader.indexOf('text/html') !== -1) {
            resourceType = 'content';
        } else if (acceptHeader.indexOf('image') !== -1) {
            resourceType = 'image';
        }

        cacheKey = resourceType;
        // Use a cache-first strategy.
        event.respondWith(
            fetchFromCache(event)
                .catch(() => fetch(request))
                .then(response => addToCache(cacheKey, request, response))
        );
    }

    function addToCache (cacheKey, request, response) {
        if (response.ok) {
            let copy = response.clone();
            caches.open(cacheKey).then( cache => {
                cache.put(request, copy);
            });
            return response;
        }
    }

    function fetchFromCache (event) {
        return caches.match(event.request).then(response => {
            if (!response) {
                // A synchronous error that will kick off the catch handler
                throw Error('${event.request.url} not found in cache');
            }
            return response;
        });
    }

    onFetch(event, config);
});
