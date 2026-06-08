import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  PaymentProvider,
  PurchaseDto,
  PurchaseStatus,
} from "@app/shared";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { PurchaseRepository } from "../domain/payment.repository";

@Injectable()
export class PrismaPurchaseRepository implements PurchaseRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async createPending(userId: string, courseId: string, provider: PaymentProvider) {
    const existing = await this.prisma.purchase.findFirst({
      where: { userId, courseId },
      select: { id: true },
    });
    if (existing) {
      await this.prisma.purchase.update({
        where: { id: existing.id },
        data: { status: "PENDING", provider },
      });
      return existing;
    }
    return this.prisma.purchase.create({
      data: { userId, courseId, provider, status: "PENDING" },
      select: { id: true },
    });
  }

  async activate(userId: string, courseId: string): Promise<void> {
    const existing = await this.prisma.purchase.findFirst({
      where: { userId, courseId },
      select: { id: true },
    });
    if (!existing) return;

    const durationMinutes = this.config.get<number>("accessDurationMinutes") ?? 131400;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    await this.prisma.purchase.update({
      where: { id: existing.id },
      data: { status: "ACTIVE", startedAt, expiresAt },
    });
  }

  async setStatusByCourse(userId: string, courseId: string, status: PurchaseStatus): Promise<void> {
    await this.prisma.purchase.updateMany({
      where: { userId, courseId },
      data: { status },
    });
  }

  async hasActiveAccess(userId: string, courseId: string): Promise<boolean> {
    const p = await this.prisma.purchase.findFirst({
      where: { userId, courseId, status: "ACTIVE" },
      select: { expiresAt: true },
    });
    if (!p) return false;
    // If expiresAt is set, check it hasn't passed
    if (p.expiresAt && p.expiresAt < new Date()) {
      // Expire it in the background without blocking the request
      void this.prisma.purchase.updateMany({
        where: { userId, courseId, status: "ACTIVE" },
        data: { status: "EXPIRED" },
      });
      return false;
    }
    return true;
  }

  async listByUser(userId: string): Promise<PurchaseDto[]> {
    const list = await this.prisma.purchase.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
    return list.map((p) => this.map(p));
  }

  async listAll(): Promise<PurchaseDto[]> {
    const list = await this.prisma.purchase.findMany({
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return list.map((p) => this.map(p));
  }

  countActive(): Promise<number> {
    return this.prisma.purchase.count({ where: { status: "ACTIVE" } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map(p: any): PurchaseDto {
    return {
      id: p.id,
      courseId: p.courseId,
      courseTitle: p.course?.title ?? "",
      status: p.status as PurchaseStatus,
      provider: p.provider as PaymentProvider,
      createdAt: p.createdAt.toISOString(),
      startedAt: p.startedAt ? p.startedAt.toISOString() : null,
      expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
    };
  }
}
