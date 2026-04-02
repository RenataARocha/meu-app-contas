// src/app/api/contas/route.ts
// GET → lista contas do mês/ano (filtros via query params)
// POST → cria nova conta

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const mes = searchParams.get("mes");
        const ano = searchParams.get("ano");
        const usuarioId = searchParams.get("usuarioId");

        // Monta os filtros dinamicamente
        const where: Record<string, unknown> = {};
        if (mes) where.mes = parseInt(mes);
        if (ano) where.ano = parseInt(ano);
        if (usuarioId) where.usuarioId = usuarioId;

        const contas = await prisma.conta.findMany({
            where,
            orderBy: { diaVencimento: "asc" }, // ordena por dia de vencimento
        });

        return NextResponse.json(contas);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar contas" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, valor, diaVencimento, banco, mes, ano, usuarioId } = body;

        // Validação básica no backend (Zod fica no frontend, mas validamos aqui tbm)
        if (!nome || !valor || !diaVencimento || !banco || !mes || !ano || !usuarioId) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
        }

        const conta = await prisma.conta.create({
            data: {
                nome,
                valor: parseFloat(valor),
                diaVencimento: parseInt(diaVencimento),
                banco,
                mes: parseInt(mes),
                ano: parseInt(ano),
                usuarioId,
            },
        });

        return NextResponse.json(conta, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
    }
}