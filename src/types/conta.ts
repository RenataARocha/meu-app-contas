export interface Conta {
  id: string;
  nome: string;
  valor: number;
  diaVencimento: number;
  banco: string;
  mes: number;
  ano: number;
  pago: boolean;
  dataPagamento: Date | string | null;
  recorrente: boolean; // ← NOVO
  createdAt: Date | string;
  usuarioId: string;
}

export type CriarContaInput = Omit<
  Conta,
  "id" | "createdAt" | "pago" | "dataPagamento"
>;
export type EditarContaInput = Partial<CriarContaInput>;

export interface MarcarPagoInput {
  pago: boolean;
  dataPagamento: string | null;
}
