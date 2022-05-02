/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-4cf01cf';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./kloktat_dehet_002.html","./kloktat_dehet_005.html","./kloktat_dehet_006.html","./kloktat_dehet_007.html","./kloktat_dehet_008.html","./kloktat_dehet_009.html","./kloktat_dehet_010.html","./kloktat_dehet_011.html","./kloktat_dehet_012.html","./kloktat_dehet_013.html","./kloktat_dehet_014.html","./kloktat_dehet_015.html","./kloktat_dehet_016.html","./kloktat_dehet_017.html","./kloktat_dehet_018.html","./kloktat_dehet_019.html","./kloktat_dehet_020.html","./kloktat_dehet_021.html","./kloktat_dehet_022.html","./kloktat_dehet_023.html","./kloktat_dehet_024.html","./manifest.json","./fonts/Literata-Italic-var.woff2","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/LiterataTT-TextRegular.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/SpaceGroteskVF.woff2","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image001.jpg","./resources/image002.jpg","./resources/mzk_logo_tyrkys_transparent.jpg","./resources/obalka_kloktat_dehet.jpg","./resources/upoutavka_eknihy.jpg","./scripts/bundle.js","./style/style.min.css","./template-images/circles.png"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
