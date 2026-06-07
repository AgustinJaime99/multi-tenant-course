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
import { AuthCard } from "@/components/auth/auth-card";
import { ErrorMessage } from "@/components/ui/error-message";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useLogin();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

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
      {error && <ErrorMessage message={error} />}
      <button type="submit" className="btn-primary w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Iniciar sesión
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Bienvenido de vuelta"
      subtitle="Accede a tu cuenta para continuar aprendiendo."
      showDemoCredentials
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-brand-400 hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
