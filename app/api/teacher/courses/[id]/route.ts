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

// Vérifie que la formation appartient bien à ce formateur (les admins passent partout)
async function assertOwnership(courseId: string, userId: string, isAdmin: boolean) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (!isAdmin && course.instructorId !== userId) return null;
  return course;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const owned = await assertOwnership(params.id, teacher.id, teacher.role === "ADMIN");
  if (!owned) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: { lessons: { orderBy: { order: "asc" } }, category: true },
  });
  return NextResponse.json(course);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const owned = await assertOwnership(params.id, teacher.id, teacher.role === "ADMIN");
  if (!owned) return NextResponse.json({ error: "Cette formation ne t'appartient pas." }, { status: 403 });

  const body = await req.json();
  const parsed = schema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const course = await prisma.course.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(course);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const owned = await assertOwnership(params.id, teacher.id, teacher.role === "ADMIN");
  if (!owned) return NextResponse.json({ error: "Cette formation ne t'appartient pas." }, { status: 403 });

  await prisma.lessonCompletion.deleteMany({ where: { lesson: { courseId: params.id } } });
  await prisma.lesson.deleteMany({ where: { courseId: params.id } });
  await prisma.certificate.deleteMany({ where: { courseId: params.id } });
  await prisma.enrollment.deleteMany({ where: { courseId: params.id } });
  await prisma.course.delete({ where: { id: params.id } });

  return NextResponse.json({ deleted: true });
}
