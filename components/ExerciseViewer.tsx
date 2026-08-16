"use client";

import { useState } from "react";
import { IconClipboardList } from "@/lib/icons";

type Question = { id: string; question: string; choices: string[]; correctChoice: number | null };
type Exercise = { id: string; title: string; instructions: string | null; questions: Question[] };

function QuestionBlock({ question, index }: { question: Question; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const hasChoices = question.choices.length > 0;

  return (
    <div className="rounded-xl border border-brand-line bg-white p-4">
      <p className="text-sm font-medium text-brand-navy mb-3">
        {index + 1}. {question.question}
      </p>

      {hasChoices ? (
        <div className="space-y-2">
          {question.choices.map((choice, cIndex) => {
            const isSelected = selected === cIndex;
            const isCorrect = question.correctChoice === cIndex;
            const showResult = selected !== null;

            let style = "border-brand-line hover:border-brand-blue/40";
            if (showResult && isSelected && isCorrect) style = "border-emerald-400 bg-emerald-50";
            else if (showResult && isSelected && !isCorrect) style = "border-red-300 bg-red-50";
            else if (showResult && isCorrect) style = "border-emerald-400 bg-emerald-50";

            return (
              <button
                key={cIndex}
                type="button"
                onClick={() => setSelected(cIndex)}
                disabled={selected !== null}
                className={`w-full text-left text-sm rounded-lg border px-3 py-2 transition-colors ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-brand-slate/50">Question ouverte — pas de correction automatique.</p>
      )}
    </div>
  );
}

export default function ExerciseViewer({ exercise }: { exercise: Exercise }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-brand-blue/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <IconClipboardList className="w-4.5 h-4.5 text-brand-blue shrink-0" />
        <p className="font-display font-bold text-brand-navy text-sm">{exercise.title}</p>
      </div>
      {exercise.instructions && (
        <p className="text-xs text-brand-slate/60 mb-4 ml-6">{exercise.instructions}</p>
      )}
      <div className="space-y-3 mt-4">
        {exercise.questions.map((q, i) => (
          <QuestionBlock key={q.id} question={q} index={i} />
        ))}
      </div>
    </div>
  );
}
