"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "../../content/site.config";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Mis cursos", icon: BookOpen },
  { href: "/dashboard/payments", label: "Pagos", icon: CreditCard },
  { href: "/dashboard/certificates", label: "Certificados", icon: Award },
  { href: "/dashboard/support", label: "Soporte", icon: LifeBuoy },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clear } = useAuthStore();

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    clear();
    router.push("/");
  }

  return (
    <aside className="flex w-full flex-col border-r border-ink-800 bg-ink-900/40 md:h-screen md:w-64">
      <Link href="/" className="flex items-center gap-2 px-6 py-5 text-lg font-bold">
        <span className="text-2xl">{siteConfig.brand.logoEmoji}</span>
        <span className="truncate">{siteConfig.brand.shortName}</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
                active ? "bg-brand-500/15 text-brand-300" : "text-ink-200 hover:bg-ink-800",
              )}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}

        {user?.role === "ADMIN" && (
          <Link
            href="/dashboard/admin"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
              pathname.startsWith("/dashboard/admin")
                ? "bg-brand-500/15 text-brand-300"
                : "text-ink-200 hover:bg-ink-800",
            )}
          >
            <ShieldCheck className="h-4 w-4" /> Administración
          </Link>
        )}
      </nav>

      <div className="border-t border-ink-800 p-4">
        <div className="mb-3 px-2 text-sm">
          <div className="font-medium text-white">{user?.name}</div>
          <div className="truncate text-xs text-ink-200">{user?.email}</div>
        </div>
        <button onClick={logout} className="btn-ghost w-full justify-start">
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
