import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z.string().min(3, "Asunto demasiado corto").max(120),
  message: z.string().min(5, "Mensaje demasiado corto").max(2000),
});

export const ticketMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
