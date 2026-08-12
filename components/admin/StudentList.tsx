"use client";

import { useEffect, useState } from "react";
import StartConversationButton from "@/components/messaging/StartConversationButton";

type StudentEnrollment = {
  id: string;
  progress: number;
  completed: boolean;
  enrolledAt: string;
  user: { id: string; name: string; email: string };
};

export default function StudentList({ courseId }: { courseId: string }) {
  const [students, setStudents] = useState<StudentEnrollment[] | null>(null);

  useEffect(() => {
    fetch(`/api/teacher/courses/${courseId}/students`)
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []));
  }, [courseId]);

  if (students === null) {
    return <p className="text-sm text-brand-slate/50">Chargement...</p>;
  }

  if (students.length === 0) {
    return (
      <p className="text-sm text-brand-slate/50">
        Aucun étudiant inscrit pour l'instant.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
      {students.map((s, i) => (
        <div
          key={s.id}
          className={`flex items-center gap-4 px-4 py-3 ${i !== 0 ? "border-t border-brand-line" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
            {s.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-brand-navy truncate">{s.user.name}</p>
            <p className="text-xs text-brand-slate/50 truncate">{s.user.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-20 h-1.5 bg-brand-line rounded-full overflow-hidden hidden sm:block">
              <div
                className={`h-full rounded-full ${s.completed ? "bg-emerald-500" : "bg-brand-blue"}`}
                style={{ width: `${s.progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-brand-slate/60 w-16 text-right">
              {s.completed ? "Terminé" : `${s.progress}%`}
            </span>
          </div>
          <StartConversationButton
            courseId={courseId}
            studentId={s.user.id}
            basePath="/teacher/messages"
            label="Message"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue border border-brand-line rounded-full px-3 py-1.5 hover:border-brand-blue/40 transition-colors"
          />
        </div>
      ))}
    </div>
  );
}
