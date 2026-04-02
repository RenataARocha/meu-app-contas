// src/components/NavBar.tsx
// Barra de navegação inferior fixa — estilo app mobile
// "use client" para acessar usePathname (rota atual)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/", label: "Início", icon: Home },
    { href: "/historico", label: "Histórico", icon: History },
    { href: "/relatorio", label: "Relatório", icon: BarChart2 },
    { href: "/perfil", label: "Perfil", icon: User },
];

export function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-md border-t border-white/5">
            <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
                {links.map(({ href, label, icon: Icon }) => {
                    const ativo = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all",
                                ativo
                                    ? "text-brand-400"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div
                                className={cn(
                                    "p-1.5 rounded-lg transition-all",
                                    ativo && "bg-brand-500/10 glow-green"
                                )}
                            >
                                <Icon size={20} strokeWidth={ativo ? 2.5 : 1.5} />
                            </div>
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}