import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-brand-navy mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <Logo variant="light" />
          <p className="text-white/60 text-sm mt-4 max-w-xs leading-relaxed">
            La plateforme de formation en ligne pensée pour la RDC — apprenez à votre
            rythme, obtenez un certificat reconnu.
          </p>
        </div>

        <div>
          <p className="eyebrow text-white/40 mb-4">Plateforme</p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/courses" className="text-white/70 hover:text-white">Formations</Link></li>
            <li><Link href="/categories" className="text-white/70 hover:text-white">Catégories</Link></li>
            <li><Link href="/register" className="text-white/70 hover:text-white">Créer un compte</Link></li>
            <li><Link href="/devenir-formateur" className="text-white/70 hover:text-white">Devenir formateur</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-white/40 mb-4">Support</p>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-white/70 hover:text-white">Centre d'aide</a></li>
            <li><Link href="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
            <li><Link href="/terms" className="text-white/70 hover:text-white">Conditions d'utilisation</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} E-Classe RDC. Tous droits réservés.
      </div>
    </footer>
  );
}
