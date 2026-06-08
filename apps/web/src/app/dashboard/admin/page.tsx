"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, DollarSign, TrendingUp, Users } from "lucide-react";
import { useAdminAnalytics, useAdminUsers, useAdminPayments, useAdminTickets } from "@/lib/queries";
import { useAuthStore } from "@/lib/auth-store";
import { formatPrice } from "@/lib/utils";
import { PageLoader } from "@/components/ui/page-loader";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { UsersTable } from "@/components/admin/dashboard/users-table";
import { PaymentsTable } from "@/components/admin/dashboard/payments-table";
import { TicketList } from "@/components/admin/dashboard/ticket-list";

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

  if (!analytics) return <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <Link href="/dashboard/admin/courses" className="btn-secondary gap-2 text-sm">
          <BookOpen className="h-4 w-4" />
          Gestionar cursos
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Usuarios" value={analytics.totalUsers} icon={Users} />
        <KpiCard label="Cursos" value={analytics.totalCourses} icon={BookOpen} />
        <KpiCard label="Suscripciones activas" value={analytics.activePurchases} icon={TrendingUp} />
        <KpiCard label="Ingresos USD" value={formatPrice(analytics.revenueUsdCents)} icon={DollarSign} />
        <KpiCard
          label="Ingresos ARS"
          value={new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(analytics.revenueArsCents / 100)}
          icon={DollarSign}
        />
      </div>

      <div className="card p-5">
        <div className="text-sm text-ink-200">Tasa de conversión</div>
        <div className="mt-1 text-2xl font-bold text-brand-300">{analytics.conversionRate}%</div>
      </div>

      <RevenueChart data={analytics.revenueByMonth} />

      {users && <UsersTable users={users.items} total={users.total} />}

      {payments && <PaymentsTable payments={payments} />}

      {tickets && <TicketList tickets={tickets} />}
    </div>
  );
}
