"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  RefreshCw,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useMyPayments, useMyPurchases } from "@/lib/queries";
import { getAccessTimeInfo, formatPaymentAmount, type AccessLight } from "@/lib/access-time";
import { formatDate } from "@/lib/utils";
import type { PaymentDto, PurchaseDto } from "@app/shared";

const STATUS_CONFIG = {
  APPROVED: { icon: CheckCircle2, bg: "bg-green-500/10",  border: "border-green-500/20",  text: "text-green-400",  label: "Aprobado"   },
  PENDING:  { icon: Clock,        bg: "bg-yellow-400/10", border: "border-yellow-400/20", text: "text-yellow-400", label: "Pendiente"  },
  REJECTED: { icon: XCircle,      bg: "bg-red-500/10",    border: "border-red-500/20",    text: "text-red-400",    label: "Rechazado"  },
  REFUNDED: { icon: RefreshCw,    bg: "bg-ink-800",       border: "border-ink-700",       text: "text-ink-400",    label: "Reembolsado"},
} as const;

const PROVIDER_LABEL: Record<string, string> = {
  MERCADOPAGO: "Mercado Pago",
  STRIPE:      "Stripe",
  BINANCE:     "Binance Pay",
};

const PROVIDER_ICON: Record<string, string> = {
  MERCADOPAGO: "🇦🇷",
  STRIPE:      "💳",
  BINANCE:     "🟡",
};

const LIGHT_STYLES: Record<AccessLight, { dot: string; text: string; badge: string; label: string }> = {
  green:   { dot: "bg-green-500",             text: "text-green-400",  badge: "bg-green-500/10 border-green-500/30",  label: "Activo"      },
  yellow:  { dot: "bg-yellow-400",            text: "text-yellow-400", badge: "bg-yellow-400/10 border-yellow-400/30",label: "Por vencer"  },
  red:     { dot: "bg-red-500 animate-pulse", text: "text-red-400",    badge: "bg-red-500/10 border-red-500/30",      label: "Vence pronto"},
  expired: { dot: "bg-ink-600",               text: "text-ink-400",    badge: "bg-ink-800 border-ink-700",            label: "Expirado"    },
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card px-5 py-4">
      <div className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}

function AccessCard({ purchase }: { purchase: PurchaseDto }) {
  const info = getAccessTimeInfo(purchase);
  const s = LIGHT_STYLES[info.light];
  return (
    <Link
      href={`/dashboard/courses/${purchase.courseId}`}
      className="card group flex items-center gap-4 p-5 transition hover:border-brand-500/40"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${s.badge}`}>
        <BookOpen className={`h-5 w-5 ${s.text}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{purchase.courseTitle}</div>
        <div className={`mt-1 flex items-center gap-1.5 text-xs ${s.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
          {info.detail && <span className="text-ink-500">· {info.detail}</span>}
        </div>
        {purchase.expiresAt && info.light !== "expired" && (
          <div className="mt-1 text-xs text-ink-500">
            Vence el {formatDate(purchase.expiresAt)}
          </div>
        )}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-ink-600 transition group-hover:text-brand-400" />
    </Link>
  );
}

function PaymentCard({ payment }: { payment: PaymentDto }) {
  const status = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING;
  const Icon = status.icon;
  return (
    <div className="flex items-center gap-4 border-b border-ink-800 px-5 py-4 last:border-0">
      {/* Provider badge */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-800 text-lg">
        {PROVIDER_ICON[payment.provider] ?? "💳"}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{PROVIDER_LABEL[payment.provider] ?? payment.provider}</div>
        <div className="text-xs text-ink-400">{formatDate(payment.createdAt)}</div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <div className="text-sm font-semibold">
          {formatPaymentAmount(payment.amountCents, payment.currency)}
        </div>
        <div className="text-xs text-ink-500">{payment.currency}</div>
      </div>

      {/* Status chip */}
      <div className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.bg} ${status.border} ${status.text}`}>
        <Icon className="h-3 w-3" />
        {status.label}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const { data: payments, isLoading: loadingPayments } = useMyPayments();
  const { data: purchases, isLoading: loadingPurchases } = useMyPurchases();

  const allPurchases   = purchases ?? [];
  const allPayments    = payments  ?? [];
  const activePurchases = allPurchases.filter((p) => p.status === "ACTIVE");
  const approvedCount   = allPayments.filter((p) => p.status === "APPROVED").length;
  const totalSpent      = allPayments
    .filter((p) => p.status === "APPROVED" && p.currency === "USD")
    .reduce((acc, p) => acc + p.amountCents, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <CreditCard className="h-6 w-6 text-brand-400" />
          Pagos y accesos
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Historial de compras y estado de acceso a tus cursos.
        </p>
      </div>

      {/* Stats row */}
      {!loadingPayments && allPayments.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Cursos activos" value={activePurchases.length} />
          <StatCard label="Pagos aprobados" value={approvedCount} />
          {totalSpent > 0 && (
            <StatCard
              label="Total invertido (USD)"
              value={formatPaymentAmount(totalSpent, "USD")}
              sub="sólo pagos aprobados"
            />
          )}
        </div>
      )}

      {/* Access section */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-300">
          <ShieldCheck className="h-4 w-4" />
          Estado de acceso
        </h2>

        {loadingPurchases ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="card h-[72px] animate-pulse bg-ink-800/40" />
            ))}
          </div>
        ) : activePurchases.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-8 text-center">
            <BookOpen className="h-8 w-8 text-ink-600" />
            <div className="text-sm text-ink-400">No tenés accesos activos en este momento.</div>
            <Link href="/#cursos" className="btn-primary text-sm">
              Explorar cursos
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activePurchases.map((p) => (
              <AccessCard key={p.id} purchase={p} />
            ))}
          </div>
        )}
      </section>

      {/* Payment history */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-300">
          <Clock className="h-4 w-4" />
          Historial de pagos
        </h2>

        {loadingPayments ? (
          <div className="card divide-y divide-ink-800">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[65px] animate-pulse bg-ink-800/40" />
            ))}
          </div>
        ) : allPayments.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-8 text-center">
            <CreditCard className="h-8 w-8 text-ink-600" />
            <div className="text-sm text-ink-400">Todavía no realizaste ningún pago.</div>
          </div>
        ) : (
          <div className="card overflow-hidden divide-y divide-ink-800">
            {allPayments.map((p) => (
              <PaymentCard key={p.id} payment={p} />
            ))}
          </div>
        )}

        {allPayments.some((p) => p.status === "PENDING") && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
            <p className="text-xs text-yellow-300">
              Tenés pagos pendientes. Los pagos con Mercado Pago pueden tardar unos minutos en
              confirmarse. Si ya completaste el pago, actualizá la página en unos momentos.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
