import { getCurrentUser } from "@/lib/session";
import ProfileForm from "@/components/ProfileForm";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-6">Modifier mon profil</h1>
      <ProfileForm initialName={user.name} email={user.email} />

      <div className="max-w-md mt-8 pt-8 border-t border-brand-line">
        <p className="font-display font-bold text-brand-navy text-sm mb-1">Sécurité</p>
        <p className="text-sm text-brand-slate/60 mb-3">Modifie le mot de passe de ton compte.</p>
        <Link
          href="/account/password"
          className="inline-flex text-sm font-semibold text-brand-blue border border-brand-line rounded-full px-5 py-2.5 hover:border-brand-blue/40 transition-colors"
        >
          Changer le mot de passe
        </Link>
      </div>

      <BottomNav active="/account" />
    </>
  );
}
