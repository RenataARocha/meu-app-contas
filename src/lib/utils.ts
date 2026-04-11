import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarData(data: string | Date | null): string {
  if (!data) return "-";
  return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
}

export function nomeMes(mes: number, ano: number): string {
  return format(new Date(ano, mes - 1, 1), "MMMM yyyy", { locale: ptBR });
}

export function statusVencimento(
  dia: number,
  mes?: number,
  ano?: number,
): {
  texto: string;
  urgencia: "ok" | "proximo" | "hoje" | "atrasado";
} {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const mesRef = mes ?? hoje.getMonth() + 1;
  const anoRef = ano ?? hoje.getFullYear();

  // Se não é o mês atual, só mostra o dia
  if (mesRef !== hoje.getMonth() + 1 || anoRef !== hoje.getFullYear()) {
    return { texto: `Dia ${dia}`, urgencia: "ok" };
  }

  const vencimento = new Date(anoRef, mesRef - 1, dia);
  vencimento.setHours(0, 0, 0, 0);
  const diff = differenceInDays(vencimento, hoje);

  if (diff < 0)
    return { texto: `Atrasado ${Math.abs(diff)}d`, urgencia: "atrasado" };
  if (diff === 0) return { texto: "Vence hoje!", urgencia: "hoje" };
  if (diff <= 5) return { texto: `Vence em ${diff}d`, urgencia: "proximo" };
  return { texto: `Dia ${dia}`, urgencia: "ok" };
}
