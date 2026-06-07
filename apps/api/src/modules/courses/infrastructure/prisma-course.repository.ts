import { Injectable } from "@nestjs/common";
import { CourseDto, CourseStatus } from "@app/shared";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import {
  CourseRepository,
  CreateCourseData,
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
}
