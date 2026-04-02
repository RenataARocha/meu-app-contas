// src/types/usuario.ts

export interface Usuario {
    id: string;
    nome: string;
    genero: "masculino" | "feminino" | "outro";
    createdAt: string;
}

export type CriarUsuarioInput = Omit<Usuario, "id" | "createdAt">;