import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Formulaire public : aucune connexion requise. On garde des limites généreuses
// mais raisonnables pour éviter qu'un envoi malveillant ne remplisse la base.
const MAX_CV_BYTES = 4 * 1024 * 1024; // 4 Mo (marge sous la limite Vercel ~4.5 Mo)

const fieldsSchema = z.object({
  fullName: z.string().trim().min(3, "Le nom complet est requis."),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z.string().trim().optional(),
  categoryId: z.string().min(1, "Choisis un domaine."),
  experience: z.string().trim().min(20, "Décris un peu plus ton expérience (20 caractères minimum)."),
  motivation: z.string().trim().min(30, "Ta motivation doit faire au moins 30 caractères."),
  portfolioUrl: z.union([z.string().trim().url("Lien invalide."), z.literal("")]).optional(),
});

export async function POST(req: Request) {
  const form = await req.formData();

  const parsed = fieldsSchema.safeParse({
    fullName: form.get("fullName"),
    email: form.get("email"),
    phone: form.get("phone") || undefined,
    categoryId: form.get("categoryId"),
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

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Domaine introuvable." }, { status: 400 });
  }

  const cvData = Buffer.from(await cv.arrayBuffer());

  const application = await prisma.teacherApplication.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      categoryId: parsed.data.categoryId,
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
