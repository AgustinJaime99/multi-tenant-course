import { Clock, Lock } from "lucide-react";
import type { CourseDto } from "@app/shared";

interface Props {
  course: CourseDto;
}

export function CurriculumPreview({ course }: Props) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div>
      <h2 className="mt-10 text-2xl font-bold">Contenido del curso</h2>
      <p className="mt-1 text-sm text-ink-200">
        {course.modules.length} módulos · {totalLessons} lecciones
      </p>
      <div className="mt-6 space-y-4">
        {course.modules.map((m, moduleIndex) => {
          const isLocked = moduleIndex >= 1;
          
          return (
            <div key={m.id} className="card overflow-hidden relative">
              <div className="border-b border-ink-800 bg-ink-900/60 px-5 py-4 font-semibold">
                {m.title}
              </div>
              <ul className={`divide-y divide-ink-800 ${isLocked ? 'blur-sm' : ''}`}>
                {m.lessons.map((l) => (
                  <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-ink-700" />
                      {l.title}
                    </span>
                    {l.durationMin && (
                      <span className="flex items-center gap-1 text-ink-200">
                        <Clock className="h-3.5 w-3.5" /> {l.durationMin} min
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950/95 backdrop-blur-sm">
                  <div className="text-center space-y-4 px-6 py-8 animate-fade-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 border-2 border-brand-500/40 shadow-lg shadow-brand-500/20">
                      <Lock className="h-10 w-10 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-ink-50">Contenido bloqueado</p>
                      <p className="mt-2 text-sm text-ink-300 max-w-xs mx-auto">
                        Desbloquea este módulo y todo el contenido comprando el curso
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
