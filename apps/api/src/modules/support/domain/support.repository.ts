import { SupportTicketDto, TicketStatus } from "@app/shared";

export const SUPPORT_REPOSITORY = Symbol("SUPPORT_REPOSITORY");

export interface SupportRepository {
  createTicket(userId: string, subject: string, message: string): Promise<SupportTicketDto>;
  listByUser(userId: string): Promise<SupportTicketDto[]>;
  listAll(): Promise<SupportTicketDto[]>;
  findById(id: string): Promise<SupportTicketDto | null>;
  addMessage(
    ticketId: string,
    authorId: string,
    message: string,
    isFromAdmin: boolean,
  ): Promise<SupportTicketDto>;
  updateStatus(ticketId: string, status: TicketStatus): Promise<SupportTicketDto>;
  isOwner(ticketId: string, userId: string): Promise<boolean>;
}
