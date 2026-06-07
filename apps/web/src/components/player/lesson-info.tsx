import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import type { LessonDto } from "@app/shared";

interface Props {
  lesson: LessonDto;
  isCompleted: boolean;
  nextLesson: LessonDto | null;
  isToggling: boolean;
  onToggleComplete: () => void;
  onNext: () => void;
}

export function LessonInfo({ lesson, isCompleted, nextLesson, isToggling, onToggleComplete, onNext }: Props) {
  return (
    <div className="card mt-4 p-5">
      <h2 className="text-lg font-semibold">{lesson.title}</h2>
      {lesson.description && (
        <p className="mt-2 text-sm text-ink-200">{lesson.description}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onToggleComplete}
          className="btn-secondary"
          disabled={isToggling}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-brand-400" /> Completada
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" /> Marcar como completada
            </>
          )}
        </button>
        {nextLesson && (
          <button onClick={onNext} className="btn-primary gap-1.5">
            Siguiente lección
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
