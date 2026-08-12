import { NextResponse } from "next/server";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// L'espace enseignant est en lecture seule : seul l'admin crée, modifie ou
// supprime une formation (voir /api/admin/courses). On n'expose donc ici que GET.

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
