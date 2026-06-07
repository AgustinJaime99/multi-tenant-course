import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { ProgressRepository } from "../domain/progress.repository";

@Injectable()
export class PrismaProgressRepository implements ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async completedLessonIds(userId: string, courseId: string): Promise<string[]> {
    const rows = await this.prisma.progress.findMany({
      where: { userId, completed: true, lesson: { module: { courseId } } },
      select: { lessonId: true },
    });
    return rows.map((r) => r.lessonId);
  }

  async lastCompletedLessonId(userId: string, courseId: string): Promise<string | null> {
    const row = await this.prisma.progress.findFirst({
      where: { userId, lesson: { module: { courseId } } },
      orderBy: { completedAt: "desc" },
      select: { lessonId: true },
    });
    return row?.lessonId ?? null;
  }

  async markComplete(userId: string, lessonId: string): Promise<void> {
    await this.prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, lessonId, completed: true },
    });
  }

  async unmark(userId: string, lessonId: string): Promise<void> {
    await this.prisma.progress.deleteMany({ where: { userId, lessonId } });
  }
}
