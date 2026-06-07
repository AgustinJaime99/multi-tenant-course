"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useMyPurchases } from "@/lib/queries";

export default function MyCoursesPage() {
  const { data: purchases } = useMyPurchases();
  const active = (purchases ?? []).filter((p) => p.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <BookOpen className="h-6 w-6 text-brand-400" /> Mis cursos
      </h1>

      {active.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-ink-200">
          No tienes cursos activos todavía.{" "}
          <Link href="/#cursos" className="text-brand-400 hover:underline">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {active.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/courses/${p.courseId}`}
              className="card flex items-center justify-between p-5 transition hover:border-brand-500/50"
            >
              <div>
                <div className="font-semibold">{p.courseTitle}</div>
                <div className="mt-1 text-xs text-brand-300">Acceso activo · {p.provider}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-ink-200" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
