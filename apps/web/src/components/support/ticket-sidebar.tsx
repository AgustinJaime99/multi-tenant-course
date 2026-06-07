import type { SupportTicketDto } from "@app/shared";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En curso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

interface Props {
  tickets: SupportTicketDto[];
  activeId?: string;
  onSelect: (ticket: SupportTicketDto) => void;
}

export function TicketSidebar({ tickets, activeId, onSelect }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-ink-200">No tienes tickets aún.</div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className={`card w-full p-4 text-left transition hover:border-brand-500/50 ${
            activeId === t.id ? "border-brand-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.subject}</span>
            <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs">
              {STATUS_LABELS[t.status]}
            </span>
          </div>
          <div className="mt-1 text-xs text-ink-200">{formatDate(t.createdAt)}</div>
        </button>
      ))}
    </div>
  );
}
