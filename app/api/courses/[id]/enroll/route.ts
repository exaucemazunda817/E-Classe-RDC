import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { enrollUserInCourse } from "@/lib/enrollment";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connecte-toi pour t'inscrire à une formation." }, { status: 401 });
  }

  const enrollment = await enrollUserInCourse(session.user.id, params.id);
  return NextResponse.json(enrollment, { status: 201 });
}
