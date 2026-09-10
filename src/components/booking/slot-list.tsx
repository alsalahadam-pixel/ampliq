"use client";

import { formatLongDate, formatTime, formatZoneAbbreviation } from "@/lib/booking/time";
import type { Slot } from "@/lib/booking/types";
import type { Dictionary } from "@/lib/dictionary";
import { cn, fill } from "@/lib/utils";

/** Short label for why a slot cannot be taken. */
function blockedLabel(slot: Slot, dict: Dictionary): string | null {
  switch (slot.reason) {
    case "busy":
      return dict.booking.slots.taken;
    case "notice":
      return dict.booking.slots.tooSoon;
    case "past":
      return dict.booking.slots.past;
    default:
      // A DST-skipped slot is not a state worth explaining to a visitor; it is
      // simply not there. Rendered as unavailable with no label.
      return null;
  }
}

export function SlotList({
  date,
  slots,
  selected,
  onSelect,
  loading,
  visitorTimeZone,
  businessTimeZone,
  slotMinutes,
  intlTag,
  dict,
}: {
  /** `YYYY-MM-DD`. */
  date: string;
  slots: Slot[];
  selected: string | null;
  onSelect: (start: string) => void;
  loading: boolean;
  visitorTimeZone: string;
  businessTimeZone: string;
  slotMinutes: number;
  intlTag: string;
  dict: Dictionary;
}) {
  const t = dict.booking.slots;
  const reference = slots.length > 0 ? new Date(slots[0].start) : new Date();

  const visitorZone = formatZoneAbbreviation(reference, visitorTimeZone, intlTag);
  const businessZone = formatZoneAbbreviation(reference, businessTimeZone, intlTag);
  const zonesDiffer = visitorTimeZone !== businessTimeZone;

  const heading = formatLongDate(
    new Date(`${date}T12:00:00Z`),
    "UTC",
    intlTag,
  );

  if (!loading && slots.length === 0) {
    return (
      <div className="border border-rule bg-paper-soft p-8">
        <p className="text-[0.9375rem] font-medium text-ink">{t.none}</p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">
          {t.noneBody}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-[1.375rem] leading-none font-bold tracking-[-0.03em]">
          {heading}
        </h3>
        <p className="text-fine text-graphite">
          {fill(t.durationNote, { minutes: slotMinutes })} ·{" "}
          {fill(t.shownIn, { zone: visitorZone })}
        </p>
      </div>

      <ul
        aria-busy={loading}
        className={cn(
          "mt-6 grid gap-2 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3",
          loading && "opacity-45",
        )}
      >
        {slots.map((slot) => {
          const start = new Date(slot.start);
          const time = formatTime(start, visitorTimeZone, intlTag);
          const isSelected = slot.start === selected;
          const label = blockedLabel(slot, dict);

          // The visible label puts two clocks side by side, which runs together
          // when read aloud. The spoken name is composed separately.
          const spoken = [
            time,
            fill(t.durationNote, { minutes: slotMinutes }),
            zonesDiffer
              ? fill(t.alsoIn, {
                  time: formatTime(start, businessTimeZone, intlTag),
                  zone: businessZone,
                })
              : null,
            slot.available ? null : label,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <li key={slot.start}>
              <button
                type="button"
                disabled={!slot.available}
                aria-pressed={isSelected}
                aria-label={spoken}
                onClick={() => onSelect(slot.start)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-3 rounded-[2px] border px-4 py-3.5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  slot.available &&
                    !isSelected &&
                    "cursor-pointer border-rule-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
                  isSelected && "border-accent bg-accent text-white",
                  !slot.available &&
                    "cursor-not-allowed border-rule bg-paper-soft/60 text-fog",
                )}
              >
                <span
                  className={cn(
                    "text-[0.9375rem] font-medium tabular-nums",
                    !slot.available && "line-through decoration-fog/50",
                  )}
                >
                  {time}
                </span>

                {/* The other clock, so a visitor abroad can sanity-check it. */}
                {zonesDiffer && slot.available ? (
                  <span
                    className={cn(
                      "text-[0.6875rem] tabular-nums",
                      isSelected ? "text-white/70" : "text-graphite",
                    )}
                  >
                    {formatTime(start, businessTimeZone, intlTag)} {businessZone}
                  </span>
                ) : null}

                {!slot.available && label ? (
                  <span className="text-[0.6875rem] tracking-[0.06em] uppercase">
                    {label}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
