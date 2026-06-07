import { Loader2 } from "lucide-react";

interface Props {
  fullScreen?: boolean;
}

export function PageLoader({ fullScreen = false }: Props) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "h-full"}`}>
      <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
    </div>
  );
}
