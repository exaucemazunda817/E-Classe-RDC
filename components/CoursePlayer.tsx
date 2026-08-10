"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlay, IconMedal } from "@/lib/icons";

type Lesson = { id: string; title: string; order: number };

export default function CoursePlayer({
  courseId,
  lessons,
  isLoggedIn,
  isEnrolled,
  completedLessonIds,
  isCourseCompleted,
  certifying,
  hasCertificate,
}: {
  courseId: string;
  lessons: Lesson[];
  isLoggedIn: boolean;
  isEnrolled: boolean;
  completedLessonIds: string[];
  isCourseCompleted: boolean;
  certifying: boolean;
  hasCertificate: boolean;
}) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [done, setDone] = useState<Set<string>>(new Set(completedLessonIds));
  const [justCertified, setJustCertified] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const allDone = lessons.length > 0 && lessons.every((l) => done.has(l.id));

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setEnrolling(true);
    await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
    setEnrolled(true);
    setEnrolling(false);
    router.refresh();
  }

  async function handleCompleteLesson(lessonId: string) {
    if (done.has(lessonId)) return;
    setLoadingId(lessonId);
    const res = await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
    const data = await res.json();
    setDone((prev) => new Set(prev).add(lessonId));
    setLoadingId(null);
    if (data.certificate) setJustCertified(true);
    router.refresh();
  }

  if (!enrolled) {
    return (
      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white font-semibold px-8 py-3.5 rounded-full disabled:opacity-60"
      >
        {enrolling ? "Inscription..." : isLoggedIn ? "S'inscrire à cette formation" : "Se connecter pour s'inscrire"}
      </button>
    );
  }

  return (
    <div>
      {(justCertified || (isCourseCompleted && hasCertificate)) && certifying && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 mb-6">
          <IconMedal className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-display font-bold text-emerald-800 text-sm">Formation terminée 🎉</p>
            <p className="text-xs text-emerald-700/80">
              Ton certificat a été généré automatiquement — retrouve-le dans "Mes Certificats".
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {lessons.map((lesson, i) => {
          const isDone = done.has(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => handleCompleteLesson(lesson.id)}
              disabled={isDone || loadingId === lesson.id}
              className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                isDone
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-brand-line bg-white hover:border-brand-blue/40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isDone ? "bg-emerald-500 text-white" : "bg-brand-blue/8 text-brand-blue"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium flex-1 ${isDone ? "text-emerald-800" : "text-brand-navy"}`}>
                {lesson.title}
              </span>
              {!isDone && (
                <span className="flex items-center gap-1 text-xs font-semibold text-brand-blue shrink-0">
                  <IconPlay className="w-3.5 h-3.5" />
                  {loadingId === lesson.id ? "..." : "Marquer terminé"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
