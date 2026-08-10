import { prisma } from "@/lib/prisma";
import Logo from "@/components/Logo";
import { IconMedal } from "@/lib/icons";

export default async function VerifyCertificatePage({ params }: { params: { code: string } }) {
  const cert = await prisma.certificate.findUnique({
    where: { verifyCode: params.code },
    include: { course: true, user: true },
  });

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 py-12">
      <Logo variant="light" />

      <div className="mt-10 w-full max-w-sm bg-white rounded-2xl p-8 text-center">
        {cert ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <IconMedal className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="eyebrow text-emerald-600 mb-1">Certificat authentique</p>
            <h1 className="font-display font-bold text-brand-navy text-lg mb-4">{cert.course.title}</h1>
            <div className="border-t border-brand-line pt-4 text-sm text-brand-slate/70 space-y-1">
              <p><strong className="text-brand-navy">{cert.user.name}</strong></p>
              <p>{cert.partnerLabel || "E-Classe RDC"}</p>
              <p>
                Délivré le{" "}
                {new Date(cert.issuedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow text-red-500 mb-1">Certificat introuvable</p>
            <p className="text-sm text-brand-slate/60">
              Ce code de vérification ne correspond à aucun certificat émis par E-Classe RDC.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
