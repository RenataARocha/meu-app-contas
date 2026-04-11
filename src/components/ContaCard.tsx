"use client";

import { useState, useEffect } from "react";
import { ChevronDown, CheckCircle2, Circle, Trash2, Pencil } from "lucide-react";
import { cn, formatarMoeda, formatarData, statusVencimento } from "@/lib/utils";
import { BancoIcon } from "./BancoIcon";
import type { Conta } from "@/types/conta";

interface ContaCardProps {
    conta: Conta;
    onMarcarPago: (id: string, pago: boolean) => void;
    onExcluir: (id: string) => void;
    onEditar: (conta: Conta) => void;
    somenteLeitura?: boolean;
}

export function ContaCard({ conta, onMarcarPago, onExcluir, onEditar, somenteLeitura }: ContaCardProps) {
    const [statusTexto, setStatusTexto] = useState("");
    const [statusUrgencia, setStatusUrgencia] = useState<"ok" | "proximo" | "hoje" | "atrasado">("ok");
    const [montado, setMontado] = useState(false);
    const [expandido, setExpandido] = useState(false);

    useEffect(() => {
        const s = statusVencimento(conta.diaVencimento, conta.mes, conta.ano); // ← com mês/ano
        setStatusTexto(s.texto);
        setStatusUrgencia(s.urgencia);
        setMontado(true);
    }, [conta.diaVencimento, conta.mes, conta.ano]);

    const corUrgencia = {
        ok: "text-muted-foreground",
        proximo: "text-gold-400",
        hoje: "text-orange-400",
        atrasado: "text-destructive",
    }[statusUrgencia];

    return (
        <div className={cn(
            "glass-card rounded-2xl overflow-hidden transition-all duration-200",
            conta.pago && "opacity-75"
        )}>
            <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandido(!expandido)}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onMarcarPago(conta.id, !conta.pago); }}
                    className="shrink-0 transition-transform active:scale-90"
                    aria-label={conta.pago ? "Desmarcar como pago" : "Marcar como pago"}
                >
                    {conta.pago
                        ? <CheckCircle2 size={22} className="text-brand-500" />
                        : <Circle size={22} className="text-muted-foreground" />
                    }
                </button>

                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-sm font-medium truncate",
                        conta.pago && "line-through text-muted-foreground decoration-destructive"
                    )}>
                        {conta.nome}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <BancoIcon nome={conta.banco} tamanho={12} />
                        <span className="text-xs text-muted-foreground capitalize">{conta.banco}</span>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className={cn("text-sm font-semibold", conta.pago ? "text-brand-400" : "text-foreground")}>
                        {formatarMoeda(conta.valor)}
                    </p>
                    {!conta.pago && montado && (
                        <span className={cn("text-xs", corUrgencia)}>
                            {statusTexto}
                        </span>
                    )}
                    {conta.pago && <span className="text-xs text-brand-600">Pago ✓</span>}
                </div>

                <ChevronDown
                    size={16}
                    className={cn("text-muted-foreground transition-transform duration-200 shrink-0", expandido && "rotate-180")}
                />
            </div>

            {expandido && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p className="text-muted-foreground mb-0.5">Banco</p>
                            <BancoIcon nome={conta.banco} tamanho={14} mostrarNome />
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-0.5">Vencimento</p>
                            <p className="text-foreground font-medium">Dia {conta.diaVencimento}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-0.5">Data de pagamento</p>
                            <p className={cn("font-medium", conta.dataPagamento ? "text-brand-400" : "text-muted-foreground")}>
                                {formatarData(conta.dataPagamento) ?? "Não pago"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-0.5">Referência</p>
                            <p className="text-foreground font-medium">{conta.mes}/{conta.ano}</p>
                        </div>
                        {conta.recorrente && (
                            <div className="col-span-2">
                                <span className="text-xs bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full">
                                    ↻ Recorrente
                                </span>
                            </div>
                        )}
                    </div>

                    {!somenteLeitura && (
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => onEditar(conta)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-dark-600 text-xs text-muted-foreground hover:text-foreground
                           hover:bg-dark-500 transition-all"
                            >
                                <Pencil size={13} />
                                Editar
                            </button>
                            <button
                                onClick={() => onExcluir(conta.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-destructive/10 text-xs text-destructive hover:bg-destructive/20
                           transition-all"
                            >
                                <Trash2 size={13} />
                                Excluir
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}