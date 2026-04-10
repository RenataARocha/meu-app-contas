import { NextResponse } from "next/server";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function GET(request: Request) {
  // Proteção: só Vercel Cron pode chamar
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const diaAmanha = amanha.getDate();
  const mesAmanha = amanha.getMonth() + 1;
  const anoAmanha = amanha.getFullYear();

  // Busca contas que vencem amanhã e não foram pagas
  const contas = await prisma.conta.findMany({
    where: {
      diaVencimento: diaAmanha,
      mes: mesAmanha,
      ano: anoAmanha,
      pago: false,
    },
    include: {
      usuario: {
        include: { pushSubscriptions: true },
      },
    },
  });

  let enviadas = 0;

  for (const conta of contas) {
    for (const sub of conta.usuario.pushSubscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            title: "💸 Conta vence amanhã!",
            body: `${conta.nome} — R$ ${conta.valor.toFixed(2).replace(".", ",")}`,
            url: "/",
          }),
        );
        enviadas++;
      } catch {
        // Remove assinatura inválida
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      }
    }
  }

  return NextResponse.json({ ok: true, enviadas });
}
