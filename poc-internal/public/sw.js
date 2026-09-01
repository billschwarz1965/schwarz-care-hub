// MedVerse Service Worker
//
// v4 fixes a bug that made every code change invisible: the previous version was
// cache-first for all non-HTML requests, which included the app's own
// /src/*.js modules. Once a module was cached the browser kept serving that
// copy no matter what the server returned, so shipped fixes never appeared and
// a stale build could be demoed as if current.
//
// Now:
//   - On localhost the worker does not intercept at all, so development is
//     always live.
//   - Code (js/css/json) is network-first, with cache only as an offline
//     fallback.
//   - Cache-first is reserved for genuinely immutable assets: icons, images,
//     fonts.
const CACHE_VERSION = 'medverse-v4';

// Anything whose content changes when we ship must never be served cache-first.
const CODE_RE = /\.(?:js|mjs|css|json)(?:$|\?)/i;
const STATIC_RE = /\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|mp3|wav)(?:$|\?)/i;
const IS_DEV = ['localhost', '127.0.0.1', '[::1]'].includes(self.location.hostname);
const BASE = self.registration.scope;
// This edition's own pages only. It previously carried poc's list verbatim,
// including concierge.html, patient.html and system-tools.html — three pages
// poc-internal does not ship. Every entry has to exist, or the install below
// fails; see the note there.
const APP_SHELL_PATHS = [
  '',
  'index.html',
  'ask.html',
  'msl-copilot.html',
  'medical.html',
  'agents.html',
  'disease.html',
  'literature.html',
  'congress.html',
  'orion.html',
  'population.html',
  'demo.html',
  'about.html',
  'manifest.json',
  'icons/icon.svg',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];
const APP_SHELL = APP_SHELL_PATHS.map(p => BASE + p);

// Install: cache app shell
self.addEventListener('install', (event) => {
  // Don't pre-cache in development — a cached shell is another way to end up
  // looking at a build that is no longer what the source says.
  if (!IS_DEV) {
    // Cached one at a time rather than with addAll(): addAll() rejects the
    // entire install if a single URL 404s, so one stale entry in
    // APP_SHELL_PATHS silently disabled the whole worker for an edition. A
    // missing page now simply goes uncached.
    event.waitUntil(
      caches.open(CACHE_VERSION).then((cache) =>
        Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => {})))
      )
    );
  }
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

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Development: never intercept. Vite already handles reloads, and caching
  // here is what made edits invisible.
  if (IS_DEV) return;

  const url = request.url;
  const isHTML = request.headers.get('accept')?.includes('text/html') ||
                 url.endsWith('.html') ||
                 url.endsWith('/');

  // Only truly immutable assets are safe to serve from cache first.
  const cacheFirst = !isHTML && STATIC_RE.test(url) && !CODE_RE.test(url);

  if (cacheFirst) {
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
    return;
  }

  // Everything else — pages and all code — is network-first, so a shipped fix
  // takes effect on the next load. Cache is the offline fallback only.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
