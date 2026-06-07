"use client";

import type { CourseDto } from "@app/shared";
import { useDeleteCourse } from "@/lib/queries";
import { StatusBadge, courseStatusToVariant } from "@/components/ui/status-badge";
import { CourseThumbnail } from "./course-thumbnail";
import { DeleteButton } from "./delete-button";

interface Props {
  course: CourseDto;
  onEdit: () => void;
  onPreview: () => void;
}

export function CourseListItem({ course, onEdit, onPreview }: Props) {
  const deleteCourse = useDeleteCourse();
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="card flex items-center gap-4 p-4 transition-colors hover:border-ink-700">
      <CourseThumbnail src={course.coverImage} alt={course.title} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{course.title}</span>
          <StatusBadge variant={courseStatusToVariant(course.status)} />
        </div>
        <p className="mt-0.5 text-sm text-ink-400">
          {course.modules.length} secciones · {totalLessons} lecciones
        </p>
      </div>

      <button className="btn-ghost py-1.5 text-sm" onClick={onPreview}>
        Vista previa
      </button>
      <button className="btn-secondary py-1.5 text-sm" onClick={onEdit}>
        Editar
      </button>
      <DeleteButton
        onDelete={() => deleteCourse.mutate(course.id)}
        isPending={deleteCourse.isPending}
      />
    </div>
  );
}
