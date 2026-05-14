const CACHE_NAME = 'egor69-v8';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

function isBundledAsset(url) {
  const p = url.pathname;
  return (
    p.startsWith('/assets/') ||
    p.endsWith('.js') ||
    p.endsWith('.mjs') ||
    p.endsWith('.css')
  );
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(() => {
        // Silently fail if some resources aren't available
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (url.pathname.includes('/api/')) {
    return;
  }

  // Chunks Vite : jamais de fallback HTML (sinon le navigateur « exécute » du HTML → React cassé / hooks null).
  if (isBundledAsset(url)) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 503, statusText: 'Offline' }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        const accept = event.request.headers.get('accept') || '';
        const wantsHtml =
          event.request.mode === 'navigate' || accept.includes('text/html');
        if (wantsHtml) {
          return caches.match('/index.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
