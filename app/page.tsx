import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import CourseCard from "@/components/CourseCard";
import { prisma } from "@/lib/prisma";
import {
  IconCode,
  IconBriefcase,
  IconGraduationCap,
  IconTarget,
  IconWrench,
  IconBookOpen,
  IconArrowRight,
  IconUsers,
  IconMedal,
  IconStar,
} from "@/lib/icons";

const categoryIcons: Record<string, any> = {
  "Informatique & Technologie": IconCode,
  "Business & Entrepreneuriat": IconBriefcase,
  "Éducation & Academique": IconGraduationCap,
  "Développement Personnel": IconTarget,
  "Artisanat & Métiers": IconWrench,
  "Théologie & Spirituel": IconBookOpen,
};

export default async function HomePage() {
  const [categories, courses] = await Promise.all([
    prisma.category.findMany({ include: { _count: { select: { courses: true } } } }),
    prisma.course.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  return (
    <>
      <Header />

      {/* ---------- HERO ---------- */}
      <section className="relative bg-brand-navy overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-28 md:pb-32">
          <p className="eyebrow text-brand-orange mb-4">Formation en ligne — RDC</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-[1.1] max-w-2xl">
            Apprenez des compétences qui comptent.
          </h1>
          <p className="text-white/70 text-base sm:text-lg mt-6 max-w-xl leading-relaxed">
            Des formations pratiques et certifiantes, conçues pour le marché congolais —
            à votre rythme, sur votre téléphone ou votre ordinateur.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-9">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base"
            >
              Explorer les formations
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-white/25 hover:bg-white/5 transition-colors text-sm sm:text-base"
            >
              Créer un compte gratuit
            </Link>
          </div>
        </div>

        {/* Bande de crédibilité */}
        <div className="relative border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: IconUsers, value: "12 000+", label: "Apprenants actifs" },
              { icon: IconBookOpen, value: "80+", label: "Formations disponibles" },
              { icon: IconMedal, value: "4 500+", label: "Certificats délivrés" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className="w-6 h-6 text-brand-orange shrink-0" />
                <div>
                  <p className="font-display font-bold text-white text-lg leading-none">{s.value}</p>
                  <p className="text-white/50 text-xs mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-brand-blue mb-2">Domaines</p>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy">
              Choisissez votre catégorie
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-orange transition-colors"
          >
            Voir tout <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              name={c.name}
              count={c._count.courses}
              Icon={categoryIcons[c.name] ?? IconBookOpen}
              href={`/courses?category=${c.id}`}
            />
          ))}
        </div>
      </section>

      {/* ---------- FORMATIONS POPULAIRES ---------- */}
      <section className="bg-white border-y border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow text-brand-blue mb-2">Populaires</p>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy">
                Formations recommandées
              </h2>
            </div>
            <Link
              href="/courses"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-orange transition-colors"
            >
              Voir tout <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  category={c.category.name}
                  level={c.level}
                  type={c.type}
                  priceUSD={c.priceUSD}
                  certifying={c.certifying}
                  instructor={c.instructor}
                />
              ))}
            </div>
          ) : (
            <p className="text-brand-slate/60 text-sm">
              Aucune formation pour l'instant — lance <code className="bg-brand-line/60 px-1.5 py-0.5 rounded">npm run db:seed</code> pour ajouter des données d'exemple.
            </p>
          )}
        </div>
      </section>

      {/* ---------- DEVENIR FORMATEUR ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-4">
        <div className="rounded-3xl border border-brand-line bg-white px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <IconGraduationCap className="w-7 h-7 text-brand-orange" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="eyebrow text-brand-orange mb-2">Rejoindre l'équipe</p>
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-brand-navy">
              Vous avez une expertise à partager ?
            </h2>
            <p className="text-brand-slate/70 mt-2 max-w-lg">
              Devenez formateur sur E-Classe RDC et transmettez votre savoir à des milliers
              d'apprenants congolais.
            </p>
          </div>
          <Link
            href="/devenir-formateur"
            className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 transition-colors text-white font-semibold px-6 py-3.5 rounded-full shrink-0 whitespace-nowrap"
          >
            Devenir formateur
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-brand-blue px-8 py-14 md:px-16 text-center relative overflow-hidden">
          <IconStar className="w-8 h-8 text-brand-orange mx-auto mb-5" />
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white max-w-xl mx-auto">
            Prêt à progresser dans votre carrière ?
          </h2>
          <p className="text-white/70 mt-3 max-w-md mx-auto">
            Rejoignez des milliers d'apprenants congolais qui se forment chaque jour.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-blue font-semibold px-6 py-3.5 rounded-full mt-7 hover:bg-white/90 transition-colors"
          >
            Commencer maintenant
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
