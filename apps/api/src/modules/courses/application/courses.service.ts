import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CourseDto, LessonDto, ModuleDto } from "@app/shared";
import {
  COURSE_REPOSITORY,
  CourseRepository,
  CreateCourseData,
  CreateLessonData,
  CreateModuleData,
} from "../domain/course.repository";

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courses: CourseRepository,
  ) {}

  listPublished(): Promise<CourseDto[]> {
    return this.courses.findAllPublished();
  }

  listAll(): Promise<CourseDto[]> {
    return this.courses.findAll();
  }

  async getById(id: string): Promise<CourseDto> {
    const course = await this.courses.findById(id);
    if (!course) throw new NotFoundException("Curso no encontrado");
    return course;
  }

  async getBySlug(slug: string): Promise<CourseDto> {
    const course = await this.courses.findBySlug(slug);
    if (!course) throw new NotFoundException("Curso no encontrado");
    return course;
  }

  create(data: CreateCourseData): Promise<CourseDto> {
    return this.courses.create(data);
  }

  async update(id: string, data: Partial<CreateCourseData>): Promise<CourseDto> {
    await this.getById(id);
    return this.courses.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.courses.delete(id);
  }

  // ─── Module management ──────────────────────────────────

  async addModule(courseId: string, data: CreateModuleData): Promise<ModuleDto> {
    await this.getById(courseId);
    return this.courses.createModule(courseId, data);
  }

  async editModule(moduleId: string, data: Partial<CreateModuleData>): Promise<ModuleDto> {
    const mod = await this.courses.findModuleById(moduleId);
    if (!mod) throw new NotFoundException("Módulo no encontrado");
    return this.courses.updateModule(moduleId, data);
  }

  async removeModule(moduleId: string): Promise<void> {
    const mod = await this.courses.findModuleById(moduleId);
    if (!mod) throw new NotFoundException("Módulo no encontrado");
    await this.courses.deleteModule(moduleId);
  }

  // ─── Lesson management ──────────────────────────────────

  async addLesson(moduleId: string, data: CreateLessonData): Promise<LessonDto> {
    const mod = await this.courses.findModuleById(moduleId);
    if (!mod) throw new NotFoundException("Módulo no encontrado");
    return this.courses.createLesson(moduleId, data);
  }

  async editLesson(lessonId: string, data: Partial<CreateLessonData>): Promise<LessonDto> {
    const lesson = await this.courses.findLessonById(lessonId);
    if (!lesson) throw new NotFoundException("Lección no encontrada");
    return this.courses.updateLesson(lessonId, data);
  }

  async removeLesson(lessonId: string): Promise<void> {
    const lesson = await this.courses.findLessonById(lessonId);
    if (!lesson) throw new NotFoundException("Lección no encontrada");
    await this.courses.deleteLesson(lessonId);
  }
}
