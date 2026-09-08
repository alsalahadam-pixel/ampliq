export type ClassValue = string | false | null | undefined;

/** Minimal class joiner — enough for this codebase, zero dependencies. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** `01`, `02`, … — the index style used across the site. */
export function pad(index: number): string {
  return String(index).padStart(2, "0");
}
