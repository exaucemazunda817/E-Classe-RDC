import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

async function authorize(id: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) return null;
  if (conversation.studentId !== userId && conversation.teacherId !== userId) return null;
  return conversation;
}

// Renvoie les messages du fil et marque comme lus ceux envoyés par l'autre
// partie. Utilisé aussi bien pour le chargement initial que le polling.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const conversation = await authorize(params.id, user.id);
  if (!conversation) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.message.updateMany({
    where: { conversationId: conversation.id, senderId: { not: user.id }, read: false },
    data: { read: true },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true } } },
  });

  return NextResponse.json(messages);
}

const sendSchema = z.object({
  content: z.string().trim().min(1, "Message vide").max(2000, "Message trop long"),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const conversation = await authorize(params.id, user.id);
  if (!conversation) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const parsed = sendSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { conversationId: conversation.id, senderId: user.id, content: parsed.data.content },
    include: { sender: { select: { id: true, name: true } } },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message, { status: 201 });
}
