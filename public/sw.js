const CACHE_NAME = "appV1";
const urlToCache = [
    '/static/js/main.chunk.js',
    '/static/js/0/chunk.js',
    '/static/js/bundle.js',
    '/index.js',
    '/',
    '/users',
]

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(urlToCache)
                .catch((error) => {
                    console.error('Failed to cache', error);
                    urlToCache.forEach(url => {
                        fetch(url).then(response => {
                            if (!response.ok) {
                                console.error('Failed to fetch: ', url);
                            }
                        }).catch(fetchError => {
                            console.error('Fetch error for: ', url, fetchError);
                        });
                    });
                });
        })
    );
});



this.addEventListener('fetch', function (event) {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
    
                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
    
                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();
    
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
    
                        return response;
                    }
                )
            }).catch(function() {
                // If both fail, show a generic fallback:
                // return caches.match('/offline.html');
                // However, in reality you'd have many different
                // fallbacks, depending on URL & headers.
                // Eg, a fallback silhouette image for avatars.
            })
        );
     }
});

this.addEventListener('activate', function(event) {

    var cacheWhitelist = CACHE_NAME;

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});