/**
 * A very simple ServiceWorker that caches the
 * site for offline use.
 */


//keep track of the cache
let CACHE_VERSION = 'v1';


self.addEventListener('install', event => {

    //store some files on first load
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

//clear out the cache if service worker is updated
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

//handle fetch events by sending back the cached resource if avaliable
self.addEventListener('fetch', (event) => {
    function onFetch (event) {
        let request = event.request;
        let acceptHeader = request.headers.get('Accept');
        let resourceType = 'static';
        let cacheKey;

        if (acceptHeader.indexOf('text/html') !== -1) { //make different cashes for different content to retrieve later
            resourceType = 'content';
        } else if (acceptHeader.indexOf('image') !== -1) {
            resourceType = 'image';
        }

        cacheKey = resourceType;

        // Use cache first.
        event.respondWith(
            fetchFromCache(event)
                .catch(() => fetch(request))
                .then(response => addToCache(cacheKey, request, response))
        );
    }

    //add responses to cache to fetch later
    function addToCache (cacheKey, request, response) {
        if (response.ok) {
            let copy = response.clone(); //copy the response to not use it up
            caches.open(cacheKey).then( cache => {
                cache.put(request, copy);
            });
            return response;
        }
    }

    //get responses from cache
    function fetchFromCache (event) {
        return caches.match(event.request).then(response => {
            if (!response) {
                throw Error('${event.request.url} not found in cache');
            }
            return response;
        });
    }

    onFetch(event);
});
