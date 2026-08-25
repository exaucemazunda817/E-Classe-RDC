import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initiateMonerooPayment, MonerooError } from "@/lib/moneroo";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connecte-toi pour continuer." }, { status: 401 });
  }

  const body = await req.json();
  const { purpose, planId, courseId } = body as {
    purpose: "subscription" | "course";
    planId?: string;
    courseId?: string;
  };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  let amountCDF = 0;
  let description = "";
  let purposeString = "";

  if (purpose === "subscription" && planId) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return NextResponse.json({ error: "Plan introuvable." }, { status: 404 });
    if (plan.priceCDF === 0) {
      return NextResponse.json({ error: "Ce plan est gratuit, aucun paiement requis." }, { status: 400 });
    }
    amountCDF = plan.priceCDF;
    description = `Abonnement ${plan.name} — E-Classe RDC`;
    purposeString = `subscription:${plan.id}`;
  } else if (purpose === "course" && courseId) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Formation introuvable." }, { status: 404 });
    if (course.priceCDF === 0) {
      return NextResponse.json({ error: "Cette formation est gratuite, aucun paiement requis." }, { status: 400 });
    }
    amountCDF = course.priceCDF;
    description = `Formation : ${course.title} — E-Classe RDC`;
    purposeString = `course:${course.id}`;
  } else {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      amountCDF,
      provider: "MONEROO",
      status: "PENDING",
      purpose: purposeString,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const { checkoutUrl, monerooPaymentId } = await initiateMonerooPayment({
      transactionId: payment.id,
      amountCDF,
      description,
      customerName: user.name,
      customerEmail: user.email,
      returnUrl: `${baseUrl}/payment/return?ref=${payment.id}`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerRef: monerooPaymentId },
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    const message = err instanceof MonerooError ? err.message : "Erreur lors de l'initialisation du paiement.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
