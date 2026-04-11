# MinhasConta$ 💸

> Controle suas contas mensais com estilo — organize, acompanhe e nunca mais pague multa por esquecimento.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://meu-app-contas.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---
## 🎥 Demonstração



https://github.com/user-attachments/assets/3162a031-08ab-4f4f-a372-08e37d3c6b95




---
## 📱 Demo

🔗 **[meu-app-contas.vercel.app](https://meu-app-contas.vercel.app)**

> Acesse com sua conta Google e comece a organizar suas contas em segundos.

---

## ✨ Funcionalidades

- **📋 Dashboard mensal** — visão geral de todas as contas do mês com resumo financeiro (total, pago, pendente)
- **✅ Marcar como pago** — registre a data de pagamento com um clique
- **🔁 Contas recorrentes** — marque uma conta como recorrente e ela aparece automaticamente no mês seguinte
- **📅 Calendário visual** — veja quais dias do mês têm contas vencendo, com status por cor
- **📊 Relatório mensal** — gráficos e análises dos seus gastos
- **🕐 Histórico** — navegue por meses anteriores e consulte o histórico de pagamentos
- **🔔 Notificações push** — receba alertas um dia antes do vencimento, mesmo com o app fechado
- **🎨 Temas personalizáveis** — escolha entre múltiplos temas de cores
- **📲 PWA instalável** — instale no celular como um app nativo
- **🔐 Login com Google** — autenticação segura via OAuth

---

## 🛠️ Tecnologias

| Categoria         | Tecnologia                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| Framework         | [Next.js 14](https://nextjs.org) (App Router)                           |
| Linguagem         | [TypeScript](https://typescriptlang.org)                                |
| Estilização       | [Tailwind CSS](https://tailwindcss.com)                                 |
| Banco de dados    | [PostgreSQL](https://postgresql.org) via [Neon](https://neon.tech)      |
| ORM               | [Prisma 7](https://prisma.io)                                           |
| Autenticação      | [NextAuth.js v4](https://next-auth.js.org) + Google OAuth               |
| Notificações Push | [Web Push](https://www.npmjs.com/package/web-push) + VAPID              |
| Validação         | [Zod](https://zod.dev) + [React Hook Form](https://react-hook-form.com) |
| Ícones            | [Lucide React](https://lucide.dev)                                      |
| Deploy            | [Vercel](https://vercel.com)                                            |
| Cron Jobs         | Vercel Cron                                                             |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Neon](https://neon.tech) (banco PostgreSQL gratuito)
- Credenciais OAuth do [Google Cloud Console](https://console.cloud.google.com)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/meu-app-contas.git
cd meu-app-contas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-secret-aqui"

# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."

# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY="sua-chave-publica"
VAPID_PRIVATE_KEY="sua-chave-privada"
VAPID_SUBJECT="mailto:seu@email.com"

# Cron Secret
CRON_SECRET="sua-senha-secreta"
```

Para gerar as chaves VAPID:

```bash
npx web-push generate-vapid-keys
```

Para gerar o NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Configure o banco de dados

```bash
npx prisma db push
npx prisma generate
```

### 5. Configure o Google OAuth

No [Google Cloud Console](https://console.cloud.google.com):

1. Crie um projeto e ative a API OAuth
2. Em **Credenciais**, crie um **OAuth 2.0 Client ID**
3. Adicione em **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://seu-dominio.vercel.app/api/auth/callback/google`

### 6. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 📂 Estrutura do projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── contas/        # CRUD de contas
│   │   ├── usuario/       # Perfil do usuário
│   │   ├── push/          # Salvar assinatura push
│   │   └── notificacoes/  # Cron job de notificações
│   ├── historico/         # Página de histórico
│   ├── perfil/            # Página de perfil
│   ├── relatorio/         # Página de relatório
│   ├── login/             # Página de login
│   └── page.tsx           # Dashboard principal
├── components/            # Componentes reutilizáveis
├── lib/                   # Configurações (auth, prisma, tema)
├── schemas/               # Schemas de validação Zod
└── types/                 # Tipos TypeScript
```

---

## 🔔 Notificações Push

O app usa **Web Push API** com chaves VAPID para enviar notificações mesmo com o app fechado.

Um **cron job** roda todo dia às 8h (UTC) e envia notificações para contas que vencem no dia seguinte:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/notificacoes/enviar",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## 🌐 Deploy na Vercel

1. Faça fork do repositório
2. Conecte ao [Vercel](https://vercel.com)
3. Adicione todas as variáveis de ambiente nas configurações do projeto
4. Deploy automático a cada `git push`

---

## 📄 Licença

MIT © [Renata Rocha](https://github.com/RenataARocha)

---

<div align="center">
  Feito com 💚 por <strong>Renata Rocha</strong>
  <br/>
  <a href="https://meu-app-contas.vercel.app">Ver demo</a> · 
  <a href="https://www.linkedin.com/in/renata-alexandre-rocha/">LinkedIn</a>
</div>
