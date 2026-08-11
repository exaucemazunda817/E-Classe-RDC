import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/admin/CourseForm";

export default async function NewTeacherCoursePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-8">Nouvelle formation</h1>
      {categories.length === 0 ? (
        <p className="text-sm text-brand-slate/60">Aucune catégorie n'est encore configurée sur la plateforme.</p>
      ) : (
        <CourseForm categories={categories} apiBase="/api/teacher" redirectBase="/teacher/courses" />
      )}
    </>
  );
}
