"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [carregando, setCarregando] = useState(false);

    async function entrarComGoogle() {
        setCarregando(true);
        await signIn("google", { callbackUrl: "/" });
    }

    return (
        <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-6">

            {/* Logo */}
            <div className="mb-8 animate-bounce-slow">
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

            {/* Título */}
            <div className="text-center mb-10 animate-fade-in"
                style={{ animationDelay: "200ms", animationFillMode: "both" }}>
                <h1 className="text-3xl font-bold text-gradient-green mb-2">
                    MinhasConta$
                </h1>
                <p className="text-muted-foreground text-sm">
                    Controle suas contas mensais com estilo
                </p>
            </div>

            {/* Card de login */}
            <div className="glass-card rounded-3xl p-8 w-full max-w-sm animate-slide-up"
                style={{ animationDelay: "400ms", animationFillMode: "both" }}>

                <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                        Bem-vinda de volta
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Entre com sua conta Google para continuar
                    </p>
                </div>

                <button
                    onClick={entrarComGoogle}
                    disabled={carregando}
                    aria-label="Entrar com Google"
                    aria-busy={carregando}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6
                     bg-white hover:bg-gray-50 active:scale-[0.98]
                     text-gray-800 font-semibold text-sm rounded-2xl
                     transition-all disabled:opacity-50
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-brand-500"
                >
                    {carregando ? (
                        <Loader2 size={18} className="animate-spin text-gray-600" />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
                            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
                            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z" />
                            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
                        </svg>
                    )}
                    {carregando ? "Entrando..." : "Entrar com Google"}
                </button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    Seus dados ficam salvos na sua conta
                </p>
            </div>

            {/* Recursos */}
            <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm animate-fade-in"
                style={{ animationDelay: "600ms", animationFillMode: "both" }}>
                {[
                    { emoji: "💰", texto: "Contas organizadas" },
                    { emoji: "📊", texto: "Relatórios visuais" },
                    { emoji: "📱", texto: "Funciona offline" },
                ].map(({ emoji, texto }) => (
                    <div key={texto} className="glass-card rounded-2xl p-3 text-center">
                        <span className="text-2xl block mb-1" aria-hidden="true">{emoji}</span>
                        <span className="text-xs text-muted-foreground">{texto}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}