import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getConversationForUser } from "@/lib/conversations";
import ChatThread from "@/components/messaging/ChatThread";
import { IconChevronRight } from "@/lib/icons";

export default async function TeacherConversationPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const conversation = await getConversationForUser(params.id, user);
  if (!conversation) notFound();

  return (
    <>
      <Link
        href="/teacher/messages"
        className="inline-flex items-center gap-1 text-sm text-brand-slate/60 hover:text-brand-navy mb-4"
      >
        <IconChevronRight className="w-4 h-4 rotate-180" />
        Retour aux messages
      </Link>

      <h1 className="font-display text-xl font-extrabold text-brand-navy mb-1">
        {conversation.student.name}
      </h1>
      <p className="text-sm text-brand-slate/60 mb-6">{conversation.course.title}</p>

      <ChatThread
        conversationId={conversation.id}
        currentUserId={user.id}
        initialMessages={conversation.messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
