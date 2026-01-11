// Give your cache a version name
const cacheName = "valentine-games-cache-v1";

// List all the files you want to cache (your game files)
const filesToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",   // replace with your JS file name
  "./icon-192.png",
  "./icon-512.png"
];

// Install event: cache the files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("Caching app files");
      return cache.addAll(filesToCache);
    })
  );
});

// Fetch event: serve cached files if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
