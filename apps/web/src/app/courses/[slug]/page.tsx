"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, Lock, PlayCircle } from "lucide-react";
import type { PaymentProvider } from "@app/shared";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCourse, useCheckout } from "@/lib/queries";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const providers: { id: PaymentProvider; label: string }[] = [
  { id: "STRIPE", label: "Tarjeta (Stripe)" },
  { id: "MERCADOPAGO", label: "Mercado Pago" },
  { id: "BINANCE", label: "Binance Pay (cripto)" },
];

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: course, isLoading } = useCourse(slug, true);
  const checkout = useCheckout();
  const { user, hydrated } = useAuthStore();
  const [provider, setProvider] = useState<PaymentProvider>("STRIPE");
  const [error, setError] = useState("");

  async function buy() {
    setError("");
    if (hydrated && !user) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    if (!course) return;
    try {
      const session = await checkout.mutateAsync({ courseId: course.id, provider });
      window.location.href = session.url;
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  if (isLoading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-ink-200">{course.subtitle}</p>
            <p className="mt-6 text-ink-100">{course.description}</p>

            <h2 className="mt-10 text-2xl font-bold">Contenido del curso</h2>
            <p className="mt-1 text-sm text-ink-200">
              {course.modules.length} módulos · {totalLessons} lecciones
            </p>
            <div className="mt-6 space-y-4">
              {course.modules.map((m) => (
                <div key={m.id} className="card overflow-hidden">
                  <div className="border-b border-ink-800 bg-ink-900/60 px-5 py-4 font-semibold">
                    {m.title}
                  </div>
                  <ul className="divide-y divide-ink-800">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
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
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.coverImage || ""}
                alt={course.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-6">
                <div className="text-3xl font-bold text-brand-400">
                  {formatPrice(course.priceCents, course.currency)}
                </div>
                <p className="mt-1 text-sm text-ink-200">Pago único · Acceso de por vida</p>

                <div className="mt-5 space-y-2">
                  <label className="label">Método de pago</label>
                  {providers.map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-700 px-4 py-3 text-sm has-[:checked]:border-brand-500"
                    >
                      <input
                        type="radio"
                        name="provider"
                        checked={provider === p.id}
                        onChange={() => setProvider(p.id)}
                        className="accent-brand-500"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>

                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                <button onClick={buy} className="btn-primary mt-5 w-full" disabled={checkout.isPending}>
                  {checkout.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  Comprar ahora
                </button>

                <ul className="mt-6 space-y-2 text-sm text-ink-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" /> Certificado incluido
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" /> Soporte personalizado
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
