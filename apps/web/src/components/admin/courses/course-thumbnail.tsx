import { BookOpen } from "lucide-react";

interface Props {
  src?: string | null;
  alt: string;
}

export function CourseThumbnail({ src, alt }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="h-14 w-20 shrink-0 rounded-lg object-cover" />;
  }
  return (
    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-ink-800">
      <BookOpen className="h-5 w-5 text-ink-500" />
    </div>
  );
}
