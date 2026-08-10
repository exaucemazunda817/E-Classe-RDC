import { prisma } from "@/lib/prisma";
import { IconUsers, IconBookOpen, IconMedal, IconCreditCard } from "@/lib/icons";

export default async function AdminDashboard() {
  const [userCount, courseCount, certCount, revenueAgg] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.certificate.count(),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amountUSD: true },
    }),
  ]);

  const revenueUSD = (revenueAgg._sum.amountUSD ?? 0) / 100;

  const stats = [
    { label: "Apprenants", value: userCount, Icon: IconUsers },
    { label: "Formations", value: courseCount, Icon: IconBookOpen },
    { label: "Certificats délivrés", value: certCount, Icon: IconMedal },
    { label: "Revenus", value: `${revenueUSD.toFixed(2)} $`, Icon: IconCreditCard },
  ];

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">Tableau de bord</h1>
      <p className="text-sm text-brand-slate/60 mb-8">Vue d'ensemble de la plateforme</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-brand-line bg-white p-5">
            <s.Icon className="w-5 h-5 text-brand-blue mb-3" />
            <p className="font-display font-extrabold text-xl text-brand-navy">{s.value}</p>
            <p className="text-xs text-brand-slate/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}
