"use client";

import { useState, useEffect } from "react";
import { GraficoBarras } from "@/components/GraficoBarras";
import { formatarMoeda, nomeMes } from "@/lib/utils";
import type { Conta } from "@/types/conta";
import Link from "next/link";
import { ArrowLeft, FileDown, Loader2 } from "lucide-react";

interface DadosMes {
    mes: string;
    total: number;
    pago: number;
}

export default function RelatorioPage() {
    const [dados, setDados] = useState<DadosMes[]>([]);
    const [contasMes, setContasMes] = useState<Conta[]>([]);
    const [loading, setLoading] = useState(true);
    const [exportando, setExportando] = useState(false);
    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    const [nomeUsuario, setNomeUsuario] = useState("");

    const mesesNomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const hoje = new Date();
    const mesAtualNum = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    useEffect(() => {
        fetch("/api/usuario")
            .then((r) => r.json())
            .then((u) => {
                if (u?.id) { setUsuarioId(u.id); setNomeUsuario(u.nome); }
            });
    }, []);

    useEffect(() => {
        if (!usuarioId) return;
        async function carregarDados() {
            const resultados: DadosMes[] = [];
            for (let i = 5; i >= 0; i--) {
                const data = new Date(anoAtual, hoje.getMonth() - i, 1);
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
            const resMes = await fetch(`/api/contas?mes=${mesAtualNum}&ano=${anoAtual}&usuarioId=${usuarioId}`);
            const contasDoMes: Conta[] = await resMes.json();
            setDados(resultados);
            setContasMes(contasDoMes);
            setLoading(false);
        }
        carregarDados();
    }, [usuarioId]);

    async function exportarPDF() {
        setExportando(true);
        try {
            const { default: jsPDF } = await import("jspdf");
            const { default: autoTable } = await import("jspdf-autotable");
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const largura = doc.internal.pageSize.getWidth();

            doc.setFillColor(6, 13, 24);
            doc.rect(0, 0, largura, 40, "F");
            doc.setTextColor(34, 197, 94);
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text("MinhasConta$", 14, 18);
            doc.setTextColor(156, 163, 175);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Relatório de ${nomeUsuario}`, 14, 26);
            doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 32);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(nomeMes(mesAtualNum, anoAtual).toUpperCase(), largura - 14, 22, { align: "right" });

            const totalMes = contasMes.reduce((s, c) => s + c.valor, 0);
            const pagoMes = contasMes.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0);

            doc.setFillColor(10, 22, 40);
            doc.roundedRect(14, 48, (largura - 28) / 3 - 3, 28, 3, 3, "F");
            doc.roundedRect(14 + (largura - 28) / 3, 48, (largura - 28) / 3 - 3, 28, 3, 3, "F");
            doc.roundedRect(14 + ((largura - 28) / 3) * 2, 48, (largura - 28) / 3 - 3, 28, 3, 3, "F");

            doc.setTextColor(156, 163, 175); doc.setFontSize(7); doc.setFont("helvetica", "normal");
            doc.text("TOTAL DO MÊS", 17, 56);
            doc.setTextColor(255, 255, 255); doc.setFontSize(11); doc.setFont("helvetica", "bold");
            doc.text(formatarMoeda(totalMes), 17, 65);

            const x2 = 14 + (largura - 28) / 3 + 3;
            doc.setTextColor(156, 163, 175); doc.setFontSize(7); doc.setFont("helvetica", "normal");
            doc.text("PAGO", x2, 56);
            doc.setTextColor(34, 197, 94); doc.setFontSize(11); doc.setFont("helvetica", "bold");
            doc.text(formatarMoeda(pagoMes), x2, 65);

            const x3 = 14 + ((largura - 28) / 3) * 2 + 3;
            doc.setTextColor(156, 163, 175); doc.setFontSize(7); doc.setFont("helvetica", "normal");
            doc.text("PENDENTE", x3, 56);
            doc.setTextColor(239, 68, 68); doc.setFontSize(11); doc.setFont("helvetica", "bold");
            doc.text(formatarMoeda(totalMes - pagoMes), x3, 65);

            doc.setTextColor(255, 255, 255); doc.setFontSize(12); doc.setFont("helvetica", "bold");
            doc.text(`Contas de ${nomeMes(mesAtualNum, anoAtual)}`, 14, 90);

            autoTable(doc, {
                startY: 95,
                head: [["Conta", "Banco", "Vencimento", "Valor", "Status", "Data Pago"]],
                body: contasMes
                    .sort((a, b) => a.diaVencimento - b.diaVencimento)
                    .map((c) => [
                        c.nome, c.banco, `Dia ${c.diaVencimento}`, formatarMoeda(c.valor),
                        c.pago ? "✓ Pago" : "Pendente",
                        c.dataPagamento ? new Date(c.dataPagamento).toLocaleDateString("pt-BR") : "-",
                    ]),
                headStyles: { fillColor: [10, 22, 40], textColor: [34, 197, 94], fontSize: 8, fontStyle: "bold" },
                bodyStyles: { fillColor: [6, 13, 24], textColor: [255, 255, 255], fontSize: 8 },
                alternateRowStyles: { fillColor: [10, 22, 40] },
                margin: { left: 14, right: 14 },
            });

            const finalY = (doc as any).lastAutoTable.finalY + 10;
            doc.setTextColor(255, 255, 255); doc.setFontSize(12); doc.setFont("helvetica", "bold");
            doc.text("Histórico dos últimos 6 meses", 14, finalY);

            autoTable(doc, {
                startY: finalY + 5,
                head: [["Mês", "Total", "Pago", "Pendente", "% Pago"]],
                body: dados.map((d) => [
                    d.mes, formatarMoeda(d.total), formatarMoeda(d.pago),
                    formatarMoeda(d.total - d.pago),
                    d.total > 0 ? `${((d.pago / d.total) * 100).toFixed(0)}%` : "0%",
                ]),
                headStyles: { fillColor: [10, 22, 40], textColor: [34, 197, 94], fontSize: 8, fontStyle: "bold" },
                bodyStyles: { fillColor: [6, 13, 24], textColor: [255, 255, 255], fontSize: 8 },
                alternateRowStyles: { fillColor: [10, 22, 40] },
                margin: { left: 14, right: 14 },
            });

            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(7);
                doc.setTextColor(100, 120, 150);
                doc.text(`MinhasConta$ • Página ${i} de ${pageCount}`, largura / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
            }

            doc.save(`minhascontas-${nomeMes(mesAtualNum, anoAtual).replace(" ", "-")}.pdf`);
        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
            alert("Erro ao gerar PDF. Tente novamente.");
        } finally {
            setExportando(false);
        }
    }

    const mesAtual = dados[dados.length - 1];
    const totalGeral = dados.reduce((s, d) => s + d.pago, 0);

    return (
        <main className="max-w-2xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-10 animate-fade-in"
            aria-label="Página de relatórios financeiros">
            <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between animate-slide-up"
                    style={{ animationFillMode: "both" }}>
                    <div>
                        <h1 className="text-xl font-semibold">Relatório</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportarPDF}
                            disabled={exportando || loading}
                            aria-label={exportando ? "Gerando PDF, aguarde" : "Exportar relatório em PDF"}
                            aria-busy={exportando}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                         bg-brand-500/10 text-brand-400 hover:bg-brand-500/20
                         transition-all text-xs font-medium disabled:opacity-50
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            {exportando
                                ? <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                                : <FileDown size={14} aria-hidden="true" />
                            }
                            {exportando ? "Gerando..." : "Exportar PDF"}
                        </button>
                        <Link
                            href="/"
                            aria-label="Voltar para o início"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                         bg-white/5 text-muted-foreground hover:text-foreground
                         hover:bg-white/10 transition-all text-xs font-medium
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <ArrowLeft size={14} aria-hidden="true" />
                            Início
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-muted-foreground text-sm"
                        role="status" aria-live="polite">
                        <span className="sr-only">Carregando dados do relatório...</span>
                        Carregando dados...
                    </div>
                ) : (
                    <>
                        {/* Cards resumo */}
                        <section aria-label="Resumo do mês atual"
                            className="grid grid-cols-2 gap-3 animate-slide-up"
                            style={{ animationDelay: "80ms", animationFillMode: "both" }}>
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
                        </section>

                        {/* Gráfico */}
                        <section aria-label="Gráfico de gastos por mês"
                            className="glass-card rounded-2xl p-4 animate-slide-up"
                            style={{ animationDelay: "160ms", animationFillMode: "both" }}>
                            <p className="text-sm font-medium mb-4">Gastos por mês</p>
                            <GraficoBarras dados={dados} />
                        </section>

                        {/* Detalhamento */}
                        <section aria-label="Detalhamento mensal"
                            className="glass-card rounded-2xl p-4 animate-slide-up"
                            style={{ animationDelay: "240ms", animationFillMode: "both" }}>
                            <p className="text-sm font-medium mb-3">Detalhamento</p>
                            <ul className="space-y-2 list-none" aria-label="Progresso de pagamento por mês">
                                {dados.map((d) => (
                                    <li key={d.mes} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground w-10" aria-label={`Mês: ${d.mes}`}>
                                            {d.mes}
                                        </span>
                                        <div
                                            className="flex-1 mx-3 h-1.5 bg-dark-600 rounded-full overflow-hidden"
                                            role="progressbar"
                                            aria-valuenow={d.total > 0 ? Math.round((d.pago / d.total) * 100) : 0}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`${d.mes}: ${d.total > 0 ? Math.round((d.pago / d.total) * 100) : 0}% pago`}
                                        >
                                            <div
                                                className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                                                style={{ width: d.total > 0 ? `${(d.pago / d.total) * 100}%` : "0%" }}
                                            />
                                        </div>
                                        <span className="text-brand-400 font-medium w-24 text-right">
                                            {formatarMoeda(d.pago)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}