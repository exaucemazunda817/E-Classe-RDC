"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlay } from "@/lib/icons";

type Lesson = { id: string; title: string; order: number; videoUrl: string | null; content: string | null };

const emptyDraft = { title: "", videoUrl: "", content: "" };

export default function LessonManager({
  courseId,
  lessons,
  apiBase = "/api/admin",
}: {
  courseId: string;
  lessons: Lesson[];
  apiBase?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(emptyDraft);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setLoading(true);

    await fetch(`${apiBase}/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    setDraft(emptyDraft);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(lessonId: string) {
    setDeletingId(lessonId);
    await fetch(`${apiBase}/lessons/${lessonId}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    setEditDraft({
      title: lesson.title,
      videoUrl: lesson.videoUrl ?? "",
      content: lesson.content ?? "",
    });
  }

  async function handleSaveEdit(lessonId: string) {
    if (!editDraft.title.trim()) return;
    setSavingEdit(true);
    await fetch(`${apiBase}/lessons/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    setSavingEdit(false);
    setEditingId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="space-y-2 mb-6">
        {lessons.length === 0 && (
          <p className="text-sm text-brand-slate/50">Aucune leçon pour l'instant.</p>
        )}
        {lessons.map((l, i) =>
          editingId === l.id ? (
            <div key={l.id} className="rounded-xl border border-brand-blue/40 bg-white p-4 space-y-3">
              <input
                value={editDraft.title}
                onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                placeholder="Titre de la leçon"
                className="input"
              />
              <input
                value={editDraft.videoUrl}
                onChange={(e) => setEditDraft({ ...editDraft, videoUrl: e.target.value })}
                placeholder="Lien vidéo (YouTube, Vimeo, ou fichier .mp4) — optionnel"
                className="input"
              />
              <textarea
                value={editDraft.content}
                onChange={(e) => setEditDraft({ ...editDraft, content: e.target.value })}
                placeholder="Contenu / notes de la leçon — optionnel"
                rows={3}
                className="input"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveEdit(l.id)}
                  disabled={savingEdit}
                  className="text-xs font-semibold text-white bg-brand-navy hover:bg-brand-blue rounded-full px-4 py-2 disabled:opacity-60"
                >
                  {savingEdit ? "..." : "Enregistrer"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs font-semibold text-brand-slate/60 border border-brand-line rounded-full px-4 py-2"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div
              key={l.id}
              className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3"
            >
              <span className="w-6 h-6 rounded-full bg-brand-blue/8 text-brand-blue text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-brand-navy flex-1">{l.title}</span>
              {l.videoUrl && (
                <span className="flex items-center gap-1 text-xs font-semibold text-brand-blue shrink-0">
                  <IconPlay className="w-3.5 h-3.5" /> Vidéo
                </span>
              )}
              <button
                onClick={() => startEdit(l)}
                className="text-xs font-semibold text-brand-blue hover:text-brand-navy shrink-0"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(l.id)}
                disabled={deletingId === l.id}
                className="text-xs font-semibold text-red-500 hover:text-red-600 shrink-0"
              >
                {deletingId === l.id ? "..." : "Retirer"}
              </button>
            </div>
          )
        )}
      </div>

      <form onSubmit={handleAdd} className="space-y-2 rounded-xl border border-dashed border-brand-line p-4">
        <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide mb-1">
          Nouvelle leçon
        </p>
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Titre de la leçon"
          className="input"
        />
        <input
          value={draft.videoUrl}
          onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
          placeholder="Lien vidéo (YouTube, Vimeo, ou fichier .mp4) — optionnel"
          className="input"
        />
        <textarea
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          placeholder="Contenu / notes de la leçon — optionnel"
          rows={3}
          className="input"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-navy hover:bg-brand-blue transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          {loading ? "..." : "Ajouter la leçon"}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e4e7eb;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #1b5fa8;
        }
      `}</style>
    </div>
  );
}
