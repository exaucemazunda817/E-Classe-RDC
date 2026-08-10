import { NextResponse } from "next/server";
import { verifyAndFulfillPayment } from "@/lib/payments";

// CinetPay envoie une notification en x-www-form-urlencoded contenant
// cpm_trans_id (l'identifiant de transaction qu'on lui a fourni).
// Par sécurité, on ne fait JAMAIS confiance au contenu de la notification :
// on rappelle l'API CinetPay pour vérifier le statut réel avant de débloquer quoi que ce soit.
export async function POST(req: Request) {
  let transactionId: string | null = null;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    transactionId = body.cpm_trans_id || body.transaction_id || null;
  } else {
    const formData = await req.formData();
    transactionId = (formData.get("cpm_trans_id") as string) || null;
  }

  if (!transactionId) {
    return NextResponse.json({ error: "Transaction manquante" }, { status: 400 });
  }

  try {
    await verifyAndFulfillPayment(transactionId);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Erreur webhook CinetPay:", err);
    // On répond 200 quand même pour éviter que CinetPay ne boucle indéfiniment sur une erreur de notre côté ;
    // l'utilisateur pourra toujours déclencher une re-vérification via la page de retour.
    return NextResponse.json({ received: true });
  }
}
