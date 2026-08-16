import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 Mo

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fieldsSchema = z.object({
  title: z.string().trim().min(2, "Le titre est requis."),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const course = await prisma.course.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!course) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });

  const form = await req.formData();
  const parsed = fieldsSchema.safeParse({
    title: form.get("title"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Le fichier est requis." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Le fichier doit être un PDF ou un document Word." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Le fichier dépasse la taille maximale de 15 Mo." }, { status: 400 });
  }

  const fileData = Buffer.from(await file.arrayBuffer());

  const resource = await prisma.courseResource.create({
    data: {
      courseId: course.id,
      title: parsed.data.title,
      fileName: file.name || "document",
      mimeType: file.type,
      fileSize: file.size,
      fileData,
    },
    select: { id: true, title: true, fileName: true, fileSize: true, createdAt: true },
  });

  return NextResponse.json(resource, { status: 201 });
}
