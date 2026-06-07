import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number, currency = "USD") {
  const locale = currency === "ARS" ? "es-AR" : "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // ARS has no decimals by convention (e.g. $ 10.000)
    maximumFractionDigits: currency === "ARS" ? 0 : 2,
  }).format(cents / 100);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
