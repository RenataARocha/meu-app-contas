import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { TemaProvider } from "@/lib/tema";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MinhasConta$",
  description: "Gerencie suas contas mensais com estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`} data-tema="navy">
      <body className="antialiased bg-background min-h-screen">
        <TemaProvider>
          {children}
          <div className="md:hidden">
            <NavBar />
          </div>
        </TemaProvider>
      </body>
    </html>
  );
}