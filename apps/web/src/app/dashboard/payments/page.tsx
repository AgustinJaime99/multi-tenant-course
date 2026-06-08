"use client";

import { CreditCard, CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react";
import { useMyPayments, useMyPurchases } from "@/lib/queries";
import { getAccessTimeInfo, formatPaymentAmount, type AccessLight } from "@/lib/access-time";
import { formatDate } from "@/lib/utils";
import type { PaymentDto, PurchaseDto } from "@app/shared";

const STATUS_STYLES = {
  APPROVED: { icon: CheckCircle2, text: "text-green-400",  label: "Aprobado"  },
  PENDING:  { icon: Clock,        text: "text-yellow-400", label: "Pendiente"  },
  REJECTED: { icon: XCircle,      text: "text-red-400",    label: "Rechazado"  },
  REFUNDED: { icon: RefreshCw,    text: "text-ink-400",    label: "Reembolsado"},
};

const PROVIDER_LABEL: Record<string, string> = {
  MERCADOPAGO: "Mercado Pago",
  STRIPE:      "Stripe",
  BINANCE:     "Binance Pay",
};

const LIGHT_STYLES: Record<AccessLight, { dot: string; text: string; label: string }> = {
  green:   { dot: "bg-green-500",            text: "text-green-400",  label: "Activo"      },
  yellow:  { dot: "bg-yellow-400",           text: "text-yellow-400", label: "Por vencer"  },
  red:     { dot: "bg-red-500 animate-pulse", text: "text-red-400",   label: "Vence pronto"},
  expired: { dot: "bg-ink-600",              text: "text-ink-400",    label: "Expirado"    },
};

function PaymentRow({ payment }: { payment: PaymentDto }) {
  const status = STATUS_STYLES[payment.status] ?? STATUS_STYLES.PENDING;
  const Icon = status.icon;
  return (
    <tr className="border-b border-ink-800 last:border-0">
      <td className="py-3 pr-4 text-sm">{formatDate(payment.createdAt)}</td>
      <td className="py-3 pr-4 text-sm">{PROVIDER_LABEL[payment.provider] ?? payment.provider}</td>
      <td className="py-3 pr-4 text-sm font-medium">
        {formatPaymentAmount(payment.amountCents, payment.currency)}
        <span className="ml-1 text-xs text-ink-400">{payment.currency}</span>
      </td>
      <td className="py-3">
        <span className={`flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
          <Icon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </td>
    </tr>
  );
}

function PurchaseAccessRow({ purchase }: { purchase: PurchaseDto }) {
  const info = getAccessTimeInfo(purchase);
  const s = LIGHT_STYLES[info.light];
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900/40 px-4 py-3">
      <div className="min-w-0">
        <div className="truncate font-medium text-sm">{purchase.courseTitle}</div>
        {purchase.expiresAt && info.light !== "expired" && (
          <div className="mt-0.5 text-xs text-ink-400">
            Vence el {formatDate(purchase.expiresAt)}
          </div>
        )}
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ml-4 ${s.text}`}>
        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
        {s.label}
        {info.detail && <span className="text-ink-500">· {info.detail}</span>}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const { data: payments, isLoading: loadingPayments } = useMyPayments();
  const { data: purchases, isLoading: loadingPurchases } = useMyPurchases();

  const activePurchases = (purchases ?? []).filter((p) => p.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <CreditCard className="h-6 w-6 text-brand-400" /> Pagos y accesos
      </h1>

      {/* Access status per course */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-300">
          Estado de acceso
        </h2>
        {loadingPurchases ? (
          <div className="text-sm text-ink-400">Cargando...</div>
        ) : activePurchases.length === 0 ? (
          <div className="card p-6 text-center text-sm text-ink-400">
            No tenés accesos activos en este momento.
          </div>
        ) : (
          <div className="space-y-2">
            {activePurchases.map((p) => (
              <PurchaseAccessRow key={p.id} purchase={p} />
            ))}
          </div>
        )}
      </section>

      {/* Payment history */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-300">
          Historial de pagos
        </h2>
        {loadingPayments ? (
          <div className="text-sm text-ink-400">Cargando...</div>
        ) : (payments ?? []).length === 0 ? (
          <div className="card p-6 text-center text-sm text-ink-400">
            Todavía no realizaste ningún pago.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800">
                  <th className="pb-2 pr-4 pt-4 text-left text-xs font-medium uppercase tracking-wider text-ink-400 px-5">Fecha</th>
                  <th className="pb-2 pr-4 pt-4 text-left text-xs font-medium uppercase tracking-wider text-ink-400">Método</th>
                  <th className="pb-2 pr-4 pt-4 text-left text-xs font-medium uppercase tracking-wider text-ink-400">Monto</th>
                  <th className="pb-2 pt-4 text-left text-xs font-medium uppercase tracking-wider text-ink-400">Estado</th>
                </tr>
              </thead>
              <tbody className="px-5">
                {(payments ?? []).map((p) => (
                  <PaymentRow key={p.id} payment={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
