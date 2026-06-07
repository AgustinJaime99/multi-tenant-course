"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { LessonDto } from "@app/shared";
import { useUpdateLesson, useDeleteLesson } from "@/lib/queries";

function videoProviderLabel(url?: string | null) {
  if (!url) return null;
  if (url.includes("vimeo")) return "Vimeo";
  if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube";
  return "URL";
}

interface LessonFormState {
  title: string;
  description: string;
  videoUrl: string;
  durationMin: string;
  order: string;
}

function lessonToForm(lesson: LessonDto): LessonFormState {
  return {
    title: lesson.title,
    description: lesson.description ?? "",
    videoUrl: lesson.videoUrl ?? "",
    durationMin: lesson.durationMin?.toString() ?? "",
    order: lesson.order.toString(),
  };
}

interface Props {
  lesson: LessonDto;
}

export function LessonRow({ lesson }: Props) {
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<LessonFormState>(() => lessonToForm(lesson));

  function openEdit() {
    // Re-derive from current prop so stale state never leaks into the form
    setForm(lessonToForm(lesson));
    setEditing(true);
  }

  function save() {
    updateLesson.mutate(
      {
        lessonId: lesson.id,
        title: form.title,
        description: form.description || undefined,
        videoUrl: form.videoUrl || undefined,
        durationMin: form.durationMin ? parseInt(form.durationMin, 10) : undefined,
        order: parseInt(form.order, 10) || 0,
      },
      { onSuccess: () => setEditing(false) },
    );
  }

  if (editing) {
    return (
      <LessonEditForm
        form={form}
        onChange={setForm}
        onSave={save}
        onCancel={() => setEditing(false)}
        isPending={updateLesson.isPending}
      />
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-ink-800/40">
      <span className="w-6 shrink-0 text-center text-xs text-ink-400">{lesson.order}</span>
      <span className="flex-1">{lesson.title}</span>
      {lesson.videoUrl && (
        <span className="rounded bg-ink-700 px-1.5 py-0.5 text-xs text-ink-300">
          {videoProviderLabel(lesson.videoUrl)}
        </span>
      )}
      {lesson.durationMin && (
        <span className="text-xs text-ink-400">{lesson.durationMin}m</span>
      )}
      <button onClick={openEdit} className="text-ink-400 hover:text-brand-300">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => deleteLesson.mutate(lesson.id)}
        disabled={deleteLesson.isPending}
        className="text-ink-400 hover:text-red-400"
      >
        {deleteLesson.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

interface EditFormProps {
  form: LessonFormState;
  onChange: (form: LessonFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function LessonEditForm({ form, onChange, onSave, onCancel, isPending }: EditFormProps) {
  return (
    <div className="space-y-2 bg-ink-900/60 p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Título">
          <input
            autoFocus
            className="input w-full py-1.5 text-sm"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Orden">
          <input
            type="number"
            className="input w-full py-1.5 text-sm"
            value={form.order}
            onChange={(e) => onChange({ ...form, order: e.target.value })}
          />
        </Field>
      </div>
      <Field label="URL de video (YouTube embed, Vimeo embed, etc.)">
        <input
          className="input w-full py-1.5 text-sm"
          placeholder="https://www.youtube.com/embed/... o https://player.vimeo.com/video/..."
          value={form.videoUrl}
          onChange={(e) => onChange({ ...form, videoUrl: e.target.value })}
        />
      </Field>
      <Field label="Descripción">
        <textarea
          className="input w-full py-1.5 text-sm"
          rows={2}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
        />
      </Field>
      <Field label="Duración (minutos)">
        <input
          type="number"
          className="input w-32 py-1.5 text-sm"
          value={form.durationMin}
          onChange={(e) => onChange({ ...form, durationMin: e.target.value })}
        />
      </Field>
      <div className="flex gap-2">
        <button className="btn-primary py-1 text-xs" onClick={onSave} disabled={isPending}>
          {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
          Guardar
        </button>
        <button className="btn-secondary py-1 text-xs" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-ink-300">{label}</label>
      {children}
    </div>
  );
}
