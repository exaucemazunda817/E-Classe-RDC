import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeacherApplicationForm from "@/components/TeacherApplicationForm";
import { prisma } from "@/lib/prisma";
import { IconCheckCircle } from "@/lib/icons";

export const metadata = {
  title: "Devenir formateur — E-Classe RDC",
};

const ELIGIBILITY = [
  "Une expertise démontrable dans le domaine que tu souhaites enseigner (diplôme, expérience professionnelle, ou réalisations concrètes).",
  "La capacité à produire un contenu pédagogique clair et structuré (texte et/ou vidéo).",
  "Une connexion internet suffisamment stable pour créer et mettre à jour tes formations.",
  "L'engagement à répondre aux questions des apprenants inscrits à tes formations dans un délai raisonnable.",
  "L'adhésion aux Conditions d'utilisation de la plateforme, notamment sur la propriété intellectuelle du contenu partagé.",
];

const STEPS = [
  "Remplis le formulaire ci-dessous et joins ton CV.",
  "Notre équipe étudie ta candidature.",
  "Si elle est retenue, nous te contactons pour activer ton accès formateur et te confier une formation.",
];

export default async function BecomeTeacherPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <Header />

      <section className="bg-brand-navy">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="eyebrow text-brand-orange mb-2">Rejoindre l'équipe</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
            Devenir formateur sur E-Classe RDC
          </h1>
          <p className="text-white/70 mt-4 leading-relaxed max-w-xl">
            Partage ton savoir avec des milliers d'apprenants congolais. Remplis le formulaire
            ci-dessous pour candidater — notre équipe examine chaque demande individuellement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-brand-line bg-white p-6 mb-6">
          <h2 className="font-display text-lg font-bold text-brand-navy mb-4">
            Conditions d'éligibilité
          </h2>
          <ul className="space-y-3">
            {ELIGIBILITY.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-brand-slate/80">
                <IconCheckCircle className="w-4.5 h-4.5 text-brand-blue shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6 mb-10">
          <h2 className="font-display text-lg font-bold text-brand-navy mb-4">
            Comment ça se passe
          </h2>
          <ol className="space-y-2.5">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-slate/80">
                <span className="w-5 h-5 rounded-full bg-brand-line/60 text-brand-navy text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <h2 className="font-display text-xl font-bold text-brand-navy mb-6">Ta candidature</h2>
        <TeacherApplicationForm categories={categories} />
      </section>

      <Footer />
    </>
  );
}
