"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function PwaRegistro() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.id) return;
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

        async function registrar() {
            try {
                const reg = await navigator.serviceWorker.register("/sw.js");

                reg.update();

                reg.addEventListener("updatefound", () => {
                    const installingWorker = reg.installing;
                    if (!installingWorker) return;

                    installingWorker.addEventListener("statechange", () => {
                        if (installingWorker.state === "activated" && navigator.serviceWorker.controller) {
                            window.location.reload();
                        }
                    });
                });

                console.log("SW registrado:", reg.scope);

                const permissao = await Notification.requestPermission();
                if (permissao !== "granted") return;

                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
                });

                const { endpoint, keys } = subscription.toJSON() as {
                    endpoint: string;
                    keys: { p256dh: string; auth: string };
                };

                await fetch("/api/push", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint, keys }),
                });

                console.log("Push subscription salva!");
            } catch (err) {
                console.error("Erro ao registrar push:", err);
            }
        }

        registrar();
    }, [session?.user?.id]);

    return null;
}