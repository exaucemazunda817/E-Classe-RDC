import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import { IconMedal, IconDownload } from "@/lib/icons";

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });

  // Génère un QR code réel pour chaque certificat, pointant vers une page de vérification publique
  const certsWithQr = await Promise.all(
    certificates.map(async (cert) => {
      const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify/${cert.verifyCode}`;
      const qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 160 });
      return { ...cert, qr };
    })
  );

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-6">Mes Certificats</h1>

      {certsWithQr.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center max-w-2xl">
          <IconMedal className="w-8 h-8 text-brand-slate/30 mx-auto mb-3" />
          <p className="font-display font-bold text-brand-navy mb-1">Aucun certificat pour l'instant</p>
          <p className="text-sm text-brand-slate/60">
            Termine une formation certifiante pour obtenir ton premier certificat.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {certsWithQr.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border border-brand-line bg-white p-5 flex items-center gap-5"
            >
              <img
                src={cert.qr}
                alt="QR code de vérification"
                className="w-20 h-20 rounded-lg border border-brand-line shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-brand-navy text-sm">{user.name}</p>
                <p className="text-sm text-brand-slate/80 mt-0.5">{cert.course.title}</p>
                <p className="text-xs text-brand-slate/50 mt-0.5">
                  {cert.partnerLabel || "E-Classe RDC"}
                </p>
                <p className="text-xs text-brand-slate/40 mt-2">
                  {new Date(cert.issuedAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <a
                  href={`/verify/${cert.verifyCode}`}
                  target="_blank"
                  className="text-xs font-semibold text-brand-slate/60 hover:text-brand-blue transition-colors px-2"
                >
                  Vérifier
                </a>
                <a
                  href={`/api/certificates/${cert.id}/download`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-navy transition-colors rounded-full px-3 py-2"
                >
                  <IconDownload className="w-3.5 h-3.5" />
                  PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="/account" />
    </>
  );
}
