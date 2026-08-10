"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-400"
        />
        <p className="text-xs text-brand-slate/50 mt-1">L'email ne peut pas être modifié pour l'instant.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
      {saved && <p className="text-emerald-600 text-sm">Profil mis à jour ✓</p>}
    </form>
  );
}
