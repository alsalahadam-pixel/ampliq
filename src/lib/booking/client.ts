/**
 * Browser-side availability loading.
 *
 * Calls the API when there is one, and falls back to computing the grid from
 * the published working hours when there is not — which is the case in the
 * static export, where no route handlers exist.
 *
 * The fallback is honest by construction: it returns `mode: "offline"`, the UI
 * labels the calendar accordingly, and the details step stops offering to
 * confirm a booking it cannot make. Working hours are presented as working
 * hours, never as a checked calendar.
 */

import {
  applyBuffer,
  datesInMonth,
  slotsForDate,
  summariseDays,
} from "@/lib/booking/availability";
import type { PublicBookingConfig } from "@/lib/booking/config";
import type {
  AvailabilityResponse,
  BookingRequest,
  BookingResult,
} from "@/lib/booking/types";

export type MonthAvailability = AvailabilityResponse & { month: string };

export type AvailabilityRequest = {
  config: PublicBookingConfig;
  month: string;
  date?: string;
  signal?: AbortSignal;
};

/** The local computation used when the API is unreachable. */
function computeOffline({
  config,
  month,
  date,
}: AvailabilityRequest): MonthAvailability {
  const [year, monthNumber] = month.split("-").map(Number);
  const days = datesInMonth(year, monthNumber);
  // No calendar and no booking list to consult, so nothing is busy. The buffer
  // is applied for shape only; with no intervals it is a no-op.
  const input = { config, busy: applyBuffer([], 0), now: new Date() };

  return {
    month,
    mode: "offline",
    businessTimeZone: config.timeZone,
    slotMinutes: config.slotMinutes,
    days: summariseDays(days, input),
    slots: date ? slotsForDate(date, input) : undefined,
  };
}

export async function fetchAvailability(
  request: AvailabilityRequest,
): Promise<MonthAvailability> {
  const params = new URLSearchParams({ month: request.month });
  if (request.date) params.set("date", request.date);

  try {
    const response = await fetch(`/api/booking/availability?${params}`, {
      signal: request.signal,
      headers: { accept: "application/json" },
    });

    if (!response.ok) return computeOffline(request);

    const payload = (await response.json()) as MonthAvailability;
    // A static host that answers every path with the shell would otherwise be
    // read as a successful, empty month.
    if (!payload || !Array.isArray(payload.days)) return computeOffline(request);

    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return computeOffline(request);
  }
}

export type SubmitOutcome =
  | { kind: "confirmed"; result: BookingResult }
  | { kind: "slot-taken" }
  | { kind: "invalid"; fields: Record<string, string> }
  | { kind: "no-server" }
  | { kind: "failed" };

export async function submitBookingRequest(
  request: BookingRequest,
): Promise<SubmitOutcome> {
  let response: Response;

  try {
    response = await fetch("/api/booking", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    return { kind: "failed" };
  }

  // A static export has no POST target. Say so rather than showing a
  // confirmation screen for a booking that was never taken.
  if (response.status === 404 || response.status === 405) {
    return { kind: "no-server" };
  }

  if (response.status === 409) return { kind: "slot-taken" };

  if (response.status === 400) {
    const payload = (await response.json().catch(() => null)) as {
      fields?: Record<string, string>;
    } | null;
    return { kind: "invalid", fields: payload?.fields ?? {} };
  }

  if (!response.ok) return { kind: "failed" };

  const result = (await response.json().catch(() => null)) as BookingResult | null;
  if (!result?.confirmed) return { kind: "failed" };

  return { kind: "confirmed", result };
}
