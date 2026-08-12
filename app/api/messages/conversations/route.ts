import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  courseId: z.string().min(1),
  studentId: z.string().min(1).optional(),
});

// Crée (ou retrouve) le fil de discussion entre un étudiant et le formateur
// d'une formation. Appelé depuis la page de formation (côté étudiant) ou la
// liste des étudiants inscrits (côté formateur).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { courseId, studentId } = parsed.data;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });

  let finalStudentId: string;
  let finalTeacherId: string;

  if (user.role === "STUDENT") {
    if (!course.instructorId) {
      return NextResponse.json(
        { error: "Cette formation n'a pas de formateur joignable." },
        { status: 400 }
      );
    }
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Tu dois être inscrit à cette formation." }, { status: 403 });
    }
    finalStudentId = user.id;
    finalTeacherId = course.instructorId;
  } else if (user.role === "FORMATEUR" || user.role === "ADMIN") {
    if (user.role !== "ADMIN" && course.instructorId !== user.id) {
      return NextResponse.json({ error: "Cette formation ne t'appartient pas." }, { status: 403 });
    }
    if (!studentId) {
      return NextResponse.json({ error: "Étudiant requis" }, { status: 400 });
    }
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: studentId, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Cet étudiant n'est pas inscrit à cette formation." },
        { status: 400 }
      );
    }
    finalStudentId = studentId;
    finalTeacherId = user.role === "ADMIN" ? course.instructorId ?? user.id : user.id;
  } else {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      studentId_teacherId_courseId: {
        studentId: finalStudentId,
        teacherId: finalTeacherId,
        courseId,
      },
    },
    update: {},
    create: { studentId: finalStudentId, teacherId: finalTeacherId, courseId },
  });

  return NextResponse.json({ id: conversation.id }, { status: 201 });
}
