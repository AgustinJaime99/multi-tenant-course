import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "../../../content/site.config";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="card overflow-hidden bg-gradient-to-br from-brand-600/20 to-brand-900/10 p-10 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">¿Listo para empezar?</h2>
        <p className="mt-4 text-ink-200">
          Únete a miles de alumnos y conviértete en barbero profesional.
        </p>
        <Link href="/register" className="btn-primary mt-8">
          {siteConfig.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
