import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/certificate-pdf";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connecte-toi pour télécharger ce certificat." }, { status: 401 });
  }

  const certificate = await prisma.certificate.findUnique({
    where: { id: params.id },
    include: { course: true, user: true },
  });

  if (!certificate || certificate.userId !== session.user.id) {
    return NextResponse.json({ error: "Certificat introuvable." }, { status: 404 });
  }

  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify/${certificate.verifyCode}`;

  const pdfBuffer = await generateCertificatePdf({
    studentName: certificate.user.name,
    courseTitle: certificate.course.title,
    partnerLabel: certificate.partnerLabel,
    issuedAt: certificate.issuedAt,
    verifyUrl,
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-${certificate.course.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf"`,
    },
  });
}
