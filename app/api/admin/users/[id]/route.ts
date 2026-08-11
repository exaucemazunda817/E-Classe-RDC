import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["STUDENT", "FORMATEUR", "ADMIN"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // Empêche un admin de se rétrograder lui-même par erreur (pour ne pas se bloquer l'accès)
  if (params.id === admin.id && parsed.data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Tu ne peux pas retirer ton propre rôle administrateur." },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role: parsed.data.role },
  });

  return NextResponse.json({ id: user.id, role: user.role });
}
