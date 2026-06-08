import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { createCheckoutSchema, CreateCheckoutInput, PaymentProvider } from "@app/shared";
import { PaymentsService } from "../application/payments.service";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { Public } from "../../../common/decorators/public.decorator";
import { CurrentUser, AuthUser } from "../../../common/decorators/current-user.decorator";

@ApiTags("payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @Post("checkout")
  checkout(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createCheckoutSchema)) body: CreateCheckoutInput,
  ) {
    return this.paymentsService.createCheckout(
      user.id,
      user.email,
      body.courseId,
      body.provider,
      body.currency,
    );
  }

  @Public()
  @Post("webhooks/stripe")
  stripeWebhook(@Body() body: unknown, @Req() req: Request) {
    return this.paymentsService.handleWebhook(
      PaymentProvider.STRIPE,
      body,
      req.headers as Record<string, unknown>,
    );
  }

  @Public()
  @Post("webhooks/mercadopago")
  mpWebhook(@Body() body: unknown, @Req() req: Request) {
    return this.paymentsService.handleWebhook(
      PaymentProvider.MERCADOPAGO,
      body,
      req.headers as Record<string, unknown>,
    );
  }

  @Public()
  @Post("webhooks/binance")
  binanceWebhook(@Body() body: unknown, @Req() req: Request) {
    return this.paymentsService.handleWebhook(
      PaymentProvider.BINANCE,
      body,
      req.headers as Record<string, unknown>,
    );
  }

  /** Checkout simulado (solo modo demo sin credenciales reales). */
  @Public()
  @Get("simulate/:paymentId")
  async simulate(
    @Param("paymentId") paymentId: string,
    @Query("provider") _provider: string,
    @Res() res: Response,
  ) {
    const url = await this.paymentsService.simulateApprove(paymentId);
    return res.redirect(url);
  }
}
