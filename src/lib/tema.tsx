"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Tema = "navy" | "midnight" | "roxo";

interface TemaContexto {
    tema: Tema;
    setTema: (t: Tema) => void;
}

const TemaContexto = createContext<TemaContexto>({
    tema: "navy",
    setTema: () => { },
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
    const [tema, setTemaState] = useState<Tema>("navy");

    useEffect(() => {
        const salvo = localStorage.getItem("tema") as Tema | null;
        if (salvo && ["navy", "midnight", "roxo"].includes(salvo)) {
            setTemaState(salvo);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-tema", tema);
        document.body.setAttribute("data-tema", tema);

        const cores: Record<Tema, string> = {
            navy: "hsl(220, 40%, 6%)",
            midnight: "hsl(150, 40%, 3%)",
            roxo: "hsl(270, 25%, 5%)",
        };

        document.body.style.backgroundColor = cores[tema];
        document.body.style.transition = "background-color 0.4s ease";
        localStorage.setItem("tema", tema);
    }, [tema]);

    function setTema(t: Tema) { setTemaState(t); }

    return (
        <TemaContexto.Provider value={{ tema, setTema }}>
            {children}
        </TemaContexto.Provider>
    );
}

export function useTema() {
    return useContext(TemaContexto);
}