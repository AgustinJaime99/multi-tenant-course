import { CheckCircle2, Circle } from "lucide-react";
import type { CourseDto, LessonDto } from "@app/shared";

interface Props {
  course: CourseDto;
  activeLessonId: string | null;
  completedIds: Set<string>;
  onSelectLesson: (lesson: LessonDto) => void;
}

export function CourseCurriculum({ course, activeLessonId, completedIds, onSelectLesson }: Props) {
  return (
    <div className="space-y-4">
      {course.modules.map((m) => (
        <div key={m.id} className="card overflow-hidden">
          <div className="border-b border-ink-800 bg-ink-900/60 px-4 py-3 text-sm font-semibold">
            {m.title}
          </div>
          <ul>
            {m.lessons.map((lesson) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                isActive={activeLessonId === lesson.id}
                isCompleted={completedIds.has(lesson.id)}
                onSelect={() => onSelectLesson(lesson)}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface LessonListItemProps {
  lesson: LessonDto;
  isActive: boolean;
  isCompleted: boolean;
  onSelect: () => void;
}

function LessonListItem({ lesson, isActive, isCompleted, onSelect }: LessonListItemProps) {
  return (
    <li>
      <button
        onClick={onSelect}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
          isActive ? "bg-brand-500/10" : "hover:bg-ink-800"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
        ) : (
          <Circle className="h-4 w-4 shrink-0 text-ink-700" />
        )}
        <span className="flex-1">{lesson.title}</span>
        {lesson.durationMin && (
          <span className="text-xs text-ink-200">{lesson.durationMin}m</span>
        )}
      </button>
    </li>
  );
}
