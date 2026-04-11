import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { TemaProvider, temaScript } from "@/lib/tema";
import { PwaRegistro } from "@/components/PwaRegistro";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#060d18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MinhasConta$ — Controle suas contas mensais",
  description: "Organize e acompanhe suas contas mensais de forma simples e visual. Vencimentos, pagamentos e recorrências em um só lugar.",
  manifest: "/manifest.json",
  keywords: ["controle financeiro", "contas mensais", "finanças pessoais", "organizar contas", "vencimentos"],
  authors: [{ name: "Renata Rocha" }],
  creator: "Renata Rocha",

  openGraph: {
    title: "MinhasConta$ — Controle suas contas mensais",
    description: "Organize suas contas mensais de forma simples e visual. Acompanhe vencimentos, marque pagamentos e receba notificações antes do prazo.",
    url: "https://meu-app-contas.vercel.app",
    siteName: "MinhasConta$",
    images: [
      {
        url: "https://meu-app-contas.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "MinhasConta$ — Controle suas contas mensais",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MinhasConta$ — Controle suas contas mensais",
    description: "Organize suas contas mensais de forma simples e visual. Acompanhe vencimentos, marque pagamentos e receba notificações antes do prazo.",
    images: ["https://meu-app-contas.vercel.app/og-image.png"],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MinhasConta$",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Script roda antes do React — evita flash de tema errado */}
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body className="antialiased bg-background min-h-screen">
        <SessionProviderWrapper>
          <TemaProvider>
            <PwaRegistro />
            {children}
            <div className="md:hidden">
              <NavBar />
            </div>
          </TemaProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}