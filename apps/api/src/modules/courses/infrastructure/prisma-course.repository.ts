import { Injectable } from "@nestjs/common";
import { CourseDto, CourseStatus, LessonDto, ModuleDto } from "@app/shared";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import {
  CourseRepository,
  CreateCourseData,
  CreateLessonData,
  CreateModuleData,
} from "../domain/course.repository";

const courseInclude = {
  modules: {
    orderBy: { order: "asc" as const },
    include: { lessons: { orderBy: { order: "asc" as const } } },
  },
};

@Injectable()
export class PrismaCourseRepository implements CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map(c: any): CourseDto {
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      coverImage: c.coverImage,
      priceCents: c.priceCents,
      priceArs: c.priceArs ?? 0,
      currency: c.currency,
      status: c.status as CourseStatus,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modules: (c.modules ?? []).map((m: any) => ({
        id: m.id,
        title: m.title,
        order: m.order,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lessons: (m.lessons ?? []).map((l: any) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          videoUrl: l.videoUrl,
          durationMin: l.durationMin,
          order: l.order,
        })),
      })),
    };
  }

  async findAllPublished(): Promise<CourseDto[]> {
    const list = await this.prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: courseInclude,
      orderBy: { createdAt: "desc" },
    });
    return list.map((c) => this.map(c));
  }

  async findAll(): Promise<CourseDto[]> {
    const list = await this.prisma.course.findMany({
      include: courseInclude,
      orderBy: { createdAt: "desc" },
    });
    return list.map((c) => this.map(c));
  }

  async findById(id: string): Promise<CourseDto | null> {
    const c = await this.prisma.course.findUnique({
      where: { id },
      include: courseInclude,
    });
    return c ? this.map(c) : null;
  }

  async findBySlug(slug: string): Promise<CourseDto | null> {
    const c = await this.prisma.course.findUnique({
      where: { slug },
      include: courseInclude,
    });
    return c ? this.map(c) : null;
  }

  async create(data: CreateCourseData): Promise<CourseDto> {
    const c = await this.prisma.course.create({
      data: { ...data, currency: data.currency ?? "USD" },
      include: courseInclude,
    });
    return this.map(c);
  }

  async update(id: string, data: Partial<CreateCourseData>): Promise<CourseDto> {
    const c = await this.prisma.course.update({
      where: { id },
      data,
      include: courseInclude,
    });
    return this.map(c);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }

  countLessons(courseId: string): Promise<number> {
    return this.prisma.lesson.count({ where: { module: { courseId } } });
  }

  async lessonBelongsToCourse(courseId: string, lessonId: string): Promise<boolean> {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, module: { courseId } },
      select: { id: true },
    });
    return !!lesson;
  }

  count(): Promise<number> {
    return this.prisma.course.count();
  }

  // ─── Module management ──────────────────────────────────

  async createModule(courseId: string, data: CreateModuleData): Promise<ModuleDto> {
    const m = await this.prisma.courseModule.create({
      data: { courseId, title: data.title, order: data.order ?? 0 },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    return this.mapModule(m);
  }

  async updateModule(moduleId: string, data: Partial<CreateModuleData>): Promise<ModuleDto> {
    const m = await this.prisma.courseModule.update({
      where: { id: moduleId },
      data,
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    return this.mapModule(m);
  }

  async deleteModule(moduleId: string): Promise<void> {
    await this.prisma.courseModule.delete({ where: { id: moduleId } });
  }

  async findModuleById(moduleId: string): Promise<(ModuleDto & { courseId: string }) | null> {
    const m = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    if (!m) return null;
    return { ...this.mapModule(m), courseId: m.courseId };
  }

  // ─── Lesson management ──────────────────────────────────

  async createLesson(moduleId: string, data: CreateLessonData): Promise<LessonDto> {
    const l = await this.prisma.lesson.create({
      data: {
        moduleId,
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        durationMin: data.durationMin,
        order: data.order ?? 0,
      },
    });
    return this.mapLesson(l);
  }

  async updateLesson(lessonId: string, data: Partial<CreateLessonData>): Promise<LessonDto> {
    const l = await this.prisma.lesson.update({ where: { id: lessonId }, data });
    return this.mapLesson(l);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    await this.prisma.lesson.delete({ where: { id: lessonId } });
  }

  async findLessonById(
    lessonId: string,
  ): Promise<(LessonDto & { moduleId: string; module: { courseId: string } }) | null> {
    const l = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true } } },
    });
    if (!l) return null;
    return { ...this.mapLesson(l), moduleId: l.moduleId, module: { courseId: l.module.courseId } };
  }

  // ─── Private mappers ────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapModule(m: any): ModuleDto {
    return {
      id: m.id,
      title: m.title,
      order: m.order,
      lessons: (m.lessons ?? []).map((l: any) => this.mapLesson(l)),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapLesson(l: any): LessonDto {
    return {
      id: l.id,
      title: l.title,
      description: l.description,
      videoUrl: l.videoUrl,
      durationMin: l.durationMin,
      order: l.order,
    };
  }
}
