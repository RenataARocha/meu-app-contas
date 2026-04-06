import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { TemaProvider, temaScript } from "@/lib/tema";
import { PwaRegistro } from "@/components/PwaRegistro";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#060d18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MinhasConta$",
  description: "Controle suas contas mensais com estilo",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MinhasConta$",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Script roda antes do React — evita flash de tema errado */}
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body className="antialiased bg-background min-h-screen">
        <TemaProvider>
          <PwaRegistro />
          {children}
          <div className="md:hidden">
            <NavBar />
          </div>
        </TemaProvider>
      </body>
    </html>
  );
}