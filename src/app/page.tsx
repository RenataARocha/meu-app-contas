// src/app/page.tsx
// Página principal "/"
// Server Component: busca dados no servidor, passa pro Client Component

import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";

export default async function HomePage() {
  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();

  // Busca usuário e contas direto no servidor (sem fetch, mais rápido)
  const usuario = await prisma.usuario.findFirst() as import("@/types/usuario").Usuario | null;

  const contas = usuario
    ? await prisma.conta.findMany({
      where: { mes, ano, usuarioId: usuario.id },
      orderBy: { diaVencimento: "asc" },
    })
    : [];

  return (
    <DashboardClient
      usuarioInicial={usuario}
      contasIniciais={contas}
      mes={mes}
      ano={ano}
    />
  );
}