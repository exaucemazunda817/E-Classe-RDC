import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { getCurrentUser } from "@/lib/session";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/categories", label: "Catégories" },
  { href: "/courses", label: "Formations" },
];

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-brand-navy border-b border-white/10 relative">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileMenu isLoggedIn={!!user} />
          <Link href="/">
            <Logo variant="light" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <Link href="/account" className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm font-medium text-white/80">{user.name}</span>
            <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-display font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-brand-orange hover:bg-brand-orangeDark text-white px-4 py-2 rounded-full transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
