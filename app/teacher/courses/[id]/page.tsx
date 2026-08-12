import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import StudentList from "@/components/admin/StudentList";
import { IconMedal } from "@/lib/icons";

const LEVEL_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
};

export default async function TeacherCoursePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: { lessons: { orderBy: { order: "asc" } }, category: true },
  });

  if (!course) notFound();
  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    // Cette formation ne t'appartient pas
    redirect("/teacher");
  }

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">{course.title}</h1>
      <p className="text-sm text-brand-slate/60 mb-8">Suivi de la formation</p>

      {/* ---------- INFORMATIONS (lecture seule) ---------- */}
      <section className="mb-12">
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">Informations</h2>

        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <p className="text-sm text-brand-slate/80 leading-relaxed mb-4">{course.description}</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-brand-slate/60">
            <span>{course.category.name}</span>
            <span>{LEVEL_LABELS[course.level] ?? course.level}</span>
            <span className="font-display font-bold text-brand-navy">
              {course.priceUSD === 0 ? "Gratuit" : `${(course.priceUSD / 100).toFixed(2)} $`}
            </span>
            {course.certifying && (
              <span className="flex items-center gap-1.5 text-brand-orange font-semibold">
                <IconMedal className="w-3.5 h-3.5" /> Formation certifiante
              </span>
            )}
          </div>

          <p className="text-xs text-brand-slate/50 mt-4 pt-4 border-t border-brand-line">
            Le contenu de cette formation est géré par l'administrateur.
            {user.role === "ADMIN" && (
              <>
                {" "}
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="text-brand-blue font-semibold hover:underline"
                >
                  Modifier depuis l'espace admin
                </Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* ---------- LEÇONS (lecture seule) ---------- */}
      <section className="mb-12">
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">
          Leçons ({course.lessons.length})
        </h2>

        {course.lessons.length === 0 ? (
          <p className="text-sm text-brand-slate/50">Aucune leçon pour l'instant.</p>
        ) : (
          <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
            {course.lessons.map((lesson, i) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-4 px-4 py-3 ${i !== 0 ? "border-t border-brand-line" : ""}`}
              >
                <span className="text-xs font-semibold text-brand-slate/40 w-4 shrink-0">{i + 1}</span>
                <p className="text-sm text-brand-navy truncate">{lesson.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- ÉTUDIANTS ---------- */}
      <section>
        <h2 className="font-display text-lg font-bold text-brand-navy mb-4">Étudiants inscrits</h2>
        <StudentList courseId={course.id} />
      </section>
    </>
  );
}
