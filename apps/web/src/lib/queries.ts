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
    mutationFn: async (input: { courseId: string; provider: PaymentProvider; currency?: "USD" | "ARS" }) => {
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

// ─── Admin course management ────────────────────────────

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => (await api.get<CourseDto[]>("/courses/admin/all")).data,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      slug: string;
      title: string;
      subtitle?: string;
      description?: string;
      coverImage?: string;
      priceCents: number;
      priceArs?: number;
      currency?: string;
      status?: "DRAFT" | "PUBLISHED";
    }) => (await api.post<CourseDto>("/courses", body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: Partial<{
      slug: string;
      title: string;
      subtitle: string;
      description: string;
      coverImage: string;
      priceCents: number;
      priceArs: number;
      currency: string;
      status: "DRAFT" | "PUBLISHED";
    }> & { id: string }) => (await api.patch<CourseDto>(`/courses/${id}`, body)).data,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["course", vars.id] });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/courses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useAddModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, title, order }: { courseId: string; title: string; order?: number }) =>
      (await api.post(`/courses/${courseId}/modules`, { title, order })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useUpdateModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ moduleId, ...body }: { moduleId: string; title?: string; order?: number }) =>
      (await api.patch(`/courses/modules/${moduleId}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useDeleteModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (moduleId: string) => api.delete(`/courses/modules/${moduleId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useAddLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      moduleId: string;
      title: string;
      description?: string;
      videoUrl?: string;
      durationMin?: number;
      order?: number;
    }) => {
      const { moduleId, ...rest } = body;
      return (await api.post(`/courses/modules/${moduleId}/lessons`, rest)).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      lessonId: string;
      title?: string;
      description?: string;
      videoUrl?: string;
      durationMin?: number;
      order?: number;
    }) => {
      const { lessonId, ...rest } = body;
      return (await api.patch(`/courses/lessons/${lessonId}`, rest)).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => api.delete(`/courses/lessons/${lessonId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}
