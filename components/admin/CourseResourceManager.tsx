"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IconFileText, IconUpload } from "@/lib/icons";

type Resource = {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function CourseResourceManager({
  courseId,
  resources,
}: {
  courseId: string;
  resources: Resource[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!title.trim() || !file) {
      setError("Le titre et le fichier sont requis.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("file", file);

    const res = await fetch(`/api/admin/courses/${courseId}/resources`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    setTitle("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div>
      {resources.length === 0 ? (
        <p className="text-sm text-brand-slate/50 mb-3">Aucun document pour l'instant.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3"
            >
              <IconFileText className="w-4.5 h-4.5 text-brand-blue shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-navy font-medium truncate">{r.title}</p>
                <p className="text-xs text-brand-slate/50 truncate">
                  {r.fileName} · {formatSize(r.fileSize)}
                </p>
              </div>
              <a
                href={`/api/admin/resources/${r.id}/file`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-brand-blue hover:text-brand-navy shrink-0"
              >
                Voir
              </a>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                className="text-xs font-semibold text-red-500 hover:text-red-600 shrink-0"
              >
                {deletingId === r.id ? "..." : "Retirer"}
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleUpload}
        className="space-y-2 rounded-xl border border-dashed border-brand-line p-4"
      >
        <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-wide mb-1">
          Ajouter un document
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre (ex : Support de cours, Chapitre 1)"
          className="input"
        />
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="input" />
        <p className="text-xs text-brand-slate/50">PDF ou Word, 15 Mo maximum.</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-navy hover:bg-brand-blue transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          <IconUpload className="w-4 h-4" />
          {loading ? "Envoi..." : "Ajouter"}
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
