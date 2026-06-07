"use client";

import { ArrowLeft, Check, CheckCircle2, Clock, Eye, Lock, PlayCircle } from "lucide-react";
import type { CourseDto } from "@app/shared";
import { StatusBadge, courseStatusToVariant } from "@/components/ui/status-badge";
import { formatPrice } from "@/lib/utils";

interface Props {
  course: CourseDto;
  onBack: () => void;
}

const MOCK_PROVIDERS = ["Tarjeta (Stripe)", "Mercado Pago", "Binance Pay (cripto)"];

const MOCK_BENEFITS = [
  "Acceso de por vida",
  "Certificado incluido",
  "Soporte personalizado",
  "Actualizaciones gratuitas",
];

export function CoursePreview({ course, onBack }: Props) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-7xl py-6">
      {/* Admin bar */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-brand-500/30 bg-brand-500/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-ink-400 hover:text-ink-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Eye className="h-4 w-4 text-brand-400" />
          <span className="text-sm font-medium text-brand-300">Vista previa del curso</span>
          <StatusBadge variant={courseStatusToVariant(course.status)} />
        </div>
        <span className="text-xs text-ink-400">
          Así lo verán los visitantes — los botones de compra están desactivados
        </span>
      </div>

      {/* Course detail layout (mirrors courses/[slug]/page.tsx) */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left: info + curriculum */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold sm:text-4xl">{course.title}</h1>
          {course.subtitle && (
            <p className="mt-3 text-lg text-ink-200">{course.subtitle}</p>
          )}
          {course.description && (
            <p className="mt-6 text-ink-100">{course.description}</p>
          )}

          <h2 className="mt-10 text-2xl font-bold">Contenido del curso</h2>
          <p className="mt-1 text-sm text-ink-200">
            {course.modules.length} módulos · {totalLessons} lecciones
          </p>

          <div className="mt-6 space-y-4">
            {course.modules.length === 0 ? (
              <div className="card p-6 text-center text-sm text-ink-400">
                Sin secciones todavía. Agrega contenido desde el editor.
              </div>
            ) : (
              course.modules.map((m) => (
                <div key={m.id} className="card overflow-hidden">
                  <div className="border-b border-ink-800 bg-ink-900/60 px-5 py-4 font-semibold">
                    {m.title}
                  </div>
                  <ul className="divide-y divide-ink-800">
                    {m.lessons.map((l) => (
                      <li
                        key={l.id}
                        className="flex items-center justify-between px-5 py-3 text-sm"
                      >
                        <span className="flex items-center gap-3">
                          <Lock className="h-4 w-4 text-ink-700" />
                          {l.title}
                        </span>
                        {l.durationMin && (
                          <span className="flex items-center gap-1 text-ink-200">
                            <Clock className="h-3.5 w-3.5" /> {l.durationMin} min
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: buy box (inert) */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6 overflow-hidden opacity-90">
            {course.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.coverImage}
                alt={course.title}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-ink-900 text-ink-500 text-sm">
                Sin imagen de portada
              </div>
            )}

            <div className="p-6">
              <div className="text-3xl font-bold text-brand-400">
                {formatPrice(course.priceCents, course.currency)}
              </div>
              <p className="mt-1 text-sm text-ink-200">Pago único · Acceso de por vida</p>

              <div className="mt-5 space-y-2">
                <label className="label">Método de pago</label>
                {MOCK_PROVIDERS.map((label) => (
                  <div
                    key={label}
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-ink-700 px-4 py-3 text-sm opacity-60"
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-ink-600" />
                    {label}
                  </div>
                ))}
              </div>

              <button
                disabled
                className="btn-primary mt-5 w-full cursor-not-allowed opacity-50"
              >
                <PlayCircle className="h-4 w-4" />
                Comprar ahora
              </button>

              <ul className="mt-6 space-y-2 text-sm text-ink-200">
                {MOCK_BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
