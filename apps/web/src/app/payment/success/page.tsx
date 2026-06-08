"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMyPurchases } from "@/lib/queries";

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS  = 15000; // stop after 15s no matter what

function SuccessInner() {
  const params   = useSearchParams();
  const courseId = params.get("courseId");
  const qc       = useQueryClient();

  const { data: purchases } = useMyPurchases();
  const [confirmed, setConfirmed] = useState(false);
  const [timedOut,  setTimedOut]  = useState(false);
  const pollCount = useRef(0);

  const isActive = courseId
    ? (purchases ?? []).some((p) => p.courseId === courseId && p.status === "ACTIVE")
    : false;

  // Single effect: invalidate on mount, then poll until active or timeout
  useEffect(() => {
    // Invalidate immediately on arrival from MP
    qc.invalidateQueries({ queryKey: ["purchases"] });
    qc.invalidateQueries({ queryKey: ["payments", "me"] });

    const interval = setInterval(() => {
      pollCount.current += 1;
      qc.invalidateQueries({ queryKey: ["purchases"] });

      if (pollCount.current * POLL_INTERVAL_MS >= POLL_TIMEOUT_MS) {
        clearInterval(interval);
        setTimedOut(true);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  // Stop polling as soon as purchase is confirmed
  useEffect(() => {
    if (isActive) setConfirmed(true);
  }, [isActive]);

  const showSpinner = !confirmed && !timedOut;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md p-10 text-center">
        {showSpinner ? (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-brand-400" />
            <h1 className="mt-6 text-2xl font-bold">Confirmando pago...</h1>
            <p className="mt-2 text-ink-200">
              Verificando tu pago con MercadoPago. Esto puede tomar unos segundos.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-16 w-16 text-brand-400" />
            <h1 className="mt-6 text-2xl font-bold">
              {confirmed ? "¡Pago confirmado!" : "¡Gracias por tu compra!"}
            </h1>
            <p className="mt-2 text-ink-200">
              {confirmed
                ? "Ya tenés acceso completo al curso."
                : "Tu pago está siendo procesado. En unos minutos vas a ver el acceso activo en tu panel."}
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
