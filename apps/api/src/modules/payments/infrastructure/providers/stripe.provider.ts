import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaymentProvider } from "@app/shared";
import {
  CheckoutSession,
  CreatePaymentInput,
  IPaymentProvider,
  PaymentWebhookResult,
} from "../../domain/payment-provider.interface";

/**
 * Stripe provider.
 * En modo real usa el SDK de Stripe (instalar `stripe` y configurar claves).
 * Sin credenciales (STRIPE_SECRET_KEY vacío) usa un checkout simulado funcional.
 * TODO(real): reemplazar createCheckoutSession por stripe.checkout.sessions.create
 * y handleWebhook por stripe.webhooks.constructEvent con STRIPE_WEBHOOK_SECRET.
 */
@Injectable()
export class StripePaymentProvider implements IPaymentProvider {
  readonly provider = PaymentProvider.STRIPE;
  private readonly logger = new Logger(StripePaymentProvider.name);

  constructor(private readonly config: ConfigService) {}

  private get isLive(): boolean {
    return !!this.config.get<string>("payments.stripe.secretKey");
  }

  async createCheckoutSession(input: CreatePaymentInput): Promise<CheckoutSession> {
    const backendUrl = this.config.get<string>("backendUrl");
    if (!this.isLive) {
      this.logger.warn("Stripe sin credenciales: usando checkout simulado");
      return {
        url: `${backendUrl}/payments/simulate/${input.paymentId}?provider=STRIPE`,
        externalId: `stripe_mock_${input.paymentId}`,
        provider: this.provider,
      };
    }
    // TODO(real): const session = await stripe.checkout.sessions.create({...});
    throw new Error("Stripe live mode no implementado: instala y configura el SDK de Stripe");
  }

  async handleWebhook(
    payload: unknown,
    _headers: Record<string, unknown>,
  ): Promise<PaymentWebhookResult> {
    // TODO(real): verificar firma con stripe.webhooks.constructEvent
    const body = payload as { data?: { object?: { id?: string; payment_status?: string } } };
    const obj = body?.data?.object;
    return {
      externalId: obj?.id ?? "",
      approved: obj?.payment_status === "paid",
      rawStatus: obj?.payment_status ?? "unknown",
    };
  }
}
