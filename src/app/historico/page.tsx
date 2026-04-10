"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { ContaCard } from "@/components/ContaCard";
import { Resumo } from "@/components/Resumo";
import { nomeMes } from "@/lib/utils";
import type { Conta } from "@/types/conta";
import Link from "next/link";

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


    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    const proximoMes = mes === 12 ? 1 : mes + 1;
    const proximoAno = mes === 12 ? ano + 1 : ano;
    const limiteUltrapassado =
        proximoAno > anoAtual + 1 ||
        (proximoAno === anoAtual + 1 && proximoMes > mesAtual) ||
        (proximoAno === anoAtual && proximoMes > mesAtual + 1);


    function mesSeguinte() {
        if (limiteUltrapassado) return;
        setMes(proximoMes);
        setAno(proximoAno);
    }

    const total = contas.reduce((s, c) => s + c.valor, 0);
    const pago = contas.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0);
    const ehMesAtual = mes === hoje.getMonth() + 1 && ano === hoje.getFullYear();
    const mesLabel = nomeMes(mes, ano);


    return (
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-10 animate-fade-in">
            <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between animate-slide-up"
                    style={{ animationFillMode: "both" }}>
                    <div>
                        <h1 className="text-xl font-semibold">Histórico</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Veja suas contas por mês
                        </p>
                    </div>
                    <Link href="/" aria-label="Voltar para o início"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                     bg-brand-500/10 text-brand-400 hover:bg-brand-500/20
                     transition-all text-xs font-medium focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-brand-500">
                        <ArrowLeft size={14} aria-hidden="true" />
                        Início
                    </Link>
                </div>

                {/* Seletor de mês */}
                <nav aria-label="Navegação por mês"
                    className="flex items-center justify-between glass-card rounded-2xl px-4 py-3
                   animate-slide-up"
                    style={{ animationDelay: "80ms", animationFillMode: "both" }}>
                    <button onClick={mesAnterior} aria-label="Mês anterior"
                        className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground
                     hover:text-foreground transition-colors focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-brand-500">
                        <ChevronLeft size={20} aria-hidden="true" />
                    </button>
                    <span className="text-sm font-medium capitalize" aria-live="polite" aria-atomic="true">
                        {mesLabel}
                    </span>
                    <button onClick={mesSeguinte} disabled={limiteUltrapassado} aria-label="Próximo mês"
                        aria-disabled={ehMesAtual}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground
                     hover:text-foreground transition-colors disabled:opacity-30
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                        <ChevronRight size={20} aria-hidden="true" />
                    </button>
                </nav>

                {/* Resumo */}
                {!loading && contas.length > 0 && (
                    <section aria-label={`Resumo financeiro de ${mesLabel}`}
                        className="animate-slide-up"
                        style={{ animationDelay: "160ms", animationFillMode: "both" }}>
                        <Resumo total={total} pago={pago} pendente={total - pago} />
                    </section>
                )}

                {/* Lista */}
                <section aria-label={`Contas de ${mesLabel}`} aria-live="polite" aria-busy={loading}>
                    <div className="overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 420px)" }}>
                        {loading ? (
                            <div className="text-center py-10 text-muted-foreground text-sm" role="status">
                                <span className="sr-only">Carregando contas...</span>
                                Carregando...
                            </div>
                        ) : contas.length === 0 ? (
                            <div className="text-center py-10 animate-fade-in" role="status">
                                <p className="text-4xl mb-3" aria-hidden="true">📭</p>
                                <p className="text-sm text-muted-foreground">Nenhuma conta em {mesLabel}</p>
                            </div>
                        ) : (
                            <ul className="space-y-3 list-none"
                                aria-label={`${contas.length} contas em ${mesLabel}`}>
                                {contas.map((conta, index) => (
                                    <li key={conta.id}
                                        className="animate-slide-up"
                                        style={{
                                            animationDelay: `${240 + index * 50}ms`,
                                            animationFillMode: "both",
                                        }}>
                                        <ContaCard
                                            conta={conta}
                                            onMarcarPago={() => { }}
                                            onExcluir={() => { }}
                                            onEditar={() => { }}
                                            somenteLeitura
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}