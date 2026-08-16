import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connecte-toi pour accéder à ce document." }, { status: 401 });

  const resource = await prisma.courseResource.findUnique({
    where: { id: params.id },
  });
  if (!resource) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (user.role !== "ADMIN") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: resource.courseId } },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Inscris-toi à cette formation pour accéder à ce document." },
        { status: 403 }
      );
    }
  }

  return new NextResponse(Buffer.from(resource.fileData), {
    headers: {
      "Content-Type": resource.mimeType,
      "Content-Disposition": `attachment; filename="${resource.fileName}"`,
    },
  });
}
