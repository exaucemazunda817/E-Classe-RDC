import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { completeLessonForUser } from "@/lib/enrollment";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connecte-toi pour continuer." }, { status: 401 });
  }

  try {
    const result = await completeLessonForUser(session.user.id, params.id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Une erreur est survenue." }, { status: 400 });
  }
}
