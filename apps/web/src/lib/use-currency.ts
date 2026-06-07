"use client";

import { useState, useEffect } from "react";
import type { PaymentProvider } from "@app/shared";

export type DisplayCurrency = "USD" | "ARS";

// Providers shown to Argentine users (MercadoPago first)
const PROVIDERS_AR: { id: PaymentProvider; label: string }[] = [
  { id: "MERCADOPAGO", label: "Mercado Pago" },
  { id: "BINANCE", label: "Binance Pay (cripto)" },
  { id: "STRIPE", label: "Tarjeta (Stripe)" },
];

// Providers shown to international users (Binance first, no MercadoPago)
const PROVIDERS_INTL: { id: PaymentProvider; label: string }[] = [
  { id: "BINANCE", label: "Binance Pay (cripto)" },
  { id: "STRIPE", label: "Tarjeta (Stripe)" },
];

function detectArgentina(): boolean {
  if (typeof navigator === "undefined") return false;
  const lang = navigator.language ?? "";
  // es-AR is the clearest signal; es alone is ambiguous so we also check timezone
  if (lang.toLowerCase() === "es-ar") return true;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    return tz.startsWith("America/Argentina");
  } catch {
    return false;
  }
}

export function useCurrency() {
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");

  useEffect(() => {
    if (detectArgentina()) setCurrency("ARS");
  }, []);

  function toggle() {
    setCurrency((c) => (c === "USD" ? "ARS" : "USD"));
  }

  function changeCurrency(newCurrency: DisplayCurrency) {
    setCurrency(newCurrency);
  }

  const providers = currency === "ARS" ? PROVIDERS_AR : PROVIDERS_INTL;
  const defaultProvider = providers[0].id;

  return { currency, toggle, setCurrency: changeCurrency, providers, defaultProvider };
}
