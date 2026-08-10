"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 py-12 text-center">
          <Logo variant="light" />
          <h1 className="font-display text-xl font-bold text-white mt-8">
            Une erreur est survenue
          </h1>
          <p className="text-white/60 text-sm mt-2 max-w-xs">
            Désolé pour le désagrément. Tu peux réessayer ou revenir à l'accueil.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => reset()}
              className="bg-white/10 hover:bg-white/15 transition-colors text-white font-semibold px-5 py-2.5 rounded-full text-sm"
            >
              Réessayer
            </button>
            <Link
              href="/"
              className="bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-5 py-2.5 rounded-full text-sm"
            >
              Accueil
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
