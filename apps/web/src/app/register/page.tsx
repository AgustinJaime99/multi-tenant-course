"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@app/shared";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRegister } from "@/lib/queries";
import { getErrorMessage } from "@/lib/api";
import { siteConfig } from "../../../content/site.config";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setError("");
    try {
      await registerMutation.mutateAsync(values);
      router.push("/dashboard");
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold">
          <span className="text-2xl">{siteConfig.brand.logoEmoji}</span>
          {siteConfig.brand.name}
        </Link>
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-ink-200">Empieza tu camino como barbero profesional.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label">Nombre</label>
              <input className="input" {...register("name")} placeholder="Tu nombre" />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" {...register("email")} placeholder="tu@email.com" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input className="input" type="password" {...register("password")} placeholder="Mínimo 8 caracteres" />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear cuenta
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-200">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-brand-400 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
