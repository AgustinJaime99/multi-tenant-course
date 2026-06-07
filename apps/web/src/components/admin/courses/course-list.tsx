import type { CourseDto } from "@app/shared";
import { CourseListItem } from "./course-list-item";

interface Props {
  courses: CourseDto[];
  onEdit: (course: CourseDto) => void;
  onPreview: (course: CourseDto) => void;
}

export function CourseList({ courses, onEdit, onPreview }: Props) {
  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <CourseListItem
          key={course.id}
          course={course}
          onEdit={() => onEdit(course)}
          onPreview={() => onPreview(course)}
        />
      ))}
    </div>
  );
}
