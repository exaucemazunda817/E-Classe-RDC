import { NextResponse } from "next/server";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  videoUrl: z.string().optional(),
  content: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (teacher.role !== "ADMIN" && course.instructorId !== teacher.id) {
    return NextResponse.json({ error: "Cette formation ne t'appartient pas." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const count = await prisma.lesson.count({ where: { courseId: params.id } });

  const lesson = await prisma.lesson.create({
    data: { ...parsed.data, courseId: params.id, order: count + 1 },
  });

  return NextResponse.json(lesson, { status: 201 });
}
