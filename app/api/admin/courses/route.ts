import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
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
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const courses = await prisma.course.findMany({
    include: { category: true, _count: { select: { enrollments: true, lessons: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const course = await prisma.course.create({ data: parsed.data });
  return NextResponse.json(course, { status: 201 });
}
