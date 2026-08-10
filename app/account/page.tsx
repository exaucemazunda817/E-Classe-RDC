import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import {
  IconPlay,
  IconCreditCard,
  IconMedal,
  IconMessageCircle,
  IconChevronRight,
  IconUser,
} from "@/lib/icons";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeSub, enrollments, certCount, unread] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { endDate: "desc" },
    }),
    prisma.enrollment.findMany({ where: { userId: user.id } }),
    prisma.certificate.count({ where: { userId: user.id } }),
    prisma.message.count({ where: { userId: user.id, read: false } }),
  ]);

  const inProgress = enrollments.filter((e) => !e.completed).length;

  let daysLeft = 0;
  let progressPct = 0;
  if (activeSub) {
    const total = activeSub.plan.durationDays;
    const remainingMs = new Date(activeSub.endDate).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
    progressPct = Math.min(100, Math.max(0, 100 - (daysLeft / total) * 100));
  }

  return (
    <>
      <div className="max-w-2xl">
        {/* ---------- PROFIL ---------- */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-display font-bold text-xl shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg text-brand-navy truncate">{user.name}</h1>
            <p className="text-sm text-brand-slate/70 truncate">{user.email}</p>
          </div>
          <Link
            href="/account/profile"
            className="ml-auto shrink-0 text-sm font-semibold text-brand-blue border border-brand-line rounded-full px-4 py-2 hover:border-brand-blue/40 transition-colors flex items-center gap-1"
          >
            Modifier
            <IconChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-2xl bg-brand-navy px-5 py-4 mb-6 text-white"
          >
            <span className="text-sm font-semibold">Accéder à l'interface d'administration</span>
            <IconChevronRight className="w-4 h-4" />
          </Link>
        )}

        {/* ---------- ABONNEMENT ---------- */}
        {activeSub ? (
          <div className="rounded-2xl bg-brand-navy p-6 mb-8 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" preserveAspectRatio="none">
              <defs>
                <pattern id="sub-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sub-grid)" />
            </svg>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Abonnement actif</p>
                <div className="flex items-center gap-2">
                  <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded">
                    {activeSub.plan.name.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <p className="relative text-white/50 text-xs mt-4">
              Expire le {new Date(activeSub.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="relative mt-2">
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-orange rounded-full"
                  style={{ width: `${100 - progressPct}%` }}
                />
              </div>
              <p className="text-white/50 text-xs mt-1.5">{daysLeft} jours restants</p>
            </div>
            <Link
              href="/account/subscription"
              className="relative mt-5 flex items-center justify-center w-full bg-white/10 hover:bg-white/15 transition-colors text-white text-sm font-semibold py-2.5 rounded-full"
            >
              Renouveler mon abonnement
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-line bg-white p-6 mb-8 text-center">
            <p className="font-display font-bold text-brand-navy mb-1">Aucun abonnement actif</p>
            <p className="text-sm text-brand-slate/60 mb-4">
              Passe au plan PRO pour accéder aux formations certifiantes et expertes.
            </p>
            <Link
              href="/account/subscription"
              className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              Voir les abonnements
            </Link>
          </div>
        )}

        {/* ---------- LIENS RAPIDES ---------- */}
        <div className="space-y-3">
          <QuickLink
            href="/account/courses"
            Icon={IconPlay}
            title="Mes Formations"
            subtitle={`${enrollments.length} cours suivis • ${inProgress} en cours`}
          />
          <QuickLink
            href="/account/purchases"
            Icon={IconCreditCard}
            title="Mes Achats"
            subtitle="Historique des achats et abonnements"
          />
          <QuickLink
            href="/account/certificates"
            Icon={IconMedal}
            title="Mes Certificats"
            subtitle={`${certCount} certificat${certCount > 1 ? "s" : ""} obtenu${certCount > 1 ? "s" : ""}`}
          />
          <QuickLink
            href="/account/messages"
            Icon={IconMessageCircle}
            title="Messages"
            subtitle={unread > 0 ? `${unread} nouveau${unread > 1 ? "x" : ""} message${unread > 1 ? "s" : ""}` : "Aucun nouveau message"}
            badge={unread}
          />
        </div>
      </div>

      <BottomNav active="/account" />
    </>
  );
}

function QuickLink({
  href,
  Icon,
  title,
  subtitle,
  badge,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-4 hover:border-brand-blue/40 hover:shadow-sm transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-blue/8 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-blue" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-brand-navy text-sm">{title}</p>
        <p className="text-xs text-brand-slate/60 mt-0.5 truncate">{subtitle}</p>
      </div>
      {!!badge && badge > 0 && (
        <span className="bg-brand-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
          {badge}
        </span>
      )}
      <IconChevronRight className="w-4 h-4 text-brand-slate/40 shrink-0" />
    </Link>
  );
}
