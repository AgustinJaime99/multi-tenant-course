"use client";

import { useState } from "react";
import { LifeBuoy, Loader2, Plus, Send } from "lucide-react";
import type { SupportTicketDto } from "@app/shared";
import { useMyTickets, useCreateTicket, useReplyTicket } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En curso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

export default function SupportPage() {
  const { data: tickets } = useMyTickets();
  const createTicket = useCreateTicket();
  const reply = useReplyTicket();
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<SupportTicketDto | null>(null);
  const [replyText, setReplyText] = useState("");

  const current = tickets?.find((t) => t.id === selected?.id) ?? selected;

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (subject.length < 3 || message.length < 5) return;
    const t = await createTicket.mutateAsync({ subject, message });
    setSubject("");
    setMessage("");
    setCreating(false);
    setSelected(t);
  }

  async function sendReply() {
    if (!current || replyText.trim().length === 0) return;
    const updated = await reply.mutateAsync({ id: current.id, message: replyText });
    setReplyText("");
    setSelected(updated);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <LifeBuoy className="h-6 w-6 text-brand-400" /> Soporte
        </h1>
        <button onClick={() => setCreating(!creating)} className="btn-primary py-2">
          <Plus className="h-4 w-4" /> Nuevo ticket
        </button>
      </div>

      {creating && (
        <form onSubmit={submitTicket} className="card mt-6 space-y-3 p-5">
          <div>
            <label className="label">Asunto</label>
            <input
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          <div>
            <label className="label">Mensaje</label>
            <textarea
              className="input min-h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe tu consulta..."
            />
          </div>
          <button type="submit" className="btn-primary" disabled={createTicket.isPending}>
            {createTicket.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar ticket
          </button>
        </form>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {(tickets ?? []).length === 0 ? (
            <div className="card p-6 text-center text-sm text-ink-200">
              No tienes tickets aún.
            </div>
          ) : (
            tickets!.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`card w-full p-4 text-left transition hover:border-brand-500/50 ${
                  current?.id === t.id ? "border-brand-500/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.subject}</span>
                  <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs">
                    {statusLabels[t.status]}
                  </span>
                </div>
                <div className="mt-1 text-xs text-ink-200">{formatDate(t.createdAt)}</div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {current ? (
            <div className="card flex h-[28rem] flex-col p-5">
              <h2 className="font-semibold">{current.subject}</h2>
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                {current.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      m.isFromAdmin
                        ? "bg-ink-800 text-ink-100"
                        : "ml-auto bg-brand-500/20 text-ink-100"
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
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Escribe un mensaje..."
                />
                <button onClick={sendReply} className="btn-primary px-4" disabled={reply.isPending}>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="card flex h-[28rem] items-center justify-center text-ink-200">
              Selecciona o crea un ticket
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
