import { z } from "zod";

export const usuarioSchema = z.object({
    nome: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(40, "Nome muito longo"),
    genero: z.enum(["masculino", "feminino", "outro"]),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;