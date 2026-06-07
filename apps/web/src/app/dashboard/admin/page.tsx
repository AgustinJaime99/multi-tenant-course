"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DollarSign,
  Loader2,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import type { TicketStatus } from "@app/shared";
import {
  useAdminAnalytics,
  useAdminUsers,
  useAdminPayments,
  useAdminTickets,
  useUpdateTicketStatus,
  useReplyTicket,
} from "@/lib/queries";
import { useAuthStore } from "@/lib/auth-store";
import { formatPrice, formatDate } from "@/lib/utils";

const statuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function AdminPage() {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && user && user.role !== "ADMIN") router.replace("/dashboard");
  }, [hydrated, user, router]);

  const { data: analytics } = useAdminAnalytics();
  const { data: users } = useAdminUsers();
  const { data: payments } = useAdminPayments();
  const { data: tickets } = useAdminTickets();
  const updateStatus = useUpdateTicketStatus();
  const reply = useReplyTicket();
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  if (!analytics) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  const maxRevenue = Math.max(1, ...analytics.revenueByMonth.map((r) => r.revenueCents));

  const cards = [
    { label: "Usuarios", value: analytics.totalUsers, icon: Users },
    { label: "Cursos", value: analytics.totalCourses, icon: BookOpen },
    { label: "Suscripciones activas", value: analytics.activePurchases, icon: TrendingUp },
    {
      label: "Ingresos totales",
      value: formatPrice(analytics.totalRevenueCents),
      icon: DollarSign,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <h1 className="text-2xl font-bold">Panel de administración</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-200">{c.label}</span>
              <c.icon className="h-5 w-5 text-brand-400" />
            </div>
            <div className="mt-2 text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="text-sm text-ink-200">Tasa de conversión</div>
        <div className="mt-1 text-2xl font-bold text-brand-300">{analytics.conversionRate}%</div>
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <h2 className="mb-4 font-semibold">Ingresos por mes</h2>
        {analytics.revenueByMonth.length === 0 ? (
          <p className="text-sm text-ink-200">Sin datos de ingresos todavía.</p>
        ) : (
          <div className="flex h-48 items-end gap-3">
            {analytics.revenueByMonth.map((r) => (
              <div key={r.month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-brand-500/70"
                  style={{ height: `${(r.revenueCents / maxRevenue) * 100}%` }}
                  title={formatPrice(r.revenueCents)}
                />
                <span className="text-xs text-ink-200">{r.month}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users */}
      <div className="card overflow-hidden">
        <h2 className="border-b border-ink-800 px-5 py-4 font-semibold">
          Usuarios ({users?.total ?? 0})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-900/60 text-ink-200">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Alta</th>
              </tr>
            </thead>
            <tbody>
              {(users?.items ?? []).map((u) => (
                <tr key={u.id} className="border-t border-ink-800">
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3 text-ink-200">{u.email}</td>
                  <td className="px-5 py-3">{u.role}</td>
                  <td className="px-5 py-3 text-ink-200">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments */}
      <div className="card overflow-hidden">
        <h2 className="border-b border-ink-800 px-5 py-4 font-semibold">Pagos recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-900/60 text-ink-200">
              <tr>
                <th className="px-5 py-3">Proveedor</th>
                <th className="px-5 py-3">Importe</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {(payments ?? []).map((p) => (
                <tr key={p.id} className="border-t border-ink-800">
                  <td className="px-5 py-3">{p.provider}</td>
                  <td className="px-5 py-3">{formatPrice(p.amountCents, p.currency)}</td>
                  <td className="px-5 py-3">{p.status}</td>
                  <td className="px-5 py-3 text-ink-200">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tickets */}
      <div className="card overflow-hidden">
        <h2 className="border-b border-ink-800 px-5 py-4 font-semibold">Tickets de soporte</h2>
        <div className="divide-y divide-ink-800">
          {(tickets ?? []).map((t) => (
            <div key={t.id} className="p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t.subject}</span>
                <select
                  value={t.status}
                  onChange={(e) =>
                    updateStatus.mutate({ id: t.id, status: e.target.value as TicketStatus })
                  }
                  className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 space-y-2">
                {t.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] rounded-xl px-3 py-1.5 text-sm ${
                      m.isFromAdmin ? "ml-auto bg-brand-500/20" : "bg-ink-800"
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  className="input"
                  value={replyMap[t.id] ?? ""}
                  onChange={(e) => setReplyMap({ ...replyMap, [t.id]: e.target.value })}
                  placeholder="Responder como soporte..."
                />
                <button
                  className="btn-primary px-4"
                  onClick={async () => {
                    const msg = replyMap[t.id];
                    if (!msg) return;
                    await reply.mutateAsync({ id: t.id, message: msg });
                    setReplyMap({ ...replyMap, [t.id]: "" });
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
