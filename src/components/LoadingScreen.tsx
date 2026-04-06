"use client";

import { useEffect, useState } from "react";

interface Props {
    onTerminou?: () => void;
}

export function LoadingScreen({ onTerminou }: Props) {
    const [saindo, setSaindo] = useState(false);
    const [visivel, setVisivel] = useState(true);

    useEffect(() => {
        const t1 = setTimeout(() => setSaindo(true), 1800);
        const t2 = setTimeout(() => {
            setVisivel(false);
            onTerminou?.();
        }, 2200);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onTerminou]);

    if (!visivel) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center
                  bg-dark-900 transition-opacity duration-400
                  ${saindo ? "opacity-0" : "opacity-100"}`}
            aria-label="Carregando MinhasConta$"
            role="status"
        >
            <div className="animate-bounce-slow mb-6">
                <svg width="80" height="80" viewBox="0 0 512 512" fill="none">
                    <rect width="512" height="512" rx="110" fill="#060d18" />
                    <rect x="156" y="100" width="200" height="312" rx="40" fill="#0a1628" stroke="#1e3a5f" strokeWidth="4" />
                    <path d="M180 260 l50 50 l120 -140" fill="none" stroke="#22c55e"
                        strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="210" cy="350" r="15" fill="#a855f7" />
                    <circle cx="255" cy="350" r="15" fill="#1e3a5f" />
                    <circle cx="300" cy="350" r="15" fill="#1e3a5f" />
                </svg>
            </div>

            <h1
                className="text-2xl font-bold text-gradient-green animate-fade-in"
                style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
                MinhasConta$
            </h1>

            <p
                className="text-sm text-muted-foreground mt-2 animate-fade-in"
                style={{ animationDelay: "400ms", animationFillMode: "both" }}
            >
                Controle suas contas com estilo
            </p>

            <div className="mt-8 w-32 h-0.5 bg-dark-600 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gradient rounded-full animate-loading-bar" />
            </div>
        </div>
    );
}