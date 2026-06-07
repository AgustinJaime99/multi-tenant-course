import { Inject, Injectable } from "@nestjs/common";
import { CourseProgressDto } from "@app/shared";
import {
  PROGRESS_REPOSITORY,
  ProgressRepository,
} from "../domain/progress.repository";
import {
  COURSE_REPOSITORY,
  CourseRepository,
} from "../../courses/domain/course.repository";

@Injectable()
export class ProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY) private readonly progress: ProgressRepository,
    @Inject(COURSE_REPOSITORY) private readonly courses: CourseRepository,
  ) {}

  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgressDto> {
    const [completed, total, last] = await Promise.all([
      this.progress.completedLessonIds(userId, courseId),
      this.courses.countLessons(courseId),
      this.progress.lastCompletedLessonId(userId, courseId),
    ]);
    const completedCount = completed.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return {
      courseId,
      completedLessonIds: completed,
      totalLessons: total,
      completedCount,
      percentage,
      isCompleted: total > 0 && completedCount >= total,
      lastLessonId: last,
    };
  }

  async completeLesson(
    userId: string,
    courseId: string,
    lessonId: string,
  ): Promise<CourseProgressDto> {
    const belongs = await this.courses.lessonBelongsToCourse(courseId, lessonId);
    if (!belongs) {
      throw new Error("La lección no pertenece al curso");
    }
    await this.progress.markComplete(userId, lessonId);
    return this.getCourseProgress(userId, courseId);
  }

  async uncompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string,
  ): Promise<CourseProgressDto> {
    await this.progress.unmark(userId, lessonId);
    return this.getCourseProgress(userId, courseId);
  }
}
