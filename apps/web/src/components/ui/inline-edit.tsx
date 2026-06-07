"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";

interface Props {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function InlineEdit({ value, onSave, placeholder, className = "" }: Props) {
  const [editing, setEditing] = useState(false);
  // Always sync draft from the latest prop value when opening edit mode,
  // not from initial mount — avoids stale values after mutations.
  const [draft, setDraft] = useState(value);

  function startEdit() {
    setDraft(value); // always reset to current prop, not stale state
    setEditing(true);
  }

  function commit(e: React.FormEvent) {
    e.preventDefault();
    onSave(draft);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={startEdit}
        className={`flex items-center gap-1 text-left hover:text-brand-300 ${className}`}
      >
        {value || <span className="italic text-ink-400">{placeholder}</span>}
        <Pencil className="h-3 w-3 shrink-0 opacity-50" />
      </button>
    );
  }

  return (
    <form className="flex items-center gap-1" onSubmit={commit}>
      <input
        autoFocus
        className="input py-1 text-sm"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button type="submit" className="text-brand-400 hover:text-brand-300">
        <Check className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => setEditing(false)} className="text-ink-400">
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
