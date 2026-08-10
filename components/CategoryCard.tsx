import Link from "next/link";
import type { ComponentType } from "react";

export default function CategoryCard({
  name,
  count,
  Icon,
  href,
}: {
  name: string;
  count?: number;
  Icon: ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-blue/40 hover:shadow-sm transition-all"
    >
      <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-blue/8 flex items-center justify-center group-hover:bg-brand-orange/12 transition-colors">
        <Icon className="w-6 h-6 text-brand-blue group-hover:text-brand-orange transition-colors" />
      </div>
      <div>
        <p className="font-display font-bold text-brand-navy leading-tight">{name}</p>
        {count !== undefined && (
          <p className="text-sm text-brand-slate/70 mt-0.5">{count} formations</p>
        )}
      </div>
    </Link>
  );
}
