import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Pega o cookie correto dependendo do ambiente
    cookieName: req.url.startsWith("https")
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
  });

  const isAuth = !!token;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  if (!isAuth && !isLoginPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|api/contas|api/usuario|api/push|api/notificacoes|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|bancos).*)",
  ],
};
