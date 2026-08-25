import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import SubscribeButton from "@/components/SubscribeButton";
import { IconMedal } from "@/lib/icons";

export default async function SubscriptionPage() {
  const plans = await prisma.plan.findMany({ orderBy: { priceCDF: "asc" } });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-2">Abonnements</h1>
      <p className="text-sm text-brand-slate/60 mb-8 max-w-md">
        Choisis le plan qui te correspond. Paiement sécurisé via Orange Money, Airtel Money,
        Vodacom ou carte bancaire.
      </p>

      {plans.length === 0 ? (
        <p className="text-sm text-brand-slate/50">
          Aucun plan configuré — lance <code className="bg-brand-line/60 px-1.5 py-0.5 rounded">npm run db:seed</code>.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {plans.map((p) => (
            <div key={p.id} className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/12 flex items-center justify-center mb-4">
                <IconMedal className="w-5 h-5 text-brand-orange" />
              </div>
              <p className="font-display font-bold text-brand-navy text-lg">{p.name}</p>
              <p className="text-sm text-brand-slate/60 mt-1 mb-4">{p.description}</p>
              <p className="font-display font-extrabold text-2xl text-brand-navy mb-5">
                {p.priceCDF === 0 ? "Gratuit" : `${p.priceCDF.toLocaleString("fr-FR")} FC`}
                {p.priceCDF > 0 && <span className="text-sm font-medium text-brand-slate/50"> /{p.durationDays}j</span>}
              </p>

              {p.priceCDF === 0 ? (
                <button
                  disabled
                  className="w-full bg-brand-line text-brand-slate/50 font-semibold py-2.5 rounded-full cursor-not-allowed"
                >
                  Inclus par défaut
                </button>
              ) : (
                <SubscribeButton planId={p.id} />
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav active="/account" />
    </>
  );
}
