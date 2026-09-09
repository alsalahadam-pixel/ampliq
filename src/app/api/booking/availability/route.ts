/**
 * `GET /api/booking/availability`
 *
 * Query parameters:
 *   `month=YYYY-MM`  — day-by-day counts for the calendar grid
 *   `date=YYYY-MM-DD` — the full slot list for one day, plus that month's counts
 *
 * The response carries times and counts only. Nothing about what fills the
 * owner's calendar leaves this endpoint — see `lib/booking/providers/types.ts`.
 */

import { datesInMonth } from "@/lib/booking/availability";
import { publicBookingConfig } from "@/lib/booking/config";
import { loadAvailability } from "@/lib/booking/service";
import {
  dateKeyInZone,
  parseDateKey,
  parseMonthKey,
  toDateKey,
  toMonthKey,
} from "@/lib/booking/time";

/** Availability is checked live on every request; caching it would be wrong. */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const config = publicBookingConfig();
  const now = new Date();

  const dateParam = params.get("date");
  const monthParam = params.get("month");

  let month = monthParam ? parseMonthKey(monthParam) : null;
  let date: string | undefined;

  if (dateParam) {
    const parsed = parseDateKey(dateParam);
    if (!parsed) {
      return Response.json({ error: "invalid-date" }, { status: 400 });
    }
    date = toDateKey(parsed);
    month ??= { year: parsed.year, month: parsed.month };
  }

  if (!month) {
    const today = parseDateKey(dateKeyInZone(now, config.timeZone))!;
    month = { year: today.year, month: today.month };
  }

  const days = datesInMonth(month.year, month.month);

  const availability = await loadAvailability(
    { from: days[0], to: days[days.length - 1], date },
    now,
  );

  return Response.json(
    { month: toMonthKey(month), ...availability },
    {
      headers: {
        // Availability changes the moment somebody books; never store it.
        "cache-control": "no-store",
      },
    },
  );
}
