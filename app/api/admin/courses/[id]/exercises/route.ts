import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const questionSchema = z
  .object({
    question: z.string().trim().min(3, "Chaque question doit faire au moins 3 caractères."),
    choices: z.array(z.string().trim().min(1)).max(6, "6 choix maximum par question."),
    correctChoice: z.number().int().nullable(),
  })
  .refine(
    (q) => q.correctChoice === null || (q.correctChoice >= 0 && q.correctChoice < q.choices.length),
    { message: "La bonne réponse indiquée ne correspond à aucun choix." }
  );

const schema = z.object({
  title: z.string().trim().min(2, "Le titre est requis."),
  instructions: z.string().trim().optional(),
  questions: z.array(questionSchema).min(1, "Ajoute au moins une question."),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const course = await prisma.course.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!course) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const exercise = await prisma.exercise.create({
    data: {
      courseId: course.id,
      title: parsed.data.title,
      instructions: parsed.data.instructions || null,
      questions: {
        create: parsed.data.questions.map((q, i) => ({
          order: i + 1,
          question: q.question,
          choices: q.choices,
          correctChoice: q.correctChoice,
        })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json(exercise, { status: 201 });
}
