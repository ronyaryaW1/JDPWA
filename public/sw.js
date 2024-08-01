let cacheData = "appV1";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/static/js/main.chunk.js',
                '/static/js/0/chunk.js',
                '/static/js/bundle.js',
                '/index.js',
                '/',
                '/users',
            ])
        })
    )
})

// this.addEventListener("fetch", (event) => {
//     if (!navigator.onLine) {
//         event.respondWith(
//             caches.match(event.request)
//                 .then((resp) => {
//                     if (resp) {
//                         return resp
//                     }
//                     // tanpa ini ttp bisa offline tapi datanya ilang jadi harus pakai ini
//                     let requestUrl = event.request.clone();
//                     fetch(requestUrl)
//                 }).catch((err) => {
//                     // console.log('offline')
//                     // If both fail, show a generic fallback:
//                     // return caches.match('/offline.html');
//                     // However, in reality you'd have many different
//                     // fallbacks, depending on URL & headers.
//                     // Eg, a fallback silhouette image for avatars.
//                 })
//         )
//     }
// })

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
    
                        caches.open(cacheData)
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

    var cacheWhitelist = cacheData;

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