"use client";

import { useState, useEffect } from "react";

interface PriceInputProps {
  value: number;
  onChange: (cents: number) => void;
  currency?: "USD" | "ARS";
  className?: string;
  placeholder?: string;
}

export function PriceInput({
  value,
  onChange,
  currency = "USD",
  className = "",
  placeholder,
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatCentsToDisplay(value, currency));
  }, [value, currency]);

  function formatCentsToDisplay(cents: number, cur: "USD" | "ARS"): string {
    if (cur === "ARS") {
      // ARS: no decimals — store raw pesos as cents×1 (we treat 1 ARS = 1 "cent" for ARS)
      return Math.round(cents / 100).toString();
    }
    return (cents / 100).toFixed(2).replace(".", ",");
  }

  function parseDisplayToCents(display: string, cur: "USD" | "ARS"): number {
    const cleaned = display.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return 0;
    if (cur === "ARS") return Math.round(parsed) * 100;
    return Math.round(parsed * 100);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // ARS: only digits and dots (thousand separator); USD: digits and comma
    const cleaned =
      currency === "ARS"
        ? raw.replace(/[^\d.]/g, "")
        : raw.replace(/[^\d,]/g, "");
    setDisplayValue(cleaned);
  }

  function handleBlur() {
    const cents = parseDisplayToCents(displayValue, currency);
    onChange(cents);
    setDisplayValue(formatCentsToDisplay(cents, currency));
  }

  const symbol = currency === "ARS" ? "$" : "$";
  const defaultPlaceholder = currency === "ARS" ? "0" : "0,00";

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300">{symbol}</span>
      {currency === "ARS" && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">ARS</span>
      )}
      <input
        type="text"
        inputMode="decimal"
        className={`pl-7 ${currency === "ARS" ? "pr-12" : ""} ${className}`}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder ?? defaultPlaceholder}
      />
    </div>
  );
}
