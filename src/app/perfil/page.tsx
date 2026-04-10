"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usuarioSchema, type UsuarioFormData } from "@/schemas/usuarioSchema";
import { AvatarUsuario } from "@/components/AvatarUsuario";
import type { Usuario } from "@/types/usuario";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [salvo, setSalvo] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioFormData>({ resolver: zodResolver(usuarioSchema) });

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

    const generoParaAvatar = (generoAtual || usuario?.genero || "outro") as "masculino" | "feminino" | "outro";

    return (
        <main className="max-w-md mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-10"
            aria-label="Configurações de perfil">
            <div className="space-y-6">
                <div className="flex items-start justify-between animate-slide-up"
                    style={{ animationFillMode: "both" }}>
                    <div>
                        <h1 className="text-xl font-semibold">Perfil</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Personalize sua experiência
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


                {/* Avatar */}
                <section aria-label="Prévia do avatar"
                    className="flex flex-col items-center gap-3 py-4 animate-slide-up"
                    style={{ animationDelay: "80ms", animationFillMode: "both" }}>
                    <AvatarUsuario genero={generoParaAvatar} tamanho={80} />
                    <p className="text-sm text-muted-foreground" aria-live="polite">
                        Avatar atual: {generoParaAvatar === "feminino" ? "feminino"
                            : generoParaAvatar === "masculino" ? "masculino" : "neutro"}
                    </p>
                </section>

                {/* Formulário */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-slide-up"
                    style={{ animationDelay: "160ms", animationFillMode: "both" }}
                    noValidate aria-label="Formulário de edição de perfil">

                    <div>
                        <label htmlFor="nome-perfil"
                            className="block text-xs text-muted-foreground mb-1.5">
                            Seu nome <span aria-hidden="true">*</span>
                            <span className="sr-only">(obrigatório)</span>
                        </label>
                        <input
                            {...register("nome")}
                            id="nome-perfil"
                            autoComplete="given-name"
                            placeholder="Como quer ser chamada(o)?"
                            aria-invalid={!!errors.nome}
                            aria-describedby={errors.nome ? "erro-nome" : undefined}
                            className={`w-full px-4 py-3 bg-dark-700 border rounded-xl text-sm
              placeholder:text-muted-foreground focus:outline-none transition-colors
              focus:ring-1 ${errors.nome
                                    ? "border-destructive focus:ring-destructive"
                                    : "border-white/5 focus:ring-brand-500"}`}
                        />
                        {errors.nome && (
                            <p id="erro-nome" role="alert" className="text-xs text-destructive mt-1">
                                {errors.nome.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="genero-perfil"
                            className="block text-xs text-muted-foreground mb-1.5">
                            Gênero <span aria-hidden="true">*</span>
                            <span className="sr-only">(obrigatório)</span>
                        </label>
                        <select {...register("genero")} id="genero-perfil"
                            aria-invalid={!!errors.genero}
                            aria-describedby={errors.genero ? "erro-genero" : undefined}
                            className="w-full px-4 py-3 bg-dark-700 border border-white/5 rounded-xl
                       text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500">
                            <option value="">Selecione...</option>
                            <option value="feminino">Feminino</option>
                            <option value="masculino">Masculino</option>
                            <option value="outro">Prefiro não dizer</option>
                        </select>
                        {errors.genero && (
                            <p id="erro-genero" role="alert" className="text-xs text-destructive mt-1">
                                {errors.genero.message}
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}
                        className="w-full py-3.5 rounded-2xl bg-brand-gradient text-white font-semibold
                     text-sm hover:opacity-90 active:scale-[0.98] transition-all
                     disabled:opacity-50 glow-green focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-brand-500
                     focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900">
                        {isSubmitting ? "Salvando..." : "Salvar alterações"}
                    </button>

                    {salvo && (
                        <p role="status" aria-live="polite"
                            className="text-center text-sm text-brand-400 animate-fade-in">
                            ✓ Perfil atualizado com sucesso!
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
}