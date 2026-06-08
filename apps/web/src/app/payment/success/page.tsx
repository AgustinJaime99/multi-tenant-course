"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMyPurchases } from "@/lib/queries";

function SuccessInner() {
  const params = useSearchParams();
  const courseId = params.get("courseId");
  const qc = useQueryClient();

  // Poll purchases until the webhook activates the purchase (MP webhooks can take a few seconds)
  const [polling, setPolling] = useState(true);
  const { data: purchases } = useMyPurchases();

  const isActive = courseId
    ? (purchases ?? []).some((p) => p.courseId === courseId && p.status === "ACTIVE")
    : true;

  useEffect(() => {
    if (isActive) { setPolling(false); return; }
    // Invalidate every 2s until the purchase shows as ACTIVE
    const interval = setInterval(() => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["payments", "me"] });
    }, 2000);
    // Stop polling after 30s regardless
    const timeout = setTimeout(() => { setPolling(false); clearInterval(interval); }, 30000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [isActive, qc]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md p-10 text-center">
        {polling && !isActive ? (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-brand-400" />
            <h1 className="mt-6 text-2xl font-bold">Confirmando pago...</h1>
            <p className="mt-2 text-ink-200">
              Estamos verificando tu pago con MercadoPago. Esto puede tomar unos segundos.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-16 w-16 text-brand-400" />
            <h1 className="mt-6 text-2xl font-bold">¡Pago confirmado!</h1>
            <p className="mt-2 text-ink-200">
              Ya tenés acceso completo al curso. ¡Empezá a aprender ahora mismo!
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {courseId && (
            <Link href={`/dashboard/courses/${courseId}`} className="btn-primary">
              Ir al curso
            </Link>
          )}
          <Link href="/dashboard/payments" className="btn-secondary">
            Ver mis pagos
          </Link>
          <Link href="/dashboard" className="btn-ghost">
            Ir a mi panel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
