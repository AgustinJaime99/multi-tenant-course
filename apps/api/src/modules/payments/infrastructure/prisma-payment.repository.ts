import { Injectable } from "@nestjs/common";
import {
  PaymentDto,
  PaymentProvider,
  PaymentStatus,
} from "@app/shared";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import {
  CreatePaymentRecord,
  PaymentRepository,
} from "../domain/payment.repository";

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentRecord): Promise<{ id: string }> {
    const p = await this.prisma.payment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        provider: data.provider,
        amountCents: data.amountCents,
        currency: data.currency,
        status: "PENDING",
      },
      select: { id: true },
    });
    return p;
  }

  async setExternalId(id: string, externalId: string): Promise<void> {
    await this.prisma.payment.update({ where: { id }, data: { externalId } });
  }

  async markStatus(id: string, status: PaymentStatus, raw?: unknown): Promise<void> {
    await this.prisma.payment.update({
      where: { id },
      data: { status, rawPayload: raw === undefined ? undefined : (raw as object) },
    });
  }

  async findByExternalId(externalId: string) {
    return this.prisma.payment.findFirst({
      where: { externalId },
      select: { id: true, userId: true, courseId: true },
    });
  }

  async findById(id: string) {
    const p = await this.prisma.payment.findUnique({
      where: { id },
      select: { id: true, userId: true, courseId: true, status: true },
    });
    return p ? { ...p, status: p.status as PaymentStatus } : null;
  }

  async listByUser(userId: string): Promise<PaymentDto[]> {
    const list = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return list.map((p) => this.map(p));
  }

  async listAll(): Promise<PaymentDto[]> {
    const list = await this.prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return list.map((p) => this.map(p));
  }

  async totalApprovedCents(): Promise<number> {
    const r = await this.prisma.payment.aggregate({
      where: { status: "APPROVED" },
      _sum: { amountCents: true },
    });
    return r._sum.amountCents ?? 0;
  }

  async revenueByMonth(): Promise<{ month: string; revenueCents: number }[]> {
    const rows = await this.prisma.payment.findMany({
      where: { status: "APPROVED" },
      select: { amountCents: true, createdAt: true },
    });
    const map = new Map<string, number>();
    for (const r of rows) {
      const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) ?? 0) + r.amountCents);
    }
    return Array.from(map.entries())
      .map(([month, revenueCents]) => ({ month, revenueCents }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map(p: any): PaymentDto {
    return {
      id: p.id,
      provider: p.provider as PaymentProvider,
      status: p.status as PaymentStatus,
      amountCents: p.amountCents,
      currency: p.currency,
      externalId: p.externalId,
      createdAt: p.createdAt.toISOString(),
    };
  }
}
