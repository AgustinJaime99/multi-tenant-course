import type { PurchaseDto } from "@app/shared";

export type AccessLight = "green" | "yellow" | "red" | "expired";

export interface AccessTimeInfo {
  light: AccessLight;
  label: string;
  detail: string;
  remainingMs: number;
}

export function getAccessTimeInfo(purchase: PurchaseDto): AccessTimeInfo {
  if (purchase.status !== "ACTIVE" || !purchase.expiresAt) {
    return { light: "expired", label: "Expirado", detail: "", remainingMs: 0 };
  }

  const now = Date.now();
  const expiresAt = new Date(purchase.expiresAt).getTime();
  const remainingMs = expiresAt - now;

  if (remainingMs <= 0) {
    return { light: "expired", label: "Expirado", detail: "", remainingMs: 0 };
  }

  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  let detail: string;
  if (days > 0) {
    detail = `${days}d ${hours}h restantes`;
  } else if (hours > 0) {
    detail = `${hours}h ${minutes}m restantes`;
  } else {
    detail = `${minutes}m restantes`;
  }

  // Semaphore thresholds (relative to 3-month access = ~90 days)
  // Green  > 30 days
  // Yellow 7–30 days
  // Red    < 7 days
  if (days >= 30) {
    return { light: "green", label: "Activo", detail, remainingMs };
  }
  if (days >= 7) {
    return { light: "yellow", label: "Por vencer", detail, remainingMs };
  }
  return { light: "red", label: "Vence pronto", detail, remainingMs };
}

export function formatPaymentAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat(currency === "ARS" ? "es-AR" : "es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "ARS" ? 0 : 2,
  }).format(cents / 100);
}
