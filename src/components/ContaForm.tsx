// src/components/ContaForm.tsx
// Modal de adicionar/editar conta
// useForm + zodResolver para validação automática

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { contaSchema, type ContaFormData } from "@/schemas/contaSchema";
import type { Conta } from "@/types/contas";

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
    } = useForm<ContaFormData>({
        resolver: zodResolver(contaSchema),
        defaultValues: {
            nome: conta?.nome ?? "",
            valor: conta?.valor.toString() ?? "",
            diaVencimento: conta?.diaVencimento.toString() ?? "",
            banco: conta?.banco ?? "",
            mes,
            ano,
        },
    });

    // Preenche o form quando está editando
    useEffect(() => {
        if (conta) {
            reset({
                nome: conta.nome,
                valor: conta.valor.toString(),
                diaVencimento: conta.diaVencimento.toString(),
                banco: conta.banco,
                mes: conta.mes,
                ano: conta.ano,
            });
        }
    }, [conta, reset]);

    async function onSubmit(data: ContaFormData) {
        const payload = {
            ...data,
            valor: parseFloat(data.valor.replace(",", ".")),
            diaVencimento: parseInt(data.diaVencimento),
            usuarioId,
        };

        if (conta) {
            // Editando
            await fetch(`/api/contas/${conta.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            // Criando
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
        {
            id: "nome" as const,
            label: "Nome da conta",
            placeholder: "Ex: Internet, Luz, Aluguel",
            type: "text",
        },
        {
            id: "valor" as const,
            label: "Valor (R$)",
            placeholder: "0,00",
            type: "text",
            inputMode: "decimal" as const,
        },
        {
            id: "diaVencimento" as const,
            label: "Dia de vencimento",
            placeholder: "1 a 31",
            type: "number",
        },
        {
            id: "banco" as const,
            label: "Banco / Forma de pagamento",
            placeholder: "Ex: Nubank, Caixa, PIX",
            type: "text",
        },
    ];

    return (
        // Fundo escuro (faux modal)
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div className="w-full max-w-md bg-dark-800 rounded-t-3xl border-t border-white/10 p-6 space-y-5">
                {/* Header do modal */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">
                        {conta ? "Editar conta" : "Nova conta"}
                    </h2>
                    <button onClick={onFechar} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {campos.map(({ id, label, placeholder, type, inputMode }) => (
                        <div key={id}>
                            <label className="block text-xs text-muted-foreground mb-1.5">
                                {label}
                            </label>
                            <input
                                {...register(id)}
                                type={type}
                                inputMode={inputMode}
                                placeholder={placeholder}
                                className={`w-full px-4 py-3 bg-dark-700 border rounded-xl text-sm
                  placeholder:text-muted-foreground focus:outline-none transition-colors
                  ${errors[id]
                                        ? "border-destructive focus:ring-1 focus:ring-destructive"
                                        : "border-white/5 focus:ring-1 focus:ring-brand-500"
                                    }`}
                            />
                            {errors[id] && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors[id]?.message}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-3 pt-2">
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
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}