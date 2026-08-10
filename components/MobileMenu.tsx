"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/categories", label: "Catégories" },
  { href: "/courses", label: "Formations" },
];

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 flex items-center justify-center text-white"
        aria-label="Menu"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-brand-navy border-t border-white/10 px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/85 text-sm font-medium py-2.5"
            >
              {l.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-white/85 text-sm font-medium py-2.5 border-t border-white/10 mt-1 pt-3"
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
