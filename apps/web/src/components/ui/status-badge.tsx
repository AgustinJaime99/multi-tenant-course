type Variant = "published" | "draft";

const variantStyles: Record<Variant, string> = {
  published: "bg-brand-500/20 text-brand-300",
  draft: "bg-ink-700 text-ink-300",
};

const variantLabels: Record<Variant, string> = {
  published: "Publicado",
  draft: "Borrador",
};

interface Props {
  variant: Variant;
}

export function StatusBadge({ variant }: Props) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${variantStyles[variant]}`}>
      {variantLabels[variant]}
    </span>
  );
}

export function courseStatusToVariant(status: string): Variant {
  return status === "PUBLISHED" ? "published" : "draft";
}
