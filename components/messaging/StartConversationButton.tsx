"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMessageCircle } from "@/lib/icons";

export default function StartConversationButton({
  courseId,
  studentId,
  basePath,
  label = "Envoyer un message",
  className,
}: {
  courseId: string;
  studentId?: string;
  basePath: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentId }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        setError(data?.error ?? "Une erreur est survenue. Réessaie.");
        return;
      }

      router.push(`${basePath}/${data.id}`);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-60"
        }
      >
        <IconMessageCircle className="w-4 h-4" />
        {loading ? "..." : label}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
