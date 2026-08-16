import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IconChevronRight } from "@/lib/icons";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-brand-orange/10 text-brand-orange" },
  ACCEPTED: { label: "Acceptée", className: "bg-emerald-50 text-emerald-600" },
  REJECTED: { label: "Refusée", className: "bg-red-50 text-red-500" },
};

export default async function TeacherApplicationsPage() {
  const applications = await prisma.teacherApplication.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">
        Candidatures formateur
      </h1>
      <p className="text-sm text-brand-slate/60 mb-8">
        {applications.length} candidature(s) • {pendingCount} en attente
      </p>

      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        {applications.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-slate/60">
            Aucune candidature pour l'instant.
          </p>
        ) : (
          applications.map((a, i) => {
            const status = STATUS_LABELS[a.status];
            return (
              <Link
                key={a.id}
                href={`/admin/teacher-applications/${a.id}`}
                className={`flex items-center gap-4 p-4 hover:bg-brand-line/10 transition-colors ${
                  i !== 0 ? "border-t border-brand-line" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-brand-navy truncate">{a.fullName}</p>
                  <p className="text-xs text-brand-slate/50 mt-0.5 truncate">
                    {a.category?.name ?? `${a.customDomain} (autre)`} • {a.email}
                  </p>
                </div>
                <span className="text-xs text-brand-slate/40 shrink-0">
                  {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.className}`}
                >
                  {status.label}
                </span>
                <IconChevronRight className="w-4 h-4 text-brand-slate/30 shrink-0" />
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
