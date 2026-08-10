"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCourseButton({ courseId, courseTitle }: { courseId: string; courseTitle: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-brand-slate/60 hidden sm:inline">Supprimer ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1.5"
        >
          {loading ? "..." : "Oui"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-semibold text-brand-slate/60 border border-brand-line rounded-full px-3 py-1.5"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Supprimer "${courseTitle}"`}
      className="shrink-0 text-xs font-semibold text-red-500 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors"
    >
      Supprimer
    </button>
  );
}
