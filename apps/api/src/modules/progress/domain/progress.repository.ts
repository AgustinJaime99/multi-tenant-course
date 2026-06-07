export const PROGRESS_REPOSITORY = Symbol("PROGRESS_REPOSITORY");

export interface ProgressRepository {
  completedLessonIds(userId: string, courseId: string): Promise<string[]>;
  lastCompletedLessonId(userId: string, courseId: string): Promise<string | null>;
  markComplete(userId: string, lessonId: string): Promise<void>;
  unmark(userId: string, lessonId: string): Promise<void>;
}
