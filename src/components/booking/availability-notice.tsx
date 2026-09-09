"use client";

import type { AvailabilityMode } from "@/lib/booking/types";
import type { Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

/**
 * States plainly where the times on this page come from.
 *
 * The visitor is entitled to know whether a calendar was actually consulted.
 * "Provisional" and "offline" are shown as prominently as "live" — not buried,
 * and never phrased so that published working hours read as a checked calendar.
 */
export function AvailabilityNotice({
  mode,
  dict,
}: {
  mode: AvailabilityMode;
  dict: Dictionary;
}) {
  const t = dict.booking.availability;

  const content = {
    live: { title: t.liveTitle, body: t.liveBody },
    provisional: { title: t.provisionalTitle, body: t.provisionalBody },
    offline: { title: t.offlineTitle, body: t.offlineBody },
    unavailable: { title: t.errorTitle, body: t.errorBody },
  }[mode];

  const isLive = mode === "live";

  return (
    <div
      className={cn(
        "flex gap-3.5 border-l-2 px-5 py-4",
        isLive ? "border-success bg-success/5" : "border-accent bg-accent-wash",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
          isLive ? "bg-success" : "bg-accent",
        )}
      />
      <div>
        <p className="text-[0.875rem] font-medium text-ink">{content.title}</p>
        <p className="mt-1 max-w-[62ch] text-[0.875rem] leading-relaxed text-graphite">
          {content.body}
        </p>
      </div>
    </div>
  );
}
