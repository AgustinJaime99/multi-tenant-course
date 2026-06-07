import { siteConfig } from "../../../content/site.config";

export function FaqSection() {
  return (
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
  );
}
