// src/schemas/contaSchema.ts
// Zod valida os dados ANTES de enviar para a API.
// Se algo estiver errado, o React Hook Form mostra o erro no campo certo.

import { z } from "zod";

export const contaSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo"),
  valor: z
    .string()
    .min(1, "Informe o valor")
    .refine(
      (v) =>
        !isNaN(parseFloat(v.replace(",", "."))) &&
        parseFloat(v.replace(",", ".")) > 0,
      "Valor deve ser maior que zero",
    ),
  diaVencimento: z
    .string()
    .min(1, "Informe o dia")
    .refine((v) => {
      const n = parseInt(v);
      return n >= 1 && n <= 31;
    }, "Dia deve ser entre 1 e 31"),
  banco: z
    .string()
    .min(2, "Informe o banco ou forma de pagamento")
    .max(30, "Nome do banco muito longo"),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2020),
  recorrente: z.boolean().optional().default(false),
});

// Tipo inferido automaticamente do schema — não precisa criar à mão
export type ContaFormData = z.infer<typeof contaSchema>;
