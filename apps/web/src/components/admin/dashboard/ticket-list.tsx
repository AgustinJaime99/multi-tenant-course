"use client";

import { useState } from "react";
import type { SupportTicketDto, TicketStatus } from "@app/shared";
import { useUpdateTicketStatus, useReplyTicket } from "@/lib/queries";

const STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

interface Props {
  tickets: SupportTicketDto[];
}

export function TicketList({ tickets }: Props) {
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const updateStatus = useUpdateTicketStatus();
  const reply = useReplyTicket();

  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-ink-800 px-5 py-4 font-semibold">Tickets de soporte</h2>
      <div className="divide-y divide-ink-800">
        {tickets.map((ticket) => (
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            replyText={replyMap[ticket.id] ?? ""}
            onReplyChange={(text) => setReplyMap({ ...replyMap, [ticket.id]: text })}
            onStatusChange={(status) => updateStatus.mutate({ id: ticket.id, status })}
            onSendReply={async () => {
              const msg = replyMap[ticket.id];
              if (!msg) return;
              await reply.mutateAsync({ id: ticket.id, message: msg });
              setReplyMap({ ...replyMap, [ticket.id]: "" });
            }}
            isSending={reply.isPending}
          />
        ))}
      </div>
    </div>
  );
}

interface TicketItemProps {
  ticket: SupportTicketDto;
  replyText: string;
  onReplyChange: (text: string) => void;
  onStatusChange: (status: TicketStatus) => void;
  onSendReply: () => void;
  isSending: boolean;
}

function TicketItem({ ticket, replyText, onReplyChange, onStatusChange, onSendReply, isSending }: TicketItemProps) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <span className="font-medium">{ticket.subject}</span>
        <select
          value={ticket.status}
          onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
          className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 space-y-2">
        {ticket.messages.map((m) => (
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
          value={replyText}
          onChange={(e) => onReplyChange(e.target.value)}
          placeholder="Responder como soporte..."
        />
        <button className="btn-primary px-4" onClick={onSendReply} disabled={isSending}>
          Enviar
        </button>
      </div>
    </div>
  );
}
