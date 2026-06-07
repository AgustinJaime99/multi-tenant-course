"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseDto } from "@app/shared";
import { useAdminCourses } from "@/lib/queries";
import { PageLoader } from "@/components/ui/page-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { CourseEditor } from "@/components/admin/courses/course-editor";
import { CourseList } from "@/components/admin/courses/course-list";
import { CoursePageHeader } from "@/components/admin/courses/course-page-header";
import { CoursePreview } from "@/components/admin/courses/course-preview";
import { NewCourseForm } from "@/components/admin/courses/new-course-form";

type View = "list" | "editor" | "preview" | "new";

export default function AdminCoursesPage() {
  const router = useRouter();
  const { data: courses, isLoading } = useAdminCourses();

  const [view, setView] = useState<View>("list");
  const [activeCourse, setActiveCourse] = useState<CourseDto | null>(null);

  // Sync activeCourse with fresh query data after any mutation
  useEffect(() => {
    if (!activeCourse || !courses) return;
    const fresh = courses.find((c) => c.id === activeCourse.id);
    if (fresh) setActiveCourse(fresh);
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps

  function openEditor(course: CourseDto) {
    setActiveCourse(course);
    setView("editor");
  }

  function openPreview(course: CourseDto) {
    setActiveCourse(course);
    setView("preview");
  }

  function backToList() {
    setActiveCourse(null);
    setView("list");
  }

  if (isLoading) return <PageLoader />;

  if (view === "preview" && activeCourse) {
    return <CoursePreview course={activeCourse} onBack={backToList} />;
  }

  if (view === "editor" && activeCourse) {
    return (
      <div className="mx-auto max-w-4xl py-6">
        <CourseEditor course={activeCourse} onBack={backToList} />
      </div>
    );
  }

  if (view === "new") {
    return (
      <div className="mx-auto max-w-4xl space-y-6 py-6">
        <CoursePageHeader onBack={() => router.push("/dashboard/admin")} />
        <NewCourseForm onDone={backToList} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <CoursePageHeader
        onBack={() => router.push("/dashboard/admin")}
        onNew={() => setView("new")}
      />

      {(courses ?? []).length === 0 ? (
        <EmptyState message="No hay cursos todavía. Crea el primero." />
      ) : (
        <CourseList
          courses={courses ?? []}
          onEdit={openEditor}
          onPreview={openPreview}
        />
      )}
    </div>
  );
}
