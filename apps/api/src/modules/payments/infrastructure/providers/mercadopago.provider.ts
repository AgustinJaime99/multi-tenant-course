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
 * Mercado Pago provider.
 * En modo real usa el SDK `mercadopago` (Preference API).
 * Sin MERCADOPAGO_ACCESS_TOKEN usa un checkout simulado funcional.
 * TODO(real): crear preferencia con new Preference(client).create({...})
 * y validar webhooks con la firma x-signature.
 */
@Injectable()
export class MercadoPagoPaymentProvider implements IPaymentProvider {
  readonly provider = PaymentProvider.MERCADOPAGO;
  private readonly logger = new Logger(MercadoPagoPaymentProvider.name);

  constructor(private readonly config: ConfigService) {}

  private get isLive(): boolean {
    return !!this.config.get<string>("payments.mercadopago.accessToken");
  }

  async createCheckoutSession(input: CreatePaymentInput): Promise<CheckoutSession> {
    const backendUrl = this.config.get<string>("backendUrl");
    if (!this.isLive) {
      this.logger.warn("Mercado Pago sin credenciales: usando checkout simulado");
      return {
        url: `${backendUrl}/payments/simulate/${input.paymentId}?provider=MERCADOPAGO`,
        externalId: `mp_mock_${input.paymentId}`,
        provider: this.provider,
      };
    }
    // TODO(real): const pref = await new Preference(client).create({ body: {...} });
    throw new Error("Mercado Pago live mode no implementado: configura el SDK");
  }

  async handleWebhook(
    payload: unknown,
    _headers: Record<string, unknown>,
  ): Promise<PaymentWebhookResult> {
    // TODO(real): validar firma y consultar el pago vía API con el id recibido
    const body = payload as { data?: { id?: string }; action?: string; status?: string };
    return {
      externalId: body?.data?.id ?? "",
      approved: body?.status === "approved" || body?.action === "payment.approved",
      rawStatus: body?.status ?? body?.action ?? "unknown",
    };
  }
}
