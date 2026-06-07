import Link from "next/link";
import { siteConfig } from "../../content/site.config";

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">{siteConfig.brand.logoEmoji}</span>
            {siteConfig.brand.name}
          </div>
          <p className="mt-3 max-w-sm text-sm text-ink-200">
            {siteConfig.footer.description}
          </p>
          <p className="mt-4 text-sm text-ink-700">{siteConfig.brand.contactEmail}</p>
        </div>

        {siteConfig.footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ink-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-800 py-6 text-center text-xs text-ink-700">
        © {new Date().getFullYear()} {siteConfig.brand.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
