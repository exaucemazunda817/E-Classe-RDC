import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import DeleteCourseButton from "@/components/admin/DeleteCourseButton";

export default async function TeacherDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: { category: true, _count: { select: { enrollments: true, lessons: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">Mes formations</h1>
          <p className="text-sm text-brand-slate/60 mt-1">
            {courses.length} formation(s) • {courses.reduce((sum, c) => sum + c._count.enrollments, 0)} inscrit(s) au total
          </p>
        </div>
        <Link
          href="/teacher/courses/new"
          className="bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full"
        >
          + Nouvelle formation
        </Link>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        {courses.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-slate/60">
            Tu n'as pas encore de formation. Crée la première !
          </p>
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
                Gérer
              </Link>
              <DeleteCourseButton courseId={c.id} courseTitle={c.title} apiBase="/api/teacher" />
            </div>
          ))
        )}
      </div>
    </>
  );
}
