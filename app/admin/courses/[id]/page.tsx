import { prisma } from "@/lib/prisma";
import { listTeacherAccounts } from "@/lib/instructors";
import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import LessonManager from "@/components/admin/LessonManager";
import CourseResourceManager from "@/components/admin/CourseResourceManager";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const [course, categories, teachers] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: { orderBy: { order: "asc" } },
        resources: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    listTeacherAccounts(),
  ]);

  if (!course) notFound();

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">{course.title}</h1>
      <p className="text-sm text-brand-slate/60 mb-8">Modifier la formation</p>

      <section className="mb-12">
        <CourseForm
          categories={categories}
          teachers={teachers}
          initial={{
            id: course.id,
            title: course.title,
            description: course.description,
            categoryId: course.categoryId,
            level: course.level,
            type: course.type,
            priceUSD: course.priceUSD / 100,
            certifying: course.certifying,
            instructor: course.instructor ?? "",
            instructorId: course.instructorId ?? "",
          }}
        />
      </section>

      <section className="mb-12">
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">Leçons</h2>
        <LessonManager courseId={course.id} lessons={course.lessons} />
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-brand-navy mb-1">Ressources et exercices</h2>
        <p className="text-sm text-brand-slate/60 mb-4">
          Documents (PDF, Word) mis à disposition des apprenants inscrits : supports de cours,
          questionnaires, fiches d'exercices.
        </p>
        <CourseResourceManager courseId={course.id} resources={course.resources} />
      </section>
    </>
  );
}
