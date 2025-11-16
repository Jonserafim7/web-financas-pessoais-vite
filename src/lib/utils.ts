import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely formats a date string or Date object to "DD MMM" format in pt-BR locale
 * @param date - Date string (ISO) or Date object
 * @returns Formatted date string (e.g., "25 jun") or empty string if invalid
 */
export function formatTransactionDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return "";
    }

    return format(dateObj, "dd MMM", { locale: ptBR });
  } catch {
    return "";
  }
}

/**
 * Safely formats a number or string to Brazilian currency format (R$ X.XXX,XX)
 * @param amount - Number or string to format (can be null/undefined)
 * @returns Formatted currency string (e.g., "R$ 1.000,00") or "R$ 0,00" for invalid inputs
 */
export function formatCurrency(
  amount: string | number | null | undefined,
): string {
  try {
    if (amount === null || amount === undefined) {
      return "R$ 0,00";
    }

    // Convert string to number if needed
    const numAmount =
      typeof amount === "string" ? Number.parseFloat(amount) : amount;

    if (Number.isNaN(numAmount) || !Number.isFinite(numAmount)) {
      if (import.meta.env.DEV) {
        console.warn(
          `formatCurrency: Invalid amount value "${amount}", returning "R$ 0,00"`,
        );
      }
      return "R$ 0,00";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numAmount);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        `formatCurrency: Error formatting amount "${amount}":`,
        error,
      );
    }
    return "R$ 0,00";
  }
}
