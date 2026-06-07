import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { siteConfig } from "../../../content/site.config";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Cmp = (Icons as any)[name] ?? Icons.Sparkles;
  return <Cmp className={className} />;
}

export function FeaturesGrid() {
  return (
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
              <DynamicIcon name={f.icon} className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-200">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
