import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const prismaAdapter = {
  async createUser(data: any) {
    return prisma.usuario.create({
      data: {
        email: data.email,
        nome: data.name || "",
        image: data.image || "",
        emailVerified: data.emailVerified,
      },
    });
  },
  async getUser(id: string) {
    const user = await prisma.usuario.findUnique({ where: { id } });
    if (!user) return null;
    return { ...user, name: user.nome, email: user.email ?? "" };
  },
  async getUserByEmail(email: string) {
    console.log("🔍 getUserByEmail chamado com:", email);
    const user = await prisma.usuario.findUnique({ where: { email } });
    console.log("🔍 getUserByEmail resultado:", user);
    if (!user) return null;
    return { ...user, name: user.nome, email: user.email ?? "" };
  },
  async getUserByAccount({ provider, providerAccountId }: any) {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: true },
    });
    if (!account?.user) return null;
    return {
      ...account.user,
      name: account.user.nome,
      email: account.user.email ?? "",
    };
  },
  async updateUser(data: any) {
    const user = await prisma.usuario.update({
      where: { id: data.id },
      data: {
        email: data.email,
        nome: data.name || "",
        image: data.image || "",
        emailVerified: data.emailVerified,
      },
    });
    return { ...user, name: user.nome, email: user.email ?? "" };
  },
  async deleteUser(id: string) {
    return prisma.usuario.delete({ where: { id } });
  },
  async linkAccount(data: any) {
    try {
      console.log("🔵 linkAccount chamado:", data);
      const result = await prisma.account.create({ data });
      console.log("✅ linkAccount sucesso:", result);
      return result;
    } catch (err) {
      console.error("❌ linkAccount ERRO:", err);
      throw err;
    }
  },
  async unlinkAccount({ provider, providerAccountId }: any) {
    return prisma.account.delete({
      where: { provider_providerAccountId: { provider, providerAccountId } },
    });
  },
  async createSession(data: any) {
    try {
      console.log("🔵 createSession chamado:", data);
      const result = await prisma.session.create({ data });
      console.log("✅ createSession sucesso:", result);
      return result;
    } catch (err) {
      console.error("❌ createSession ERRO:", err);
      throw err;
    }
  },
  async getSessionAndUser(sessionToken: string) {
    try {
      console.log("🔵 getSessionAndUser chamado:", sessionToken);
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      console.log("🔵 getSessionAndUser resultado:", session);
      if (!session) return null;
      const user = {
        ...session.user,
        name: session.user.nome,
        email: session.user.email ?? "",
      };
      return { session, user };
    } catch (err) {
      console.error("❌ getSessionAndUser ERRO:", err);
      throw err;
    }
  },
  async updateSession(data: any) {
    return prisma.session.update({
      where: { sessionToken: data.sessionToken },
      data,
    });
  },
  async deleteSession(sessionToken: string) {
    return prisma.session.delete({ where: { sessionToken } });
  },
  async createVerificationToken(data: any) {
    return prisma.verificationToken.create({ data });
  },
  async useVerificationToken({ identifier, token }: any) {
    return prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    });
  },
};

export const authOptions: NextAuthOptions = {
  adapter: prismaAdapter as any,
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // ← força false em dev
      },
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // ← ADICIONA ISSO
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      // ← token, não user
      if (session.user && token.sub) {
        session.user.id = token.sub;
        const usuario = await prisma.usuario.findUnique({
          where: { id: token.sub },
          select: { nome: true, genero: true },
        });
        session.user.nome = usuario?.nome || session.user.name || "";
        session.user.genero = usuario?.genero || "outro";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  events: {
    async signIn({ user, isNewUser }) {
      console.log("🟢 signIn event:", { userId: user.id, isNewUser });
    },
    async session({ session, token }) {
      console.log("🟢 session event");
    },
  },
};
