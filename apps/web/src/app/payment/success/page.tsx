"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function SuccessInner() {
  const params = useSearchParams();
  const courseId = params.get("courseId");
  const qc = useQueryClient();

  useEffect(() => {
    qc.invalidateQueries({ queryKey: ["purchases"] });
  }, [qc]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand-400" />
        <h1 className="mt-6 text-2xl font-bold">¡Pago confirmado!</h1>
        <p className="mt-2 text-ink-200">
          Ya tienes acceso completo al curso. Empieza a aprender ahora mismo.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {courseId && (
            <Link href={`/dashboard/courses/${courseId}`} className="btn-primary">
              Ir al curso
            </Link>
          )}
          <Link href="/dashboard" className="btn-secondary">
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
