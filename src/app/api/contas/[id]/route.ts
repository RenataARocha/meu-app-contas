// src/app/api/contas/[id]/route.ts
// PATCH → edita ou marca como pago
// DELETE → exclui a conta

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const conta = await prisma.conta.update({
      where: { id: params.id },
      data: body,
    });

    // Se marcou como recorrente, propaga para o mês seguinte se não existir
    if (body.recorrente === true) {
      const proximoMes = conta.mes === 12 ? 1 : conta.mes + 1;
      const proximoAno = conta.mes === 12 ? conta.ano + 1 : conta.ano;

      const jaExiste = await prisma.conta.findFirst({
        where: {
          usuarioId: conta.usuarioId,
          nome: conta.nome,
          mes: proximoMes,
          ano: proximoAno,
        },
      });

      if (!jaExiste) {
        await prisma.conta.create({
          data: {
            nome: conta.nome,
            valor: conta.valor,
            diaVencimento: conta.diaVencimento,
            banco: conta.banco,
            mes: proximoMes,
            ano: proximoAno,
            recorrente: true,
            pago: false,
            usuarioId: conta.usuarioId,
          },
        });
      }
    }

    return NextResponse.json(conta);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar conta" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await prisma.conta.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir conta" },
      { status: 500 },
    );
  }
}
