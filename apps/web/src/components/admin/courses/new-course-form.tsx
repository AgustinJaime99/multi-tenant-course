"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCreateCourse } from "@/lib/queries";
import { PriceInput } from "@/components/ui/price-input";

interface Props {
  onDone: () => void;
}

interface FormState {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImage: string;
  priceCents: number;
  priceArs: number;
  currency: string;
  status: "DRAFT" | "PUBLISHED";
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function NewCourseForm({ onDone }: Props) {
  const createCourse = useCreateCourse();
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    coverImage: "",
    priceCents: 0,
    priceArs: 0,
    currency: "USD",
    status: "DRAFT",
  });

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: f.slug || slugify(title) }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    createCourse.mutate(
      {
        ...form,
        priceCents: form.priceCents,
        subtitle: form.subtitle || undefined,
        description: form.description || undefined,
        coverImage: form.coverImage || undefined,
      },
      { onSuccess: onDone },
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h3 className="font-semibold">Nuevo curso</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Título *">
          <input
            required
            className="input w-full"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </FormField>
        <FormField label="Slug *">
          <input
            required
            className="input w-full"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </FormField>
        <FormField label="Subtítulo">
          <input
            className="input w-full"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
        </FormField>
        <FormField label="Imagen de portada (URL)">
          <input
            className="input w-full"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
        </FormField>
        <FormField label="Precio USD">
          <PriceInput
            value={form.priceCents}
            onChange={(priceCents) => setForm({ ...form, priceCents })}
            className="input w-full"
          />
        </FormField>
        <FormField label="Precio ARS">
          <PriceInput
            value={form.priceArs}
            currency="ARS"
            onChange={(priceArs) => setForm({ ...form, priceArs })}
            className="input w-full"
          />
        </FormField>
        <FormField label="Estado">
          <select
            className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </FormField>
      </div>
      <FormField label="Descripción">
        <textarea
          className="input w-full"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </FormField>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={createCourse.isPending}>
          {createCourse.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Crear curso
        </button>
        <button type="button" className="btn-secondary" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-ink-300">{label}</label>
      {children}
    </div>
  );
}
