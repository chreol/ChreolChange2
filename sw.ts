/// <reference lib="webworker" />

const CACHE_NAME = 'chreol-change-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/main.ts', // Sera compilé en JS
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Installation : cache des assets statiques
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch : stratégie Cache-First pour assets, Network-First pour API
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Assets statiques : Cache First
  if (request.destination === 'image' || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Navigation : Network First avec fallback cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Autres requêtes : Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache les réponses réussies
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Background sync pour envoi WhatsApp hors-ligne (optionnel avancé)
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'send-whatsapp') {
    event.waitUntil(
      // Logique d'envoi différé quand la connexion revient
      console.log('🔄 Sync WhatsApp en attente de connexion...')
    );
  }
});