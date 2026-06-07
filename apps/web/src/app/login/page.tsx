"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@app/shared";
import { Loader2 } from "lucide-react";
import { useState, Suspense } from "react";
import { useLogin } from "@/lib/queries";
import { getErrorMessage } from "@/lib/api";
import { siteConfig } from "../../../content/site.config";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useLogin();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setError("");
    try {
      await login.mutateAsync(values);
      router.push(params.get("redirect") || "/dashboard");
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" {...register("email")} placeholder="tu@email.com" />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label">Contraseña</label>
        <input className="input" type="password" {...register("password")} placeholder="••••••••" />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>
      {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Iniciar sesión
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold">
          <span className="text-2xl">{siteConfig.brand.logoEmoji}</span>
          {siteConfig.brand.name}
        </Link>
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-ink-200">Accede a tu cuenta para continuar aprendiendo.</p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-ink-200">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-brand-400 hover:underline">
              Regístrate
            </Link>
          </p>
          <div className="mt-4 rounded-lg bg-ink-800/50 p-3 text-center text-xs text-ink-200">
            Demo — admin@demo.com / Admin1234 · user@demo.com / User1234
          </div>
        </div>
      </div>
    </div>
  );
}
