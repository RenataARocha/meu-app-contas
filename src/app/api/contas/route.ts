import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes");
    const ano = searchParams.get("ano");

    const where: Record<string, unknown> = { usuarioId: session.user.id };
    if (mes) where.mes = parseInt(mes);
    if (ano) where.ano = parseInt(ano);

    let contas = await prisma.conta.findMany({
      where,
      orderBy: { diaVencimento: "asc" },
    });

    // Se tem mês/ano e não há contas, busca recorrentes de meses anteriores
    if (mes && ano && contas.length === 0) {
      const mesNum = parseInt(mes);
      const anoNum = parseInt(ano);

      // Calcula mês anterior
      const mesAnterior = mesNum === 1 ? 12 : mesNum - 1;
      const anoAnterior = mesNum === 1 ? anoNum - 1 : anoNum;

      const recorrentes = await prisma.conta.findMany({
        where: {
          usuarioId: session.user.id,
          mes: mesAnterior,
          ano: anoAnterior,
          recorrente: true,
        },
        orderBy: { diaVencimento: "asc" },
      });

      // Cria cópias no banco para o novo mês
      if (recorrentes.length > 0) {
        await prisma.conta.createMany({
          data: recorrentes.map(({ id, createdAt, ...c }) => ({
            ...c,
            mes: mesNum,
            ano: anoNum,
            pago: false,
            dataPagamento: null,
          })),
        });

        // Busca as contas recém-criadas
        contas = await prisma.conta.findMany({
          where,
          orderBy: { diaVencimento: "asc" },
        });
      }
    }

    return NextResponse.json(contas);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar contas" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, valor, diaVencimento, banco, mes, ano, recorrente } = body;

    if (!nome || !valor || !diaVencimento || !banco || !mes || !ano) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 },
      );
    }

    const conta = await prisma.conta.create({
      data: {
        nome,
        valor: parseFloat(valor),
        diaVencimento: parseInt(diaVencimento),
        banco,
        mes: parseInt(mes),
        ano: parseInt(ano),
        recorrente: recorrente ?? false,
        usuarioId: session.user.id,
      },
    });

    return NextResponse.json(conta, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}
