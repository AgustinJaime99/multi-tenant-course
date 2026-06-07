import { Inject, Injectable } from "@nestjs/common";
import { AdminAnalytics, PaymentDto } from "@app/shared";
import { USER_REPOSITORY, UserRepository } from "../../users/domain/user.repository";
import { COURSE_REPOSITORY, CourseRepository } from "../../courses/domain/course.repository";
import {
  PAYMENT_REPOSITORY,
  PURCHASE_REPOSITORY,
  PaymentRepository,
  PurchaseRepository,
} from "../../payments/domain/payment.repository";

@Injectable()
export class AdminService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(COURSE_REPOSITORY) private readonly courses: CourseRepository,
    @Inject(PURCHASE_REPOSITORY) private readonly purchases: PurchaseRepository,
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
  ) {}

  async analytics(): Promise<AdminAnalytics> {
    const [totalUsers, totalCourses, activePurchases, totalRevenueCents, revenueByMonth] =
      await Promise.all([
        this.users.count(),
        this.courses.count(),
        this.purchases.countActive(),
        this.payments.totalApprovedCents(),
        this.payments.revenueByMonth(),
      ]);

    const conversionRate =
      totalUsers > 0 ? Math.round((activePurchases / totalUsers) * 1000) / 10 : 0;

    return {
      totalUsers,
      totalCourses,
      activePurchases,
      totalRevenueCents,
      revenueByMonth,
      conversionRate,
    };
  }

  listPayments(): Promise<PaymentDto[]> {
    return this.payments.listAll();
  }
}
