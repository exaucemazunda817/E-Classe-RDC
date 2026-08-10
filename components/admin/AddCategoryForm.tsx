"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    setName("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la catégorie"
        className="flex-1 rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60"
      >
        {loading ? "..." : "Ajouter"}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </form>
  );
}
