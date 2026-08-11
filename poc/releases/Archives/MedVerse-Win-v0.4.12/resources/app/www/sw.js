// MedVerse Service Worker
const CACHE_VERSION = 'medverse-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/concierge.html',
  '/patient.html',
  '/msl-copilot.html',
  '/medical.html',
  '/agents.html',
  '/disease.html',
  '/literature.html',
  '/congress.html',
  '/orion.html',
  '/system-tools.html',
  '/demo.html',
  '/about.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  const isHTML = request.headers.get('accept')?.includes('text/html') ||
                 request.url.endsWith('.html') ||
                 request.url.endsWith('/');

  if (isHTML) {
    // Network-first for HTML pages
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first for assets (JS, CSS, images, fonts)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
