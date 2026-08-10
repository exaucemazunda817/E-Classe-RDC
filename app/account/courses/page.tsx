import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import { IconPlay, IconMedal } from "@/lib/icons";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: { course: { include: { category: true } } },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-6">Mes Formations</h1>

      {enrollments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4 max-w-2xl">
          {enrollments.map((e) => (
            <div
              key={e.id}
              className="rounded-2xl border border-brand-line bg-white p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-blue/8 flex items-center justify-center shrink-0">
                {e.completed ? (
                  <IconMedal className="w-5 h-5 text-brand-orange" />
                ) : (
                  <IconPlay className="w-5 h-5 text-brand-blue" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="eyebrow text-brand-blue/70 mb-0.5">{e.course.category.name}</p>
                <p className="font-display font-bold text-brand-navy text-sm truncate">
                  {e.course.title}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 flex-1 bg-brand-line rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${e.completed ? "bg-emerald-500" : "bg-brand-blue"}`}
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-brand-slate/60 shrink-0">
                    {e.completed ? "Terminé" : `${e.progress}%`}
                  </span>
                </div>
              </div>

              <Link
                href={`/courses/${e.courseId}`}
                className="shrink-0 text-xs font-semibold text-brand-blue border border-brand-line rounded-full px-3 py-1.5 hover:border-brand-blue/40 transition-colors"
              >
                {e.completed ? "Revoir" : "Continuer"}
              </Link>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="/account" />
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-brand-line bg-white p-10 text-center max-w-2xl">
      <p className="font-display font-bold text-brand-navy mb-1">Aucune formation pour l'instant</p>
      <p className="text-sm text-brand-slate/60 mb-5">
        Explore le catalogue et inscris-toi à ta première formation.
      </p>
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full"
      >
        Explorer les formations
      </Link>
    </div>
  );
}
