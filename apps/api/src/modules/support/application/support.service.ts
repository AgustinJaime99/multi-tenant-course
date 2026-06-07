import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SupportTicketDto, TicketStatus } from "@app/shared";
import {
  SUPPORT_REPOSITORY,
  SupportRepository,
} from "../domain/support.repository";

@Injectable()
export class SupportService {
  constructor(
    @Inject(SUPPORT_REPOSITORY) private readonly support: SupportRepository,
  ) {}

  createTicket(userId: string, subject: string, message: string): Promise<SupportTicketDto> {
    return this.support.createTicket(userId, subject, message);
  }

  listMine(userId: string): Promise<SupportTicketDto[]> {
    return this.support.listByUser(userId);
  }

  listAll(): Promise<SupportTicketDto[]> {
    return this.support.listAll();
  }

  async addUserMessage(ticketId: string, userId: string, message: string): Promise<SupportTicketDto> {
    const owner = await this.support.isOwner(ticketId, userId);
    if (!owner) throw new ForbiddenException("No puedes responder este ticket");
    return this.support.addMessage(ticketId, userId, message, false);
  }

  async addAdminMessage(ticketId: string, adminId: string, message: string): Promise<SupportTicketDto> {
    const ticket = await this.support.findById(ticketId);
    if (!ticket) throw new NotFoundException("Ticket no encontrado");
    return this.support.addMessage(ticketId, adminId, message, true);
  }

  async updateStatus(ticketId: string, status: TicketStatus): Promise<SupportTicketDto> {
    const ticket = await this.support.findById(ticketId);
    if (!ticket) throw new NotFoundException("Ticket no encontrado");
    return this.support.updateStatus(ticketId, status);
  }
}
