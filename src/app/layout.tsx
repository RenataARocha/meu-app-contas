// src/app/layout.tsx
// Estrutura base de TODAS as páginas
// NavBar fica aqui → aparece em todo lugar

import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "MinhasConta$ — Controle de pagamentos",
  description: "Gerencie suas contas mensais com estilo",
  manifest: "/manifest.json", // PWA
  themeColor: "#0a0a0f",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        {/* Conteúdo da página */}
        <main className="max-w-md mx-auto min-h-screen pb-24 px-4 pt-6">
          {children}
        </main>

        {/* NavBar sempre visível no bottom */}
        <NavBar />
      </body>
    </html>
  );
}