/**
 * `POST /api/booking`
 *
 * Takes a completed booking, re-checks the slot against freshly fetched
 * availability, records it, writes the calendar event when a provider allows
 * it, and sends both emails.
 *
 * The re-check is the point: the browser was shown availability at some earlier
 * moment, and the slot may have gone since. A `409` here is a normal outcome,
 * not an error condition — the UI sends the visitor back to the times for that
 * day with the slot now marked taken.
 */

import { publicBookingConfig } from "@/lib/booking/config";
import { submitBooking } from "@/lib/booking/service";
import { validateBooking } from "@/lib/booking/validate";

export const dynamic = "force-dynamic";

/** Crude per-process throttle: enough to blunt a script, cheap enough to keep. */
const RECENT = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (RECENT.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  hits.push(now);
  RECENT.set(key, hits);

  // Keep the map from growing without bound on a long-lived server.
  if (RECENT.size > 500) {
    for (const [entry, times] of RECENT) {
      if (times.every((at) => now - at >= WINDOW_MS)) RECENT.delete(entry);
    }
  }

  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: Request): Promise<Response> {
  const forwarded = request.headers.get("x-forwarded-for");
  const client = forwarded?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(client)) {
    return Response.json({ error: "rate-limited" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const config = publicBookingConfig();
  const validation = validateBooking(payload, config.timeZone);

  if (!validation.ok) {
    return Response.json(
      { error: "invalid", fields: validation.errors },
      { status: 400 },
    );
  }

  const result = await submitBooking(validation.value);

  if (!result.confirmed) {
    return Response.json(result, {
      status: result.error === "slot-taken" ? 409 : 400,
    });
  }

  return Response.json(result, { status: 201 });
}
