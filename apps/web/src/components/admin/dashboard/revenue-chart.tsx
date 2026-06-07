import { formatPrice } from "@/lib/utils";

interface MonthRevenue {
  month: string;
  revenueCents: number;
}

interface Props {
  data: MonthRevenue[];
}

export function RevenueChart({ data }: Props) {
  const maxRevenue = Math.max(1, ...data.map((r) => r.revenueCents));

  return (
    <div className="card p-6">
      <h2 className="mb-4 font-semibold">Ingresos por mes</h2>
      {data.length === 0 ? (
        <p className="text-sm text-ink-200">Sin datos de ingresos todavía.</p>
      ) : (
        <div className="flex h-48 items-end gap-3">
          {data.map((r) => (
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
  );
}
