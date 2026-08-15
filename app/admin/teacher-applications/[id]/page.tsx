import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TeacherApplicationActions from "@/components/admin/TeacherApplicationActions";
import { IconChevronRight, IconFileText } from "@/lib/icons";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-brand-orange/10 text-brand-orange" },
  ACCEPTED: { label: "Acceptée", className: "bg-emerald-50 text-emerald-600" },
  REJECTED: { label: "Refusée", className: "bg-red-50 text-red-500" },
};

export default async function TeacherApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.teacherApplication.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!application) notFound();

  const status = STATUS_LABELS[application.status];
  const existingUser = await prisma.user.findUnique({
    where: { email: application.email },
    select: { role: true },
  });

  return (
    <>
      <Link
        href="/admin/teacher-applications"
        className="inline-flex items-center gap-1 text-sm text-brand-slate/60 hover:text-brand-navy mb-4"
      >
        <IconChevronRight className="w-4 h-4 rotate-180" /> Retour aux candidatures
      </Link>

      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-display text-2xl font-extrabold text-brand-navy">
          {application.fullName}
        </h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      </div>
      <p className="text-sm text-brand-slate/60 mb-8">
        Candidature reçue le{" "}
        {new Date(application.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <InfoBlock label="Email" value={application.email} />
        <InfoBlock label="Téléphone" value={application.phone || "—"} />
        <InfoBlock label="Domaine souhaité" value={application.category.name} />
        <InfoBlock
          label="Compte existant sur la plateforme"
          value={existingUser ? `Oui (rôle actuel : ${existingUser.role})` : "Non, pas encore inscrit"}
        />
      </div>

      {application.portfolioUrl && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-brand-slate/50 uppercase tracking-wide mb-1">
            Portfolio / lien
          </p>
          <a
            href={application.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-blue hover:underline break-all"
          >
            {application.portfolioUrl}
          </a>
        </div>
      )}

      <div className="rounded-2xl border border-brand-line bg-white p-5 mb-4">
        <p className="text-xs font-semibold text-brand-slate/50 uppercase tracking-wide mb-2">
          Expérience / qualifications
        </p>
        <p className="text-sm text-brand-slate/80 leading-relaxed whitespace-pre-wrap">
          {application.experience}
        </p>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-5 mb-6">
        <p className="text-xs font-semibold text-brand-slate/50 uppercase tracking-wide mb-2">
          Motivation
        </p>
        <p className="text-sm text-brand-slate/80 leading-relaxed whitespace-pre-wrap">
          {application.motivation}
        </p>
      </div>

      <a
        href={`/api/admin/teacher-applications/${application.id}/cv`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue border border-brand-line rounded-full px-5 py-2.5 mb-8 hover:border-brand-blue/40 transition-colors"
      >
        <IconFileText className="w-4 h-4" /> Ouvrir le CV ({application.cvFileName})
      </a>

      {application.adminNote && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 mb-6">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
            Motif du refus
          </p>
          <p className="text-sm text-red-600">{application.adminNote}</p>
        </div>
      )}

      <TeacherApplicationActions applicationId={application.id} status={application.status} />
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-4 py-3">
      <p className="text-xs font-semibold text-brand-slate/50 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-brand-navy font-medium truncate">{value}</p>
    </div>
  );
}
