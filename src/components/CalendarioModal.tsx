"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conta } from "@/types/conta";

interface Props {
    contas: Conta[];
    mes: number;
    ano: number;
    onFechar: () => void;
}

export function CalendarioModal({ contas, mes, ano, onFechar }: Props) {
    const hoje = new Date();
    const diasNoMes = new Date(ano, mes, 0).getDate();
    const primeiroDia = new Date(ano, mes - 1, 1).getDay();
    const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

    const contasPorDia = (dia: number) =>
        contas.filter((c) => c.diaVencimento === dia);

    const statusDia = (dia: number) => {
        const cs = contasPorDia(dia);
        if (cs.length === 0) return null;
        const todas = cs.every((c) => c.pago);
        const alguma = cs.some((c) => c.pago);
        if (todas) return "pago";
        if (alguma) return "parcial";
        const diff = dia - hoje.getDate();
        if (mes === hoje.getMonth() + 1 && ano === hoje.getFullYear()) {
            if (diff < 0) return "atrasado";
            if (diff === 0) return "hoje";
            if (diff <= 3) return "proximo";
        }
        return "pendente";
    };

    const corPonto: Record<string, string> = {
        pago: "bg-brand-500",
        parcial: "bg-yellow-400",
        pendente: "bg-muted-foreground",
        proximo: "bg-orange-400",
        hoje: "bg-orange-500",
        atrasado: "bg-destructive",
    };

    const corDia: Record<string, string> = {
        pago: "text-brand-400 bg-brand-500/10",
        parcial: "text-yellow-400 bg-yellow-400/10",
        pendente: "text-foreground",
        proximo: "text-orange-400 bg-orange-400/10",
        hoje: "text-orange-500 bg-orange-500/20 ring-1 ring-orange-500",
        atrasado: "text-destructive bg-destructive/10",
    };

    const contasDiaSelecionado = diaSelecionado ? contasPorDia(diaSelecionado) : [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Calendário de contas"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onFechar}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-dark-800 border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl z-10 p-5 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold capitalize">
                        Calendário — {new Date(ano, mes - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </h2>
                    <button
                        onClick={onFechar}
                        aria-label="Fechar calendário"
                        className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Legenda */}
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
                    {[
                        { cor: "bg-brand-500", label: "Pago" },
                        { cor: "bg-orange-400", label: "Próximo" },
                        { cor: "bg-destructive", label: "Atrasado" },
                        { cor: "bg-muted-foreground", label: "Pendente" },
                    ].map(({ cor, label }) => (
                        <span key={label} className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${cor}`} />
                            {label}
                        </span>
                    ))}
                </div>

                {/* Dias da semana */}
                <div className="grid grid-cols-7 mb-1">
                    {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                        <div key={i} className="text-center text-xs text-muted-foreground py-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid de dias */}
                <div className="grid grid-cols-7 gap-0.5">
                    {/* Espaços vazios antes do primeiro dia */}
                    {Array.from({ length: primeiroDia }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Dias do mês */}
                    {Array.from({ length: diasNoMes }).map((_, i) => {
                        const dia = i + 1;
                        const status = statusDia(dia);
                        const cs = contasPorDia(dia);
                        const selecionado = diaSelecionado === dia;

                        return (
                            <button
                                key={dia}
                                onClick={() => setDiaSelecionado(selecionado ? null : dia)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center rounded-xl py-1.5 text-xs font-medium transition-all",
                                    status ? corDia[status] : "text-muted-foreground hover:bg-white/5",
                                    selecionado && "ring-2 ring-brand-500"
                                )}
                            >
                                {dia}
                                {cs.length > 0 && (
                                    <span className={cn("w-1.5 h-1.5 rounded-full mt-0.5", corPonto[status!])} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Contas do dia selecionado */}
                {diaSelecionado && (
                    <div className="mt-4 border-t border-white/5 pt-4 space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">
                            Dia {diaSelecionado} — {contasDiaSelecionado.length} conta{contasDiaSelecionado.length !== 1 ? "s" : ""}
                        </p>
                        {contasDiaSelecionado.length === 0 ? (
                            <p className="text-xs text-muted-foreground">Nenhuma conta neste dia</p>
                        ) : (
                            <ul className="space-y-2">
                                {contasDiaSelecionado.map((c) => (
                                    <li key={c.id} className="flex items-center justify-between bg-dark-700 rounded-xl px-3 py-2">
                                        <div>
                                            <p className={cn("text-xs font-medium", c.pago && "line-through text-muted-foreground")}>
                                                {c.nome}
                                            </p>
                                            <p className="text-xs text-muted-foreground capitalize">{c.banco}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("text-xs font-semibold", c.pago ? "text-brand-400" : "text-foreground")}>
                                                R$ {c.valor.toFixed(2).replace(".", ",")}
                                            </p>
                                            <p className={cn("text-xs", c.pago ? "text-brand-500" : "text-muted-foreground")}>
                                                {c.pago ? "Pago ✓" : "Pendente"}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}