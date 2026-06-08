import { z } from "zod";

export const paymentProviderSchema = z.enum(["STRIPE", "MERCADOPAGO", "BINANCE"]);

export const createCheckoutSchema = z.object({
  courseId: z.string().min(1),
  provider: paymentProviderSchema,
  currency: z.enum(["USD", "ARS"]).default("USD"),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
