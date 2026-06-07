"use client";

import { Loader2 } from "lucide-react";

interface Props {
  subject: string;
  message: string;
  onSubjectChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function NewTicketForm({ subject, message, onSubjectChange, onMessageChange, onSubmit, isPending }: Props) {
  return (
    <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
      <div>
        <label className="label">Asunto</label>
        <input
          className="input"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="¿En qué podemos ayudarte?"
        />
      </div>
      <div>
        <label className="label">Mensaje</label>
        <textarea
          className="input min-h-24"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Describe tu consulta..."
        />
      </div>
      <button type="submit" className="btn-primary" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar ticket
      </button>
    </form>
  );
}
