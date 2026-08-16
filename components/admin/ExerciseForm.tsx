"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconX } from "@/lib/icons";

type Question = { question: string; choices: string[]; correctChoice: number | null };

type ExerciseData = {
  id?: string;
  title: string;
  instructions: string;
  questions: Question[];
};

const emptyQuestion: Question = { question: "", choices: [], correctChoice: null };

const emptyExercise: ExerciseData = {
  title: "",
  instructions: "",
  questions: [{ ...emptyQuestion }],
};

export default function ExerciseForm({
  courseId,
  initial,
}: {
  courseId: string;
  initial?: ExerciseData;
}) {
  const router = useRouter();
  const [data, setData] = useState<ExerciseData>(initial ?? emptyExercise);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const isEditing = !!initial?.id;

  function updateQuestion(index: number, patch: Partial<Question>) {
    setData((d) => ({
      ...d,
      questions: d.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    }));
  }

  function addQuestion() {
    setData((d) => ({ ...d, questions: [...d.questions, { ...emptyQuestion }] }));
  }

  function removeQuestion(index: number) {
    setData((d) => ({ ...d, questions: d.questions.filter((_, i) => i !== index) }));
  }

  function addChoice(index: number) {
    updateQuestion(index, { choices: [...data.questions[index].choices, ""] });
  }

  function updateChoice(qIndex: number, cIndex: number, value: string) {
    const choices = [...data.questions[qIndex].choices];
    choices[cIndex] = value;
    updateQuestion(qIndex, { choices });
  }

  function removeChoice(qIndex: number, cIndex: number) {
    const q = data.questions[qIndex];
    const choices = q.choices.filter((_, i) => i !== cIndex);
    const correctChoice =
      q.correctChoice === cIndex ? null : q.correctChoice !== null && q.correctChoice > cIndex ? q.correctChoice - 1 : q.correctChoice;
    updateQuestion(qIndex, { choices, correctChoice });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const payload = {
      title: data.title,
      instructions: data.instructions,
      questions: data.questions.map((q) => ({
        question: q.question,
        choices: q.choices.filter((c) => c.trim() !== ""),
        correctChoice: q.correctChoice,
      })),
    };

    const res = await fetch(
      isEditing ? `/api/admin/exercises/${initial!.id}` : `/api/admin/courses/${courseId}/exercises`,
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
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
      router.push(`/admin/courses/${courseId}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <Field label="Titre du questionnaire">
        <input
          required
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="input"
        />
      </Field>

      <Field label="Instructions (optionnel)">
        <textarea
          rows={2}
          value={data.instructions}
          onChange={(e) => setData({ ...data, instructions: e.target.value })}
          className="input"
        />
      </Field>

      <div className="space-y-3">
        {data.questions.map((q, qIndex) => (
          <div key={qIndex} className="rounded-xl border border-brand-line bg-white p-4 space-y-3">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-blue/8 text-brand-blue text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                {qIndex + 1}
              </span>
              <textarea
                required
                rows={2}
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                placeholder="Texte de la question"
                className="input flex-1"
              />
              {data.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-600 shrink-0 mt-1"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="pl-8 space-y-2">
              {q.choices.map((choice, cIndex) => (
                <div key={cIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctChoice === cIndex}
                    onChange={() => updateQuestion(qIndex, { correctChoice: cIndex })}
                    title="Marquer comme bonne réponse"
                  />
                  <input
                    value={choice}
                    onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                    placeholder={`Choix ${cIndex + 1}`}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeChoice(qIndex, cIndex)}
                    className="text-red-500 hover:text-red-600 shrink-0"
                  >
                    <IconX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addChoice(qIndex)}
                className="text-xs font-semibold text-brand-blue hover:text-brand-navy"
              >
                + Ajouter un choix de réponse
              </button>
              {q.choices.length === 0 && (
                <p className="text-xs text-brand-slate/50">
                  Aucun choix : cette question sera affichée comme une question ouverte.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className="text-sm font-semibold text-brand-blue hover:text-brand-navy"
      >
        + Ajouter une question
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le questionnaire"}
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
