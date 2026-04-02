// src/components/BancoIcon.tsx
// Renderiza o ícone oficial do banco com a cor correta
// Usa react-icons/si (Simple Icons = logos de marcas)

import * as Si from "react-icons/si";
import { getBancoInfo } from "@/lib/bancos";

interface BancoIconProps {
    nome: string;
    tamanho?: number;
    mostrarNome?: boolean;
}

export function BancoIcon({ nome, tamanho = 20, mostrarNome = false }: BancoIconProps) {
    const info = getBancoInfo(nome);

    // Busca o componente do ícone dinamicamente pelo nome
    // Ex: "SiNubank" → Si.SiNubank
    const IconComponent = (Si as Record<string, React.ComponentType<{ size: number; color: string }>>)[info.icone];

    return (
        <div className="flex items-center gap-2">
            <div
                className="flex items-center justify-center rounded-lg p-1.5"
                style={{ backgroundColor: `${info.cor}20` }} // 20 = 12% opacity
            >
                {IconComponent ? (
                    <IconComponent size={tamanho} color={info.cor} />
                ) : (
                    // Fallback: círculo colorido com inicial do banco
                    <div
                        className="rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                            width: tamanho,
                            height: tamanho,
                            backgroundColor: info.cor,
                            color: info.corTexto,
                        }}
                    >
                        {nome.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            {mostrarNome && (
                <span className="text-sm text-muted-foreground capitalize">{nome}</span>
            )}
        </div>
    );
}