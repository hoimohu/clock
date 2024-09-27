const CACHE_NAME = 'KUNUGISOFT_CLOCK_CACHE_1.1.6';
const PRE_CACHED_RESOURCES = [
    'index.html',
    'main.js',
    'style.css',
    'favicon.ico',
    '128.png',
    '512.png',
    '1024.png',
    'screenshot_mobile.jpeg',
    'screenshot_pc.jpeg',
    'timer.mp3',
    'manifest.webmanifest',
    'modules/clock.js',
    'modules/stopwatch.js',
    'modules/timer.js'
];

self.addEventListener("install", event => {
    async function preCacheResources() {
        // List all caches by their names.
        const names = await caches.keys();
        let cache_changed = true;
        names.forEach(e => {
            if (e === CACHE_NAME) {
                cache_changed = false;
            }
        });
        if (cache_changed) {
            const cache = await caches.open(CACHE_NAME);
            // Cache all static resources.
            cache.addAll(PRE_CACHED_RESOURCES);
        }
    }

    event.waitUntil(preCacheResources());
});

self.addEventListener("fetch", event => {
    async function returnCachedResource() {
        // Open the app's cache.
        const cache = await caches.open(CACHE_NAME);
        // Find the response that was pre-cached during the `install` event.
        const cachedResponse = await cache.match(event.request.url);

        if (cachedResponse) {
            // Return the resource.
            return cachedResponse;
        } else {
            // The resource wasn't found in the cache, so fetch it from the network.
            const fetchResponse = await fetch(event.request.url);
            // Put the response in cache.
            // cache.put(event.request.url, fetchResponse.clone());
            // And return the response.
            return fetchResponse;
        }
    }

    event.respondWith(returnCachedResource());
});

// Listen to the `activate` event to clear old caches.
self.addEventListener("activate", event => {
    async function deleteOldCaches() {
        // List all caches by their names.
        const names = await caches.keys();
        await Promise.all(names.map(name => {
            if (name !== CACHE_NAME) {
                // If a cache's name is the current name, delete it.
                return caches.delete(name);
            }
        }));
    }

    event.waitUntil(deleteOldCaches());
});