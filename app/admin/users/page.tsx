import { prisma } from "@/lib/prisma";
import RoleSelect from "@/components/admin/RoleSelect";

const roleLabels: Record<string, string> = {
  STUDENT: "Étudiant",
  FORMATEUR: "Formateur",
  ADMIN: "Admin",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { coursesTaught: true, enrollments: true } } },
  });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">Utilisateurs</h1>
      <p className="text-sm text-brand-slate/60 mb-8">
        Change le rôle d'un utilisateur pour lui donner accès à l'espace enseignant ou admin.
      </p>

      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        {users.map((u, i) => (
          <div
            key={u.id}
            className={`flex items-center gap-4 p-4 ${i !== 0 ? "border-t border-brand-line" : ""}`}
          >
            <div className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-navy truncate">{u.name}</p>
              <p className="text-xs text-brand-slate/50 truncate">{u.email}</p>
            </div>
            <span className="text-xs text-brand-slate/50 shrink-0 hidden sm:inline">
              {u._count.coursesTaught > 0 && `${u._count.coursesTaught} formation(s) • `}
              {u._count.enrollments} inscription(s)
            </span>
            <RoleSelect userId={u.id} currentRole={u.role} />
          </div>
        ))}
      </div>
    </>
  );
}
