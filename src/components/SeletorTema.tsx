"use client";

import { useTema, type Tema } from "@/lib/tema";
import { cn } from "@/lib/utils";

const temas: { id: Tema; label: string; cor: string; descricao: string }[] = [
    { id: "navy", label: "Navy", cor: "#3b82f6", descricao: "Azul escuro" },
    { id: "midnight", label: "Midnight", cor: "#10b981", descricao: "Verde esmeralda" },
    { id: "roxo", label: "Roxo", cor: "#a855f7", descricao: "Violeta escuro" },
];

interface Props {
    aoFechar?: () => void;
}

export function SeletorTema({ aoFechar }: Props) {
    const { tema, setTema } = useTema();

    return (
        <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Tema
            </p>
            <div className="grid grid-cols-3 gap-2">
                {temas.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => { setTema(t.id); aoFechar?.(); }}
                        aria-label={`Tema ${t.label}: ${t.descricao}`}
                        aria-pressed={tema === t.id}
                        className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                            tema === t.id
                                ? "border-brand-500/50 bg-brand-500/10"
                                : "border-white/5 bg-white/3 hover:bg-white/5"
                        )}
                    >
                        {/* Bolinha da cor */}
                        <div
                            className="w-6 h-6 rounded-full transition-all"
                            style={{
                                backgroundColor: t.cor,
                                outline: tema === t.id ? `2px solid ${t.cor}` : "2px solid transparent",
                                outlineOffset: "2px",
                                boxShadow: tema === t.id ? `0 0 10px ${t.cor}60` : "none",
                            }}
                        />
                        <span className={cn(
                            "text-xs font-medium",
                            tema === t.id ? "text-brand-400" : "text-muted-foreground"
                        )}>
                            {t.label}
                        </span>
                        {tema === t.id && (
                            <span className="text-[9px] text-brand-500">✓ ativo</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}