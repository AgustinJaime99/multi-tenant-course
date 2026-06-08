import { CheckCircle2, Circle, Clock, Lock, PlayCircle } from "lucide-react";
import type { CourseDto } from "@app/shared";

interface Props {
  course: CourseDto;
  enrolled?: boolean;
  completedIds?: Set<string>;
  onSelectLesson?: (lessonId: string) => void;
}

export function CurriculumPreview({
  course,
  enrolled = false,
  completedIds = new Set(),
  onSelectLesson,
}: Props) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div>
      <h2 className="mt-10 text-2xl font-bold">Contenido del curso</h2>
      <p className="mt-1 text-sm text-ink-200">
        {course.modules.length} módulos · {totalLessons} lecciones
      </p>
      <div className="mt-6 space-y-4">
        {course.modules.map((m, moduleIndex) => {
          // First module always visible in preview; rest locked unless enrolled
          const locked = !enrolled && moduleIndex >= 1;

          return (
            <div key={m.id} className="card overflow-hidden relative">
              <div className="border-b border-ink-800 bg-ink-900/60 px-5 py-4 font-semibold flex items-center justify-between">
                <span>{m.title}</span>
                {enrolled && (
                  <span className="text-xs text-ink-400">
                    {m.lessons.filter((l) => completedIds.has(l.id)).length}/{m.lessons.length}
                  </span>
                )}
              </div>

              <ul className={`divide-y divide-ink-800 ${locked ? "blur-sm select-none" : ""}`}>
                {m.lessons.map((l) => {
                  const isDone = completedIds.has(l.id);
                  return (
                    <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <button
                        disabled={!enrolled || !onSelectLesson}
                        onClick={() => onSelectLesson?.(l.id)}
                        className="flex items-center gap-3 text-left disabled:cursor-default group"
                      >
                        {enrolled ? (
                          isDone ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-ink-600 group-hover:text-ink-300 transition-colors" />
                          )
                        ) : (
                          <Lock className="h-4 w-4 shrink-0 text-ink-700" />
                        )}
                        <span className={enrolled && !isDone ? "group-hover:text-ink-100 transition-colors" : ""}>
                          {l.title}
                        </span>
                        {enrolled && !isDone && (
                          <PlayCircle className="h-3.5 w-3.5 shrink-0 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                      {l.durationMin && (
                        <span className="flex items-center gap-1 text-ink-400 text-xs shrink-0 ml-4">
                          <Clock className="h-3.5 w-3.5" /> {l.durationMin} min
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950/95 backdrop-blur-sm">
                  <div className="text-center space-y-4 px-6 py-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 border-2 border-brand-500/40 shadow-lg shadow-brand-500/20">
                      <Lock className="h-10 w-10 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-ink-50">Contenido bloqueado</p>
                      <p className="mt-2 text-sm text-ink-300 max-w-xs mx-auto">
                        Comprá el curso para desbloquear todo el contenido
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
