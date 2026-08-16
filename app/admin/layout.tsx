import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/SignOutButton";
import {
  IconGrid,
  IconBookOpen,
  IconHome,
  IconUsers,
  IconFileText,
  IconMessageCircle,
} from "@/lib/icons";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const [pendingApplications, unreadContactMessages] = await Promise.all([
    prisma.teacherApplication.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const navItems = [
    { href: "/admin", label: "Tableau de bord", Icon: IconHome },
    { href: "/admin/courses", label: "Formations", Icon: IconBookOpen },
    { href: "/admin/categories", label: "Catégories", Icon: IconGrid },
    { href: "/admin/users", label: "Utilisateurs", Icon: IconUsers },
    {
      href: "/admin/teacher-applications",
      label: "Candidatures",
      Icon: IconFileText,
      badge: pendingApplications,
    },
    {
      href: "/admin/contact-messages",
      label: "Contact",
      Icon: IconMessageCircle,
      badge: unreadContactMessages,
    },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex md:w-60 shrink-0 bg-brand-navy flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/">
            <Logo variant="light" />
          </Link>
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
              {!!item.badge && (
                <span className="ml-auto bg-brand-orange text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
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
          <Link href="/">
            <Logo variant="light" />
          </Link>
          <SignOutButton />
        </header>

        {/* Navigation mobile simplifiée */}
        <nav className="md:hidden flex overflow-x-auto gap-2 px-6 py-3 bg-white border-b border-brand-line">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-brand-navy bg-brand-line/50 px-3 py-1.5 rounded-full"
            >
              {item.label}
              {!!item.badge && (
                <span className="bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <main className="p-6 md:p-10 max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
