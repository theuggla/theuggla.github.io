let config = {
    staticCacheItems: [
        '/desktop/source/memory-app.html',
        '/desktop/source/memory-game.html',
        '/desktop/source/stylesheet/memory-game-styles.css',
        '/desktop/source/stylesheet/memory-app-styles.css',
        '/desktop/source/image/memory-brick-0.png',
        '/desktop/source/image/memory-brick-1.png',
        '/desktop/source/image/memory-brick-2.png',
        '/desktop/source/image/memory-brick-4.png',
        '/desktop/source/image/memory-brick-3.png',
        '/desktop/source/image/memory-brick-5.png',
        '/desktop/source/image/memory-brick-6.png',
        '/desktop/source/image/memory-brick-7.png',
        '/desktop/source/image/memory-brick-8.png',
        '/desktop/source/draggable-window.html',
        '/desktop/source/expandable-menu-item.html',
        '/desktop/source/image/',
        '/desktop/source/javascript/build.js',
        '/desktop/source/stylesheet/style.css',
        '/desktop/source/index.html'
    ]
};


self.addEventListener('install', event => {

    function onInstall () {
        return caches.open('installcache')
            .then(cache => cache.addAll([
                '/desktop/source/memory-app.html',
                '/desktop/source/memory-game.html',
                '/desktop/source/stylesheet/memory-game-styles.css',
                '/desktop/source/stylesheet/memory-app-styles.css',
                '/desktop/source/image/memory-brick-0.png',
                '/desktop/source/image/memory-brick-1.png',
                '/desktop/source/image/memory-brick-2.png',
                '/desktop/source/image/memory-brick-4.png',
                '/desktop/source/image/memory-brick-3.png',
                '/desktop/source/image/memory-brick-5.png',
                '/desktop/source/image/memory-brick-6.png',
                '/desktop/source/image/memory-brick-7.png',
                '/desktop/source/image/memory-brick-8.png',
                '/desktop/source/draggable-window.html',
                '/desktop/source/expandable-menu-item.html',
                '/desktop/source/image/',
                '/desktop/source/javascript/build.js',
                '/desktop/source/stylesheet/style.css',
                '/desktop/source/index.html'
                ])
            );
    }

    event.waitUntil(onInstall(event));

});

self.addEventListener('activate', (event) => {
    console.log("SW activated");
});

self.addEventListener('fetch', (event) => {
    function shouldHandleFetch (event, opts) {
        let request            = event.request;
        let url                = new URL(request.url);
        let criteria           = {
            isGETRequest: request.method === 'GET',
            isFromMyOrigin: url.origin === self.location.origin
        };

        // Create a new array with just the keys from criteria that have
        // failing (i.e. false) values.
        let failingCriteria    = Object.keys(criteria)
            .filter(criteriaKey => !criteria[criteriaKey]);

        // If that failing array has any length, one or more tests failed.
        return !failingCriteria.length;
    }

    function onFetch (event, opts) {
        let request      = event.request;
        let acceptHeader = request.headers.get('Accept');
        let resourceType = 'static';
        let cacheKey;

        if (acceptHeader.indexOf('text/html') !== -1) {
            resourceType = 'content';
        } else if (acceptHeader.indexOf('image') !== -1) {
            resourceType = 'image';
        }

        cacheKey = resourceType;

        if (resourceType === 'content') {
            // Use a network-first strategy.
            event.respondWith(
                fetch(request)
                    .then(response => addToCache(cacheKey, request, response))
                    .catch(() => fetchFromCache(event))
                    .catch(() => offlineResponse(opts))
            );
        } else {
            // Use a cache-first strategy.
            event.respondWith(
                fetchFromCache(event)
                    .catch(() => fetch(request))
                    .then(response => addToCache(cacheKey, request, response))
                    .catch(() => offlineResponse(resourceType, opts))
            );
        }
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

    function offlineResponse (resourceType, opts) {
        if (resourceType === 'image') {
            return new Response(opts.offlineImage,
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        } else if (resourceType === 'content') {
            return caches.match(opts.offlinePage);
        }
        return undefined;
    }

    if (shouldHandleFetch(event, config)) {
        onFetch(event, config);
    }
});
