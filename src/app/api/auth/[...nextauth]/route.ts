import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req: Request, res: any) {
  console.log("🔷 NextAuth GET:", req.url);
  return handler(req, res);
}

export async function POST(req: Request, res: any) {
  console.log("🔷 NextAuth POST:", req.url);
  return handler(req, res);
}
