import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import MercadoPagoConfig, {
  Payment,
  Preference,
  WebhookSignatureValidator,
} from "mercadopago";
import { PaymentProvider } from "@app/shared";
import {
  CheckoutSession,
  CreatePaymentInput,
  IPaymentProvider,
  PaymentWebhookResult,
} from "../../domain/payment-provider.interface";

@Injectable()
export class MercadoPagoPaymentProvider implements IPaymentProvider {
  readonly provider = PaymentProvider.MERCADOPAGO;
  private readonly logger = new Logger(MercadoPagoPaymentProvider.name);
  private readonly client: MercadoPagoConfig | null = null;
  private readonly webhookSecret: string;

  constructor(private readonly config: ConfigService) {
    const accessToken = this.config.get<string>("payments.mercadopago.accessToken");
    this.webhookSecret = this.config.get<string>("payments.mercadopago.webhookSecret") ?? "";

    if (accessToken) {
      this.client = new MercadoPagoConfig({ accessToken });
      this.logger.log("MercadoPago iniciado en modo real");
    } else {
      this.logger.warn("MercadoPago sin ACCESS_TOKEN: usando checkout simulado");
    }
  }

  async createCheckoutSession(input: CreatePaymentInput): Promise<CheckoutSession> {
    if (!this.client) {
      const backendUrl = this.config.get<string>("backendUrl");
      return {
        url: `${backendUrl}/api/payments/simulate/${input.paymentId}?provider=MERCADOPAGO`,
        externalId: `mp_mock_${input.paymentId}`,
        provider: this.provider,
      };
    }

    const backendUrl = this.config.get<string>("backendUrl");
    // Use the public-facing frontend URL for MP redirects (localhost won't work)
    const frontendUrl = this.config.get<string>("frontendPublicUrl");

    // MercadoPago works in centavos — divide by 100 to get the unit amount
    const unitPrice = input.amountCents / 100;

    const preference = new Preference(this.client);
    const result = await preference.create({
      body: {
        external_reference: input.paymentId,
        items: [
          {
            id: input.courseId,
            title: input.courseTitle,
            quantity: 1,
            unit_price: unitPrice,
            currency_id: input.currency === "ARS" ? "ARS" : "USD",
          },
        ],
        payer: {
          email: input.userEmail,
        },
        back_urls: {
          success: `${frontendUrl}/payment/success?courseId=${input.courseId}`,
          failure: `${frontendUrl}/courses/${input.courseId}?payment=failed`,
          pending: `${frontendUrl}/courses/${input.courseId}?payment=pending`,
        },
        notification_url: `${backendUrl}/api/payments/webhooks/mercadopago`,
        // wallet_purchase shows QR + all payment methods on MP checkout page
        purpose: "wallet_purchase",
      },
    });

    if (!result.id || !result.init_point) {
      throw new Error("MercadoPago: no se pudo crear la preferencia de pago");
    }

    this.logger.log(`Preferencia creada: ${result.id} para pago ${input.paymentId}`);

    return {
      url: result.init_point,
      externalId: result.id,
      provider: this.provider,
    };
  }

  async handleWebhook(
    payload: unknown,
    headers: Record<string, unknown>,
  ): Promise<PaymentWebhookResult> {
    const body = payload as {
      type?: string;
      action?: string;
      data?: { id?: string };
      id?: string | number;
    };

    this.logger.log(`Webhook MP recibido: type=${body.type} action=${body.action} data=${JSON.stringify(body.data)}`);

    // Validate signature only when both headers are present (sandbox doesn't send them)
    const xSignature  = headers["x-signature"]  as string | undefined;
    const xRequestId  = headers["x-request-id"] as string | undefined;
    const dataId      = body?.data?.id ?? String(body?.id ?? "");

    if (this.webhookSecret && xSignature && xRequestId) {
      try {
        WebhookSignatureValidator.validate({ xSignature, xRequestId, dataId, secret: this.webhookSecret });
        this.logger.log("Webhook MP: firma válida");
      } catch (err) {
        this.logger.error("Webhook MP: firma inválida", err);
        return { externalId: "", approved: false, rawStatus: "invalid_signature" };
      }
    }

    // Get the MP payment ID from the notification body
    const mpPaymentId = body?.data?.id ?? String(body?.id ?? "");

    if (!mpPaymentId) {
      this.logger.warn("Webhook MP: sin payment ID en el body");
      return { externalId: "", approved: false, rawStatus: "no_resource_id" };
    }

    // Always fetch the actual payment from MP to get real status + our external_reference
    if (this.client) {
      try {
        const mpPayment  = new Payment(this.client);
        const paymentData = await mpPayment.get({ id: mpPaymentId });
        const status      = paymentData.status ?? "unknown";
        // external_reference is our internal paymentId set when creating the preference
        const externalRef = String(paymentData.external_reference ?? "");

        this.logger.log(`Webhook MP: mp_id=${mpPaymentId} status=${status} our_ref=${externalRef}`);

        return {
          externalId: externalRef,
          approved: status === "approved",
          rawStatus: status,
        };
      } catch (err) {
        this.logger.error(`Webhook MP: no se pudo consultar pago ${mpPaymentId}`, err);
      }
    }

    // Fallback (no MP client / sandbox without credentials)
    const approved = body.action === "payment.updated" || body.type === "payment";
    this.logger.warn(`Webhook MP fallback: approved=${approved}`);

    return {
      externalId: mpPaymentId,
      approved,
      rawStatus: body.action ?? body.type ?? "unknown",
    };
  }
}
