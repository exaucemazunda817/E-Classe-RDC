import { NextResponse } from "next/server";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Lecture seule : la création d'une formation est réservée à l'admin
// (voir POST /api/admin/courses).

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
