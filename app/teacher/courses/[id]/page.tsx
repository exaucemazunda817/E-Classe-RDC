import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import CourseForm from "@/components/admin/CourseForm";
import LessonManager from "@/components/admin/LessonManager";
import StudentList from "@/components/admin/StudentList";

export default async function TeacherCoursePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [course, categories] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.id },
      include: { lessons: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!course) notFound();
  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    // Cette formation ne t'appartient pas
    redirect("/teacher");
  }

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">{course.title}</h1>
      <p className="text-sm text-brand-slate/60 mb-8">Gérer la formation</p>

      <section className="mb-12">
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">Informations</h2>
        <CourseForm
          categories={categories}
          apiBase="/api/teacher"
          redirectBase="/teacher/courses"
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
          }}
        />
      </section>

      <section className="mb-12">
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">Leçons</h2>
        <LessonManager courseId={course.id} lessons={course.lessons} apiBase="/api/teacher" />
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">Étudiants inscrits</h2>
        <StudentList courseId={course.id} />
      </section>
    </>
  );
}
