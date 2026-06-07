import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutSession, PaymentProvider } from "@app/shared";
import {
  IPaymentProvider,
  PAYMENT_PROVIDERS,
} from "../domain/payment-provider.interface";
import {
  PAYMENT_REPOSITORY,
  PURCHASE_REPOSITORY,
  PaymentRepository,
  PurchaseRepository,
} from "../domain/payment.repository";
import {
  COURSE_REPOSITORY,
  CourseRepository,
} from "../../courses/domain/course.repository";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly registry: Map<PaymentProvider, IPaymentProvider>;

  constructor(
    @Inject(PAYMENT_PROVIDERS) providers: IPaymentProvider[],
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
    @Inject(PURCHASE_REPOSITORY) private readonly purchases: PurchaseRepository,
    @Inject(COURSE_REPOSITORY) private readonly courses: CourseRepository,
    private readonly config: ConfigService,
  ) {
    this.registry = new Map(providers.map((p) => [p.provider, p]));
  }

  private resolve(provider: PaymentProvider): IPaymentProvider {
    const impl = this.registry.get(provider);
    if (!impl) throw new BadRequestException(`Proveedor de pago no soportado: ${provider}`);
    return impl;
  }

  async createCheckout(
    userId: string,
    userEmail: string,
    courseId: string,
    provider: PaymentProvider,
  ): Promise<CheckoutSession> {
    const course = await this.courses.findById(courseId);
    if (!course) throw new NotFoundException("Curso no encontrado");

    if (await this.purchases.hasActiveAccess(userId, courseId)) {
      throw new BadRequestException("Ya tienes acceso activo a este curso");
    }

    const payment = await this.payments.create({
      userId,
      courseId,
      provider,
      amountCents: course.priceCents,
      currency: course.currency,
    });
    await this.purchases.createPending(userId, courseId, provider);

    const impl = this.resolve(provider);
    const session = await impl.createCheckoutSession({
      paymentId: payment.id,
      courseId,
      courseTitle: course.title,
      userId,
      userEmail,
      amountCents: course.priceCents,
      currency: course.currency,
    });
    await this.payments.setExternalId(payment.id, session.externalId);
    return session;
  }

  async handleWebhook(
    provider: PaymentProvider,
    payload: unknown,
    headers: Record<string, unknown>,
  ): Promise<{ received: true }> {
    const impl = this.resolve(provider);
    const result = await impl.handleWebhook(payload, headers);
    const payment = result.externalId
      ? await this.payments.findByExternalId(result.externalId)
      : null;

    if (!payment) {
      this.logger.warn(`Webhook ${provider}: pago no encontrado (${result.externalId})`);
      return { received: true };
    }

    if (result.approved) {
      await this.payments.markStatus(payment.id, "APPROVED", payload);
      await this.purchases.activate(payment.userId, payment.courseId);
    } else {
      await this.payments.markStatus(payment.id, "REJECTED", payload);
      await this.purchases.setStatusByCourse(payment.userId, payment.courseId, "FAILED");
    }
    return { received: true };
  }

  /**
   * Aprueba un pago simulado (solo cuando no hay credenciales reales).
   * Devuelve la URL de redirección al frontend.
   */
  async simulateApprove(paymentId: string): Promise<string> {
    if (this.config.get<string>("nodeEnv") === "production") {
      throw new BadRequestException("Simulación deshabilitada en producción");
    }
    const payment = await this.payments.findById(paymentId);
    if (!payment) throw new NotFoundException("Pago no encontrado");

    await this.payments.markStatus(payment.id, "APPROVED");
    await this.purchases.activate(payment.userId, payment.courseId);

    const frontendUrl = this.config.get<string>("frontendUrl");
    return `${frontendUrl}/payment/success?courseId=${payment.courseId}`;
  }
}
