import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";
import type { Usuario } from "@/types/usuario";
import type { Conta } from "@/types/conta";


export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();

  // Verifica contas recorrentes do mês anterior
  const mesAnterior = mes === 1 ? 12 : mes - 1;
  const anoAnterior = mes === 1 ? ano - 1 : ano;

  const contasRecorrentes = await prisma.conta.findMany({
    where: {
      usuarioId: session.user.id,
      mes: mesAnterior,
      ano: anoAnterior,
      recorrente: true,
    },
  });

  // Cria no mês atual as que ainda não existem
  for (const conta of contasRecorrentes) {
    const jaExiste = await prisma.conta.findFirst({
      where: {
        usuarioId: session.user.id,
        nome: conta.nome,
        mes,
        ano,
      },
    });

    if (!jaExiste) {
      await prisma.conta.create({
        data: {
          nome: conta.nome,
          valor: conta.valor,
          diaVencimento: conta.diaVencimento,
          banco: conta.banco,
          mes,
          ano,
          recorrente: true,
          usuarioId: session.user.id,
        },
      });
    }
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
  });

  const contas = await prisma.conta.findMany({
    where: { mes, ano, usuarioId: session.user.id },
    orderBy: { diaVencimento: "asc" },
  });

  return (
    <DashboardClient
      usuarioInicial={usuario as any}
      contasIniciais={contas as any}
      mes={mes}
      ano={ano}
    />
  );
}