import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const filters = [
  { value: "", label: "Toutes" },
  { value: "GRATUITE", label: "Gratuites" },
  { value: "ABORDABLE", label: "Abordables" },
  { value: "CERTIFIANTE", label: "Certifiantes" },
  { value: "EXPERTE", label: "Expertes" },
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { type?: string; category?: string };
}) {
  const where: any = {};
  if (searchParams.type) where.type = searchParams.type;
  if (searchParams.category) where.categoryId = searchParams.category;

  const courses = await prisma.course.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow text-brand-blue mb-2">Catalogue</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy mb-8">
          Toutes les formations
        </h1>

        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => {
            const active = (searchParams.type ?? "") === f.value;
            return (
              <Link
                key={f.value}
                href={f.value ? `/courses?type=${f.value}` : "/courses"}
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                  active
                    ? "bg-brand-navy text-white border-brand-navy"
                    : "bg-white text-brand-slate border-brand-line hover:border-brand-blue/40"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
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
                priceCDF={c.priceCDF}
                certifying={c.certifying}
                instructor={c.instructor}
              />
            ))}
          </div>
        ) : (
          <p className="text-brand-slate/60 text-sm">
            Aucune formation ne correspond à ce filtre pour l'instant.
          </p>
        )}
      </section>
      <Footer />
    </>
  );
}
