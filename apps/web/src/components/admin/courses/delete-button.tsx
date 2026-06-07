"use client";

import { Loader2, Trash2 } from "lucide-react";

interface Props {
  onDelete: () => void;
  isPending: boolean;
}

export function DeleteButton({ onDelete, isPending }: Props) {
  return (
    <button
      onClick={onDelete}
      disabled={isPending}
      className="text-ink-400 hover:text-red-400 disabled:cursor-not-allowed"
      aria-label="Eliminar curso"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
