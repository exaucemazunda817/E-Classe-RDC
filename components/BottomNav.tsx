import Link from "next/link";
import { IconHome, IconGrid, IconMedal, IconUser } from "@/lib/icons";

const items = [
  { href: "/", label: "Accueil", Icon: IconHome },
  { href: "/categories", label: "Catégories", Icon: IconGrid },
  { href: "/account/certificates", label: "Certificats", Icon: IconMedal },
  { href: "/account", label: "Mon Espace", Icon: IconUser },
];

export default function BottomNav({ active }: { active: string }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-line md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const isActive = item.href === active;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                isActive ? "text-brand-blue" : "text-brand-slate/50"
              }`}
            >
              <item.Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
