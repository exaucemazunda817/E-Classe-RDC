import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function TeacherDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: { category: true, _count: { select: { enrollments: true, lessons: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-brand-navy">Mes formations</h1>
        <p className="text-sm text-brand-slate/60 mt-1">
          {courses.length} formation(s) • {totalStudents} inscrit(s) au total
        </p>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-display font-bold text-brand-navy mb-1">
              Aucune formation ne t'est assignée
            </p>
            <p className="text-sm text-brand-slate/60">
              C'est l'administrateur qui rattache une formation à ton compte. Contacte-le
              pour qu'il t'assigne la tienne.
            </p>
          </div>
        ) : (
          courses.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center gap-4 p-4 ${i !== 0 ? "border-t border-brand-line" : ""}`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-brand-navy truncate">{c.title}</p>
                <p className="text-xs text-brand-slate/50 mt-0.5">
                  {c.category.name} • {c._count.lessons} leçon(s) • {c._count.enrollments} inscrit(s)
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-slate/60 shrink-0">
                {c.priceUSD === 0 ? "Gratuit" : `${(c.priceUSD / 100).toFixed(2)} $`}
              </span>
              <Link
                href={`/teacher/courses/${c.id}`}
                className="shrink-0 text-xs font-semibold text-brand-blue border border-brand-line rounded-full px-3 py-1.5 hover:border-brand-blue/40 transition-colors"
              >
                Voir les inscrits
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
