import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function getConversationForUser(id: string, user: User) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  if (!conversation) return null;
  if (conversation.studentId !== user.id && conversation.teacherId !== user.id) return null;

  return conversation;
}
