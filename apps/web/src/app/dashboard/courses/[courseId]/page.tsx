"use client";

import { use, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LessonDto } from "@app/shared";
import { useCourse, useProgress, useCompleteLesson, useGenerateCertificate } from "@/lib/queries";
import { PageLoader } from "@/components/ui/page-loader";
import { ProgressBar } from "@/components/player/progress-bar";
import { VideoPlayer, VideoPlaceholder } from "@/components/player/video-player";
import { LessonInfo } from "@/components/player/lesson-info";
import { CertificateBanner } from "@/components/player/certificate-banner";
import { CourseCurriculum } from "@/components/player/course-curriculum";

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
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
      const lastId = progress?.lastLessonId;
      setActiveLesson(allLessons.find((l) => l.id === lastId) ?? allLessons[0]);
    }
  }, [allLessons, progress, activeLesson]);

  if (isLoading || !course) return <PageLoader />;

  const completedSet = new Set(progress?.completedLessonIds ?? []);
  const currentIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1
    ? allLessons[currentIndex + 1]
    : null;

  function handleToggleComplete() {
    if (!activeLesson) return;
    complete.mutate({ lessonId: activeLesson.id, completed: !completedSet.has(activeLesson.id) });
  }

  function handleNext() {
    if (!nextLesson || !activeLesson) return;
    if (!completedSet.has(activeLesson.id)) {
      complete.mutate({ lessonId: activeLesson.id, completed: true });
    }
    setActiveLesson(nextLesson);
  }

  async function handleGenerateCertificate() {
    await generateCert.mutateAsync(courseId);
    router.push("/dashboard/certificates");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold">{course.title}</h1>

      <ProgressBar percentage={progress?.percentage ?? 0} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeLesson?.videoUrl ? (
            <VideoPlayer videoUrl={activeLesson.videoUrl} title={activeLesson.title} />
          ) : (
            <VideoPlaceholder />
          )}

          {activeLesson && (
            <LessonInfo
              lesson={activeLesson}
              isCompleted={completedSet.has(activeLesson.id)}
              nextLesson={nextLesson}
              isToggling={complete.isPending}
              onToggleComplete={handleToggleComplete}
              onNext={handleNext}
            />
          )}

          {progress?.isCompleted && (
            <CertificateBanner
              onGenerate={handleGenerateCertificate}
              isPending={generateCert.isPending}
            />
          )}
        </div>

        <CourseCurriculum
          course={course}
          activeLessonId={activeLesson?.id ?? null}
          completedIds={completedSet}
          onSelectLesson={setActiveLesson}
        />
      </div>
    </div>
  );
}
