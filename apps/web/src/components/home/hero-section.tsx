import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { siteConfig } from "../../../content/site.config";

export function HeroSection() {
  return (
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
  );
}
