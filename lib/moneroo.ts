// ============================================================
// Client Moneroo
// Gère Orange Money Congo, Airtel Congo, Vodacom Congo et carte bancaire
// via une page de paiement hébergée (pas besoin de gérer chaque opérateur
// individuellement).
// Documentation : https://docs.moneroo.io
// ============================================================

import crypto from "crypto";

const MONEROO_BASE = "https://api.moneroo.io/v1";

export class MonerooError extends Error {}

export async function initiateMonerooPayment(params: {
  transactionId: string;
  amountCDF: number; // montant en Francs Congolais, unité entière
  description: string;
  customerName: string;
  customerEmail: string;
  returnUrl: string;
}): Promise<{ checkoutUrl: string; monerooPaymentId: string }> {
  const secretKey = process.env.MONEROO_SECRET_KEY;
  if (!secretKey) {
    throw new MonerooError("MONEROO_SECRET_KEY n'est pas configuré dans .env");
  }

  const [firstName, ...rest] = params.customerName.trim().split(" ");
  const lastName = rest.join(" ") || firstName || "Client";

  const res = await fetch(`${MONEROO_BASE}/payments/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: Math.round(params.amountCDF),
      currency: "CDF",
      description: params.description,
      return_url: params.returnUrl,
      customer: {
        email: params.customerEmail,
        first_name: firstName || "Client",
        last_name: lastName,
      },
      metadata: { transaction_id: params.transactionId },
    }),
  });

  const data = await res.json();

  if (!res.ok || !data?.data?.checkout_url) {
    throw new MonerooError(data?.message || "Erreur lors de l'initialisation du paiement Moneroo");
  }

  return { checkoutUrl: data.data.checkout_url as string, monerooPaymentId: data.data.id as string };
}

export async function verifyMonerooTransaction(monerooPaymentId: string) {
  const secretKey = process.env.MONEROO_SECRET_KEY;
  if (!secretKey) {
    throw new MonerooError("MONEROO_SECRET_KEY n'est pas configuré dans .env");
  }

  const res = await fetch(`${MONEROO_BASE}/payments/${monerooPaymentId}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  const data = await res.json();

  return data.data as {
    id: string;
    status: "success" | "pending" | "failed";
    metadata?: { transaction_id?: string };
  };
}

// Vérifie la signature HMAC-SHA256 d'une notification webhook Moneroo, pour
// s'assurer qu'elle provient bien de Moneroo avant d'en tenir compte.
export function verifyMonerooWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.MONEROO_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== receivedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}
