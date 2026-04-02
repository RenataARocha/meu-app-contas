// src/components/DashboardClient.tsx
// Client Component principal: toda interatividade fica aqui
// Recebe dados iniciais do servidor (sem loading no primeiro render)

"use client";

import { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { AvatarUsuario } from "./AvatarUsuario";
import { Resumo } from "./Resumo";
import { ContaCard } from "./ContaCard";
import { ContaForm } from "./ContaForm";
import { ModalPagamento } from "./ModalPagamento";
import { PrimeiroAcesso } from "./PrimeiroAcesso";
import { nomeMes } from "@/lib/utils";
import type { Conta } from "@/types/contas";
import type { Usuario } from "@/types/usuario";

interface Props {
    usuarioInicial: Usuario | null;
    contasIniciais: Conta[];
    mes: number;
    ano: number;
}

export function DashboardClient({ usuarioInicial, contasIniciais, mes, ano }: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(usuarioInicial);
    const [contas, setContas] = useState<Conta[]>(contasIniciais);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendente" | "pago">("todos");
    const [filtroBanco, setFiltroBanco] = useState("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [modalForm, setModalForm] = useState(false);
    const [contaEditando, setContaEditando] = useState<Conta | null>(null);
    const [modalPagamento, setModalPagamento] = useState<string | null>(null); // id da conta

    // Se não tem usuário, mostra tela de primeiro acesso
    if (!usuario) {
        return <PrimeiroAcesso onCriado={setUsuario} />;
    }

    // Filtra as contas conforme busca e filtros
    const contasFiltradas = contas.filter((c) => {
        const buscaNome = c.nome.toLowerCase().includes(busca.toLowerCase());
        const buscaBanco = c.banco.toLowerCase().includes(filtroBanco.toLowerCase());
        const matchStatus =
            filtroStatus === "todos" ||
            (filtroStatus === "pago" && c.pago) ||
            (filtroStatus === "pendente" && !c.pago);
        return buscaNome && buscaBanco && matchStatus;
    });

    // Cálculos do resumo
    const total = contas.reduce((s, c) => s + c.valor, 0);
    const pago = contas.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0);

    // Hora do dia → saudação
    const hora = new Date().getHours();
    const saudacao =
        hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

    async function recarregarContas() {
        const res = await fetch(`/api/contas?mes=${mes}&ano=${ano}&usuarioId=${usuario!.id}`);
        const data = await res.json();
        setContas(data);
    }

    async function handleExcluir(id: string) {
        if (!confirm("Excluir esta conta?")) return;
        await fetch(`/api/contas/${id}`, { method: "DELETE" });
        setContas((prev) => prev.filter((c) => c.id !== id));
    }

    function handleMarcarPago(id: string, pago: boolean) {
        if (pago) {
            // Abre modal para informar a data de pagamento
            setModalPagamento(id);
        } else {
            // Desmarcar — não precisa de data
            confirmarPagamento(id, false, null);
        }
    }

    async function confirmarPagamento(id: string, pago: boolean, data: string | null) {
        await fetch(`/api/contas/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pago,
                dataPagamento: pago && data ? new Date(data).toISOString() : null,
            }),
        });
        await recarregarContas();
        setModalPagamento(null);
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{saudacao},</p>
                    <h1 className="text-xl font-semibold text-foreground capitalize">
                        {usuario.nome.split(" ")[0]} 👋
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {nomeMes(mes, ano)}
                    </p>
                </div>
                <AvatarUsuario genero={usuario.genero as "masculino" | "feminino" | "outro"} tamanho={46} />
            </div>

            {/* Resumo financeiro */}
            <Resumo total={total} pago={pago} pendente={total - pago} />

            {/* Barra de busca + filtros */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar conta..."
                            className="w-full pl-9 pr-4 py-2.5 bg-dark-700 border border-white/5 rounded-xl
                         text-sm placeholder:text-muted-foreground focus:outline-none
                         focus:ring-1 focus:ring-brand-500"
                        />
                    </div>
                    <button
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        className={`p-2.5 rounded-xl border transition-all ${mostrarFiltros
                            ? "bg-brand-500/10 border-brand-500/30 text-brand-400"
                            : "bg-dark-700 border-white/5 text-muted-foreground"
                            }`}
                    >
                        <SlidersHorizontal size={18} />
                    </button>
                </div>

                {mostrarFiltros && (
                    <div className="flex gap-2">
                        <input
                            value={filtroBanco}
                            onChange={(e) => setFiltroBanco(e.target.value)}
                            placeholder="Filtrar banco..."
                            className="flex-1 px-3 py-2 bg-dark-700 border border-white/5 rounded-xl
                         text-xs placeholder:text-muted-foreground focus:outline-none
                         focus:ring-1 focus:ring-brand-500"
                        />
                        <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value as "todos" | "pendente" | "pago")}
                            className="px-3 py-2 bg-dark-700 border border-white/5 rounded-xl
                         text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                            <option value="todos">Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Botão adicionar */}
            <button
                onClick={() => { setContaEditando(null); setModalForm(true); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                   bg-brand-gradient text-sm font-semibold text-white
                   hover:opacity-90 active:scale-[0.98] transition-all glow-green"
            >
                <Plus size={18} />
                Adicionar conta
            </button>

            {/* Lista de contas */}
            <div className="space-y-3">
                {contasFiltradas.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-sm">Nenhuma conta encontrada</p>
                    </div>
                ) : (
                    contasFiltradas.map((conta) => (
                        <ContaCard
                            key={conta.id}
                            conta={conta}
                            onMarcarPago={handleMarcarPago}
                            onExcluir={handleExcluir}
                            onEditar={(c) => { setContaEditando(c); setModalForm(true); }}
                        />
                    ))
                )}
            </div>

            {/* Modal formulário */}
            {modalForm && (
                <ContaForm
                    conta={contaEditando}
                    usuarioId={usuario.id}
                    mes={mes}
                    ano={ano}
                    onFechar={() => { setModalForm(false); setContaEditando(null); }}
                    onSalvo={recarregarContas}
                />
            )}

            {/* Modal pagamento */}
            {modalPagamento && (
                <ModalPagamento
                    onFechar={() => setModalPagamento(null)}
                    onConfirmar={(data) => confirmarPagamento(modalPagamento, true, data)}
                />
            )}
        </div>
    );
}