"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { IconPlay, IconUpload } from "@/lib/icons";

type Lesson = { id: string; title: string; order: number; videoUrl: string | null; content: string | null };

function VideoField({
  videoFile,
  onVideoFile,
  currentVideoUrl,
  onRemoveVideo,
}: {
  videoFile: File | null;
  onVideoFile: (f: File | null) => void;
  currentVideoUrl?: string | null;
  onRemoveVideo?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
        onChange={(e) => onVideoFile(e.target.files?.[0] ?? null)}
        className="input"
      />
      {videoFile ? (
        <p className="text-xs text-brand-slate/60 mt-1">Nouveau fichier : {videoFile.name}</p>
      ) : currentVideoUrl ? (
        <div className="flex items-center gap-2 mt-1">
          <a
            href={currentVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-brand-blue hover:underline"
          >
            Voir la vidéo actuelle
          </a>
          {onRemoveVideo && (
            <button type="button" onClick={onRemoveVideo} className="text-xs text-red-500 hover:text-red-600">
              Retirer
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-brand-slate/50 mt-1">Fichier vidéo (mp4, webm...) — optionnel, 300 Mo max.</p>
      )}
    </div>
  );
}

const emptyDraft = { title: "", content: "" };

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
  const [draftVideoFile, setDraftVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ title: "", content: "", videoUrl: "" as string | null });
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  async function uploadVideoIfNeeded(file: File | null): Promise<string | undefined> {
    if (!file) return undefined;
    setUploadProgress(0);
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload-video",
      onUploadProgress: (p) => setUploadProgress(Math.round(p.percentage)),
    });
    setUploadProgress(null);
    return blob.url;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setLoading(true);

    const videoUrl = await uploadVideoIfNeeded(draftVideoFile);

    await fetch(`${apiBase}/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, videoUrl: videoUrl ?? "" }),
    });

    setDraft(emptyDraft);
    setDraftVideoFile(null);
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
    setEditDraft({ title: lesson.title, content: lesson.content ?? "", videoUrl: lesson.videoUrl });
    setEditVideoFile(null);
  }

  async function handleSaveEdit(lessonId: string) {
    if (!editDraft.title.trim()) return;
    setSavingEdit(true);

    const uploadedUrl = await uploadVideoIfNeeded(editVideoFile);
    const videoUrl = uploadedUrl ?? editDraft.videoUrl ?? "";

    await fetch(`${apiBase}/lessons/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editDraft.title, content: editDraft.content, videoUrl }),
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
              <VideoField
                videoFile={editVideoFile}
                onVideoFile={setEditVideoFile}
                currentVideoUrl={editDraft.videoUrl}
                onRemoveVideo={() => setEditDraft({ ...editDraft, videoUrl: "" })}
              />
              <textarea
                value={editDraft.content}
                onChange={(e) => setEditDraft({ ...editDraft, content: e.target.value })}
                placeholder="Contenu / notes de la leçon — optionnel"
                rows={3}
                className="input"
              />
              {savingEdit && uploadProgress !== null && (
                <p className="text-xs text-brand-blue">Envoi de la vidéo... {uploadProgress}%</p>
              )}
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
        <VideoField videoFile={draftVideoFile} onVideoFile={setDraftVideoFile} />
        <textarea
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          placeholder="Contenu / notes de la leçon — optionnel"
          rows={3}
          className="input"
        />
        {loading && uploadProgress !== null && (
          <p className="text-xs text-brand-blue">Envoi de la vidéo... {uploadProgress}%</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-navy hover:bg-brand-blue transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          <IconUpload className="w-4 h-4" />
          {loading ? "Envoi..." : "Ajouter la leçon"}
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
