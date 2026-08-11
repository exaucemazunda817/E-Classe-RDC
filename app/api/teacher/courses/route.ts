import { NextResponse } from "next/server";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  level: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]),
  type: z.enum(["GRATUITE", "ABORDABLE", "CERTIFIANTE", "EXPERTE"]),
  priceUSD: z.number().min(0),
  certifying: z.boolean(),
  instructor: z.string().optional(),
});

export async function GET() {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const courses = await prisma.course.findMany({
    where: { instructorId: teacher.id },
    include: { category: true, _count: { select: { enrollments: true, lessons: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      ...parsed.data,
      instructor: parsed.data.instructor || teacher.name,
      instructorId: teacher.id, // toute formation créée depuis l'espace enseignant lui est automatiquement attribuée
    },
  });
  return NextResponse.json(course, { status: 201 });
}
