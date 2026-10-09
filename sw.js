// Service worker de Market Legends: guarda el juego para abrirlo sin internet.
// Sube la versión cada vez que cambie el juego para que los teléfonos descarguen lo nuevo.
const VERSION = 'ml-v52';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './audio/menu.mp3', './audio/juego.mp3', './audio/inicio.mp3', './audio/victoria.mp3',
  './audio/acierto.mp3', './audio/fallo.mp3', './audio/bono.mp3', './audio/nivel.mp3'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) {
        const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
