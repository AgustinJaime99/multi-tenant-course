import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export function KpiCard({ label, value, icon: Icon }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-200">{label}</span>
        <Icon className="h-5 w-5 text-brand-400" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
