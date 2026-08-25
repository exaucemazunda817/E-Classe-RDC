import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Formulaire public : aucune connexion requise. On garde des limites généreuses
// mais raisonnables pour éviter qu'un envoi malveillant ne remplisse la base.
const MAX_CV_BYTES = 4 * 1024 * 1024; // 4 Mo (marge sous la limite Vercel ~4.5 Mo)

const fieldsSchema = z
  .object({
    fullName: z.string().trim().min(3, "Le nom complet est requis."),
    email: z.string().trim().email("Adresse email invalide."),
    phone: z.string().trim().optional(),
    categoryId: z.string().optional(),
    customDomain: z.string().trim().max(100).optional(),
    experience: z.string().trim().min(20, "Décris un peu plus ton expérience (20 caractères minimum)."),
    motivation: z.string().trim().min(30, "Ta motivation doit faire au moins 30 caractères."),
    portfolioUrl: z.union([z.string().trim().url("Lien invalide."), z.literal("")]).optional(),
  })
  .refine((data) => !!data.categoryId || !!data.customDomain, {
    message: "Choisis un domaine.",
  });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = await checkRateLimit(`teacher-application:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de candidatures envoyées. Réessaie plus tard." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  const form = await req.formData();

  const parsed = fieldsSchema.safeParse({
    fullName: form.get("fullName"),
    email: form.get("email"),
    phone: form.get("phone") || undefined,
    categoryId: form.get("categoryId") || undefined,
    customDomain: form.get("customDomain") || undefined,
    experience: form.get("experience"),
    motivation: form.get("motivation"),
    portfolioUrl: form.get("portfolioUrl") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Le CV (PDF) est requis." }, { status: 400 });
  }
  if (cv.type !== "application/pdf") {
    return NextResponse.json({ error: "Le CV doit être un fichier PDF." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: "Le CV dépasse la taille maximale de 4 Mo." }, { status: 400 });
  }

  let categoryId: string | null = null;
  if (parsed.data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Domaine introuvable." }, { status: 400 });
    }
    categoryId = category.id;
  }

  const cvData = Buffer.from(await cv.arrayBuffer());

  const application = await prisma.teacherApplication.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      // Clé "category" totalement omise (pas juste undefined) quand le candidat
      // a choisi "Autre" — Prisma ne traite pas toujours une valeur undefined
      // explicite comme équivalente à une clé absente sur un champ de relation.
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      customDomain: categoryId ? null : parsed.data.customDomain || null,
      experience: parsed.data.experience,
      motivation: parsed.data.motivation,
      portfolioUrl: parsed.data.portfolioUrl || null,
      cvFileName: cv.name || "cv.pdf",
      cvMimeType: cv.type,
      cvData,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: application.id }, { status: 201 });
}
