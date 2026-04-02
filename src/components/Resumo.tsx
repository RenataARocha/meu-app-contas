// src/components/Resumo.tsx
// Três cards: Total do mês / Total pago / Total pendente
// "use client" pois recebe props dinâmicas e renderiza no cliente

"use client";

import { formatarMoeda } from "@/lib/utils";
import { TrendingUp, CheckCircle, Clock } from "lucide-react";

interface ResumoProps {
    total: number;
    pago: number;
    pendente: number;
}

export function Resumo({ total, pago, pendente }: ResumoProps) {
    const percentualPago = total > 0 ? (pago / total) * 100 : 0;

    return (
        <div className="space-y-3">
            {/* Card principal — total */}
            <div className="glass-card rounded-2xl p-5 glow-green">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Total do mês
                    </span>
                    <TrendingUp size={16} className="text-brand-500" />
                </div>
                <p className="text-3xl font-semibold text-gradient-green">
                    {formatarMoeda(total)}
                </p>
                {/* Barra de progresso */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{percentualPago.toFixed(0)}% pago</span>
                        <span>{(100 - percentualPago).toFixed(0)}% pendente</span>
                    </div>
                    <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                            style={{ width: `${percentualPago}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Cards pago e pendente lado a lado */}
            <div className="grid grid-cols-2 gap-3">
                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={14} className="text-brand-500" />
                        <span className="text-xs text-muted-foreground">Pago</span>
                    </div>
                    <p className="text-lg font-semibold text-brand-400">
                        {formatarMoeda(pago)}
                    </p>
                </div>

                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-destructive" />
                        <span className="text-xs text-muted-foreground">Pendente</span>
                    </div>
                    <p className="text-lg font-semibold text-destructive">
                        {formatarMoeda(pendente)}
                    </p>
                </div>
            </div>
        </div>
    );
}