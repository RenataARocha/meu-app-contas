// src/components/ContaCard.tsx
// Card accordion de cada conta
// Clica no card → expande com detalhes
// Clica no checkbox → abre modal para confirmar pagamento

"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle, Trash2, Pencil } from "lucide-react";
import { cn, formatarMoeda, formatarData, statusVencimento } from "@/lib/utils";
import { BancoIcon } from "./BancoIcon";
import type { Conta } from "@/types/contas";

interface ContaCardProps {
    conta: Conta;
    onMarcarPago: (id: string, pago: boolean) => void;
    onExcluir: (id: string) => void;
    onEditar: (conta: Conta) => void;
}

export function ContaCard({ conta, onMarcarPago, onExcluir, onEditar }: ContaCardProps) {
    const [expandido, setExpandido] = useState(false);
    const status = statusVencimento(conta.diaVencimento);

    const corUrgencia = {
        ok: "text-muted-foreground",
        proximo: "text-gold-400",
        hoje: "text-orange-400",
        atrasado: "text-destructive",
    }[status.urgencia];

    return (
        <div
            className={cn(
                "glass-card rounded-2xl overflow-hidden transition-all duration-200",
                conta.pago && "opacity-75"
            )}
        >
            {/* Linha principal — sempre visível */}
            <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandido(!expandido)}
            >
                {/* Checkbox */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // não expande o card
                        onMarcarPago(conta.id, !conta.pago);
                    }}
                    className="shrink-0 transition-transform active:scale-90"
                    aria-label={conta.pago ? "Desmarcar como pago" : "Marcar como pago"}
                >
                    {conta.pago ? (
                        <CheckCircle2 size={22} className="text-brand-500" />
                    ) : (
                        <Circle size={22} className="text-muted-foreground" />
                    )}
                </button>

                {/* Nome + banco */}
                <div className="flex-1 min-w-0">
                    <p
                        className={cn(
                            "text-sm font-medium truncate",
                            conta.pago && "line-through text-muted-foreground decoration-destructive"
                        )}
                    >
                        {conta.nome}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <BancoIcon nome={conta.banco} tamanho={12} />
                        <span className="text-xs text-muted-foreground capitalize">{conta.banco}</span>
                    </div>
                </div>

                {/* Valor + status */}
                <div className="text-right shrink-0">
                    <p className={cn(
                        "text-sm font-semibold",
                        conta.pago ? "text-brand-400" : "text-foreground"
                    )}>
                        {formatarMoeda(conta.valor)}
                    </p>
                    {!conta.pago && (
                        <span className={cn("text-xs", corUrgencia)}>{status.texto}</span>
                    )}
                    {conta.pago && (
                        <span className="text-xs text-brand-600">Pago ✓</span>
                    )}
                </div>

                {/* Chevron */}
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-muted-foreground transition-transform duration-200 shrink-0",
                        expandido && "rotate-180"
                    )}
                />
            </div>

            {/* Detalhes — visíveis só quando expandido */}
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
                            <p className={cn(
                                "font-medium",
                                conta.dataPagamento ? "text-brand-400" : "text-muted-foreground"
                            )}>
                                {formatarData(conta.dataPagamento) ?? "Não pago"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-0.5">Referência</p>
                            <p className="text-foreground font-medium">{conta.mes}/{conta.ano}</p>
                        </div>
                    </div>

                    {/* Ações */}
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
                </div>
            )}
        </div>
    );
}