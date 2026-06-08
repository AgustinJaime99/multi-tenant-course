import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { CourseDto } from "@app/shared";
import { siteConfig } from "../../../content/site.config";
import { formatPrice } from "@/lib/utils";

interface Props {
  course: CourseDto | undefined;
}

export function PricingSection({ course }: Props) {
  return (
    <section id="cursos" className="border-y border-ink-800 bg-ink-900/30 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">El curso</h2>
          <p className="mt-4 text-ink-200">Acceso completo, con certificado.</p>
        </div>

        {course && (
          <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.coverImage || siteConfig.hero.imageUrl}
              alt={course.title}
              className="h-full w-full rounded-2xl border border-ink-800 object-cover"
            />
            <div className="card p-8">
              <h3 className="text-2xl font-bold">{course.title}</h3>
              <p className="mt-2 text-ink-200">{course.subtitle}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-brand-400">
                  {formatPrice(course.priceCents, course.currency)}
                </span>
                <span className="text-sm text-ink-200">pago único</span>
              </div>
              <ul className="mt-6 space-y-3">
                {siteConfig.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-brand-400" /> {b}
                  </li>
                ))}
              </ul>
              <Link href={`/courses/${course.slug}`} className="btn-primary mt-8 w-full">
                Ver el curso <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
