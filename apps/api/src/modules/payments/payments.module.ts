import { Module } from "@nestjs/common";
import { PaymentsService } from "./application/payments.service";
import { PurchasesService } from "./application/purchases.service";
import { PaymentsController } from "./presentation/payments.controller";
import { PurchasesController } from "./presentation/purchases.controller";
import {
  PAYMENT_REPOSITORY,
  PURCHASE_REPOSITORY,
} from "./domain/payment.repository";
import { PAYMENT_PROVIDERS } from "./domain/payment-provider.interface";
import { PrismaPaymentRepository } from "./infrastructure/prisma-payment.repository";
import { PrismaPurchaseRepository } from "./infrastructure/prisma-purchase.repository";
import { StripePaymentProvider } from "./infrastructure/providers/stripe.provider";
import { MercadoPagoPaymentProvider } from "./infrastructure/providers/mercadopago.provider";
import { BinancePaymentProvider } from "./infrastructure/providers/binance.provider";
import { CoursesModule } from "../courses/courses.module";

@Module({
  imports: [CoursesModule],
  controllers: [PaymentsController, PurchasesController],
  providers: [
    PaymentsService,
    PurchasesService,
    StripePaymentProvider,
    MercadoPagoPaymentProvider,
    BinancePaymentProvider,
    { provide: PAYMENT_REPOSITORY, useClass: PrismaPaymentRepository },
    { provide: PURCHASE_REPOSITORY, useClass: PrismaPurchaseRepository },
    {
      provide: PAYMENT_PROVIDERS,
      useFactory: (
        stripe: StripePaymentProvider,
        mp: MercadoPagoPaymentProvider,
        binance: BinancePaymentProvider,
      ) => [stripe, mp, binance],
      inject: [StripePaymentProvider, MercadoPagoPaymentProvider, BinancePaymentProvider],
    },
  ],
  exports: [PaymentsService, PurchasesService, PURCHASE_REPOSITORY, PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
