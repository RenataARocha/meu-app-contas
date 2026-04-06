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

// Script inline — roda antes do React para evitar flash de tema errado
export const temaScript = `
  (function() {
    try {
      var tema = localStorage.getItem("tema") || "navy";
      if (!["navy","midnight","roxo"].includes(tema)) tema = "navy";

      document.documentElement.setAttribute("data-tema", tema);

      var cores = {
        navy: "#060d18",
        midnight: "#030a08",
        roxo: "#0d0a14"
      };

      document.documentElement.style.backgroundColor = cores[tema];
    } catch(e) {}
  })();
`;

export function TemaProvider({ children }: { children: React.ReactNode }) {
    const [tema, setTemaState] = useState<Tema>(() => {
        if (typeof window !== "undefined") {
            const salvo = localStorage.getItem("tema") as Tema;
            if (salvo && ["navy", "midnight", "roxo"].includes(salvo)) {
                return salvo;
            }
        }
        return "navy";
    });


    useEffect(() => {
        document.documentElement.setAttribute("data-tema", tema);

        const cores: Record<Tema, string> = {
            navy: "#060d18",
            midnight: "#030a08",
            roxo: "#0d0a14",
        };

        // 🔥 AGORA CORRETO — usa só HTML (não usa body)
        document.documentElement.style.backgroundColor = cores[tema];
        document.documentElement.style.transition = "background-color 0.4s ease";

        localStorage.setItem("tema", tema);
    }, [tema]);

    function setTema(t: Tema) {
        setTemaState(t);
    }

    return (
        <TemaContexto.Provider value={{ tema, setTema }}>
            {children}
        </TemaContexto.Provider>
    );
}

export function useTema() {
    return useContext(TemaContexto);
}