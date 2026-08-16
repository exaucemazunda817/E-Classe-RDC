import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExerciseForm from "@/components/admin/ExerciseForm";
import { IconChevronRight } from "@/lib/icons";

export default async function EditExercisePage({
  params,
}: {
  params: { id: string; exerciseId: string };
}) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: params.exerciseId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!exercise || exercise.courseId !== params.id) notFound();

  return (
    <>
      <Link
        href={`/admin/courses/${params.id}`}
        className="inline-flex items-center gap-1 text-sm text-brand-slate/60 hover:text-brand-navy mb-4"
      >
        <IconChevronRight className="w-4 h-4 rotate-180" /> Retour à la formation
      </Link>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-8">{exercise.title}</h1>
      <ExerciseForm
        courseId={params.id}
        initial={{
          id: exercise.id,
          title: exercise.title,
          instructions: exercise.instructions ?? "",
          questions: exercise.questions.map((q) => ({
            question: q.question,
            choices: q.choices,
            correctChoice: q.correctChoice,
          })),
        }}
      />
    </>
  );
}
