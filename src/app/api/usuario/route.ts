// src/app/api/usuario/route.ts
// GET → busca o usuário (por ora o primeiro cadastrado — login vem depois)
// POST → cria usuário novo

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Por ora sem autenticação: pega o primeiro usuário cadastrado
        const usuario = await prisma.usuario.findFirst();
        if (!usuario) {
            return NextResponse.json(null, { status: 404 });
        }
        return NextResponse.json(usuario);
    } catch {
        return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, genero } = body;

        if (!nome || !genero) {
            return NextResponse.json({ error: "Nome e gênero são obrigatórios" }, { status: 400 });
        }

        const usuario = await prisma.usuario.create({
            data: { nome, genero },
        });

        return NextResponse.json(usuario, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, nome, genero } = body;

        const usuario = await prisma.usuario.update({
            where: { id },
            data: { nome, genero },
        });

        return NextResponse.json(usuario);
    } catch {
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}