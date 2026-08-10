"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Lesson = { id: string; title: string; order: number };

export default function LessonManager({ courseId, lessons }: { courseId: string; lessons: Lesson[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    await fetch(`/api/admin/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(lessonId: string) {
    setDeletingId(lessonId);
    await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {lessons.length === 0 && (
          <p className="text-sm text-brand-slate/50">Aucune leçon pour l'instant.</p>
        )}
        {lessons.map((l, i) => (
          <div
            key={l.id}
            className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3"
          >
            <span className="w-6 h-6 rounded-full bg-brand-blue/8 text-brand-blue text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-brand-navy flex-1">{l.title}</span>
            <button
              onClick={() => handleDelete(l.id)}
              disabled={deletingId === l.id}
              className="text-xs font-semibold text-red-500 hover:text-red-600"
            >
              {deletingId === l.id ? "..." : "Retirer"}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la nouvelle leçon"
          className="flex-1 rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 bg-brand-navy hover:bg-brand-blue transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          {loading ? "..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
