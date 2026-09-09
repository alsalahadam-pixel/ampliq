"use client";

import { Arrow, Button, ButtonLink } from "@/components/ui/button";
import { buildIcs } from "@/lib/booking/ics";
import {
  formatLongDate,
  formatTime,
  formatZoneAbbreviation,
} from "@/lib/booking/time";
import type { BookingDetails, BookingResult } from "@/lib/booking/types";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { fill } from "@/lib/utils";

export function Confirmation({
  result,
  details,
  businessTimeZone,
  intlTag,
  locale,
  dict,
  onBookAnother,
}: {
  result: BookingResult;
  details: BookingDetails;
  businessTimeZone: string;
  intlTag: string;
  locale: Locale;
  dict: Dictionary;
  onBookAnother: () => void;
}) {
  const t = dict.booking.confirmation;
  const start = new Date(result.start);
  const end = new Date(result.end);

  const date = formatLongDate(start, details.timeZone, intlTag);
  const time = `${formatTime(start, details.timeZone, intlTag)}–${formatTime(
    end,
    details.timeZone,
    intlTag,
  )}`;
  const zone = formatZoneAbbreviation(start, details.timeZone, intlTag);
  const zonesDiffer = details.timeZone !== businessTimeZone;

  function downloadIcs() {
    const ics = buildIcs({
      start: result.start,
      end: result.end,
      summary: locale === "de" ? "Gespräch mit AMPLIQ" : "Call with AMPLIQ",
      description: details.message,
    });

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ampliq-call.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div role="status" className="border border-rule bg-paper-soft p-8 sm:p-12">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper"
      >
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path d="M2.5 8.5 6 12l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <h2 className="font-display mt-6 text-display-sm">{t.title}</h2>
      <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-graphite">
        {t.body}
      </p>

      <dl className="mt-9 border-t border-rule-strong">
        <Row label={dict.booking.steps.date} value={date} />
        <Row
          label={dict.booking.steps.time}
          value={`${time} (${zone})`}
          note={
            zonesDiffer
              ? fill(dict.booking.slots.alsoIn, {
                  time: `${formatTime(
                    start,
                    businessTimeZone,
                    intlTag,
                  )}–${formatTime(end, businessTimeZone, intlTag)}`,
                  zone: formatZoneAbbreviation(start, businessTimeZone, intlTag),
                })
              : undefined
          }
        />
        <Row label={dict.booking.details.email} value={details.email} />
      </dl>

      {/* Whether a confirmation actually went out is stated either way. */}
      <p className="mt-6 text-[0.875rem] leading-relaxed text-graphite">
        {result.emailSent
          ? fill(t.emailSent, { email: details.email })
          : t.emailNotSent}
      </p>

      <h3 className="eyebrow mt-10 text-graphite">{t.whatNext}</h3>
      <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink">
        {t.whatNextBody}
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="primary" onClick={downloadIcs} className="shrink-0">
          {t.addToCalendar}
          <Arrow className="rotate-90" />
        </Button>
        <Button variant="outline" onClick={onBookAnother} withArrow={false}>
          {t.bookAnother}
        </Button>
        <ButtonLink href={route(locale, "home")} variant="ghost" className="sm:ml-2">
          {t.backHome}
        </ButtonLink>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  /** Secondary line under the value, e.g. the same time in the other zone. */
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3.5">
      <dt className="eyebrow text-graphite">{label}</dt>
      <dd className="text-right">
        <span className="block text-[0.9375rem] font-medium text-ink">
          {value}
        </span>
        {note ? (
          <span className="mt-0.5 block text-[0.8125rem] text-graphite">
            {note}
          </span>
        ) : null}
      </dd>
    </div>
  );
}
