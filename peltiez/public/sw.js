const CACHE_NAME = 'circulai-v12';

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
  // Activation immédiate, pas de pré-cache d'index.html (évite les versions périmées).
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return;

  // Chunks Vite : network-only, jamais de fallback HTML.
  if (isBundledAsset(url)) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 503, statusText: 'Offline' }))
    );
    return;
  }

  // Navigation HTML : network-first, fallback cache uniquement hors-ligne.
  const accept = event.request.headers.get('accept') || '';
  const isNavigation =
    event.request.mode === 'navigate' || accept.includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy)).catch(() => {});
        return response;
      }).catch(() => caches.match('/index.html').then(r => r || new Response('', { status: 503 })))
    );
    return;
  }

  // Autres assets : cache-first léger.
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.status === 200 && response.type !== 'error') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
      }
      return response;
    }).catch(() => new Response('', { status: 503 })))
  );
});
