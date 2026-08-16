import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const resource = await prisma.courseResource.findUnique({
    where: { id: params.id },
    select: { fileData: true, mimeType: true, fileName: true },
  });
  if (!resource) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  return new NextResponse(Buffer.from(resource.fileData), {
    headers: {
      "Content-Type": resource.mimeType,
      "Content-Disposition": `inline; filename="${resource.fileName}"`,
    },
  });
}
