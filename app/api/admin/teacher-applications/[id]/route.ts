import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
  adminNote: z.string().trim().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const application = await prisma.teacherApplication.findUnique({ where: { id: params.id } });
  if (!application) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updated = await prisma.teacherApplication.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.adminNote || null,
      reviewedAt: new Date(),
    },
  });

  // Si un compte existe déjà avec cet email, on le promeut directement Formateur —
  // évite à l'admin l'aller-retour manuel par /admin/users. Sinon, l'admin lui
  // indiquera de créer un compte puis fera la promotion une fois inscrit.
  let promotedUser = null;
  if (parsed.data.status === "ACCEPTED") {
    const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
    if (existingUser && existingUser.role === "STUDENT") {
      promotedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: "FORMATEUR" },
        select: { id: true, name: true, email: true },
      });
    }
  }

  return NextResponse.json({ application: updated, promotedUser });
}
