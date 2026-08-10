import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { prisma } from "@/lib/prisma";
import {
  IconCode,
  IconBriefcase,
  IconGraduationCap,
  IconTarget,
  IconWrench,
  IconBookOpen,
} from "@/lib/icons";

const categoryIcons: Record<string, any> = {
  "Informatique & Technologie": IconCode,
  "Business & Entrepreneuriat": IconBriefcase,
  "Éducation & Academique": IconGraduationCap,
  "Développement Personnel": IconTarget,
  "Artisanat & Métiers": IconWrench,
  "Théologie & Spirituel": IconBookOpen,
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
  });

  return (
    <>
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow text-brand-blue mb-2">Toutes les catégories</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy mb-10">
          Explorer par domaine
        </h1>

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
      <Footer />
    </>
  );
}
