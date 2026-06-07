"use client";

import { Award, Download } from "lucide-react";
import { useMyCertificates } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function CertificatesPage() {
  const { data: certificates } = useMyCertificates();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Award className="h-6 w-6 text-brand-400" /> Mis certificados
      </h1>

      {(certificates ?? []).length === 0 ? (
        <div className="card mt-6 p-8 text-center text-ink-200">
          Completa un curso al 100% para obtener tu certificado.
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {certificates!.map((c) => (
            <div key={c.id} className="card flex items-center justify-between p-5">
              <div>
                <div className="font-semibold">{c.courseTitle}</div>
                <div className="mt-1 text-xs text-ink-200">
                  Emitido el {formatDate(c.issuedAt)} · {c.userName}
                </div>
              </div>
              <a
                href={`${API}/api/certificates/${c.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-2"
              >
                <Download className="h-4 w-4" /> Descargar PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
