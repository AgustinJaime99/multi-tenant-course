"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, PlayCircle, Trophy } from "lucide-react";
import type { CourseProgressDto } from "@app/shared";
import { ProgressBar } from "@/components/player/progress-bar";

interface Props {
  coverImage?: string | null;
  title: string;
  courseId: string;
  progress: CourseProgressDto | null;
}

export function EnrolledBox({ coverImage, title, courseId, progress }: Props) {
  const pct = progress?.percentage ?? 0;
  const completed = progress?.completedCount ?? 0;
  const total = progress?.totalLessons ?? 0;
  const isFinished = progress?.isCompleted ?? false;

  // Resume from last lesson, or start from beginning
  const resumeHref = progress?.lastLessonId
    ? `/dashboard/courses/${courseId}?lesson=${progress.lastLessonId}`
    : `/dashboard/courses/${courseId}`;

  return (
    <div className="card sticky top-24 overflow-hidden">
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt={title} className="aspect-video w-full object-cover" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-ink-800">
          <BookOpen className="h-10 w-10 text-ink-600" />
        </div>
      )}

      <div className="p-6">
        {isFinished ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3">
            <Trophy className="h-5 w-5 shrink-0 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">¡Curso completado!</span>
          </div>
        ) : (
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-ink-300">
              <span>Tu progreso</span>
              <span className="font-medium text-ink-100">{completed}/{total} lecciones</span>
            </div>
            <ProgressBar percentage={pct} />
          </div>
        )}

        <Link href={resumeHref} className="btn-primary w-full justify-center">
          <PlayCircle className="h-4 w-4" />
          {pct === 0 ? "Comenzar curso" : isFinished ? "Repasar curso" : "Continuar curso"}
        </Link>

        <ul className="mt-6 space-y-2 text-sm text-ink-200">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-400" /> Acceso completo desbloqueado
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-400" /> Certificado incluido
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-400" /> Soporte personalizado
          </li>
        </ul>
      </div>
    </div>
  );
}
