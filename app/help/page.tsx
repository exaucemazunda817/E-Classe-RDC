import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Centre d'aide — E-Classe RDC",
};

const FAQ_SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Démarrer sur E-Classe RDC",
    items: [
      {
        q: "Comment créer un compte ?",
        a: "Clique sur « Créer un compte » en haut du site, renseigne ton nom, ton email et un mot de passe. Tu peux commencer à explorer les formations dès la création de ton compte.",
      },
      {
        q: "Comment m'inscrire à une formation ?",
        a: "Ouvre la page de la formation qui t'intéresse et clique sur « S'inscrire ». Selon la formation, l'accès est gratuit, à l'unité, ou via un abonnement mensuel.",
      },
      {
        q: "J'ai oublié mon mot de passe, que faire ?",
        a: "Sur la page de connexion, utilise le lien « Mot de passe oublié » pour recevoir les instructions de réinitialisation par email.",
      },
    ],
  },
  {
    title: "Paiement et abonnement",
    items: [
      {
        q: "Quels moyens de paiement sont acceptés ?",
        a: "Le mobile money (Orange Money, Airtel Money, M-Pesa) ainsi que la carte bancaire, selon les moyens disponibles au moment du paiement.",
      },
      {
        q: "Puis-je me faire rembourser une formation achetée ?",
        a: "Une formation achetée à l'unité n'est pas remboursable une fois l'accès débloqué. Un abonnement peut être annulé à tout moment ; l'accès reste actif jusqu'à la fin de la période déjà payée. Voir le détail dans les Conditions d'utilisation.",
      },
    ],
  },
  {
    title: "Formations et certificats",
    items: [
      {
        q: "Comment obtenir mon certificat ?",
        a: "Le certificat est délivré automatiquement une fois toutes les leçons d'une formation certifiante terminées. Tu peux le télécharger depuis ton espace « Mes formations ».",
      },
      {
        q: "Comment contacter le formateur d'une formation ?",
        a: "Depuis la page de la formation à laquelle tu es inscrit, utilise le bouton de messagerie pour écrire directement au formateur.",
      },
    ],
  },
  {
    title: "Devenir formateur",
    items: [
      {
        q: "Comment proposer une formation en tant que formateur ?",
        a: "Rends-toi sur la page « Devenir formateur » et remplis le formulaire de candidature avec ton CV. Notre équipe étudie chaque demande avant validation.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <>
      <Header />

      <section className="bg-brand-navy">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="eyebrow text-brand-orange mb-2">Centre d'aide</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
            Comment pouvons-nous t'aider ?
          </h1>
          <p className="text-white/70 mt-4 leading-relaxed max-w-xl">
            Retrouve les réponses aux questions les plus fréquentes sur E-Classe RDC. Tu ne trouves
            pas ce que tu cherches ?{" "}
            <Link href="/contact" className="text-white font-semibold hover:underline">
              Contacte-nous directement.
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 space-y-12">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-lg font-bold text-brand-navy mb-4">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-brand-line bg-white px-5 py-4"
                >
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-brand-navy list-none">
                    {item.q}
                    <span className="text-brand-slate/40 group-open:rotate-45 transition-transform text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-brand-slate/70 leading-relaxed mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-brand-line bg-brand-blue/5 px-6 py-8 text-center">
          <p className="font-display text-lg font-bold text-brand-navy mb-2">
            Tu as encore besoin d'aide ?
          </p>
          <p className="text-sm text-brand-slate/70 mb-5 max-w-md mx-auto">
            Notre équipe te répond directement par email pour toute question qui n'est pas
            couverte ici.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-6 py-2.5 rounded-full"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
