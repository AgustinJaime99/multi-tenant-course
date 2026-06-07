"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useAddLesson } from "@/lib/queries";

interface Props {
  moduleId: string;
  nextOrder: number;
}

interface FormState {
  title: string;
  videoUrl: string;
  description: string;
  durationMin: string;
  order: string;
}

const emptyForm = (order: number): FormState => ({
  title: "",
  videoUrl: "",
  description: "",
  durationMin: "",
  order: order.toString(),
});

export function AddLessonForm({ moduleId, nextOrder }: Props) {
  const addLesson = useAddLesson();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(nextOrder));

  function open_() {
    setForm(emptyForm(nextOrder));
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addLesson.mutate(
      {
        moduleId,
        title: form.title.trim(),
        videoUrl: form.videoUrl || undefined,
        description: form.description || undefined,
        durationMin: form.durationMin ? parseInt(form.durationMin, 10) : undefined,
        order: parseInt(form.order, 10) || nextOrder,
      },
      {
        onSuccess: () => {
          setForm(emptyForm(nextOrder));
          setOpen(false);
        },
      },
    );
  }

  if (!open) {
    return (
      <button
        onClick={open_}
        className="flex w-full items-center gap-2 px-4 py-2 text-xs text-ink-400 hover:text-brand-300"
      >
        <Plus className="h-3.5 w-3.5" /> Agregar lección
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2 border-t border-ink-800 bg-ink-900/40 p-3">
      <p className="text-xs font-semibold text-ink-200">Nueva lección</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-ink-300">Título *</label>
          <input
            autoFocus
            required
            className="input w-full py-1.5 text-sm"
            placeholder="Título de la lección"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-300">Orden</label>
          <input
            type="number"
            className="input w-full py-1.5 text-sm"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-ink-300">
          URL de video (YouTube embed, Vimeo embed, etc.)
        </label>
        <input
          className="input w-full py-1.5 text-sm"
          placeholder="https://www.youtube.com/embed/... o https://player.vimeo.com/video/..."
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-ink-300">Descripción</label>
        <textarea
          className="input w-full py-1.5 text-sm"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-ink-300">Duración (min)</label>
        <input
          type="number"
          className="input w-32 py-1.5 text-sm"
          value={form.durationMin}
          onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary py-1 text-xs" disabled={addLesson.isPending}>
          {addLesson.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
          Agregar
        </button>
        <button type="button" className="btn-secondary py-1 text-xs" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
