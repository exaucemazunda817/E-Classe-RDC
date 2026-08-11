import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
}

/**
 * Retourne l'utilisateur connecté s'il est ADMIN, sinon null.
 * À utiliser dans les routes API admin pour bloquer tout accès non autorisé.
 */
export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/**
 * Retourne l'utilisateur connecté s'il est FORMATEUR ou ADMIN (les admins peuvent
 * aussi accéder à l'espace enseignant pour dépanner), sinon null.
 */
export async function getCurrentTeacher() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "FORMATEUR" && user.role !== "ADMIN")) return null;
  return user;
}
