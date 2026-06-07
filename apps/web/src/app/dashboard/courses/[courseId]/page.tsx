"use client";

import { use, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { LessonDto } from "@app/shared";
import {
  useCourse,
  useProgress,
  useCompleteLesson,
  useGenerateCertificate,
} from "@/lib/queries";

export default function CoursePlayer({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: progress } = useProgress(courseId);
  const complete = useCompleteLesson(courseId);
  const generateCert = useGenerateCertificate();
  const [activeLesson, setActiveLesson] = useState<LessonDto | null>(null);

  const allLessons = useMemo(
    () => course?.modules.flatMap((m) => m.lessons) ?? [],
    [course],
  );

  useEffect(() => {
    if (!activeLesson && allLessons.length > 0) {
      const last = progress?.lastLessonId;
      setActiveLesson(allLessons.find((l) => l.id === last) ?? allLessons[0]);
    }
  }, [allLessons, progress, activeLesson]);

  if (isLoading || !course) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  const completedSet = new Set(progress?.completedLessonIds ?? []);
  const isDone = progress?.isCompleted ?? false;

  async function generate() {
    const cert = await generateCert.mutateAsync(courseId);
    router.push(`/dashboard/certificates`);
    return cert;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold">{course.title}</h1>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-200">Progreso del curso</span>
          <span className="font-medium text-brand-300">{progress?.percentage ?? 0}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-800">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${progress?.percentage ?? 0}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Player */}
        <div className="lg:col-span-2">
          {activeLesson?.videoUrl ? (
            <div className="aspect-video overflow-hidden rounded-2xl border border-ink-800 bg-black">
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-ink-800 bg-ink-900 text-ink-200">
              Selecciona una lección
            </div>
          )}

          {activeLesson && (
            <div className="card mt-4 p-5">
              <h2 className="text-lg font-semibold">{activeLesson.title}</h2>
              {activeLesson.description && (
                <p className="mt-2 text-sm text-ink-200">{activeLesson.description}</p>
              )}
              <button
                onClick={() =>
                  complete.mutate({
                    lessonId: activeLesson.id,
                    completed: !completedSet.has(activeLesson.id),
                  })
                }
                className="btn-secondary mt-4"
                disabled={complete.isPending}
              >
                {completedSet.has(activeLesson.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-brand-400" /> Completada
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" /> Marcar como completada
                  </>
                )}
              </button>
            </div>
          )}

          {isDone && (
            <div className="card mt-4 border-brand-500/40 bg-brand-500/10 p-5">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-brand-400" />
                <div className="flex-1">
                  <div className="font-semibold">¡Curso completado!</div>
                  <div className="text-sm text-ink-200">Genera tu certificado oficial.</div>
                </div>
                <button onClick={generate} className="btn-primary" disabled={generateCert.isPending}>
                  {generateCert.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Obtener certificado
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Curriculum */}
        <div className="space-y-4">
          {course.modules.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <div className="border-b border-ink-800 bg-ink-900/60 px-4 py-3 text-sm font-semibold">
                {m.title}
              </div>
              <ul>
                {m.lessons.map((l) => {
                  const done = completedSet.has(l.id);
                  const active = activeLesson?.id === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => setActiveLesson(l)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                          active ? "bg-brand-500/10" : "hover:bg-ink-800"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-ink-700" />
                        )}
                        <span className="flex-1">{l.title}</span>
                        {l.durationMin && (
                          <span className="text-xs text-ink-200">{l.durationMin}m</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
