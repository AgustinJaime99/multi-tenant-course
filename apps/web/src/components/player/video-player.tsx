interface Props {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: Props) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-ink-800 bg-black">
      <iframe
        src={videoUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function VideoPlaceholder() {
  return (
    <div className="flex aspect-video items-center justify-center rounded-2xl border border-ink-800 bg-ink-900 text-ink-200">
      Selecciona una lección
    </div>
  );
}
