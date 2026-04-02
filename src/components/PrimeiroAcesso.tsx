// src/components/PrimeiroAcesso.tsx
// Tela exibida quando não há usuário cadastrado ainda
// Usuária informa nome e gênero

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usuarioSchema, type UsuarioFormData } from "@/schemas/usuarioSchema";
import type { Usuario } from "@/types/usuario";

interface Props {
    onCriado: (usuario: Usuario) => void;
}

export function PrimeiroAcesso({ onCriado }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
    });

    async function onSubmit(data: UsuarioFormData) {
        const res = await fetch("/api/usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const usuario = await res.json();
        onCriado(usuario);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <h1 className="text-2xl font-bold text-gradient-green mb-2">
                    MinhasConta$
                </h1>
                <p className="text-sm text-muted-foreground">
                    Controle suas contas mensais com estilo
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">
                        Como você quer ser chamada(o)?
                    </label>
                    <input
                        {...register("nome")}
                        placeholder="Seu nome"
                        className="w-full px-4 py-3 bg-dark-700 border border-white/5 rounded-xl
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    {errors.nome && (
                        <p className="text-xs text-destructive mt-1">{errors.nome.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">
                        Gênero (para personalizar seu avatar)
                    </label>
                    <select
                        {...register("genero")}
                        className="w-full px-4 py-3 bg-dark-700 border border-white/5 rounded-xl
                       text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="outro">Prefiro não dizer</option>
                    </select>
                    {errors.genero && (
                        <p className="text-xs text-destructive mt-1">{errors.genero.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-brand-gradient text-white font-semibold
                     text-sm hover:opacity-90 active:scale-[0.98] transition-all
                     disabled:opacity-50 glow-green"
                >
                    {isSubmitting ? "Criando perfil..." : "Começar →"}
                </button>
            </form>
        </div>
    );
}