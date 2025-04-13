import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, short = false): string {
  const options: Intl.DateTimeFormatOptions = short
    ? { weekday: "short" }
    : { weekday: "long", year: "numeric", month: "long", day: "numeric" }

  return date.toLocaleDateString("es-ES", options)
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
