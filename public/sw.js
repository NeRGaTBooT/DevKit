const CACHE_NAME = "devkit-static-v1";
const BASE_PATH = "";

const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/icons/icon-192.svg`,
  `${BASE_PATH}/icons/icon-512.svg`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const isStatic =
          url.pathname.startsWith(`${BASE_PATH}/_next/static/`) ||
          url.pathname.startsWith(`${BASE_PATH}/icons/`) ||
          url.pathname.endsWith(".svg") ||
          url.pathname.endsWith(".woff2");

        if (isStatic) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }

        return response;
      });
    }),
  );
});
