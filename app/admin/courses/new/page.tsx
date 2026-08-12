import { prisma } from "@/lib/prisma";
import { listTeacherAccounts } from "@/lib/instructors";
import CourseForm from "@/components/admin/CourseForm";

export default async function NewCoursePage() {
  const [categories, teachers] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    listTeacherAccounts(),
  ]);

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-8">Nouvelle formation</h1>
      {categories.length === 0 ? (
        <p className="text-sm text-brand-slate/60">
          Crée d'abord au moins une catégorie dans l'onglet "Catégories".
        </p>
      ) : (
        <CourseForm categories={categories} teachers={teachers} />
      )}
    </>
  );
}
