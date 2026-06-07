import { ArrowLeft, Plus } from "lucide-react";

interface Props {
  onBack: () => void;
  onNew?: () => void;
}

export function CoursePageHeader({ onBack, onNew }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-ink-400 hover:text-ink-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Gestión de cursos</h1>
      </div>
      {onNew && (
        <button className="btn-primary gap-2" onClick={onNew}>
          <Plus className="h-4 w-4" />
          Nuevo curso
        </button>
      )}
    </div>
  );
}
