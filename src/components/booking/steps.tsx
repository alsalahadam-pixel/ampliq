"use client";

import type { Dictionary } from "@/lib/dictionary";
import { cn, fill } from "@/lib/utils";

const ORDER = ["date", "time", "details", "done"] as const;

export type StepKey = (typeof ORDER)[number];

export function Steps({
  current,
  dict,
}: {
  current: StepKey;
  dict: Dictionary;
}) {
  const t = dict.booking.steps;
  const labels: Record<StepKey, string> = {
    date: t.date,
    time: t.time,
    details: t.details,
    done: t.done,
  };

  const index = ORDER.indexOf(current);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-rule pb-5">
      {/* The visible list is decorative sequencing; this is the announcement. */}
      <li className="sr-only" aria-current="step">
        {fill(t.stepOf, { current: index + 1, total: ORDER.length })} —{" "}
        {labels[current]}
      </li>

      {ORDER.map((step, position) => {
        const state =
          position < index ? "done" : position === index ? "current" : "upcoming";

        return (
          <li key={step} aria-hidden="true" className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-2 text-[0.6875rem] font-medium tracking-[0.09em] uppercase transition-colors duration-300",
                state === "current" && "text-ink",
                state === "done" && "text-graphite",
                state === "upcoming" && "text-fog",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[0.625rem] tabular-nums",
                  state === "current" && "bg-ink text-paper",
                  state === "done" && "bg-rule-strong text-ink",
                  state === "upcoming" && "border border-rule-strong text-fog",
                )}
              >
                {state === "done" ? (
                  <svg
                    viewBox="0 0 16 16"
                    className="h-2.5 w-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path d="M2.5 8.5 6 12l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  position + 1
                )}
              </span>
              {labels[step]}
            </span>

            {position < ORDER.length - 1 ? (
              <span className="mx-1 h-px w-4 bg-rule-strong sm:w-7" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
