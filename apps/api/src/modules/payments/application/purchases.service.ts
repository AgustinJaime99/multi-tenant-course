import { Inject, Injectable } from "@nestjs/common";
import { PaymentDto, PurchaseDto } from "@app/shared";
import {
  PAYMENT_REPOSITORY,
  PURCHASE_REPOSITORY,
  PaymentRepository,
  PurchaseRepository,
} from "../domain/payment.repository";

@Injectable()
export class PurchasesService {
  constructor(
    @Inject(PURCHASE_REPOSITORY) private readonly purchases: PurchaseRepository,
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
  ) {}

  listMine(userId: string): Promise<PurchaseDto[]> {
    return this.purchases.listByUser(userId);
  }

  listAll(): Promise<PurchaseDto[]> {
    return this.purchases.listAll();
  }

  listMyPayments(userId: string): Promise<PaymentDto[]> {
    return this.payments.listByUser(userId);
  }

  hasAccess(userId: string, courseId: string): Promise<boolean> {
    return this.purchases.hasActiveAccess(userId, courseId);
  }
}
