"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, Check, Star } from "lucide-react";
import { siteConfig } from "../../content/site.config";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCourses } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

function Icon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Cmp = (Icons as any)[name] ?? Icons.Sparkles;
  return <Cmp className={className} />;
}

export default function HomePage() {
  const { data: courses } = useCourses();
  const featured = courses?.[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-900/20 via-ink-950 to-ink-950" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
              <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
              {siteConfig.hero.badge}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {siteConfig.hero.title}{" "}
              <span className="gradient-text">{siteConfig.hero.highlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-200">{siteConfig.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary">
                {siteConfig.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#cursos" className="btn-secondary">
                {siteConfig.hero.ctaSecondary}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {siteConfig.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-ink-200">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.hero.imageUrl}
              alt="Barbería profesional"
              className="aspect-[4/5] w-full rounded-3xl border border-ink-800 object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Todo lo que necesitas para destacar</h2>
          <p className="mt-4 text-ink-200">
            Una formación completa con las herramientas para aprender y emprender.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-brand-500/10 p-3 text-brand-400">
                <Icon name={f.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-200">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Curso / Pricing */}
      <section id="cursos" className="border-y border-ink-800 bg-ink-900/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">El curso</h2>
            <p className="mt-4 text-ink-200">Acceso completo, de por vida, con certificado.</p>
          </div>

          {featured && (
            <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.coverImage || siteConfig.hero.imageUrl}
                alt={featured.title}
                className="h-full w-full rounded-2xl border border-ink-800 object-cover"
              />
              <div className="card p-8">
                <h3 className="text-2xl font-bold">{featured.title}</h3>
                <p className="mt-2 text-ink-200">{featured.subtitle}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-brand-400">
                    {formatPrice(featured.priceCents, featured.currency)}
                  </span>
                  <span className="text-sm text-ink-200">pago único</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {siteConfig.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-brand-400" /> {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/courses/${featured.slug}`}
                  className="btn-primary mt-8 w-full"
                >
                  Ver el curso <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Lo que dicen nuestros alumnos</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-1 text-brand-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-400" />
                ))}
              </div>
              <p className="mt-4 text-ink-100">“{t.quote}”</p>
              <div className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-ink-200">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-ink-800 bg-ink-900/30 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h2>
          <div className="mt-10 space-y-4">
            {siteConfig.faq.map((f) => (
              <details key={f.question} className="card group p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm text-ink-200">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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

      <Footer />
    </div>
  );
}
