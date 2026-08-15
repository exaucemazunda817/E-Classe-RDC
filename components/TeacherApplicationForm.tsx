"use client";

import { useState } from "react";
import { IconUpload, IconFileText, IconCheckCircle } from "@/lib/icons";

type Category = { id: string; name: string };

const MAX_CV_BYTES = 4 * 1024 * 1024;

export default function TeacherApplicationForm({ categories }: { categories: Category[] }) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError("");

    if (file) {
      if (file.type !== "application/pdf") {
        setError("Le CV doit être un fichier PDF.");
        setCvFile(null);
        e.target.value = "";
        return;
      }
      if (file.size > MAX_CV_BYTES) {
        setError("Le CV dépasse la taille maximale de 4 Mo.");
        setCvFile(null);
        e.target.value = "";
        return;
      }
    }
    setCvFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!cvFile) {
      setError("Merci de joindre ton CV en PDF.");
      return;
    }
    if (!agreed) {
      setError("Merci de confirmer que tu remplis les conditions d'éligibilité.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("cv", cvFile);

    try {
      const res = await fetch("/api/teacher-applications", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        setError(data?.error ?? "Une erreur est survenue. Réessaie.");
        return;
      }

      setDone(true);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-10 text-center">
        <IconCheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
        <p className="font-display font-bold text-lg text-brand-navy mb-2">
          Candidature envoyée !
        </p>
        <p className="text-sm text-brand-slate/70 max-w-sm mx-auto">
          Merci pour ta candidature. Notre équipe l'examine et te contactera par email si elle est
          retenue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nom complet *">
          <input name="fullName" required className="input" placeholder="Ton nom et prénom" />
        </Field>
        <Field label="Email *">
          <input name="email" type="email" required className="input" placeholder="toi@email.com" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Téléphone / WhatsApp (optionnel)">
          <input name="phone" className="input" placeholder="+243 ..." />
        </Field>
        <Field label="Domaine que tu souhaites enseigner *">
          <select name="categoryId" required className="input" defaultValue="">
            <option value="" disabled>
              Choisis un domaine
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Ton expérience / tes qualifications dans ce domaine *">
        <textarea
          name="experience"
          required
          rows={3}
          className="input"
          placeholder="Diplômes, expérience professionnelle, réalisations concrètes..."
        />
      </Field>

      <Field label="Pourquoi veux-tu devenir formateur sur E-Classe RDC ? *">
        <textarea
          name="motivation"
          required
          rows={4}
          className="input"
          placeholder="Parle-nous de ta motivation..."
        />
      </Field>

      <Field label="Portfolio, LinkedIn ou chaîne YouTube (optionnel)">
        <input name="portfolioUrl" type="url" className="input" placeholder="https://..." />
      </Field>

      <Field label="CV (PDF, 4 Mo maximum) *">
        <label className="flex items-center gap-3 rounded-xl border border-dashed border-brand-line bg-brand-line/10 px-4 py-3.5 cursor-pointer hover:border-brand-blue/40 transition-colors">
          {cvFile ? (
            <IconFileText className="w-5 h-5 text-brand-blue shrink-0" />
          ) : (
            <IconUpload className="w-5 h-5 text-brand-slate/50 shrink-0" />
          )}
          <span className="text-sm text-brand-slate/70 truncate">
            {cvFile ? cvFile.name : "Cliquer pour choisir un fichier PDF"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleCvChange}
            className="hidden"
          />
        </label>
      </Field>

      <label className="flex items-start gap-2.5 text-sm text-brand-slate/70">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-gray-300 shrink-0"
        />
        Je certifie remplir les conditions d'éligibilité ci-dessus et que les informations fournies
        sont exactes.
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-8 py-3 rounded-full disabled:opacity-60"
      >
        {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
      </button>

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
      <label className="block text-sm font-medium text-brand-navy mb-1.5">{label}</label>
      {children}
    </div>
  );
}
