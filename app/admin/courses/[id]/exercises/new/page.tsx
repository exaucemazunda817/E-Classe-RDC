import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExerciseForm from "@/components/admin/ExerciseForm";
import { IconChevronRight } from "@/lib/icons";

export default async function NewExercisePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({ where: { id: params.id }, select: { id: true, title: true } });
  if (!course) notFound();

  return (
    <>
      <Link
        href={`/admin/courses/${course.id}`}
        className="inline-flex items-center gap-1 text-sm text-brand-slate/60 hover:text-brand-navy mb-4"
      >
        <IconChevronRight className="w-4 h-4 rotate-180" /> Retour à {course.title}
      </Link>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-8">Nouveau questionnaire</h1>
      <ExerciseForm courseId={course.id} />
    </>
  );
}
