"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type Teacher = { id: string; name: string; email: string };

type CourseData = {
  id?: string;
  title: string;
  description: string;
  categoryId: string;
  level: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  type: "GRATUITE" | "ABORDABLE" | "CERTIFIANTE" | "EXPERTE";
  priceCDF: number;
  certifying: boolean;
  instructor: string;
  instructorId?: string; // "" = aucun compte lié
};

const emptyCourse: CourseData = {
  title: "",
  description: "",
  categoryId: "",
  level: "DEBUTANT",
  type: "GRATUITE",
  priceCDF: 0,
  certifying: false,
  instructor: "",
  instructorId: "",
};

export default function CourseForm({
  categories,
  teachers,
  initial,
  apiBase = "/api/admin",
  redirectBase = "/admin/courses",
}: {
  categories: Category[];
  /** Fourni uniquement côté admin : permet de lier un vrai compte formateur. */
  teachers?: Teacher[];
  initial?: CourseData;
  apiBase?: string;
  redirectBase?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<CourseData>(initial ?? { ...emptyCourse, categoryId: categories[0]?.id ?? "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const isEditing = !!initial?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const payload: Record<string, unknown> = {
      ...data,
      priceCDF: Math.round(Number(data.priceCDF)),
    };

    // Le lien vers un compte formateur n'est modifiable que depuis l'espace admin :
    // ailleurs, on ne l'envoie pas du tout pour ne pas risquer de le réattribuer.
    if (teachers) {
      payload.instructorId = data.instructorId ? data.instructorId : null;
    } else {
      delete payload.instructorId;
    }

    const res = await fetch(isEditing ? `${apiBase}/courses/${initial!.id}` : `${apiBase}/courses`, {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    setLoading(false);

    if (isEditing) {
      setSaved(true);
      router.refresh();
    } else {
      router.push(`${redirectBase}/${result.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <Field label="Titre">
        <input
          required
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="input"
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={3}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="input"
        />
      </Field>

      <Field label="Catégorie">
        <select
          required
          value={data.categoryId}
          onChange={(e) => setData({ ...data, categoryId: e.target.value })}
          className="input"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Niveau">
          <select
            value={data.level}
            onChange={(e) => setData({ ...data, level: e.target.value as CourseData["level"] })}
            className="input"
          >
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
          </select>
        </Field>

        <Field label="Type">
          <select
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value as CourseData["type"] })}
            className="input"
          >
            <option value="GRATUITE">Gratuite</option>
            <option value="ABORDABLE">Abordable</option>
            <option value="CERTIFIANTE">Certifiante</option>
            <option value="EXPERTE">Experte</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Prix (FC, 0 si gratuit)">
          <input
            type="number"
            min={0}
            step="1"
            value={data.priceCDF}
            onChange={(e) => setData({ ...data, priceCDF: Number(e.target.value) })}
            className="input"
          />
        </Field>

        <Field label="Formateur — nom affiché (optionnel)">
          <input
            value={data.instructor}
            onChange={(e) => setData({ ...data, instructor: e.target.value })}
            className="input"
          />
        </Field>
      </div>

      {teachers && (
        <Field label="Compte formateur lié">
          <select
            value={data.instructorId ?? ""}
            onChange={(e) => setData({ ...data, instructorId: e.target.value })}
            className="input"
          >
            <option value="">— Aucun compte lié —</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-brand-slate/60 mt-1.5">
            {teachers.length === 0
              ? "Aucun compte n'a le rôle Formateur pour l'instant. Attribue ce rôle depuis « Utilisateurs »."
              : "Nécessaire pour que les étudiants inscrits puissent écrire au formateur depuis la page de la formation."}
          </p>
        </Field>
      )}

      <label className="flex items-center gap-2 text-sm text-brand-slate">
        <input
          type="checkbox"
          checked={data.certifying}
          onChange={(e) => setData({ ...data, certifying: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300"
        />
        Cette formation délivre un certificat à la fin
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer la formation"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            ✓ Modifications enregistrées
          </span>
        )}
      </div>

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
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
