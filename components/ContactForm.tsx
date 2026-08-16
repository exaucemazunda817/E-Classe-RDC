"use client";

import { useState } from "react";
import { IconCheckCircle } from "@/lib/icons";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => null);

      if (!res.ok || !result) {
        setError(result?.error ?? "Une erreur est survenue. Réessaie.");
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
        <p className="font-display font-bold text-lg text-brand-navy mb-2">Message envoyé !</p>
        <p className="text-sm text-brand-slate/70 max-w-sm mx-auto">
          Merci de nous avoir écrit. Notre équipe te répondra par email dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nom complet *">
          <input name="name" required className="input" placeholder="Ton nom" />
        </Field>
        <Field label="Email *">
          <input name="email" type="email" required className="input" placeholder="toi@email.com" />
        </Field>
      </div>

      <Field label="Objet *">
        <input name="subject" required className="input" placeholder="De quoi veux-tu nous parler ?" />
      </Field>

      <Field label="Message *">
        <textarea name="message" required rows={5} className="input" placeholder="Ton message..." />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-8 py-3 rounded-full disabled:opacity-60"
      >
        {loading ? "Envoi en cours..." : "Envoyer le message"}
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
