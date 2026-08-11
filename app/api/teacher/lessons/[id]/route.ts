import { NextResponse } from "next/server";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: { course: true },
  });
  if (!lesson) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (teacher.role !== "ADMIN" && lesson.course.instructorId !== teacher.id) {
    return NextResponse.json({ error: "Cette formation ne t'appartient pas." }, { status: 403 });
  }

  await prisma.lessonCompletion.deleteMany({ where: { lessonId: params.id } });
  await prisma.lesson.delete({ where: { id: params.id } });

  return NextResponse.json({ deleted: true });
}
