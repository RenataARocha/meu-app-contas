const CACHE = "minhascontas-v1";

const ARQUIVOS = [
    "/",
    "/historico",
    "/relatorio",
    "/perfil",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(ARQUIVOS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;
    if (e.request.url.includes("/api/")) return;

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
    e.waitUntil(
        clients.openWindow(e.notification.data.url)
    );
});