import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IconChevronRight } from "@/lib/icons";

export default async function ContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">
        Messages de contact
      </h1>
      <p className="text-sm text-brand-slate/60 mb-8">
        {messages.length} message(s) • {unreadCount} non lu(s)
      </p>

      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        {messages.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-slate/60">
            Aucun message pour l'instant.
          </p>
        ) : (
          messages.map((m, i) => (
            <Link
              key={m.id}
              href={`/admin/contact-messages/${m.id}`}
              className={`flex items-center gap-4 p-4 hover:bg-brand-line/10 transition-colors ${
                i !== 0 ? "border-t border-brand-line" : ""
              } ${!m.read ? "bg-brand-blue/5" : ""}`}
            >
              {!m.read && <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm truncate ${
                    m.read ? "font-medium text-brand-navy/80" : "font-bold text-brand-navy"
                  }`}
                >
                  {m.subject}
                </p>
                <p className="text-xs text-brand-slate/50 mt-0.5 truncate">
                  {m.name} • {m.email}
                </p>
              </div>
              <span className="text-xs text-brand-slate/40 shrink-0">
                {new Date(m.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <IconChevronRight className="w-4 h-4 text-brand-slate/30 shrink-0" />
            </Link>
          ))
        )}
      </div>
    </>
  );
}
