"use client";

import { useState } from "react";

interface BancoIconProps {
    nome: string;
    tamanho?: number;
    mostrarNome?: boolean;
}

// Logos locais (pasta: /public/bancos)
const logosBancos: Record<string, { url: string; cor: string }> = {
    nubank: { url: "/bancos/nubank.png", cor: "#8A05BE" },
    itau: { url: "/bancos/itau.png", cor: "#EC7000" },
    inter: { url: "/bancos/inter.png", cor: "#FF7A00" },
    c6: { url: "/bancos/c6.png", cor: "#000000" },
    "c6 bank": { url: "/bancos/c6.png", cor: "#000000" },
    neon: { url: "/bancos/neon.png", cor: "#00FF73" },
    picpay: { url: "/bancos/picpay.png", cor: "#21C25E" },
    pagbank: { url: "/bancos/pagbank.png", cor: "#FFD700" },
    santander: { url: "/bancos/santander.png", cor: "#EC0000" },
    bradesco: { url: "/bancos/bradesco.png", cor: "#CC092F" },
    caixa: { url: "/bancos/caixa.png", cor: "#005CA9" },
    bancodobrasil: { url: "/bancos/bancodobrasil.png", cor: "#F9A800" },
    "banco do brasil": { url: "/bancos/bancodobrasil.png", cor: "#F9A800" },
    bb: { url: "/bancos/bancodobrasil.png", cor: "#F9A800" },
    bv: { url: "/bancos/bv.png", cor: "#1E3A8A" },
    citi: { url: "/bancos/citi.png", cor: "#0A66C2" },
    safra: { url: "/bancos/safra.png", cor: "#1E293B" },
    btg: { url: "/bancos/btg.png", cor: "#2563EB" },
    sicredi: { url: "/bancos/sicredi.png", cor: "#5D9B2F" },
    sicoob: { url: "/bancos/sicoob.png", cor: "#006B3F" },
    agi: { url: "/bancos/agi.png", cor: "#2563EB" },
    bmg: { url: "/bancos/bmg.png", cor: "#FF6B00" },
    iti: { url: "/bancos/iti.png", cor: "#FF2D55" },
    next: { url: "/bancos/next.png", cor: "#00FF87" },
    original: { url: "/bancos/original.png", cor: "#00B140" },
    banrisul: { url: "/bancos/banrisul.png", cor: "#005AA7" },
    pan: { url: "/bancos/pan.png", cor: "#FF6B00" },
    "banco pan": { url: "/bancos/pan.png", cor: "#FF6B00" },
    pix: { url: "/bancos/pix.png", cor: "#32BCAD" },
    mercadopago: { url: "/bancos/mercadopago.jpeg", cor: "#00B1EA" },
    "mercado pago": { url: "/bancos/mercadopago.jpeg", cor: "#00B1EA" },
    mp: { url: "/bancos/mercadopago.jpeg", cor: "#00B1EA" },
    novucard: { url: "/bancos/novucard.png", cor: "#7C3AED" },
    "novo card": { url: "/bancos/novucard.png", cor: "#7C3AED" },
};

export function BancoIcon({ nome, tamanho = 20, mostrarNome = false }: BancoIconProps) {
    function normalizarBanco(nome: string) {
        return nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    const chave = normalizarBanco(nome);

    const banco =
        logosBancos[chave] ||
        Object.entries(logosBancos).find(([key]) =>
            chave.includes(key)
        )?.[1];

    const cor = banco?.cor || "#4B5563";
    const logoUrl = banco?.url;
    const inicial = nome.charAt(0).toUpperCase();
    const [imgErro, setImgErro] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                    width: tamanho + 8,
                    height: tamanho + 8,
                    backgroundColor: `${cor}25`,
                    padding: "4px",
                }}
                aria-label={`Banco ${nome}`}
            >
                {logoUrl && !imgErro ? (
                    <img
                        src={logoUrl}
                        alt={nome}
                        width={tamanho}
                        height={tamanho}
                        style={{ objectFit: "contain" }}
                        onError={() => setImgErro(true)}
                    />
                ) : (
                    <span
                        className="font-bold"
                        style={{ fontSize: tamanho * 0.65, color: cor }}
                    >
                        {inicial}
                    </span>
                )}
            </div>

            {mostrarNome && (
                <span className="text-sm text-muted-foreground capitalize">
                    {nome}
                </span>
            )}
        </div>
    );
}