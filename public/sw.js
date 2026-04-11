const CACHE = "minhascontas-v3";
const DEV = self.location.hostname === "localhost";

const ARQUIVOS = [
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

self.addEventListener("install", (e) => {
    if (DEV) { self.skipWaiting(); return; }
    e.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(ARQUIVOS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    // Em desenvolvimento nunca usa cache
    if (DEV) return;
    if (e.request.method !== "GET") return;
    if (e.request.url.includes("/api/")) return;
    if (e.request.url.includes("/_next/")) return;
    if (e.request.url.includes("/login")) return;

    e.respondWith(
        caches.match(e.request).then((cached) => {
            const fresh = fetch(e.request).then((res) => {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE).then((c) => c.put(e.request, clone));
                }
                return res;
            });
            return cached || fresh;
        })
    );
});

self.addEventListener("push", (e) => {
    if (!e.data) return;
    const data = e.data.json();
    e.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-96x96.png",
            data: { url: data.url || "/" },
        })
    );
});

self.addEventListener("notificationclick", (e) => {
    e.notification.close();
    e.waitUntil(clients.openWindow(e.notification.data.url));
}); 