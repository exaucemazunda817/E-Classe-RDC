import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const application = await prisma.teacherApplication.findUnique({
    where: { id: params.id },
    select: { cvData: true, cvMimeType: true, cvFileName: true },
  });
  if (!application) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  return new NextResponse(Buffer.from(application.cvData), {
    headers: {
      "Content-Type": application.cvMimeType,
      "Content-Disposition": `inline; filename="${application.cvFileName}"`,
    },
  });
}
