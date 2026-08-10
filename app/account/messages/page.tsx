import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import { IconMessageCircle } from "@/lib/icons";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const messages = await prisma.message.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-6">Messages</h1>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center max-w-2xl">
          <IconMessageCircle className="w-8 h-8 text-brand-slate/30 mx-auto mb-3" />
          <p className="font-display font-bold text-brand-navy mb-1">Aucun message</p>
          <p className="text-sm text-brand-slate/60">
            Les questions et réponses de tes formateurs apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 ${
                m.read ? "border-brand-line bg-white" : "border-brand-blue/30 bg-brand-blue/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow text-brand-blue/70">
                  {m.fromRole === "FORMATEUR" ? "Formateur" : m.fromRole === "ADMIN" ? "Équipe E-Classe" : "Toi"}
                </span>
                <span className="text-xs text-brand-slate/40">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="text-sm text-brand-slate/80">{m.content}</p>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="/account" />
    </>
  );
}
