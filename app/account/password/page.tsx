import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import PasswordForm from "@/components/PasswordForm";
import BottomNav from "@/components/BottomNav";

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <>
      <Link href="/account/profile" className="text-sm text-brand-blue font-semibold mb-4 inline-block">
        ← Retour au profil
      </Link>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-6">
        Changer le mot de passe
      </h1>
      <PasswordForm />
      <BottomNav active="/account" />
    </>
  );
}
