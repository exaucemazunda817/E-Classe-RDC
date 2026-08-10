import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import { IconCreditCard } from "@/lib/icons";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-amber-50 text-amber-700",
  FAILED: "bg-red-50 text-red-700",
};

const statusLabels: Record<string, string> = {
  SUCCESS: "Réussi",
  PENDING: "En attente",
  FAILED: "Échoué",
};

export default async function PurchasesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-6">Mes Achats</h1>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center max-w-2xl">
          <IconCreditCard className="w-8 h-8 text-brand-slate/30 mx-auto mb-3" />
          <p className="font-display font-bold text-brand-navy mb-1">Aucun achat pour l'instant</p>
          <p className="text-sm text-brand-slate/60">
            Ton historique d'abonnements et de formations payantes apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-line bg-white overflow-hidden max-w-2xl">
          {payments.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 p-4 ${i !== 0 ? "border-t border-brand-line" : ""}`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand-blue/8 flex items-center justify-center shrink-0">
                <IconCreditCard className="w-4.5 h-4.5 text-brand-blue" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-brand-navy truncate">{p.purpose}</p>
                <p className="text-xs text-brand-slate/50 mt-0.5">
                  {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[p.status]}`}>
                {statusLabels[p.status]}
              </span>
              <span className="font-display font-bold text-brand-navy text-sm shrink-0 w-16 text-right">
                {(p.amountUSD / 100).toFixed(2)} $
              </span>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="/account" />
    </>
  );
}
