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
 * Binance Pay provider.
 * En modo real usa la API de Binance Pay (v2/order) firmando con HMAC SHA512.
 * Sin BINANCE_PAY_API_KEY usa un checkout simulado funcional.
 * TODO(real): POST https://bpay.binanceapi.com/binancepay/openapi/v2/order
 * con headers BinancePay-Timestamp, BinancePay-Nonce, BinancePay-Certificate-SN
 * y BinancePay-Signature; validar webhooks con la misma firma.
 */
@Injectable()
export class BinancePaymentProvider implements IPaymentProvider {
  readonly provider = PaymentProvider.BINANCE;
  private readonly logger = new Logger(BinancePaymentProvider.name);

  constructor(private readonly config: ConfigService) {}

  private get isLive(): boolean {
    return !!this.config.get<string>("payments.binance.apiKey");
  }

  async createCheckoutSession(input: CreatePaymentInput): Promise<CheckoutSession> {
    const backendUrl = this.config.get<string>("backendUrl");
    if (!this.isLive) {
      this.logger.warn("Binance Pay sin credenciales: usando checkout simulado");
      return {
        url: `${backendUrl}/payments/simulate/${input.paymentId}?provider=BINANCE`,
        externalId: `binance_mock_${input.paymentId}`,
        provider: this.provider,
      };
    }
    // TODO(real): firmar y crear orden vía Binance Pay openapi
    throw new Error("Binance Pay live mode no implementado: configura las claves");
  }

  async handleWebhook(
    payload: unknown,
    _headers: Record<string, unknown>,
  ): Promise<PaymentWebhookResult> {
    // TODO(real): validar BinancePay-Signature antes de confiar en el payload
    const body = payload as { bizStatus?: string; data?: string | { merchantTradeNo?: string } };
    let externalId = "";
    if (typeof body?.data === "string") {
      try {
        externalId = JSON.parse(body.data)?.merchantTradeNo ?? "";
      } catch {
        externalId = "";
      }
    } else {
      externalId = body?.data?.merchantTradeNo ?? "";
    }
    return {
      externalId,
      approved: body?.bizStatus === "PAY_SUCCESS",
      rawStatus: body?.bizStatus ?? "unknown",
    };
  }
}
