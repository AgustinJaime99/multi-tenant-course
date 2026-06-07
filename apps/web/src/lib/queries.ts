"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminAnalytics,
  AuthResponse,
  CertificateDto,
  CheckoutSession,
  CourseDto,
  CourseProgressDto,
  LoginInput,
  PaymentDto,
  PaymentProvider,
  PublicUser,
  PurchaseDto,
  RegisterInput,
  SupportTicketDto,
  TicketStatus,
} from "@app/shared";
import { api } from "./api";
import { useAuthStore } from "./auth-store";

// ─── Auth ───────────────────────────────────────────────
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<AuthResponse>("/auth/login", input);
      return data;
    },
    onSuccess: (data) =>
      setSession(data.user, data.tokens.accessToken, data.tokens.refreshToken),
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await api.post<AuthResponse>("/auth/register", input);
      return data;
    },
    onSuccess: (data) =>
      setSession(data.user, data.tokens.accessToken, data.tokens.refreshToken),
  });
}

// ─── Courses ────────────────────────────────────────────
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await api.get<CourseDto[]>("/courses")).data,
  });
}

export function useCourse(idOrSlug: string, bySlug = false) {
  return useQuery({
    queryKey: ["course", idOrSlug, bySlug],
    queryFn: async () =>
      (await api.get<CourseDto>(bySlug ? `/courses/slug/${idOrSlug}` : `/courses/${idOrSlug}`)).data,
    enabled: !!idOrSlug,
  });
}

// ─── Progress ───────────────────────────────────────────
export function useProgress(courseId: string, enabled = true) {
  return useQuery({
    queryKey: ["progress", courseId],
    queryFn: async () =>
      (await api.get<CourseProgressDto>(`/progress/${courseId}`)).data,
    enabled: enabled && !!courseId,
  });
}

export function useCompleteLesson(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
      const url = `/progress/${courseId}/lessons/${lessonId}/complete`;
      const { data } = completed ? await api.post(url) : await api.delete(url);
      return data as CourseProgressDto;
    },
    onSuccess: (data) => qc.setQueryData(["progress", courseId], data),
  });
}

// ─── Purchases / Payments ───────────────────────────────
export function useMyPurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => (await api.get<PurchaseDto[]>("/purchases/me")).data,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["payments", "me"],
    queryFn: async () => (await api.get<PaymentDto[]>("/purchases/me/payments")).data,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: async (input: { courseId: string; provider: PaymentProvider }) => {
      const { data } = await api.post<CheckoutSession>("/payments/checkout", input);
      return data;
    },
  });
}

// ─── Certificates ───────────────────────────────────────
export function useMyCertificates() {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: async () => (await api.get<CertificateDto[]>("/certificates/me")).data,
  });
}

export function useGenerateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) =>
      (await api.post<CertificateDto>(`/certificates/generate/${courseId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["certificates"] }),
  });
}

// ─── Support ────────────────────────────────────────────
export function useMyTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => (await api.get<SupportTicketDto[]>("/support/tickets/me")).data,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { subject: string; message: string }) =>
      (await api.post<SupportTicketDto>("/support/tickets", input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) =>
      (await api.post<SupportTicketDto>(`/support/tickets/${id}/messages`, { message })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
  });
}

// ─── Admin ──────────────────────────────────────────────
export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => (await api.get<AdminAnalytics>("/admin/analytics")).data,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () =>
      (await api.get<{ items: PublicUser[]; total: number }>("/admin/users")).data,
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => (await api.get<PaymentDto[]>("/admin/payments")).data,
  });
}

export function useAdminTickets() {
  return useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: async () => (await api.get<SupportTicketDto[]>("/support/tickets/admin")).data,
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TicketStatus }) =>
      (await api.patch<SupportTicketDto>(`/support/tickets/${id}/status`, { status })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tickets"] }),
  });
}
