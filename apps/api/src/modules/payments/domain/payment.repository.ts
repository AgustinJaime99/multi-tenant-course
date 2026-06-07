import {
  PaymentDto,
  PaymentProvider,
  PaymentStatus,
  PurchaseDto,
  PurchaseStatus,
} from "@app/shared";

export const PAYMENT_REPOSITORY = Symbol("PAYMENT_REPOSITORY");
export const PURCHASE_REPOSITORY = Symbol("PURCHASE_REPOSITORY");

export interface CreatePaymentRecord {
  userId: string;
  courseId: string;
  provider: PaymentProvider;
  amountCents: number;
  currency: string;
}

export interface PaymentRepository {
  create(data: CreatePaymentRecord): Promise<{ id: string }>;
  setExternalId(id: string, externalId: string): Promise<void>;
  markStatus(id: string, status: PaymentStatus, raw?: unknown): Promise<void>;
  findByExternalId(externalId: string): Promise<{ id: string; userId: string; courseId: string } | null>;
  findById(id: string): Promise<{ id: string; userId: string; courseId: string; status: PaymentStatus } | null>;
  listByUser(userId: string): Promise<PaymentDto[]>;
  listAll(): Promise<PaymentDto[]>;
  totalApprovedCents(): Promise<number>;
  revenueByMonth(): Promise<{ month: string; revenueCents: number }[]>;
}

export interface PurchaseRepository {
  createPending(userId: string, courseId: string, provider: PaymentProvider): Promise<{ id: string }>;
  activate(userId: string, courseId: string): Promise<void>;
  setStatusByCourse(userId: string, courseId: string, status: PurchaseStatus): Promise<void>;
  hasActiveAccess(userId: string, courseId: string): Promise<boolean>;
  listByUser(userId: string): Promise<PurchaseDto[]>;
  listAll(): Promise<PurchaseDto[]>;
  countActive(): Promise<number>;
}
