import Link from "next/link";
import { IconPlay, IconMedal } from "@/lib/icons";

const typeLabels: Record<string, { label: string; color: string }> = {
  GRATUITE: { label: "Gratuite", color: "bg-emerald-50 text-emerald-700" },
  ABORDABLE: { label: "Abordable", color: "bg-blue-50 text-blue-700" },
  CERTIFIANTE: { label: "Certifiante", color: "bg-amber-50 text-amber-700" },
  EXPERTE: { label: "Experte", color: "bg-purple-50 text-purple-700" },
};

export default function CourseCard({
  id,
  title,
  category,
  level,
  type,
  priceCDF,
  certifying,
  instructor,
}: {
  id: string;
  title: string;
  category: string;
  level: string;
  type: string;
  priceCDF: number;
  certifying: boolean;
  instructor?: string | null;
}) {
  const badge = typeLabels[type] ?? typeLabels.GRATUITE;

  return (
    <Link
      href={`/courses/${id}`}
      className="group block rounded-2xl border border-brand-line bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {/* Bandeau supérieur : plus de dessin, un motif géométrique sobre en dégradé de marque */}
      <div className="relative h-28 bg-gradient-to-br from-brand-navy to-brand-blue overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
          <defs>
            <pattern id={`grid-${id}`} width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
        </svg>
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
          <IconPlay className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="p-5">
        <p className="eyebrow text-brand-blue/70 mb-1.5">{category}</p>
        <h3 className="font-display font-bold text-brand-navy leading-snug group-hover:text-brand-blue transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-line">
          <div className="flex items-center gap-3 text-xs text-brand-slate/70">
            <span className="capitalize">{level.toLowerCase()}</span>
            {certifying && (
              <span className="flex items-center gap-1">
                <IconMedal className="w-3.5 h-3.5" /> Certificat
              </span>
            )}
          </div>
          <span className="font-display font-bold text-brand-navy">
            {priceCDF === 0 ? "Gratuit" : `${priceCDF.toLocaleString("fr-FR")} FC`}
          </span>
        </div>
      </div>
    </Link>
  );
}
