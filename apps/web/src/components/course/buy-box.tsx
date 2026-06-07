"use client";

import { CheckCircle2, Loader2, PlayCircle, DollarSign } from "lucide-react";
import type { PaymentProvider } from "@app/shared";
import type { DisplayCurrency } from "@/lib/use-currency";
import { formatPrice } from "@/lib/utils";
import { ErrorMessage } from "@/components/ui/error-message";

interface Provider {
  id: PaymentProvider;
  label: string;
}

interface Props {
  coverImage?: string | null;
  title: string;
  priceCents: number;
  priceArs: number;
  currency: DisplayCurrency;
  onCurrencyChange: (currency: DisplayCurrency) => void;
  providers: Provider[];
  selectedProvider: PaymentProvider;
  onProviderChange: (provider: PaymentProvider) => void;
  onBuy: () => void;
  isPending: boolean;
  error: string;
}

export function BuyBox({
  coverImage,
  title,
  priceCents,
  priceArs,
  currency,
  onCurrencyChange,
  providers,
  selectedProvider,
  onProviderChange,
  onBuy,
  isPending,
  error,
}: Props) {
  const displayCents = currency === "ARS" ? priceArs : priceCents;

  return (
    <div className="card sticky top-24 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coverImage || ""} alt={title} className="aspect-video w-full object-cover" />
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-ink-300">
              <DollarSign className="h-3.5 w-3.5" />
              Moneda
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as DisplayCurrency)}
                className="appearance-none cursor-pointer rounded-lg border border-ink-700 bg-ink-800 pl-3 pr-8 py-2 text-sm font-medium text-ink-100 hover:border-brand-500 hover:bg-ink-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="ARS">🇦🇷 ARS</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                <svg className="h-4 w-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 p-4">
            <div className="text-4xl font-bold text-brand-400">
              {formatPrice(displayCents, currency)}
            </div>
            <p className="mt-1.5 text-sm text-ink-200">Pago único · Acceso por 3 meses</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <label className="label">Método de pago</label>
          {providers.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-700 px-4 py-3 text-sm has-[:checked]:border-brand-500"
            >
              <input
                type="radio"
                name="provider"
                checked={selectedProvider === p.id}
                onChange={() => onProviderChange(p.id)}
                className="accent-brand-500"
              />
              {p.label}
            </label>
          ))}
        </div>

        {error && <div className="mt-3"><ErrorMessage message={error} /></div>}

        <button onClick={onBuy} className="btn-primary mt-5 w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
          Comprar ahora
        </button>

        <ul className="mt-6 space-y-2 text-sm text-ink-200">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-400" /> Certificado incluido
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-400" /> Soporte personalizado
          </li>
        </ul>
      </div>
    </div>
  );
}
