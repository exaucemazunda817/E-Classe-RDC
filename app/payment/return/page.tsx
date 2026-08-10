import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAndFulfillPayment } from "@/lib/payments";
import Logo from "@/components/Logo";
import { IconMedal } from "@/lib/icons";

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = searchParams.ref;

  let payment = ref ? await prisma.payment.findUnique({ where: { id: ref } }) : null;

  // Filet de sécurité : si le webhook n'est pas encore arrivé (ex. en développement local
  // sans URL publique), on vérifie activement le statut au retour de l'utilisateur.
  if (payment && payment.status === "PENDING") {
    payment = await verifyAndFulfillPayment(payment.id);
  }

  const success = payment?.status === "SUCCESS";
  const failed = payment?.status === "FAILED";

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 py-12">
      <Logo variant="light" />

      <div className="mt-10 w-full max-w-sm bg-white rounded-2xl p-8 text-center">
        {success && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <IconMedal className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="eyebrow text-emerald-600 mb-1">Paiement réussi</p>
            <h1 className="font-display font-bold text-brand-navy text-lg mb-2">Merci !</h1>
            <p className="text-sm text-brand-slate/60 mb-6">
              Ton accès a été activé. Tu peux dès maintenant en profiter.
            </p>
            <Link
              href="/account"
              className="inline-flex bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-6 py-2.5 rounded-full"
            >
              Aller à mon espace
            </Link>
          </>
        )}

        {failed && (
          <>
            <p className="eyebrow text-red-500 mb-1">Paiement échoué</p>
            <h1 className="font-display font-bold text-brand-navy text-lg mb-2">
              Le paiement n'a pas abouti
            </h1>
            <p className="text-sm text-brand-slate/60 mb-6">
              Aucun montant n'a été débité. Tu peux réessayer à tout moment.
            </p>
            <Link
              href="/account/subscription"
              className="inline-flex bg-brand-blue hover:bg-brand-navy transition-colors text-white font-semibold px-6 py-2.5 rounded-full"
            >
              Réessayer
            </Link>
          </>
        )}

        {!success && !failed && (
          <>
            <p className="eyebrow text-amber-600 mb-1">Paiement en attente</p>
            <h1 className="font-display font-bold text-brand-navy text-lg mb-2">
              Confirmation en cours
            </h1>
            <p className="text-sm text-brand-slate/60 mb-6">
              La confirmation de l'opérateur peut prendre quelques instants. Rafraîchis cette
              page dans un moment.
            </p>
            <Link
              href="/account"
              className="inline-flex bg-brand-blue hover:bg-brand-navy transition-colors text-white font-semibold px-6 py-2.5 rounded-full"
            >
              Aller à mon espace
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
