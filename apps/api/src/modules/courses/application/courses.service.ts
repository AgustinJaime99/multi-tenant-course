import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CourseDto } from "@app/shared";
import {
  COURSE_REPOSITORY,
  CourseRepository,
  CreateCourseData,
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
}
