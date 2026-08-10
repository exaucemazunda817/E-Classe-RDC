import { prisma } from "./prisma";
import { checkCinetpayTransaction } from "./cinetpay";
import { enrollUserInCourse } from "./enrollment";

/**
 * Vérifie le statut réel d'un paiement auprès de CinetPay (jamais confiance
 * aveugle dans une notification entrante), puis met à jour la base et
 * débloque l'accès correspondant (abonnement ou formation) si succès.
 * Idempotent : peut être appelée plusieurs fois sans effet de bord.
 */
export async function verifyAndFulfillPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error("Paiement introuvable");

  // Déjà traité — on ne refait rien
  if (payment.status === "SUCCESS") return payment;

  const check = await checkCinetpayTransaction(payment.id);
  const cinetpayStatus = check.data?.status;

  if (cinetpayStatus === "ACCEPTED") {
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        channel: check.data?.payment_method || null,
        providerRef: check.data?.operator_id || null,
      },
    });

    await fulfillPayment(updated);
    return updated;
  }

  if (cinetpayStatus === "REFUSED") {
    return prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
  }

  // Toujours en attente côté CinetPay
  return payment;
}

async function fulfillPayment(payment: { id: string; userId: string; purpose: string; amountUSD: number }) {
  const [kind, refId] = payment.purpose.split(":");

  if (kind === "subscription") {
    const plan = await prisma.plan.findUnique({ where: { id: refId } });
    if (!plan) return;

    // Expire les anciens abonnements actifs avant d'activer le nouveau
    await prisma.subscription.updateMany({
      where: { userId: payment.userId, status: "ACTIVE" },
      data: { status: "EXPIRED" },
    });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await prisma.subscription.create({
      data: {
        userId: payment.userId,
        planId: plan.id,
        endDate,
        status: "ACTIVE",
      },
    });
  }

  if (kind === "course") {
    await enrollUserInCourse(payment.userId, refId);
  }
}
