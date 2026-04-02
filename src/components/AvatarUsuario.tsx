// src/components/AvatarUsuario.tsx
// Renderiza avatar SVG baseado no gênero do usuário

interface AvatarUsuarioProps {
    genero: "masculino" | "feminino" | "outro";
    tamanho?: number;
}

export function AvatarUsuario({ genero, tamanho = 44 }: AvatarUsuarioProps) {
    // Avatar feminino
    if (genero === "feminino") {
        return (
            <svg width={tamanho} height={tamanho} viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="22" fill="#1a1a35" />
                <circle cx="22" cy="17" r="8" fill="#f9a8d4" />
                <path d="M6 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#ec4899" />
                {/* cabelo */}
                <path d="M14 14c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#7c3aed" />
                <path d="M12 16c0-1 .5-3 2-4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 16c0-1-.5-3-2-4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                {/* brinco */}
                <circle cx="14" cy="20" r="1.5" fill="#fbbf24" />
                <circle cx="30" cy="20" r="1.5" fill="#fbbf24" />
                {/* borda verde */}
                <circle cx="22" cy="22" r="21" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.6" />
            </svg>
        );
    }

    // Avatar masculino
    if (genero === "masculino") {
        return (
            <svg width={tamanho} height={tamanho} viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="22" fill="#1a1a35" />
                <circle cx="22" cy="17" r="8" fill="#fed7aa" />
                <path d="M6 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#3b82f6" />
                {/* cabelo curto */}
                <path d="M14 14c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1-6 2-8 1s-8 0-8-1z" fill="#1e3a5f" />
                {/* borda verde */}
                <circle cx="22" cy="22" r="21" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.6" />
            </svg>
        );
    }

    // Avatar neutro
    return (
        <svg width={tamanho} height={tamanho} viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="22" fill="#1a1a35" />
            <circle cx="22" cy="17" r="8" fill="#d1d5db" />
            <path d="M6 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#6b7280" />
            <circle cx="22" cy="22" r="21" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.6" />
        </svg>
    );
}