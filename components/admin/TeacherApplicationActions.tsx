"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherApplicationActions({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"ACCEPTED" | "REJECTED" | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [showRejectNote, setShowRejectNote] = useState(false);

  async function updateStatus(newStatus: "ACCEPTED" | "REJECTED") {
    setLoading(newStatus);
    setError("");

    try {
      const res = await fetch(`/api/admin/teacher-applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNote: note || undefined }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        setError(data?.error ?? "Une erreur est survenue. Réessaie.");
        return;
      }

      router.refresh();
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(null);
    }
  }

  if (status !== "PENDING") return null;

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5">
      {showRejectNote && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Motif du refus (optionnel, usage interne)"
          rows={2}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => updateStatus("ACCEPTED")}
          disabled={loading !== null}
          className="bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-60"
        >
          {loading === "ACCEPTED" ? "..." : "Accepter la candidature"}
        </button>

        {!showRejectNote ? (
          <button
            onClick={() => setShowRejectNote(true)}
            className="border border-brand-line text-sm font-semibold text-brand-slate/70 px-5 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
          >
            Refuser
          </button>
        ) : (
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={loading !== null}
            className="bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-60"
          >
            {loading === "REJECTED" ? "..." : "Confirmer le refus"}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
