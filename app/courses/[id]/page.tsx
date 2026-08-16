import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoursePlayer from "@/components/CoursePlayer";
import PurchaseCourseButton from "@/components/PurchaseCourseButton";
import StartConversationButton from "@/components/messaging/StartConversationButton";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { IconMedal, IconFileText, IconDownload } from "@/lib/icons";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      lessons: { orderBy: { order: "asc" } },
      resources: { orderBy: { createdAt: "asc" } },
      instructorUser: true,
    },
  });

  if (!course) notFound();

  let enrollment = null;
  let completedLessonIds: string[] = [];
  let hasCertificate = false;

  if (user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      include: { lessonCompletions: true },
    });
    completedLessonIds = enrollment?.lessonCompletions.map((c) => c.lessonId) ?? [];

    const cert = await prisma.certificate.findFirst({
      where: { userId: user.id, courseId: course.id },
    });
    hasCertificate = !!cert;
  }

  return (
    <>
      <Header />

      <section className="bg-brand-navy">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <p className="eyebrow text-brand-orange mb-2">{course.category.name}</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white max-w-2xl">
            {course.title}
          </h1>
          <p className="text-white/70 mt-4 max-w-xl leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/60">
            <span className="capitalize">{course.level.toLowerCase()}</span>
            {(course.instructorUser?.name || course.instructor) && (
              <span>Par {course.instructorUser?.name || course.instructor}</span>
            )}
            {course.certifying && (
              <span className="flex items-center gap-1.5 text-brand-orange font-semibold">
                <IconMedal className="w-4 h-4" /> Formation certifiante
              </span>
            )}
            <span className="font-display font-bold text-white">
              {course.priceUSD === 0 ? "Gratuit" : `${(course.priceUSD / 100).toFixed(2)} $`}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="font-display text-xl font-bold text-brand-navy mb-5">Contenu de la formation</h2>

        {course.lessons.length === 0 ? (
          <p className="text-sm text-brand-slate/60">
            Le contenu de cette formation sera bientôt disponible.
          </p>
        ) : course.priceUSD > 0 && !enrollment ? (
          <div>
            <p className="text-sm text-brand-slate/60 mb-4">
              Cette formation est payante. Achète-la pour débloquer les {course.lessons.length}{" "}
              leçons{course.certifying ? " et obtenir un certificat à la fin" : ""}.
            </p>
            <PurchaseCourseButton
              courseId={course.id}
              priceUSD={course.priceUSD}
              isLoggedIn={!!user}
            />
          </div>
        ) : (
          <CoursePlayer
            courseId={course.id}
            lessons={course.lessons}
            isLoggedIn={!!user}
            isEnrolled={!!enrollment}
            completedLessonIds={completedLessonIds}
            isCourseCompleted={!!enrollment?.completed}
            certifying={course.certifying}
            hasCertificate={hasCertificate}
          />
        )}

        {enrollment && course.resources.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-bold text-brand-navy mb-5">
              Ressources et exercices
            </h2>
            <div className="space-y-2">
              {course.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={`/api/resources/${resource.id}`}
                  className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 hover:border-brand-blue/40 transition-colors"
                >
                  <IconFileText className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-navy font-medium truncate">{resource.title}</p>
                    <p className="text-xs text-brand-slate/50">
                      {resource.kind === "EXERCISE" ? "Questionnaire / exercice" : "Document"}
                    </p>
                  </div>
                  <IconDownload className="w-4 h-4 text-brand-slate/40 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {user && user.role === "STUDENT" && enrollment && course.instructorId && (
          <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-brand-line bg-white p-5">
            <div>
              <p className="font-display font-bold text-brand-navy text-sm mb-0.5">
                Une question sur cette formation ?
              </p>
              <p className="text-xs text-brand-slate/60">
                Écris directement à {course.instructorUser?.name || course.instructor}.
              </p>
            </div>
            <StartConversationButton
              courseId={course.id}
              basePath="/account/messages"
              label="Contacter le formateur"
            />
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
