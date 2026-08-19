import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { selfEnrollInCourse, PaymentRequiredError } from "@/lib/enrollment";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connecte-toi pour t'inscrire à une formation." }, { status: 401 });
  }

  try {
    const enrollment = await selfEnrollInCourse(session.user.id, params.id);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    if (err instanceof PaymentRequiredError) {
      return NextResponse.json({ error: err.message }, { status: 402 });
    }
    return NextResponse.json({ error: "Formation introuvable." }, { status: 404 });
  }
}
