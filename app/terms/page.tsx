import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Conditions d'utilisation — E-Classe RDC",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="eyebrow text-brand-blue mb-2">Informations légales</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy mb-2">
          Conditions d'utilisation
        </h1>
        <p className="text-sm text-brand-slate/60 mb-12">Dernière mise à jour : 12 août 2026</p>

        <div className="space-y-10 text-sm text-brand-slate/80 leading-relaxed">
          <Article number="1" title="Objet">
            <p>
              Les présentes Conditions d'utilisation régissent l'accès et l'utilisation de la
              plateforme E-Classe RDC (le « Site »), accessible à l'adresse{" "}
              <span className="font-semibold text-brand-navy">
                https://e-classe-rdc-en69.vercel.app
              </span>
              , éditée par <span className="font-semibold text-brand-navy">E-Classe RDC</span>.
              En créant un compte ou en utilisant le Site, vous acceptez sans réserve les présentes
              conditions. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Site.
            </p>
          </Article>

          <Article number="2" title="Description du service">
            <p>
              E-Classe RDC est une plateforme de formation en ligne proposant des cours accessibles
              gratuitement, à l'unité, ou via un abonnement mensuel. Certaines formations donnent lieu,
              après achèvement, à la délivrance d'un certificat vérifiable par QR code.
            </p>
          </Article>

          <Article number="3" title="Création de compte">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                L'inscription est ouverte à toute personne capable de s'engager contractuellement.
                Les mineurs doivent obtenir l'autorisation d'un parent ou tuteur légal avant de créer
                un compte.
              </li>
              <li>
                Vous vous engagez à fournir des informations exactes lors de l'inscription et à les
                maintenir à jour.
              </li>
              <li>
                Vous êtes seul responsable de la confidentialité de votre mot de passe et de toute
                activité effectuée depuis votre compte. Contactez-nous immédiatement en cas
                d'utilisation non autorisée.
              </li>
              <li>Un compte est personnel et ne peut être partagé ni cédé à un tiers.</li>
            </ul>
          </Article>

          <Article number="4" title="Abonnements, achats et paiement">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Les prix des formations et des abonnements sont indiqués en Francs Congolais (FC)
                et affichés avant tout achat.
              </li>
              <li>
                Les paiements sont traités par un prestataire tiers (mobile money : Orange Money,
                Airtel Money, Vodacom ; ou carte bancaire). E-Classe RDC ne stocke aucune donnée
                bancaire ou de paiement.
              </li>
              <li>
                Un abonnement se renouvelle pour la durée indiquée lors de la souscription. Aucun
                renouvellement automatique n'a lieu sans une action explicite de votre part.
              </li>
              <li>
                <span className="font-semibold text-brand-navy">Remboursement :</span> une formation
                achetée à l'unité n'est pas remboursable une fois l'accès débloqué. Un abonnement peut
                être annulé à tout moment depuis votre espace personnel ; l'accès reste actif jusqu'à
                la fin de la période déjà payée, sans reconduction ni prélèvement supplémentaire.
              </li>
            </ul>
          </Article>

          <Article number="5" title="Certificats">
            <p>
              Les certificats délivrés à l'issue d'une formation certifiante attestent de la
              complétion du contenu proposé sur la plateforme. Ils sont vérifiables publiquement via
              leur code QR. E-Classe RDC ne garantit pas la reconnaissance de ces certificats par un
              employeur, un établissement scolaire ou une autorité administrative.
            </p>
          </Article>

          <Article number="6" title="Formateurs et contenu des formations">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Certaines formations sont dispensées par des formateurs indépendants, identifiés sur
                la page de la formation concernée.
              </li>
              <li>
                Chaque formateur est responsable de l'exactitude, de la qualité et de la légalité du
                contenu qu'il publie. E-Classe RDC agit comme intermédiaire technique et ne garantit
                pas l'exhaustivité ou l'exactitude du contenu pédagogique.
              </li>
              <li>
                Le contenu des formations (textes, vidéos, supports) est protégé par le droit
                d'auteur. Toute reproduction ou diffusion en dehors du cadre d'un usage personnel est
                interdite sans autorisation.
              </li>
            </ul>
          </Article>

          <Article number="7" title="Messagerie entre apprenants et formateurs">
            <p>
              La messagerie intégrée est réservée aux échanges liés au contenu d'une formation. Il est
              interdit d'y tenir des propos injurieux, discriminatoires, frauduleux ou sans rapport
              avec la formation. E-Classe RDC se réserve le droit de suspendre l'accès à la messagerie,
              voire au compte, en cas de non-respect de cette règle.
            </p>
          </Article>

          <Article number="8" title="Usage interdit">
            <p className="mb-2">Il est interdit d'utiliser le Site pour :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Diffuser un contenu illicite, trompeur ou portant atteinte aux droits d'un tiers ;</li>
              <li>Tenter d'accéder sans autorisation à des données ou comptes d'autres utilisateurs ;</li>
              <li>
                Perturber le fonctionnement technique du Site (intrusion, surcharge délibérée,
                contournement des mesures de sécurité) ;
              </li>
              <li>Revendre ou redistribuer l'accès à une formation sans autorisation.</li>
            </ul>
          </Article>

          <Article number="9" title="Données personnelles">
            <p>
              E-Classe RDC collecte les données nécessaires au fonctionnement du service : nom,
              adresse email, historique de progression, certificats obtenus et informations de
              paiement transmises par le prestataire tiers (hors coordonnées bancaires). Ces données
              ne sont ni vendues ni transmises à des tiers en dehors de ce qui est strictement
              nécessaire au fonctionnement du service (ex. prestataire de paiement). Vous pouvez à
              tout moment demander l'accès, la correction ou la suppression de vos données en nous
              contactant à l'adresse indiquée à l'article 14.
            </p>
          </Article>

          <Article number="10" title="Suspension et résiliation">
            <p>
              E-Classe RDC se réserve le droit de suspendre ou de résilier tout compte en cas de
              violation des présentes conditions, sans préavis en cas de manquement grave. Vous
              pouvez demander la suppression de votre compte à tout moment en nous contactant.
            </p>
          </Article>

          <Article number="11" title="Limitation de responsabilité">
            <p>
              Le Site est fourni « en l'état ». E-Classe RDC met en œuvre des moyens raisonnables pour
              assurer la disponibilité et la sécurité du service, sans garantir une disponibilité
              ininterrompue. E-Classe RDC ne saurait être tenue responsable des dommages indirects
              résultant de l'utilisation du Site, dans la limite permise par la loi applicable.
            </p>
          </Article>

          <Article number="12" title="Modification des conditions">
            <p>
              Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront informés
              de toute modification substantielle par un avis sur le Site. La poursuite de
              l'utilisation du Site après modification vaut acceptation des nouvelles conditions.
            </p>
          </Article>

          <Article number="13" title="Droit applicable">
            <p>
              Les présentes conditions sont régies par le droit de la République Démocratique du
              Congo. Tout litige relève de la compétence exclusive des juridictions congolaises,
              sauf disposition légale contraire.
            </p>
          </Article>

          <Article number="14" title="Contact">
            <p>
              Pour toute question relative à ces conditions, vous pouvez nous écrire à{" "}
              <a
                href="mailto:exaucemazunda817@gmail.com"
                className="font-semibold text-brand-blue hover:underline"
              >
                exaucemazunda817@gmail.com
              </a>
              .
            </p>
          </Article>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Article({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-navy mb-3">
        {number}. {title}
      </h2>
      {children}
    </div>
  );
}
