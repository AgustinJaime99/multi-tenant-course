"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, Trash2 } from "lucide-react";
import type { ModuleDto } from "@app/shared";
import { useDeleteModule, useUpdateModule } from "@/lib/queries";
import { InlineEdit } from "@/components/ui/inline-edit";
import { LessonRow } from "./lesson-row";
import { AddLessonForm } from "./add-lesson-form";

interface Props {
  mod: ModuleDto;
}

export function ModuleSection({ mod }: Props) {
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-800">
      <ModuleHeader
        mod={mod}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        onRename={(title) => updateModule.mutate({ moduleId: mod.id, title })}
        onDelete={() => deleteModule.mutate(mod.id)}
        isDeleting={deleteModule.isPending}
      />

      {expanded && (
        <>
          {mod.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
          <AddLessonForm moduleId={mod.id} nextOrder={mod.lessons.length} />
        </>
      )}
    </div>
  );
}

interface HeaderProps {
  mod: ModuleDto;
  expanded: boolean;
  onToggle: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function ModuleHeader({ mod, expanded, onToggle, onRename, onDelete, isDeleting }: HeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-900/60 px-4 py-2.5">
      <button onClick={onToggle} className="text-ink-400 hover:text-ink-100">
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <span className="mr-2 text-xs text-ink-400">#{mod.order}</span>
      <div className="flex-1">
        <InlineEdit
          value={mod.title}
          placeholder="Sin título"
          className="text-sm font-semibold"
          onSave={onRename}
        />
      </div>
      <span className="text-xs text-ink-400">{mod.lessons.length} lecciones</span>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="text-ink-400 hover:text-red-400"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
