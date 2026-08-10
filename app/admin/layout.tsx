import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/SignOutButton";
import { IconGrid, IconBookOpen, IconHome } from "@/lib/icons";

const navItems = [
  { href: "/admin", label: "Tableau de bord", Icon: IconHome },
  { href: "/admin/courses", label: "Formations", Icon: IconBookOpen },
  { href: "/admin/categories", label: "Catégories", Icon: IconGrid },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex md:w-60 shrink-0 bg-brand-navy flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Logo variant="light" />
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.Icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/50 truncate">{user.name}</span>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden h-16 bg-brand-navy flex items-center justify-between px-6 border-b border-white/10">
          <Logo variant="light" />
          <SignOutButton />
        </header>

        {/* Navigation mobile simplifiée */}
        <nav className="md:hidden flex overflow-x-auto gap-2 px-6 py-3 bg-white border-b border-brand-line">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 text-xs font-semibold text-brand-navy bg-brand-line/50 px-3 py-1.5 rounded-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="p-6 md:p-10 max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
