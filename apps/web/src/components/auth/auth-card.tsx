import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "../../../content/site.config";

interface Props {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
  showDemoCredentials?: boolean;
}

export function AuthCard({ title, subtitle, footer, children, showDemoCredentials }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold">
          <span className="text-2xl">{siteConfig.brand.logoEmoji}</span>
          {siteConfig.brand.name}
        </Link>
        <div className="card p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-ink-200">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-200">{footer}</div>
          {showDemoCredentials && (
            <div className="mt-4 rounded-lg bg-ink-800/50 p-3 text-center text-xs text-ink-200">
              Demo — admin@demo.com / Admin1234 · user@demo.com / User1234
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
