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
            data: body, // aceita qualquer campo parcial (pago, dataPagamento, nome, valor…)
        });

        return NextResponse.json(conta);
    } catch {
        return NextResponse.json({ error: "Erro ao atualizar conta" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: Params) {
    try {
        await prisma.conta.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erro ao excluir conta" }, { status: 500 });
    }
}