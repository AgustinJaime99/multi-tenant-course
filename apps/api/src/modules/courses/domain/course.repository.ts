import { CourseDto } from "@app/shared";

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY");

export interface CreateCourseData {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverImage?: string;
  priceCents: number;
  currency?: string;
  status?: "DRAFT" | "PUBLISHED";
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
}
