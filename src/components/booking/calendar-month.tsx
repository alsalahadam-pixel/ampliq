"use client";

import { useEffect, useId, useMemo, useRef } from "react";

import {
  addDaysToDateKey,
  daysInMonth,
  formatMonthLabel,
  parseDateKey,
  toDateKey,
  weekdayOf,
} from "@/lib/booking/time";
import type { DaySummary } from "@/lib/booking/types";
import type { Dictionary } from "@/lib/dictionary";
import { cn, fill } from "@/lib/utils";

/** Monday-first, matching the weekday labels and European convention. */
function mondayIndex(weekday: number): number {
  return (weekday + 6) % 7;
}

type DayState = "available" | "full" | "soon" | "past" | "closed" | "outside";

function stateOf(summary: DaySummary | undefined, inRange: boolean): DayState {
  if (!inRange) return "outside";
  if (!summary || summary.totalCount === 0) return "closed";
  if (summary.availableCount > 0) return "available";

  // Only a diary that is genuinely occupied reads as "fully booked".
  if (summary.blockedBy === "past") return "past";
  if (summary.blockedBy === "notice") return "soon";
  return "full";
}

export function CalendarMonth({
  month,
  days,
  selected,
  focusedDate,
  onFocusDate,
  onSelect,
  onMonthChange,
  minDate,
  maxDate,
  loading,
  intlTag,
  dict,
}: {
  /** `YYYY-MM`. */
  month: string;
  days: DaySummary[];
  selected: string | null;
  focusedDate: string;
  onFocusDate: (date: string, viaKeyboard: boolean) => void;
  onSelect: (date: string) => void;
  onMonthChange: (month: string) => void;
  minDate: string;
  maxDate: string;
  loading: boolean;
  /** BCP-47 tag for the month, weekday and day-name formatters. */
  intlTag: string;
  dict: Dictionary;
}) {
  const t = dict.booking.calendar;
  const headingId = useId();
  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const shouldFocus = useRef(false);

  const [year, monthNumber] = month.split("-").map(Number);

  const summaries = useMemo(() => {
    const map = new Map<string, DaySummary>();
    for (const day of days) map.set(day.date, day);
    return map;
  }, [days]);

  const weeks = useMemo(() => {
    const total = daysInMonth(year, monthNumber);
    const leading = mondayIndex(weekdayOf(year, monthNumber, 1));

    const cells: (string | null)[] = Array.from({ length: leading }, () => null);
    for (let day = 1; day <= total; day += 1) {
      cells.push(toDateKey({ year, month: monthNumber, day }));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (string | null)[][] = [];
    for (let index = 0; index < cells.length; index += 7) {
      rows.push(cells.slice(index, index + 7));
    }
    return rows;
  }, [year, monthNumber]);

  // Focus follows arrow keys. Guarded by a ref so a selection made with the
  // mouse does not yank focus around the grid.
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    cellRefs.current.get(focusedDate)?.focus();
  }, [focusedDate]);

  const previousMonth = monthNumber === 1
    ? `${year - 1}-12`
    : `${year}-${String(monthNumber - 1).padStart(2, "0")}`;
  const nextMonth = monthNumber === 12
    ? `${year + 1}-01`
    : `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

  const canGoBack = previousMonth >= minDate.slice(0, 7);
  const canGoForward = nextMonth <= maxDate.slice(0, 7);

  function move(from: string, delta: number) {
    const next = addDaysToDateKey(from, delta);
    if (next < minDate || next > maxDate) return;

    shouldFocus.current = true;
    onFocusDate(next, true);
    if (next.slice(0, 7) !== month) onMonthChange(next.slice(0, 7));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, date: string) {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (event.key in deltas) {
      event.preventDefault();
      move(date, deltas[event.key]);
      return;
    }

    // Home and End move to the ends of the visible week.
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const parsed = parseDateKey(date)!;
      const offset = mondayIndex(
        weekdayOf(parsed.year, parsed.month, parsed.day),
      );
      move(date, event.key === "Home" ? -offset : 6 - offset);
      return;
    }

    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const target = event.key === "PageUp" ? previousMonth : nextMonth;
      const [targetYear, targetMonth] = target.split("-").map(Number);
      const day = Math.min(
        parseDateKey(date)!.day,
        daysInMonth(targetYear, targetMonth),
      );
      const next = toDateKey({ year: targetYear, month: targetMonth, day });
      if (next < minDate || next > maxDate) return;

      shouldFocus.current = true;
      onFocusDate(next, true);
      onMonthChange(target);
    }
  }

  const monthLabel = formatMonthLabel(year, monthNumber, intlTag);
  const dayFormatter = new Intl.DateTimeFormat(intlTag, {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  function labelFor(date: string, state: DayState, summary?: DaySummary) {
    const parsed = parseDateKey(date)!;
    const readable = dayFormatter.format(
      new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)),
    );

    if (state === "available") {
      const count = summary?.availableCount ?? 0;
      return fill(count === 1 ? t.dayAvailableOne : t.dayAvailableMany, {
        date: readable,
        count,
      });
    }
    if (state === "full") return fill(t.dayFull, { date: readable });
    if (state === "soon") return fill(t.dayTooSoon, { date: readable });
    if (state === "past") return fill(t.dayPast, { date: readable });
    return fill(t.dayClosed, { date: readable });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3
          id={headingId}
          aria-live="polite"
          className="font-display text-[1.375rem] leading-none font-bold tracking-[-0.03em]"
        >
          {monthLabel}
        </h3>

        <div className="flex items-center gap-1.5">
          <MonthButton
            label={t.previousMonth}
            disabled={!canGoBack}
            onClick={() => onMonthChange(previousMonth)}
            direction="prev"
          />
          <MonthButton
            label={t.nextMonth}
            disabled={!canGoForward}
            onClick={() => onMonthChange(nextMonth)}
            direction="next"
          />
        </div>
      </div>

      <div className="relative mt-6">
        {/* Weekday header, outside the grid so it is not read as a row of dates. */}
        <div
          aria-hidden="true"
          className="grid grid-cols-7 border-b border-rule pb-2.5"
        >
          {t.weekdays.map((day) => (
            <span
              key={day}
              className="text-center text-[0.6875rem] font-medium tracking-[0.09em] text-graphite uppercase"
            >
              {day}
            </span>
          ))}
        </div>

        <div
          role="grid"
          aria-labelledby={headingId}
          aria-busy={loading}
          className={cn(
            "mt-1.5 transition-opacity duration-200",
            loading && "opacity-45",
          )}
        >
          {weeks.map((week, index) => (
            <div role="row" key={index} className="grid grid-cols-7">
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <span role="gridcell" key={dayIndex} aria-hidden="true" />;
                }

                const inRange = date >= minDate && date <= maxDate;
                const state = stateOf(summaries.get(date), inRange);
                const isSelected = date === selected;
                const day = Number(date.slice(8));

                return (
                  // Selection is announced on the cell: `aria-selected` is part
                  // of the grid pattern and is not valid on a button.
                  <span
                    role="gridcell"
                    key={date}
                    aria-selected={isSelected}
                    className="p-0.5"
                  >
                    <button
                      type="button"
                      ref={(node) => {
                        if (node) cellRefs.current.set(date, node);
                        else cellRefs.current.delete(date);
                      }}
                      tabIndex={date === focusedDate ? 0 : -1}
                      aria-disabled={state !== "available"}
                      aria-label={labelFor(date, state, summaries.get(date))}
                      data-state={state}
                      onKeyDown={(event) => onKeyDown(event, date)}
                      onFocus={() => onFocusDate(date, false)}
                      onClick={() => {
                        if (state === "available") onSelect(date);
                      }}
                      className={cn(
                        // A fixed row height, not `aspect-square`: the grid is
                        // as wide as the column it sits in, and square cells at
                        // that width leave the month floating in white space.
                        "relative flex h-12 w-full items-center justify-center rounded-[2px] text-[0.9375rem] tabular-nums transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-14",
                        state === "available" &&
                          !isSelected &&
                          "cursor-pointer font-medium text-ink hover:bg-ink hover:text-paper",
                        state === "available" &&
                          isSelected &&
                          "bg-accent font-medium text-white",
                        // Struck through means taken. A day that is only too
                        // soon, closed or past is greyed, never struck.
                        state === "full" &&
                          "cursor-not-allowed text-fog line-through decoration-fog/60",
                        (state === "soon" ||
                          state === "past" ||
                          state === "closed" ||
                          state === "outside") &&
                          "cursor-not-allowed text-fog/55",
                      )}
                    >
                      {day}
                      {/* A dot rather than a count: the exact number matters at
                          the time step, not while scanning a month. */}
                      {state === "available" && !isSelected ? (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2 h-1 w-1 rounded-full bg-accent"
                        />
                      ) : null}
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-4 text-xs text-graphite">
        <Legend swatch={<span className="h-1.5 w-1.5 rounded-full bg-accent" />}>
          {t.legendAvailable}
        </Legend>
        <Legend
          swatch={
            <span className="h-px w-3 bg-fog" />
          }
        >
          {t.legendFull}
        </Legend>
        <Legend swatch={<span className="h-1.5 w-1.5 rounded-full bg-rule-strong" />}>
          {t.legendClosed}
        </Legend>
      </ul>
    </div>
  );
}

function Legend({
  swatch,
  children,
}: {
  swatch: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden="true" className="flex w-3 justify-center">
        {swatch}
      </span>
      {children}
    </li>
  );
}

function MonthButton({
  label,
  disabled,
  onClick,
  direction,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-rule-strong text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:border-rule disabled:text-fog disabled:hover:bg-transparent disabled:hover:text-fog"
    >
      <svg
        viewBox="0 0 16 16"
        className={cn("h-3.5 w-3.5", direction === "prev" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        aria-hidden="true"
      >
        <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
