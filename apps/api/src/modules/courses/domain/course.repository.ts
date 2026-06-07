import { CourseDto, ModuleDto, LessonDto } from "@app/shared";

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY");

export interface CreateCourseData {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverImage?: string;
  priceCents: number;
  priceArs?: number;
  currency?: string;
  status?: "DRAFT" | "PUBLISHED";
}

export interface CreateModuleData {
  title: string;
  order?: number;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  videoUrl?: string;
  durationMin?: number;
  order?: number;
}

export interface CourseRepository {
  findAllPublished(): Promise<CourseDto[]>;
  findAll(): Promise<CourseDto[]>;
  findById(id: string): Promise<CourseDto | null>;
  findBySlug(slug: string): Promise<CourseDto | null>;
  create(data: CreateCourseData): Promise<CourseDto>;
  update(id: string, data: Partial<CreateCourseData>): Promise<CourseDto>;
  delete(id: string): Promise<void>;
  countLessons(courseId: string): Promise<number>;
  lessonBelongsToCourse(courseId: string, lessonId: string): Promise<boolean>;
  count(): Promise<number>;

  // Module management
  createModule(courseId: string, data: CreateModuleData): Promise<ModuleDto>;
  updateModule(moduleId: string, data: Partial<CreateModuleData>): Promise<ModuleDto>;
  deleteModule(moduleId: string): Promise<void>;
  findModuleById(moduleId: string): Promise<(ModuleDto & { courseId: string }) | null>;

  // Lesson management
  createLesson(moduleId: string, data: CreateLessonData): Promise<LessonDto>;
  updateLesson(lessonId: string, data: Partial<CreateLessonData>): Promise<LessonDto>;
  deleteLesson(lessonId: string): Promise<void>;
  findLessonById(lessonId: string): Promise<(LessonDto & { moduleId: string; module: { courseId: string } }) | null>;
}
