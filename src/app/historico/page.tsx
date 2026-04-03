"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContaCard } from "@/components/ContaCard";
import { Resumo } from "@/components/Resumo";
import { nomeMes, formatarData } from "@/lib/utils";
import type { Conta } from "@/types/conta";

export default function HistoricoPage() {
    const hoje = new Date();
    const [mes, setMes] = useState(hoje.getMonth() + 1);
    const [ano, setAno] = useState(hoje.getFullYear());
    const [contas, setContas] = useState<Conta[]>([]);
    const [loading, setLoading] = useState(true);
    const [usuarioId, setUsuarioId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/usuario")
            .then((r) => r.json())
            .then((u) => { if (u?.id) setUsuarioId(u.id); });
    }, []);

    useEffect(() => {
        if (!usuarioId) return;
        setLoading(true);
        fetch(`/api/contas?mes=${mes}&ano=${ano}&usuarioId=${usuarioId}`)
            .then((r) => r.json())
            .then((data) => { setContas(data); setLoading(false); });
    }, [mes, ano, usuarioId]);

    function mesAnterior() {
        if (mes === 1) { setMes(12); setAno(ano - 1); }
        else setMes(mes - 1);
    }

    function mesSeguinte() {
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();
        if (ano > anoAtual || (ano === anoAtual && mes >= mesAtual)) return;
        if (mes === 12) { setMes(1); setAno(ano + 1); }
        else setMes(mes + 1);
    }

    const total = contas.reduce((s, c) => s + c.valor, 0);
    const pago = contas.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0);
    const ehMesAtual = mes === hoje.getMonth() + 1 && ano === hoje.getFullYear();

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">Histórico</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Veja suas contas por mês
                </p>
            </div>

            {/* Seletor de mês */}
            <div className="flex items-center justify-between glass-card rounded-2xl px-4 py-3">
                <button
                    onClick={mesAnterior}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium capitalize">
                    {nomeMes(mes, ano)}
                </span>
                <button
                    onClick={mesSeguinte}
                    disabled={ehMesAtual}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Resumo do mês */}
            {!loading && contas.length > 0 && (
                <Resumo total={total} pago={pago} pendente={total - pago} />
            )}

            {/* Lista */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        Carregando...
                    </div>
                ) : contas.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-sm text-muted-foreground">
                            Nenhuma conta em {nomeMes(mes, ano)}
                        </p>
                    </div>
                ) : (
                    contas.map((conta) => (
                        <ContaCard
                            key={conta.id}
                            conta={conta}
                            onMarcarPago={() => { }}
                            onExcluir={() => { }}
                            onEditar={() => { }}
                            somenteLeitura
                        />
                    ))
                )}
            </div>
        </div>
    );
}