import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMonerooWebhookSignature } from "@/lib/moneroo";
import { verifyAndFulfillPayment } from "@/lib/payments";

// Moneroo envoie une notification JSON signée (en-tête X-Moneroo-Signature).
// Par sécurité, on ne fait JAMAIS confiance au contenu de la notification :
// on rappelle l'API Moneroo pour vérifier le statut réel avant de débloquer quoi que ce soit.
// La signature sert uniquement à confirmer que la notification vient bien de Moneroo,
// pas à décider du statut du paiement.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-moneroo-signature");

  if (!verifyMonerooWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 403 });
  }

  let payload: { data?: { id?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const monerooPaymentId = payload.data?.id;
  if (!monerooPaymentId) {
    return NextResponse.json({ error: "Paiement manquant" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { provider: "MONEROO", providerRef: monerooPaymentId },
  });

  if (!payment) {
    // Transaction inconnue de notre côté — on répond 200 pour ne pas faire boucler Moneroo.
    return NextResponse.json({ received: true });
  }

  try {
    await verifyAndFulfillPayment(payment.id);
  } catch (err) {
    console.error("Erreur webhook Moneroo:", err);
  }

  return NextResponse.json({ received: true });
}
