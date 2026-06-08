"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { useMyPurchases } from "@/lib/queries";
import { getAccessTimeInfo, type AccessLight } from "@/lib/access-time";
import type { PurchaseDto } from "@app/shared";

const LIGHT_STYLES: Record<AccessLight, { dot: string; badge: string; text: string }> = {
  green:   { dot: "bg-green-500",  badge: "bg-green-500/10 border-green-500/30",  text: "text-green-400"  },
  yellow:  { dot: "bg-yellow-400", badge: "bg-yellow-400/10 border-yellow-400/30", text: "text-yellow-400" },
  red:     { dot: "bg-red-500 animate-pulse", badge: "bg-red-500/10 border-red-500/30", text: "text-red-400" },
  expired: { dot: "bg-ink-600",    badge: "bg-ink-800 border-ink-700",             text: "text-ink-400"   },
};

function AccessBadge({ purchase }: { purchase: PurchaseDto }) {
  const info = getAccessTimeInfo(purchase);
  const s = LIGHT_STYLES[info.light];
  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${s.badge} ${s.text}`}>
      <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
      {info.label}
      {info.detail && <span className="text-ink-400">· {info.detail}</span>}
    </div>
  );
}

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
          No tenés cursos activos todavía.{" "}
          <Link href="/#cursos" className="text-brand-400 hover:underline">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {active.map((p) => {
            const info = getAccessTimeInfo(p);
            return (
              <Link
                key={p.id}
                href={`/dashboard/courses/${p.courseId}`}
                className="card flex items-center gap-4 p-5 transition hover:border-brand-500/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.courseTitle}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <AccessBadge purchase={p} />
                    {info.light === "red" && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <Clock className="h-3 w-3" /> ¡Renová pronto!
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-ink-400 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
