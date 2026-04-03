"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usuarioSchema, type UsuarioFormData } from "@/schemas/usuarioSchema";
import { AvatarUsuario } from "@/components/AvatarUsuario";
import type { Usuario } from "@/types/usuario";

export default function PerfilPage() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [salvo, setSalvo] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
    });

    const generoAtual = watch("genero");

    useEffect(() => {
        fetch("/api/usuario")
            .then((r) => r.json())
            .then((u) => {
                if (u?.id) {
                    setUsuario(u);
                    reset({ nome: u.nome, genero: u.genero });
                }
            });
    }, [reset]);

    async function onSubmit(data: UsuarioFormData) {
        const res = await fetch("/api/usuario", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: usuario?.id, ...data }),
        });
        const atualizado = await res.json();
        setUsuario(atualizado);
        setSalvo(true);
        setTimeout(() => setSalvo(false), 3000);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold">Perfil</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Personalize sua experiência
                </p>
            </div>

            {/* Avatar preview */}
            <div className="flex flex-col items-center gap-3 py-4">
                <AvatarUsuario
                    genero={(generoAtual || usuario?.genero || "outro") as "masculino" | "feminino" | "outro"}
                    tamanho={80}
                />
                <p className="text-sm text-muted-foreground">
                    O avatar muda conforme o gênero selecionado
                </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">
                        Seu nome
                    </label>
                    <input
                        {...register("nome")}
                        placeholder="Como quer ser chamada(o)?"
                        className={`w-full px-4 py-3 bg-dark-700 border rounded-xl text-sm
              placeholder:text-muted-foreground focus:outline-none transition-colors
              ${errors.nome
                                ? "border-destructive focus:ring-1 focus:ring-destructive"
                                : "border-white/5 focus:ring-1 focus:ring-brand-500"
                            }`}
                    />
                    {errors.nome && (
                        <p className="text-xs text-destructive mt-1">{errors.nome.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">
                        Gênero
                    </label>
                    <select
                        {...register("genero")}
                        className="w-full px-4 py-3 bg-dark-700 border border-white/5 rounded-xl
                       text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                    {isSubmitting ? "Salvando..." : "Salvar alterações"}
                </button>

                {salvo && (
                    <p className="text-center text-sm text-brand-400">
                        ✓ Perfil atualizado com sucesso!
                    </p>
                )}
            </form>
        </div>
    );
}