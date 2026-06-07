interface Props {
  percentage: number;
}

export function ProgressBar({ percentage }: Props) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-200">Progreso del curso</span>
        <span className="font-medium text-brand-300">{percentage}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
