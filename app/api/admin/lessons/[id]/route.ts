import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  videoUrl: z.string().optional(),
  content: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const lesson = await prisma.lesson.update({
    where: { id: params.id },
    data: {
      title: parsed.data.title,
      videoUrl: parsed.data.videoUrl || null,
      content: parsed.data.content || null,
    },
  });

  return NextResponse.json(lesson);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  await prisma.lessonCompletion.deleteMany({ where: { lessonId: params.id } });
  await prisma.lesson.delete({ where: { id: params.id } });

  return NextResponse.json({ deleted: true });
}
