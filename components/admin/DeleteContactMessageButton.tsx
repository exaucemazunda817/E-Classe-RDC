"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteContactMessageButton({ messageId }: { messageId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/contact-messages/${messageId}`, { method: "DELETE" });
    router.push("/admin/contact-messages");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-slate/60">Supprimer ce message ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full px-4 py-2 disabled:opacity-60"
        >
          {loading ? "..." : "Oui, supprimer"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-semibold text-brand-slate/60 border border-brand-line rounded-full px-4 py-2"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm font-semibold text-red-500 border border-red-200 rounded-full px-5 py-2.5 hover:bg-red-50 transition-colors"
    >
      Supprimer
    </button>
  );
}
