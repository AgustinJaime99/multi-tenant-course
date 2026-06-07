import type { ReactNode } from "react";

interface Props {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: Props) {
  return (
    <div className="card p-8 text-center text-ink-200">
      <p>{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
