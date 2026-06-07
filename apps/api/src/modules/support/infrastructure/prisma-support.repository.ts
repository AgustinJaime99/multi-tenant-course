import { Injectable } from "@nestjs/common";
import { SupportTicketDto, TicketStatus } from "@app/shared";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { SupportRepository } from "../domain/support.repository";

const ticketInclude = {
  messages: { orderBy: { createdAt: "asc" as const } },
};

@Injectable()
export class PrismaSupportRepository implements SupportRepository {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map(t: any): SupportTicketDto {
    return {
      id: t.id,
      subject: t.subject,
      status: t.status as TicketStatus,
      createdAt: t.createdAt.toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: (t.messages ?? []).map((m: any) => ({
        id: m.id,
        message: m.message,
        isFromAdmin: m.isFromAdmin,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }

  async createTicket(userId: string, subject: string, message: string): Promise<SupportTicketDto> {
    const t = await this.prisma.supportTicket.create({
      data: {
        userId,
        subject,
        messages: { create: { authorId: userId, message, isFromAdmin: false } },
      },
      include: ticketInclude,
    });
    return this.map(t);
  }

  async listByUser(userId: string): Promise<SupportTicketDto[]> {
    const list = await this.prisma.supportTicket.findMany({
      where: { userId },
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
    return list.map((t) => this.map(t));
  }

  async listAll(): Promise<SupportTicketDto[]> {
    const list = await this.prisma.supportTicket.findMany({
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
    return list.map((t) => this.map(t));
  }

  async findById(id: string): Promise<SupportTicketDto | null> {
    const t = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: ticketInclude,
    });
    return t ? this.map(t) : null;
  }

  async addMessage(
    ticketId: string,
    authorId: string,
    message: string,
    isFromAdmin: boolean,
  ): Promise<SupportTicketDto> {
    await this.prisma.supportMessage.create({
      data: { ticketId, authorId, message, isFromAdmin },
    });
    await this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: isFromAdmin ? "IN_PROGRESS" : undefined, updatedAt: new Date() },
    });
    const t = await this.findById(ticketId);
    return t!;
  }

  async updateStatus(ticketId: string, status: TicketStatus): Promise<SupportTicketDto> {
    const t = await this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
      include: ticketInclude,
    });
    return this.map(t);
  }

  async isOwner(ticketId: string, userId: string): Promise<boolean> {
    const t = await this.prisma.supportTicket.findFirst({
      where: { id: ticketId, userId },
      select: { id: true },
    });
    return !!t;
  }
}
