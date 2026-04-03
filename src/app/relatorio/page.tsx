"use client";

import { useState, useEffect } from "react";
import { GraficoBarras } from "@/components/GraficoBarras";
import { formatarMoeda } from "@/lib/utils";
import type { Conta } from "@/types/conta";

interface DadosMes {
    mes: string;
    total: number;
    pago: number;
}

export default function RelatorioPage() {
    const [dados, setDados] = useState<DadosMes[]>([]);
    const [loading, setLoading] = useState(true);
    const [usuarioId, setUsuarioId] = useState<string | null>(null);

    const mesesNomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    useEffect(() => {
        fetch("/api/usuario")
            .then((r) => r.json())
            .then((u) => { if (u?.id) setUsuarioId(u.id); });
    }, []);

    useEffect(() => {
        if (!usuarioId) return;

        async function carregarDados() {
            const hoje = new Date();
            const resultados: DadosMes[] = [];

            for (let i = 5; i >= 0; i--) {
                const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
                const m = data.getMonth() + 1;
                const a = data.getFullYear();

                const res = await fetch(`/api/contas?mes=${m}&ano=${a}&usuarioId=${usuarioId}`);
                const contas: Conta[] = await res.json();

                resultados.push({
                    mes: mesesNomes[m - 1],
                    total: contas.reduce((s, c) => s + c.valor, 0),
                    pago: contas.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0),
                });
            }

            setDados(resultados);
            setLoading(false);
        }

        carregarDados();
    }, [usuarioId]);

    const mesAtual = dados[dados.length - 1];
    const totalGeral = dados.reduce((s, d) => s + d.pago, 0);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-semibold">Relatório</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Últimos 6 meses
                </p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                    Carregando dados...
                </div>
            ) : (
                <>
                    {/* Cards resumo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-card rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">Pago no mês atual</p>
                            <p className="text-lg font-semibold text-brand-400">
                                {mesAtual ? formatarMoeda(mesAtual.pago) : "R$ 0,00"}
                            </p>
                        </div>
                        <div className="glass-card rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total em 6 meses</p>
                            <p className="text-lg font-semibold text-foreground">
                                {formatarMoeda(totalGeral)}
                            </p>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div className="glass-card rounded-2xl p-4">
                        <p className="text-sm font-medium mb-4">Gastos por mês</p>
                        <GraficoBarras dados={dados} />
                    </div>

                    {/* Tabela resumo */}
                    <div className="glass-card rounded-2xl p-4">
                        <p className="text-sm font-medium mb-3">Detalhamento</p>
                        <div className="space-y-2">
                            {dados.map((d) => (
                                <div key={d.mes} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground w-10">{d.mes}</span>
                                    <div className="flex-1 mx-3 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-gradient rounded-full"
                                            style={{
                                                width: d.total > 0 ? `${(d.pago / d.total) * 100}%` : "0%",
                                            }}
                                        />
                                    </div>
                                    <span className="text-brand-400 font-medium w-24 text-right">
                                        {formatarMoeda(d.pago)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}