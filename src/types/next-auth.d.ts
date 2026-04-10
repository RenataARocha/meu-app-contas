import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nome: string;
      genero: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}
