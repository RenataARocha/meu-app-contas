// src/lib/bancos.ts
// Mapeamento de bancos brasileiros → cor e ícone (react-icons/si)
// Si = Simple Icons (logos oficiais de marcas)

export interface BancoInfo {
    cor: string;
    corTexto: string;
    icone: string; // nome do ícone no react-icons/si
}

export const bancosMap: Record<string, BancoInfo> = {
    nubank: { cor: "#8A05BE", corTexto: "#ffffff", icone: "SiNubank" },
    itaú: { cor: "#EC7000", corTexto: "#ffffff", icone: "SiItau" },
    itau: { cor: "#EC7000", corTexto: "#ffffff", icone: "SiItau" },
    bradesco: { cor: "#CC092F", corTexto: "#ffffff", icone: "SiBradesco" },
    inter: { cor: "#FF7A00", corTexto: "#ffffff", icone: "SiBancodointer" },
    santander: { cor: "#EC0000", corTexto: "#ffffff", icone: "SiSantander" },
    caixa: { cor: "#005CA9", corTexto: "#ffffff", icone: "SiCaixaeconomicafederal" },
    "c6 bank": { cor: "#1A1A1A", corTexto: "#FFD700", icone: "SiC6bank" },
    c6: { cor: "#1A1A1A", corTexto: "#FFD700", icone: "SiC6bank" },
    picpay: { cor: "#21C25E", corTexto: "#ffffff", icone: "SiPicpay" },
    mercadopago: { cor: "#00B1EA", corTexto: "#ffffff", icone: "SiMercadopago" },
    sicoob: { cor: "#006B3F", corTexto: "#ffffff", icone: "SiSicoob" },
    "banco do brasil": { cor: "#FEDF01", corTexto: "#003087", icone: "SiBancodobrasil" },
    bb: { cor: "#FEDF01", corTexto: "#003087", icone: "SiBancodobrasil" },
    xp: { cor: "#000000", corTexto: "#ffffff", icone: "SiXp" },
    pix: { cor: "#32BCAD", corTexto: "#ffffff", icone: "SiPix" },
};

// Busca info do banco — case insensitive, com fallback
export function getBancoInfo(nomeBanco: string): BancoInfo {
    const chave = nomeBanco.toLowerCase().trim();
    return (
        bancosMap[chave] ?? {
            cor: "#4B5563",
            corTexto: "#ffffff",
            icone: "SiRevolut", // ícone genérico de fallback
        }
    );
}