self.addEventListener('install', (event) => {
  const cacheKey = 'MyFancyCacheName_v1';

  event.waitUntil(caches.open(cacheKey).then((cache) => {
    // Add all the assets in the array to the 'MyFancyCacheName_v1'
    // `Cache` instance for later use.
    return cache.addAll([
      '/css/global.bc7b80b7.css',
      // '/css/home.fe5d0b23.css',
      // '/js/home.d3cc4ba4.js',
      // '/js/jquery.43ca4933.js'
    ]);
  }));
});

self.addEventListener('install', (event) => {
  const cacheKey = 'MyFancyCacheName_v2';

  event.waitUntil(caches.open(cacheKey).then((cache) => {
    // Add all the assets in the array to the 'MyFancyCacheName_v2'
    // `Cache` instance for later use.
    return cache.addAll([
      '/css/global.ced4aef2.css',
      // '/css/home.cbe409ad.css',
      // '/js/home.109defa4.js',
      // '/js/jquery.38caf32d.js'
    ]);
  }));
});

self.addEventListener('activate', (event) => {
  // Specify allowed cache keys
  const cacheAllowList = ['MyFancyCacheName_v2'];

  // Get all the currently active `Cache` instances.
  event.waitUntil(caches.keys().then((keys) => {
    // Delete all caches that aren't in the allow list:
    return Promise.all(keys.map((key) => {
      if (!cacheAllowList.includes(key)) {
        return caches.delete(key);
      }
    }));
  }));
});