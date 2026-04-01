import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "../components/NavBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MinhasConta$",
  description: "Controle suas contas mensais com estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">
        <main className="max-w-md mx-auto min-h-screen pb-24 px-4 pt-6">
          {children}
        </main>
        <NavBar />
      </body>
    </html>
  );
}