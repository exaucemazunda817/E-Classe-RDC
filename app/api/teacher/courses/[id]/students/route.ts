import { NextResponse } from "next/server";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (teacher.role !== "ADMIN" && course.instructorId !== teacher.id) {
    return NextResponse.json({ error: "Cette formation ne t'appartient pas." }, { status: 403 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: params.id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { enrolledAt: "desc" },
  });

  return NextResponse.json(enrollments);
}
