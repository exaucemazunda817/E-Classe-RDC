import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Compte administrateur par défaut — à utiliser une fois puis à sécuriser
  // (change le mot de passe depuis Prisma Studio ou directement en base).
  const adminEmail = "admin@eclasserdc.cd";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("ChangeMoi123!", 10);
    await prisma.user.create({
      data: {
        name: "Administrateur",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`✅ Compte admin créé : ${adminEmail} / ChangeMoi123! (à changer immédiatement)`);
  }

  const categories = [
    { name: "Informatique & Technologie" },
    { name: "Business & Entrepreneuriat" },
    { name: "Éducation & Academique" },
    { name: "Développement Personnel" },
    { name: "Artisanat & Métiers" },
    { name: "Théologie & Spirituel" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const c of categories) {
    let cat = await prisma.category.findFirst({ where: { name: c.name } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name: c.name } });
    }
    createdCategories[c.name] = cat.id;
  }

  const sampleCourses = [
    {
      title: "Développez vos Compétences en IT",
      description: "Les bases du développement web moderne, du HTML au déploiement.",
      category: "Informatique & Technologie",
      level: "DEBUTANT" as const,
      type: "ABORDABLE" as const,
      priceCDF: 42000,
      certifying: true,
      instructor: "David Kalonji",
    },
    {
      title: "Marketing Digital pour Débutants",
      description: "Apprenez les fondamentaux du marketing digital et des réseaux sociaux.",
      category: "Business & Entrepreneuriat",
      level: "DEBUTANT" as const,
      type: "GRATUITE" as const,
      priceCDF: 0,
      certifying: false,
      instructor: "Grace Tshimanga",
    },
    {
      title: "Compétences Managériales en Entreprise Avancée",
      description: "Diriger une équipe, gérer les conflits et piloter la performance.",
      category: "Business & Entrepreneuriat",
      level: "AVANCE" as const,
      type: "CERTIFIANTE" as const,
      priceCDF: 126000,
      certifying: true,
      instructor: "Patrick Mbayo",
    },
    {
      title: "Fondements de la Théologie Chrétienne",
      description: "Une introduction structurée aux bases de la théologie.",
      category: "Théologie & Spirituel",
      level: "DEBUTANT" as const,
      type: "CERTIFIANTE" as const,
      priceCDF: 56000,
      certifying: true,
      instructor: "Pasteur Emmanuel Ilunga",
    },
    {
      title: "Introduction au Développement Web",
      description: "HTML, CSS et JavaScript pour construire votre premier site.",
      category: "Informatique & Technologie",
      level: "DEBUTANT" as const,
      type: "CERTIFIANTE" as const,
      priceCDF: 28000,
      certifying: true,
      instructor: "David Kalonji",
    },
    {
      title: "Menuiserie et Travail du Bois",
      description: "Les techniques essentielles de l'artisanat du bois.",
      category: "Artisanat & Métiers",
      level: "DEBUTANT" as const,
      type: "GRATUITE" as const,
      priceCDF: 0,
      certifying: false,
      instructor: "Joseph Kabeya",
    },
  ];

  for (const course of sampleCourses) {
    const categoryId = createdCategories[course.category];
    let record = await prisma.course.findFirst({ where: { title: course.title } });
    if (!record) {
      record = await prisma.course.create({
        data: {
          title: course.title,
          description: course.description,
          level: course.level,
          type: course.type,
          priceCDF: course.priceCDF,
          certifying: course.certifying,
          instructor: course.instructor,
          categoryId,
        },
      });
    }

    // Ajoute 3 leçons d'exemple si la formation n'en a pas encore
    const existingLessons = await prisma.lesson.count({ where: { courseId: record.id } });
    if (existingLessons === 0) {
      const lessonTitles = [
        `Introduction : ${course.title}`,
        "Notions clés et bonnes pratiques",
        "Mise en pratique et évaluation finale",
      ];
      for (let i = 0; i < lessonTitles.length; i++) {
        await prisma.lesson.create({
          data: { courseId: record.id, title: lessonTitles[i], order: i + 1 },
        });
      }
    }
  }

  const plans = [
    { name: "Gratuit", priceCDF: 0, durationDays: 365, description: "Accès aux formations gratuites uniquement." },
    { name: "PRO", priceCDF: 28000, durationDays: 30, description: "Accès à toutes les formations abordables et certifiantes." },
    { name: "Expert", priceCDF: 70000, durationDays: 30, description: "Accès complet, y compris les formations expertes." },
  ];

  for (const p of plans) {
    const existing = await prisma.plan.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.plan.create({ data: p });
    }
  }

  console.log("✅ Données d'exemple créées avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
