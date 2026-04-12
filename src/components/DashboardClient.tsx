"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    SlidersHorizontal,
    Menu,
    X,
    Home,
    History,
    BarChart2,
    User,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { AvatarUsuario } from "./AvatarUsuario";
import { Resumo } from "./Resumo";
import { ContaCard } from "./ContaCard";
import { ContaForm } from "./ContaForm";
import { ModalPagamento } from "./ModalPagamento";
import { PrimeiroAcesso } from "./PrimeiroAcesso";
import type { Conta } from "@/types/conta";
import type { Usuario } from "@/types/usuario";
import { SeletorTema } from "./SeletorTema";
import { Palette } from "lucide-react";
import { LoadingScreen } from "./LoadingScreen";
import { CalendarioModal } from "./CalendarioModal";
import { CalendarDays } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Props {
    usuarioInicial: Usuario | null;
    contasIniciais: Conta[];
    mes: number;
    ano: number;
}

const navLinks = [
    { href: "/", label: "Início", icon: Home },
    { href: "/historico", label: "Histórico", icon: History },
    { href: "/relatorio", label: "Relatório", icon: BarChart2 },
    { href: "/perfil", label: "Perfil", icon: User },
];

export function DashboardClient({
    usuarioInicial,
    contasIniciais,
    mes,
    ano,
}: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(usuarioInicial);
    const [contas, setContas] = useState<Conta[]>(contasIniciais);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<
        "todos" | "pendente" | "pago"
    >("todos");
    const [filtroBanco, setFiltroBanco] = useState("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [modalForm, setModalForm] = useState(false);
    const [contaEditando, setContaEditando] = useState<Conta | null>(null);
    const [modalPagamento, setModalPagamento] = useState<string | null>(null);
    const [sidebarAberta, setSidebarAberta] = useState(false);
    const [mostrarTema, setMostrarTema] = useState(false);
    const [loadingTerminou, setLoadingTerminou] = useState(false);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);

    useEffect(() => {
        if (!usuario) return;

        const handleFocus = () => recarregarContas();

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [usuario]);

    if (!usuario) return <PrimeiroAcesso onCriado={setUsuario} />;

    // Renderiza loading + conteúdo ao mesmo tempo
    // O conteúdo fica "escondido" pelas animações até o loading sumir

    const contasFiltradas = contas.filter((c) => {
        const buscaNome = c.nome.toLowerCase().includes(busca.toLowerCase());
        const buscaBanco = c.banco
            .toLowerCase()
            .includes(filtroBanco.toLowerCase());
        const matchStatus =
            filtroStatus === "todos" ||
            (filtroStatus === "pago" && c.pago) ||
            (filtroStatus === "pendente" && !c.pago);
        return buscaNome && buscaBanco && matchStatus;
    });

    const total = contas.reduce((s, c) => s + c.valor, 0);
    const pago = contas.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0);
    const hora = new Date().getHours();
    const saudacao =
        hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

    async function recarregarContas() {
        const res = await fetch(
            `/api/contas?mes=${mes}&ano=${ano}&usuarioId=${usuario!.id}`,
        );
        const data = await res.json();
        setContas(data);
    }

    async function handleExcluir(id: string) {
        if (!confirm("Excluir esta conta?")) return;
        await fetch(`/api/contas/${id}`, { method: "DELETE" });
        setContas((prev) => prev.filter((c) => c.id !== id));
    }

    function handleMarcarPago(id: string, novoPago: boolean) {
        if (novoPago) setModalPagamento(id);
        else confirmarPagamento(id, false, null);
    }

    function dataAtualFormatada() {
        return new Date().toLocaleString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    async function confirmarPagamento(
        id: string,
        novoPago: boolean,
        data: string | null,
    ) {
        await fetch(`/api/contas/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pago: novoPago,
                // ← Adiciona T12:00:00 para evitar problema de fuso
                dataPagamento: novoPago && data ? `${data}T12:00:00.000Z` : null,
            }),
        });
        await recarregarContas();
        setModalPagamento(null);
    }

    const inputClass =
        "bg-dark-700 border border-white/5 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-500";

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Loading screen — some depois de 2.2s */}
            <LoadingScreen onTerminou={() => setLoadingTerminou(true)} />

            {/* ── OVERLAY SIDEBAR ── */}
            {sidebarAberta && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSidebarAberta(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── SIDEBAR ── só desktop ── */}
            <aside
                id="sidebar-menu"
                role="navigation"
                aria-label="Menu principal"
                aria-hidden={!sidebarAberta}
                className={cn(
                    "fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300",
                    "bg-gradient-to-b from-dark-800 via-dark-800 to-dark-900",
                    "border-r border-white/5 shadow-2xl",
                    sidebarAberta ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Header do sidebar */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center glow-green">
                            <span className="text-sm font-bold text-white">M$</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                            MinhasConta$
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarAberta(false)}
                        aria-label="Fechar menu"
                        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 p-4 space-y-1" aria-label="Páginas do app">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setSidebarAberta(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                   text-muted-foreground hover:text-foreground hover:bg-brand-500/10
                   hover:text-brand-400 transition-all focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <Icon size={18} aria-hidden="true" />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
               text-destructive hover:bg-destructive/10 transition-all"
                    >
                        <LogOut size={18} aria-hidden="true" />
                        Sair
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                        MinhasConta$ v1.0
                    </p>
                </div>
            </aside>

            {/* ── HEADER DESKTOP ── */}
            <header
                className={`hidden md:flex items-center justify-between px-8 py-4 border-b border-white/5 bg-dark-800/80 backdrop-blur-sm sticky top-0 z-30 ${loadingTerminou ? "animate-fade-in" : "opacity-0"}`}
                role="banner"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarAberta(true)}
                        aria-label="Abrir menu de navegação"
                        aria-expanded={sidebarAberta}
                        aria-controls="sidebar-menu"
                        className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                        <Menu size={20} aria-hidden="true" />
                    </button>
                    <div>
                        <p
                            className="text-xs text-muted-foreground"
                            suppressHydrationWarning
                        >
                            {saudacao},
                        </p>
                        <p className="text-lg font-semibold capitalize">
                            {usuario.nome.split(" ")[0]} 👋
                        </p>
                    </div>
                </div>

                {/* Busca desktop */}
                <div className="relative w-72">
                    <label htmlFor="busca-desktop" className="sr-only">
                        Buscar conta
                    </label>
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <input
                        id="busca-desktop"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar conta..."
                        className={`w-full pl-9 pr-4 py-2 ${inputClass}`}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground capitalize">
                        {dataAtualFormatada()}
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setMostrarTema(!mostrarTema)}
                            aria-label="Selecionar tema"
                            aria-expanded={mostrarTema}
                            className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground
               hover:text-foreground transition-all focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <Palette size={18} aria-hidden="true" />
                        </button>

                        <button
                            onClick={() => setMostrarCalendario(true)}
                            aria-label="Abrir calendário"
                            className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground
             hover:text-foreground transition-all focus-visible:outline-none
             focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <CalendarDays size={18} aria-hidden="true" />
                        </button>

                        {mostrarTema && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setMostrarTema(false)}
                                />
                                <div className="absolute top-full right-0 mt-2 w-52 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl z-50">
                                    <SeletorTema aoFechar={() => setMostrarTema(false)} />
                                </div>
                            </>
                        )}
                    </div>
                    <Link href="/perfil">
                        <AvatarUsuario
                            genero={usuario.genero as "masculino" | "feminino" | "outro"}
                            tamanho={38}
                        />
                    </Link>
                </div>
            </header>

            {/* ── CONTEÚDO PRINCIPAL ── */}
            <main
                id="conteudo-principal"
                className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-10"
                aria-label="Dashboard de contas"
            >
                {/* Pular navegação — acessibilidade */}
                <a
                    href="#lista-contas"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white
                focus:rounded-lg focus:text-sm"
                >
                    Pular para lista de contas
                </a>

                {/* Header mobile */}
                <div
                    className={`flex items-center justify-between mb-5 md:hidden
       ${loadingTerminou ? "animate-fade-in" : "opacity-0"}`}
                >
                    {/* Esquerda: saudação */}
                    <div>
                        <p
                            className="text-xs text-muted-foreground"
                            suppressHydrationWarning
                        >
                            {saudacao},
                        </p>
                        <h1 className="text-xl font-semibold capitalize">
                            {usuario.nome.split(" ")[0]} 👋
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                            {dataAtualFormatada()}
                        </p>
                    </div>

                    {/* Direita: calendário + logout + avatar */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMostrarCalendario(true)}
                            aria-label="Abrir calendário"
                            className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground 
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <CalendarDays size={20} aria-hidden="true" />
                        </button>

                        <Link href="/perfil">
                            <AvatarUsuario
                                genero={usuario.genero as "masculino" | "feminino" | "outro"}
                                tamanho={38}
                            />
                        </Link>

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            aria-label="Sair da conta"
                            className="p-2 rounded-xl hover:bg-white/5 text-destructive 
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <LogOut size={20} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Resumo financeiro */}
                <section
                    className={`mb-5 ${loadingTerminou ? "animate-slide-up" : "opacity-0"}`}
                    style={{
                        animationDelay: loadingTerminou ? "100ms" : "0ms",
                        animationFillMode: "both",
                    }}
                >
                    <Resumo total={total} pago={pago} pendente={total - pago} />
                </section>

                {/* Filtros + botão */}
                <section
                    className={`flex flex-col md:flex-row gap-3 mb-5
                    ${loadingTerminou ? "animate-slide-up" : "opacity-0"}`}
                    style={{
                        animationDelay: loadingTerminou ? "200ms" : "0ms",
                        animationFillMode: "both",
                    }}
                >
                    {/* Busca mobile */}
                    <div className="flex gap-2 md:hidden">
                        <div className="flex-1 relative">
                            <label htmlFor="busca-mobile" className="sr-only">
                                Buscar conta
                            </label>
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <input
                                id="busca-mobile"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar conta..."
                                className={`w-full pl-9 pr-4 py-2.5 ${inputClass}`}
                            />
                        </div>
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            aria-label={
                                mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"
                            }
                            aria-expanded={mostrarFiltros}
                            className={cn(
                                "p-2.5 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                                mostrarFiltros
                                    ? "bg-brand-500/10 border-brand-500/30 text-brand-400"
                                    : "bg-dark-700 border-white/5 text-muted-foreground",
                            )}
                        >
                            <SlidersHorizontal size={18} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Filtros desktop */}
                    <div
                        className="hidden md:flex gap-3 flex-1"
                        role="group"
                        aria-label="Filtros de contas"
                    >
                        <label htmlFor="filtro-banco" className="sr-only">
                            Filtrar por banco
                        </label>
                        <input
                            id="filtro-banco"
                            value={filtroBanco}
                            onChange={(e) => setFiltroBanco(e.target.value)}
                            placeholder="Filtrar banco..."
                            className={`px-4 py-2.5 w-48 ${inputClass}`}
                        />
                        <label htmlFor="filtro-status" className="sr-only">
                            Filtrar por status
                        </label>
                        <select
                            id="filtro-status"
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(e.target.value as "todos" | "pendente" | "pago")
                            }
                            className={`px-4 py-2.5 ${inputClass} text-foreground`}
                        >
                            <option value="todos">Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setContaEditando(null);
                            setModalForm(true);
                        }}
                        aria-label="Adicionar nova conta"
                        className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-2xl
                       bg-brand-gradient text-sm font-semibold text-white
                       hover:opacity-90 active:scale-[0.98] transition-all glow-green
                       md:ml-auto focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-brand-500 focus-visible:ring-offset-2
                       focus-visible:ring-offset-dark-900"
                    >
                        <Plus size={18} aria-hidden="true" />
                        Adicionar conta
                    </button>
                </section>

                {/* Filtros mobile expansíveis */}
                {mostrarFiltros && (
                    <div
                        className="flex gap-2 mb-4 md:hidden"
                        role="group"
                        aria-label="Filtros adicionais"
                    >
                        <label htmlFor="filtro-banco-mobile" className="sr-only">
                            Filtrar por banco
                        </label>
                        <input
                            id="filtro-banco-mobile"
                            value={filtroBanco}
                            onChange={(e) => setFiltroBanco(e.target.value)}
                            placeholder="Filtrar banco..."
                            className={`flex-1 px-3 py-2 text-xs ${inputClass}`}
                        />
                        <label htmlFor="filtro-status-mobile" className="sr-only">
                            Filtrar por status
                        </label>
                        <select
                            id="filtro-status-mobile"
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(e.target.value as "todos" | "pendente" | "pago")
                            }
                            className={`px-3 py-2 text-xs ${inputClass} text-foreground`}
                        >
                            <option value="todos">Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                        </select>
                    </div>
                )}

                {/* Lista de contas */}
                <section
                    id="lista-contas"
                    aria-label={`Lista de contas — ${contasFiltradas.length} encontrada${contasFiltradas.length !== 1 ? "s" : ""}`}
                    aria-live="polite"
                    aria-atomic="false"
                >
                    <div
                        className="overflow-y-auto pr-1"
                        style={{ maxHeight: "calc(100vh - 420px)" }}
                    >
                        {contasFiltradas.length === 0 ? (
                            <div
                                className="text-center py-16 text-muted-foreground"
                                role="status"
                            >
                                <p className="text-5xl mb-4" aria-hidden="true">
                                    📋
                                </p>
                                <p className="text-sm">Nenhuma conta encontrada</p>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 list-none">
                                {contasFiltradas.map((conta, index) => (
                                    <li
                                        key={conta.id}
                                        className={
                                            loadingTerminou ? "animate-slide-up" : "opacity-0"
                                        }
                                        style={{
                                            animationDelay: loadingTerminou
                                                ? `${300 + index * 60}ms`
                                                : "0ms",
                                            animationFillMode: "both",
                                        }}
                                    >
                                        <ContaCard
                                            conta={conta}
                                            onMarcarPago={handleMarcarPago}
                                            onExcluir={handleExcluir}
                                            onEditar={(c) => {
                                                setContaEditando(c);
                                                setModalForm(true);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>

            {/* Modais */}
            {modalForm && (
                <ContaForm
                    conta={contaEditando}
                    usuarioId={usuario.id}
                    mes={mes}
                    ano={ano}
                    onFechar={() => {
                        setModalForm(false);
                        setContaEditando(null);
                    }}
                    onSalvo={recarregarContas}
                />
            )}
            {modalPagamento && (
                <ModalPagamento
                    onFechar={() => setModalPagamento(null)}
                    onConfirmar={(data) => confirmarPagamento(modalPagamento, true, data)}
                />
            )}

            {mostrarCalendario && (
                <CalendarioModal
                    contas={contas}
                    mes={mes}
                    ano={ano}
                    onFechar={() => setMostrarCalendario(false)}
                />
            )}
        </div>
    );
}
