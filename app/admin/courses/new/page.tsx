import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/admin/CourseForm";

export default async function NewCoursePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-8">Nouvelle formation</h1>
      {categories.length === 0 ? (
        <p className="text-sm text-brand-slate/60">
          Crée d'abord au moins une catégorie dans l'onglet "Catégories".
        </p>
      ) : (
        <CourseForm categories={categories} />
      )}
    </>
  );
}
