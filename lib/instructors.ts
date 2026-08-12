import { prisma } from "@/lib/prisma";

/**
 * Liste des comptes pouvant être liés à une formation comme formateur.
 * Utilisé pour alimenter le sélecteur du formulaire admin.
 */
export function listTeacherAccounts() {
  return prisma.user.findMany({
    where: { role: { in: ["FORMATEUR", "ADMIN"] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Vérifie qu'un compte formateur choisi existe et a bien le rôle voulu.
 * Renvoie un message d'erreur en français, ou null si tout va bien.
 */
export async function validateInstructor(instructorId: string | null | undefined) {
  if (!instructorId) return null;

  const user = await prisma.user.findUnique({ where: { id: instructorId } });
  if (!user) return "Ce compte formateur est introuvable.";
  if (user.role !== "FORMATEUR" && user.role !== "ADMIN") {
    return "Ce compte n'a pas le rôle Formateur.";
  }
  return null;
}
