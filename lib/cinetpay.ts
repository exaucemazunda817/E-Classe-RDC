// ============================================================
// Client CinetPay
// Gère Orange Money, Airtel Money, M-Pesa et carte bancaire
// via une page de paiement hébergée (pas besoin de gérer
// chaque opérateur individuellement).
// Documentation : https://docs.cinetpay.com
// ============================================================

const CINETPAY_BASE = "https://api-checkout.cinetpay.com/v2";

export class CinetpayError extends Error {}

export async function initiateCinetpayPayment(params: {
  transactionId: string;
  amountUSD: number; // montant en dollars (unité normale, pas en cents)
  description: string;
  customerName: string;
  customerEmail: string;
  returnUrl: string;
  notifyUrl: string;
}): Promise<string> {
  const apikey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;

  if (!apikey || !siteId) {
    throw new CinetpayError(
      "CINETPAY_API_KEY / CINETPAY_SITE_ID ne sont pas configurés dans .env"
    );
  }

  const res = await fetch(`${CINETPAY_BASE}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey,
      site_id: siteId,
      transaction_id: params.transactionId,
      amount: Math.round(params.amountUSD),
      currency: "USD",
      description: params.description,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      notify_url: params.notifyUrl,
      return_url: params.returnUrl,
      channels: "ALL", // laisse l'utilisateur choisir Orange Money / Airtel Money / M-Pesa / carte
    }),
  });

  const data = await res.json();

  if (data.code !== "201") {
    throw new CinetpayError(data.message || "Erreur lors de l'initialisation du paiement CinetPay");
  }

  return data.data.payment_url as string;
}

export async function checkCinetpayTransaction(transactionId: string) {
  const apikey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;

  const res = await fetch(`${CINETPAY_BASE}/payment/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey,
      site_id: siteId,
      transaction_id: transactionId,
    }),
  });

  return res.json() as Promise<{
    code: string;
    message: string;
    data?: {
      status: "ACCEPTED" | "REFUSED" | "PENDING";
      payment_method?: string;
      operator_id?: string;
    };
  }>;
}
