import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 py-12 text-center">
      <Logo variant="light" />
      <p className="font-display text-6xl font-extrabold text-white/20 mt-10">404</p>
      <h1 className="font-display text-xl font-bold text-white mt-3">Page introuvable</h1>
      <p className="text-white/60 text-sm mt-2 max-w-xs">
        La page que tu cherches n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-6 py-3 rounded-full mt-8 text-sm"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
