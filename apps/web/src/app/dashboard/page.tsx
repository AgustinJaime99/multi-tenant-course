"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { useMyPurchases, useCourses } from "@/lib/queries";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardHome() {
  const { user } = useAuthStore();
  const { data: purchases } = useMyPurchases();
  const { data: courses } = useCourses();

  const active = (purchases ?? []).filter((p) => p.status === "ACTIVE");
  const ownedIds = new Set(active.map((p) => p.courseId));
  const available = (courses ?? []).filter((c) => !ownedIds.has(c.id));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Hola, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="mt-1 text-ink-200">Continúa donde lo dejaste o explora nuevos cursos.</p>

      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5 text-brand-400" /> Mis cursos
        </h2>
        {active.length === 0 ? (
          <div className="card p-8 text-center text-ink-200">
            Aún no tienes cursos. ¡Explora el catálogo más abajo!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/courses/${p.courseId}`}
                className="card flex items-center justify-between p-5 transition hover:border-brand-500/50"
              >
                <div>
                  <div className="font-semibold">{p.courseTitle}</div>
                  <div className="mt-1 text-xs text-brand-300">Acceso activo</div>
                </div>
                <ArrowRight className="h-5 w-5 text-ink-200" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {available.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-brand-400" /> Cursos disponibles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {available.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="card flex items-center justify-between p-5 transition hover:border-brand-500/50"
              >
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="mt-1 text-xs text-ink-200">{c.subtitle}</div>
                </div>
                <GraduationCap className="h-5 w-5 text-ink-200" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
