import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { IconMessageCircle, IconChevronRight } from "@/lib/icons";

export default async function TeacherMessagesPage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) redirect("/login");

  const conversations = await prisma.conversation.findMany({
    where: { teacherId: teacher.id },
    include: {
      student: { select: { name: true } },
      course: { select: { title: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: { messages: { where: { senderId: { not: teacher.id }, read: false } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">Messages</h1>
      <p className="text-sm text-brand-slate/60 mb-8">Échanges avec tes étudiants</p>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center">
          <IconMessageCircle className="w-8 h-8 text-brand-slate/30 mx-auto mb-3" />
          <p className="font-display font-bold text-brand-navy mb-1">Aucun message</p>
          <p className="text-sm text-brand-slate/60">
            Les échanges avec tes étudiants apparaîtront ici. Tu peux aussi en démarrer un depuis
            la liste des étudiants inscrits à une formation.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
          {conversations.map((c, i) => {
            const last = c.messages[0];
            const unread = c._count.messages;
            return (
              <Link
                key={c.id}
                href={`/teacher/messages/${c.id}`}
                className={`flex items-center gap-4 px-4 py-3.5 hover:bg-brand-line/20 transition-colors ${
                  i !== 0 ? "border-t border-brand-line" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                  {c.student.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${unread > 0 ? "font-bold text-brand-navy" : "font-semibold text-brand-navy"}`}>
                      {c.student.name}
                    </p>
                    {last && (
                      <span className="text-xs text-brand-slate/40 shrink-0 ml-2">
                        {new Date(last.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-slate/50 truncate">{c.course.title}</p>
                  <p className={`text-sm truncate mt-0.5 ${unread > 0 ? "text-brand-navy font-medium" : "text-brand-slate/60"}`}>
                    {last ? last.content : "Aucun message pour l'instant"}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="shrink-0 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
                <IconChevronRight className="w-4 h-4 text-brand-slate/30 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
