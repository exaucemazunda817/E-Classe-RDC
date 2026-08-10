import { prisma } from "./prisma";

/**
 * Inscrit un utilisateur à une formation (ne fait rien si déjà inscrit).
 */
export async function enrollUserInCourse(userId: string, courseId: string) {
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  return prisma.enrollment.create({
    data: { userId, courseId },
  });
}

/**
 * Marque une leçon comme terminée, recalcule la progression de l'inscription,
 * et — si toutes les leçons sont terminées et que la formation est certifiante —
 * génère automatiquement le certificat de l'utilisateur.
 */
export async function completeLessonForUser(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) throw new Error("Leçon introuvable");

  const enrollment = await enrollUserInCourse(userId, lesson.courseId);

  // Enregistre la complétion (ignore si déjà fait, grâce à la contrainte unique)
  await prisma.lessonCompletion.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    update: {},
    create: { enrollmentId: enrollment.id, lessonId },
  });

  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
  const doneLessons = await prisma.lessonCompletion.count({ where: { enrollmentId: enrollment.id } });

  const progress = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
  const isNowComplete = totalLessons > 0 && doneLessons >= totalLessons;

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { progress, completed: isNowComplete },
  });

  let issuedCertificate = null;
  if (isNowComplete && lesson.course.certifying) {
    issuedCertificate = await issueCertificateIfNeeded(userId, lesson.courseId);
  }

  return { enrollment: updatedEnrollment, certificate: issuedCertificate };
}

/**
 * Émet un certificat pour une formation terminée, si aucun n'existe déjà
 * pour cet utilisateur et cette formation (idempotent).
 */
export async function issueCertificateIfNeeded(userId: string, courseId: string) {
  const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
  if (existing) return existing;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Formation introuvable");

  return prisma.certificate.create({
    data: {
      userId,
      courseId,
      partnerLabel: null, // à personnaliser si une formation est co-brandée avec un partenaire
    },
  });
}
