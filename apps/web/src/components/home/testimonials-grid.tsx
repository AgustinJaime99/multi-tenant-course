import { Star } from "lucide-react";
import { siteConfig } from "../../../content/site.config";

export function TestimonialsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        Lo que dicen nuestros alumnos
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {siteConfig.testimonials.map((t) => (
          <div key={t.name} className="card p-6">
            <div className="flex gap-1 text-brand-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-400" />
              ))}
            </div>
            <p className="mt-4 text-ink-100">"{t.quote}"</p>
            <div className="mt-4 text-sm">
              <div className="font-semibold">{t.name}</div>
              <div className="text-ink-200">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
