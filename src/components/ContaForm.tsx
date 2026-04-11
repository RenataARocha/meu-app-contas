"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { contaSchema, type ContaFormData } from "@/schemas/contaSchema";
import type { Conta } from "@/types/conta";

interface Props {
    conta: Conta | null;
    usuarioId: string;
    mes: number;
    ano: number;
    onFechar: () => void;
    onSalvo: () => void;
}



export function ContaForm({ conta, usuarioId, mes, ano, onFechar, onSalvo }: Props) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(contaSchema),
        defaultValues: {
            nome: "",
            valor: "",
            diaVencimento: "",
            banco: "",
            mes,
            ano,
            recorrente: false,
        },
    });

    useEffect(() => {
        if (conta) {
            reset({
                nome: conta.nome,
                valor: conta.valor.toString(),
                diaVencimento: conta.diaVencimento.toString(),
                banco: conta.banco,
                mes: conta.mes,
                ano: conta.ano,
                recorrente: conta.recorrente ?? false,
            });
        } else {
            reset({ nome: "", valor: "", diaVencimento: "", banco: "", mes, ano, recorrente: false });
        }
    }, [conta, reset, mes, ano]);

    async function onSubmit(data: ContaFormData) {
        const payload = {
            ...data,
            valor: parseFloat(data.valor.replace(",", ".")) || 0,
            diaVencimento: parseInt(data.diaVencimento),
            usuarioId,
        };
        if (conta) {
            await fetch(`/api/contas/${conta.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch("/api/contas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
        onSalvo();
        onFechar();
    }

    const campos = [
        { id: "nome" as const, label: "Nome da conta", placeholder: "Ex: Internet, Luz, Aluguel", type: "text" },
        { id: "valor" as const, label: "Valor (R$)", placeholder: "Ex: 150,00", type: "text" },
        { id: "diaVencimento" as const, label: "Dia de vencimento", placeholder: "1 a 31", type: "number" },
        { id: "banco" as const, label: "Banco / Forma de pagamento", placeholder: "Ex: Nubank, Caixa, PIX", type: "text" },
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div
                className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl flex flex-col animate-slide-up"
                style={{ maxHeight: "85dvh" }}
            >

                {/* Header fixo */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                    <h2 id="form-titulo" className="text-base font-semibold">
                        {conta ? "Editar conta" : "Nova conta"}
                    </h2>
                    <button onClick={onFechar} aria-label="Fechar formulário"
                        className="text-muted-foreground hover:text-foreground p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Scroll area — padding bottom garante que os botões fiquem acima da NavBar */}
                <div className="overflow-y-auto flex-1 px-6 pb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {campos.map(({ id, label, placeholder, type }) => (
                            <div key={id}>
                                <label htmlFor={id} className="block text-xs text-muted-foreground mb-1.5">
                                    {label}
                                </label>
                                <input
                                    {...register(id)}
                                    id={id}
                                    type={type}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    className={`w-full px-4 py-3 bg-dark-700 border rounded-xl text-sm
              placeholder:text-muted-foreground focus:outline-none transition-colors
              ${errors[id]
                                            ? "border-destructive focus:ring-1 focus:ring-destructive"
                                            : "border-white/5 focus:ring-1 focus:ring-brand-500"
                                        }`}
                                />
                                {errors[id] && (
                                    <p role="alert" className="text-xs text-destructive mt-1">
                                        {errors[id]?.message}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Recorrente */}
                        <div className="flex items-center gap-3 py-2 px-1">
                            <input
                                {...register("recorrente")}
                                id="recorrente"
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/20 bg-dark-700 accent-brand-500 cursor-pointer"
                            />
                            <label htmlFor="recorrente" className="text-sm text-muted-foreground cursor-pointer select-none">
                                Repetir todo mês automaticamente
                            </label>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-3 pt-2 pb-5">
                            <button
                                type="button"
                                onClick={onFechar}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-sm
                     text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl bg-brand-gradient text-sm font-semibold
                     text-white hover:opacity-90 active:scale-[0.98] transition-all
                     disabled:opacity-50"
                            >
                                {isSubmitting ? "Salvando..." : conta ? "Salvar edição" : "Adicionar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}