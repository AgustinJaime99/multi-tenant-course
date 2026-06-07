import type {
  Role,
  PaymentProvider,
  PaymentStatus,
  PurchaseStatus,
  TicketStatus,
} from "../constants/enums";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: PublicUser;
  tokens: AuthTokens;
}

export interface LessonDto {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  durationMin?: number | null;
  order: number;
}

export interface ModuleDto {
  id: string;
  title: string;
  order: number;
  lessons: LessonDto[];
}

export interface CourseDto {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  coverImage?: string | null;
  priceCents: number;
  currency: string;
  status: "DRAFT" | "PUBLISHED";
  modules: ModuleDto[];
}

export interface CourseProgressDto {
  courseId: string;
  completedLessonIds: string[];
  totalLessons: number;
  completedCount: number;
  percentage: number;
  isCompleted: boolean;
  lastLessonId?: string | null;
}

export interface PurchaseDto {
  id: string;
  courseId: string;
  courseTitle: string;
  status: PurchaseStatus;
  provider: PaymentProvider;
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amountCents: number;
  currency: string;
  externalId?: string | null;
  createdAt: string;
}

export interface CertificateDto {
  id: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  issuedAt: string;
}

export interface SupportMessageDto {
  id: string;
  message: string;
  isFromAdmin: boolean;
  createdAt: string;
}

export interface SupportTicketDto {
  id: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  messages: SupportMessageDto[];
}

export interface CheckoutSession {
  url: string;
  externalId: string;
  provider: PaymentProvider;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalCourses: number;
  activePurchases: number;
  totalRevenueCents: number;
  revenueByMonth: { month: string; revenueCents: number }[];
  conversionRate: number;
}
