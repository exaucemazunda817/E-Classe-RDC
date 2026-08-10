"use client";

import { signOut } from "next-auth/react";
import { IconLogOut } from "@/lib/icons";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
      aria-label="Se déconnecter"
      title="Se déconnecter"
    >
      <IconLogOut className="w-4 h-4" />
    </button>
  );
}
