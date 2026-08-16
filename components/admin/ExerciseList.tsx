"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconClipboardList } from "@/lib/icons";

type Exercise = { id: string; title: string; questionCount: number };

export default function ExerciseList({
  courseId,
  exercises,
}: {
  courseId: string;
  exercises: Exercise[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/admin/exercises/${id}`, { method: "DELETE" });
    setDeletingId(null);
    setConfirmingId(null);
    router.refresh();
  }

  return (
    <div>
      {exercises.length === 0 ? (
        <p className="text-sm text-brand-slate/50 mb-3">Aucun questionnaire pour l'instant.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3"
            >
              <IconClipboardList className="w-4.5 h-4.5 text-brand-blue shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-navy font-medium truncate">{ex.title}</p>
                <p className="text-xs text-brand-slate/50">
                  {ex.questionCount} question{ex.questionCount > 1 ? "s" : ""}
                </p>
              </div>
              <Link
                href={`/admin/courses/${courseId}/exercises/${ex.id}`}
                className="text-xs font-semibold text-brand-blue hover:text-brand-navy shrink-0"
              >
                Modifier
              </Link>
              {confirmingId === ex.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(ex.id)}
                    disabled={deletingId === ex.id}
                    className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1.5 disabled:opacity-60"
                  >
                    {deletingId === ex.id ? "..." : "Confirmer"}
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="text-xs font-semibold text-brand-slate/60"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingId(ex.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 shrink-0"
                >
                  Retirer
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/admin/courses/${courseId}/exercises/new`}
        className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-blue transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
      >
        + Nouveau questionnaire
      </Link>
    </div>
  );
}
