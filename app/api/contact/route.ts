import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().email("Adresse email invalide."),
  subject: z.string().trim().min(3, "L'objet est requis."),
  message: z.string().trim().min(10, "Le message doit faire au moins 10 caractères."),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const created = await prisma.contactMessage.create({
    data: parsed.data,
    select: { id: true },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
