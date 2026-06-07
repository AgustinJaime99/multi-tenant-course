"use client";

import { ArrowLeft, Loader2, Plus } from "lucide-react";
import type { CourseDto } from "@app/shared";
import { useAddModule, useUpdateCourse } from "@/lib/queries";
import { InlineEdit } from "@/components/ui/inline-edit";
import { StatusBadge, courseStatusToVariant } from "@/components/ui/status-badge";
import { PriceInput } from "@/components/ui/price-input";
import { ModuleSection } from "./module-section";

type CourseUpdate = Parameters<ReturnType<typeof useUpdateCourse>["mutate"]>[0];

interface Props {
  course: CourseDto;
  onBack: () => void;
}

export function CourseEditor({ course, onBack }: Props) {
  const addModule = useAddModule();

  return (
    <div className="space-y-6">
      <CourseEditorHeader course={course} onBack={onBack} />
      <CourseMeta course={course} />
      <ModuleList
        course={course}
        onAddModule={() =>
          addModule.mutate({
            courseId: course.id,
            title: "Nueva sección",
            order: course.modules.length,
          })
        }
        isAddingModule={addModule.isPending}
      />
    </div>
  );
}

function CourseEditorHeader({ course, onBack }: { course: CourseDto; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="text-ink-400 hover:text-ink-100">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="text-xl font-bold">{course.title}</h2>
      <StatusBadge variant={courseStatusToVariant(course.status)} />
    </div>
  );
}

// CourseMeta owns its own mutation so the type is always correct
function CourseMeta({ course }: { course: CourseDto }) {
  const updateCourse = useUpdateCourse();

  function save(patch: Omit<CourseUpdate, "id">) {
    updateCourse.mutate({ id: course.id, ...patch });
  }

  return (
    <div className="card space-y-4 p-5">
      <h3 className="text-sm font-semibold text-ink-200">Información del curso</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título">
          <InlineEdit value={course.title} className="text-sm" onSave={(title) => save({ title })} />
        </Field>
        <Field label="Slug">
          <InlineEdit value={course.slug} className="text-sm" onSave={(slug) => save({ slug })} />
        </Field>
        <Field label="Subtítulo">
          <InlineEdit
            value={course.subtitle ?? ""}
            placeholder="Agregar subtítulo"
            className="text-sm"
            onSave={(subtitle) => save({ subtitle })}
          />
        </Field>
        <Field label="Imagen de portada (URL)">
          <InlineEdit
            value={course.coverImage ?? ""}
            placeholder="https://..."
            className="text-sm"
            onSave={(coverImage) => save({ coverImage })}
          />
        </Field>
        <Field label="Precio USD">
          <PriceInput
            value={course.priceCents}
            onChange={(priceCents) => save({ priceCents })}
            className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm w-full"
          />
        </Field>
        <Field label="Precio ARS">
          <PriceInput
            value={course.priceArs}
            currency="ARS"
            onChange={(priceArs) => save({ priceArs })}
            className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm w-full"
          />
        </Field>
        <Field label="Estado">
          <select
            value={course.status}
            onChange={(e) => save({ status: e.target.value as "DRAFT" | "PUBLISHED" })}
            className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </Field>
      </div>
      <Field label="Descripción">
        <InlineEdit
          value={course.description ?? ""}
          placeholder="Agregar descripción"
          className="text-sm"
          onSave={(description) => save({ description })}
        />
      </Field>
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

interface ModuleListProps {
  course: CourseDto;
  onAddModule: () => void;
  isAddingModule: boolean;
}

function ModuleList({ course, onAddModule, isAddingModule }: ModuleListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Secciones ({course.modules.length})</h3>
        <button
          className="btn-secondary gap-1.5 py-1.5 text-xs"
          onClick={onAddModule}
          disabled={isAddingModule}
        >
          {isAddingModule ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Agregar sección
        </button>
      </div>

      {course.modules.length === 0 && (
        <p className="text-sm text-ink-400">Sin secciones. Agrega una para comenzar.</p>
      )}

      {course.modules.map((m) => (
        <ModuleSection key={m.id} mod={m} />
      ))}
    </div>
  );
}
