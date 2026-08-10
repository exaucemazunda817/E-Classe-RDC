import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  videoUrl: z.string().optional(),
  content: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

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
