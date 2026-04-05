"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, BarChart2, User, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTema } from "@/lib/tema";
import { SeletorTema } from "./SeletorTema";
import { useState } from "react";
import { Palette } from "lucide-react";

const links = [
    { href: "/", label: "Início", icon: Home },
    { href: "/historico", label: "Histórico", icon: History },
    { href: "/relatorio", label: "Relatório", icon: BarChart2 },
    { href: "/perfil", label: "Perfil", icon: User },
];

export function NavBar() {
    const pathname = usePathname();
    const [mostrarTema, setMostrarTema] = useState(false);

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-md border-t border-white/5"
            aria-label="Navegação principal"
        >
            <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
                {links.map(({ href, label, icon: Icon }) => {
                    const ativo = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-label={label}
                            aria-current={ativo ? "page" : undefined}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                                ativo ? "text-brand-400" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-lg transition-all",
                                ativo && "bg-brand-500/10 glow-green"
                            )}>
                                <Icon size={20} strokeWidth={ativo ? 2.5 : 1.5} aria-hidden="true" />
                            </div>
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}

                {/* Botão de tema */}
                <div className="relative">
                    <button
                        onClick={() => setMostrarTema(!mostrarTema)}
                        aria-label="Selecionar tema"
                        aria-expanded={mostrarTema}
                        className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
               text-muted-foreground hover:text-foreground"
                    >
                        <div className="p-1.5 rounded-lg">
                            <Palette size={20} strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <span className="text-[10px] font-medium">Tema</span>
                    </button>

                    {mostrarTema && (
                        <div className="absolute bottom-full right-0 mb-2 w-52 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl z-50">
                            <SeletorTema aoFechar={() => setMostrarTema(false)} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}