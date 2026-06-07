import { PaymentProvider as Provider } from "@app/shared";

export interface CreatePaymentInput {
  paymentId: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userEmail: string;
  amountCents: number;
  currency: string;
}

export interface CheckoutSession {
  url: string;
  externalId: string;
  provider: Provider;
}

export interface PaymentWebhookResult {
  externalId: string;
  paymentId?: string;
  approved: boolean;
  rawStatus: string;
}

export interface IPaymentProvider {
  readonly provider: Provider;
  createCheckoutSession(input: CreatePaymentInput): Promise<CheckoutSession>;
  handleWebhook(payload: unknown, headers: Record<string, unknown>): Promise<PaymentWebhookResult>;
}

export const PAYMENT_PROVIDERS = Symbol("PAYMENT_PROVIDERS");
