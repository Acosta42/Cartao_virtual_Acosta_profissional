const CACHE = 'cartao-artur-v3';
const BASE = '/Cartao_virtual_Acosta/';
const FILES = [
  BASE, BASE + 'index.html', BASE + 'manifest.json',
  BASE + 'icon-192.png', BASE + 'icon-512.png',
  BASE + 'og-image.png', BASE + 'Arturzinho.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(FILES.map(f =>
        fetch(f).then(r => r.ok ? c.put(f, r) : null).catch(() => null)
      ))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() =>
      caches.match(BASE + 'index.html')
    ))
  );
});
