"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { siteConfig } from "../../content/site.config";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export function Navbar() {
  const router = useRouter();
  const { user, hydrated, clear } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    clear();
    router.push("/");
  }

  const showAuth = mounted && hydrated;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl">{siteConfig.brand.logoEmoji}</span>
          <span>{siteConfig.brand.name}</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/#cursos" className="text-sm text-ink-200 hover:text-white">Cursos</Link>
          <Link href="/#features" className="text-sm text-ink-200 hover:text-white">Beneficios</Link>
          <Link href="/#faq" className="text-sm text-ink-200 hover:text-white">FAQ</Link>

          {showAuth && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="btn-secondary py-2">
                <LayoutDashboard className="h-4 w-4" /> Mi panel
              </Link>
              <button onClick={logout} className="btn-ghost py-2" aria-label="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : showAuth ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-ghost py-2">Iniciar sesión</Link>
              <Link href="/register" className="btn-primary py-2">Empezar</Link>
            </div>
          ) : null}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-800 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/#cursos" onClick={() => setOpen(false)}>Cursos</Link>
            <Link href="/#faq" onClick={() => setOpen(false)}>FAQ</Link>
            {showAuth && user ? (
              <>
                <Link href="/dashboard" className="btn-secondary">Mi panel</Link>
                <button onClick={logout} className="btn-ghost">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Iniciar sesión</Link>
                <Link href="/register" className="btn-primary">Empezar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
