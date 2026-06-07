"use client";

import { useState } from "react";
import { LifeBuoy, Plus } from "lucide-react";
import type { SupportTicketDto } from "@app/shared";
import { useMyTickets, useCreateTicket, useReplyTicket } from "@/lib/queries";
import { TicketSidebar } from "@/components/support/ticket-sidebar";
import { TicketThread, TicketThreadEmpty } from "@/components/support/ticket-thread";
import { NewTicketForm } from "@/components/support/new-ticket-form";

export default function SupportPage() {
  const { data: tickets } = useMyTickets();
  const createTicket = useCreateTicket();
  const reply = useReplyTicket();

  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<SupportTicketDto | null>(null);
  const [replyText, setReplyText] = useState("");

  // Keep selected ticket in sync after reply mutations
  const activeTicket = tickets?.find((t) => t.id === selected?.id) ?? selected;

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (subject.length < 3 || message.length < 5) return;
    const ticket = await createTicket.mutateAsync({ subject, message });
    setSubject("");
    setMessage("");
    setCreating(false);
    setSelected(ticket);
  }

  async function handleSendReply() {
    if (!activeTicket || !replyText.trim()) return;
    const updated = await reply.mutateAsync({ id: activeTicket.id, message: replyText });
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
        <NewTicketForm
          subject={subject}
          message={message}
          onSubjectChange={setSubject}
          onMessageChange={setMessage}
          onSubmit={handleCreateTicket}
          isPending={createTicket.isPending}
        />
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TicketSidebar
            tickets={tickets ?? []}
            activeId={activeTicket?.id}
            onSelect={setSelected}
          />
        </div>

        <div className="lg:col-span-2">
          {activeTicket ? (
            <TicketThread
              ticket={activeTicket}
              replyText={replyText}
              onReplyChange={setReplyText}
              onSend={handleSendReply}
              isSending={reply.isPending}
            />
          ) : (
            <TicketThreadEmpty />
          )}
        </div>
      </div>
    </div>
  );
}
