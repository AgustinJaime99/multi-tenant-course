"use client";

import { Send } from "lucide-react";
import type { SupportTicketDto } from "@app/shared";

interface Props {
  ticket: SupportTicketDto;
  replyText: string;
  onReplyChange: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function TicketThread({ ticket, replyText, onReplyChange, onSend, isSending }: Props) {
  return (
    <div className="card flex h-[28rem] flex-col p-5">
      <h2 className="font-semibold">{ticket.subject}</h2>
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {ticket.messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              m.isFromAdmin ? "bg-ink-800 text-ink-100" : "ml-auto bg-brand-500/20 text-ink-100"
            }`}
          >
            <div className="mb-0.5 text-xs text-ink-200">
              {m.isFromAdmin ? "Soporte" : "Tú"}
            </div>
            {m.message}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="input"
          value={replyText}
          onChange={(e) => onReplyChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={onSend} className="btn-primary px-4" disabled={isSending}>
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function TicketThreadEmpty() {
  return (
    <div className="card flex h-[28rem] items-center justify-center text-ink-200">
      Selecciona o crea un ticket
    </div>
  );
}
