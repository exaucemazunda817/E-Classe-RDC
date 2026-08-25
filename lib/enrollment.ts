import { prisma } from "./prisma";

export class PaymentRequiredError extends Error {}

/**
 * Inscrit un utilisateur à une formation (ne fait rien si déjà inscrit).
 * Ne vérifie aucun paiement : réservée aux appels déjà autorisés (flux de
 * paiement une fois le paiement vérifié). Pour une inscription à l'initiative
 * de l'utilisateur, utiliser selfEnrollInCourse ci-dessous.
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
 * Inscrit un utilisateur à sa propre initiative (bouton "S'inscrire",
 * complétion de leçon). Contrairement à enrollUserInCourse, refuse l'accès
 * à une formation payante tant qu'aucun paiement réussi n'existe pour cet
 * utilisateur et cette formation — sans quoi n'importe quel utilisateur
 * connecté pourrait débloquer une formation payante sans jamais payer.
 */
export async function selfEnrollInCourse(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Formation introuvable");

  if (course.priceCDF > 0) {
    const existingPayment = await prisma.payment.findFirst({
      where: { userId, purpose: `course:${courseId}`, status: "SUCCESS" },
    });
    if (!existingPayment) {
      throw new PaymentRequiredError(
        "Cette formation est payante. Achète-la avant de t'inscrire."
      );
    }
  }

  return enrollUserInCourse(userId, courseId);
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

  const enrollment = await selfEnrollInCourse(userId, lesson.courseId);

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
