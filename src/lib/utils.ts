export type ClassValue = string | false | null | undefined;

/** Minimal class joiner — enough for this codebase, zero dependencies. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** `01`, `02`, … — the index style used across the site. */
export function pad(index: number): string {
  return String(index).padStart(2, "0");
}

/**
 * Fills `{name}` placeholders in a dictionary string.
 *
 * Copy that needs a value interpolated stays a plain string rather than a
 * template function, because dictionaries are handed whole to client
 * components and functions cannot cross that boundary.
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
