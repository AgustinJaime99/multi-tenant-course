import { Award, Loader2 } from "lucide-react";

interface Props {
  onGenerate: () => void;
  isPending: boolean;
}

export function CertificateBanner({ onGenerate, isPending }: Props) {
  return (
    <div className="card mt-4 border-brand-500/40 bg-brand-500/10 p-5">
      <div className="flex items-center gap-3">
        <Award className="h-8 w-8 text-brand-400" />
        <div className="flex-1">
          <div className="font-semibold">¡Curso completado!</div>
          <div className="text-sm text-ink-200">Genera tu certificado oficial.</div>
        </div>
        <button onClick={onGenerate} className="btn-primary" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Obtener certificado
        </button>
      </div>
    </div>
  );
}
