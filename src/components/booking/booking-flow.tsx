"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { AvailabilityNotice } from "@/components/booking/availability-notice";
import { CalendarMonth } from "@/components/booking/calendar-month";
import { Confirmation } from "@/components/booking/confirmation";
import { DetailsForm } from "@/components/booking/details-form";
import { SlotList } from "@/components/booking/slot-list";
import { Steps } from "@/components/booking/steps";
import { ButtonLink } from "@/components/ui/button";
import { bookableRange } from "@/lib/booking/availability";
import type { PublicBookingConfig } from "@/lib/booking/config";
import {
  type MonthAvailability,
  fetchAvailability,
  submitBookingRequest,
} from "@/lib/booking/client";
import {
  dateKeyInZone,
  detectTimeZone,
  formatLongDate,
  formatTime,
  formatZoneAbbreviation,
} from "@/lib/booking/time";
import type {
  BookingDetails,
  BookingResult,
  Slot,
} from "@/lib/booking/types";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { contact } from "@/lib/site";
import { cn, fill } from "@/lib/utils";

const INTL_TAG: Record<Locale, string> = { en: "en-GB", de: "de-DE" };

type Step = "date" | "time" | "details" | "done";

type Problem = "slot-taken" | "failed" | "no-server" | null;

type ClientEnvironment = {
  /** The visitor's own IANA zone. */
  zone: string;
  /** Today's date in the agency's zone — the first bookable day. */
  today: string;
  businessTimeZone: string;
};

/**
 * Everything the flow needs that only exists in a browser.
 *
 * Read through `useSyncExternalStore` rather than an effect: the server
 * snapshot is `null`, so the first render — on the server and again during
 * hydration — produces identical markup, and the real values arrive
 * immediately afterwards. Deriving the visitor's timezone or today's date
 * during a normal render would reintroduce exactly the hydration mismatch this
 * project has already fixed once.
 *
 * `getSnapshot` has to return a stable reference or React re-renders forever,
 * hence the module-level cache. Neither value changes within a session.
 */
let environmentCache: ClientEnvironment | null = null;

function environmentSnapshot(businessTimeZone: string): ClientEnvironment {
  if (!environmentCache || environmentCache.businessTimeZone !== businessTimeZone) {
    environmentCache = {
      businessTimeZone,
      zone: detectTimeZone(businessTimeZone),
      today: dateKeyInZone(new Date(), businessTimeZone),
    };
  }
  return environmentCache;
}

/** Nothing to subscribe to: neither value changes while the page is open. */
const noSubscription = () => () => {};
const serverSnapshot = () => null;

function useClientEnvironment(businessTimeZone: string): ClientEnvironment | null {
  return useSyncExternalStore(
    noSubscription,
    () => environmentSnapshot(businessTimeZone),
    serverSnapshot,
  );
}

export function BookingFlow({
  config,
  locale,
  dict,
}: {
  config: PublicBookingConfig;
  locale: Locale;
  dict: Dictionary;
}) {
  const intlTag = INTL_TAG[locale];

  const environment = useClientEnvironment(config.timeZone);
  const timeZone = environment?.zone ?? config.timeZone;
  const today = environment?.today ?? null;

  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // The month on screen and the roving grid focus default to today and are only
  // held as state once the visitor moves them, so nothing has to be
  // synchronised when the environment resolves.
  const [monthOverride, setMonthOverride] = useState<string | null>(null);
  const [focusOverride, setFocusOverride] = useState<string | null>(null);
  const month = monthOverride ?? today?.slice(0, 7) ?? null;
  const focusedDate = focusOverride ?? today ?? null;

  const [submitting, setSubmitting] = useState(false);
  const [problem, setProblem] = useState<Problem>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<BookingResult | null>(null);
  const [details, setDetails] = useState<BookingDetails | null>(null);

  const stepRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  /**
   * Availability, keyed by what was asked for.
   *
   * Holding the request key alongside the response makes "loading" a derived
   * value rather than a second piece of state to keep in step — and a bumped
   * `reload` is all it takes to force a refetch of the same day after a slot is
   * lost to somebody else.
   */
  const [reload, setReload] = useState(0);
  const requestKey = `${month ?? ""}|${selectedDate ?? ""}|${reload}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    value: MonthAvailability;
  } | null>(null);

  const availability = loaded?.key === requestKey ? loaded.value : null;
  const loading = availability === null;

  const range = today ? bookableRange(config, new Date()) : { from: "", to: "" };

  useEffect(() => {
    if (!month) return;

    const controller = new AbortController();
    const key = requestKey;

    fetchAvailability({
      config,
      month,
      date: selectedDate ?? undefined,
      signal: controller.signal,
    })
      .then((value) => setLoaded({ key, value }))
      .catch(() => {
        // Only an abort reaches here — fetchAvailability handles everything
        // else by falling back to the local computation. A newer request is
        // already in flight, so there is nothing to recover.
      });

    return () => controller.abort();
  }, [requestKey, month, selectedDate, config]);

  /**
   * Moving between steps takes focus to the new step, so a keyboard or
   * screen-reader user is not left at the bottom of the previous one.
   *
   * The scroll is done explicitly rather than left to `focus()`. A step taller
   * than the viewport — the confirmation, most of all — gets bottom-aligned by
   * the browser's default scrolling, which drops the visitor onto the buttons
   * instead of the heading that tells them what just happened. `block: "start"`
   * honours the container's `scroll-mt`, and the smoothness comes from the
   * stylesheet, which already turns it off under `prefers-reduced-motion`.
   */
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;

    const node = stepRef.current;
    if (!node) return;

    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: "start" });
  }, [step]);

  const goTo = useCallback((next: Step) => {
    moveFocus.current = true;
    setStep(next);
  }, []);

  function chooseDate(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setProblem(null);
    goTo("time");
  }

  function chooseSlot(start: string) {
    setSelectedSlot(start);
    setProblem(null);
    goTo("details");
  }

  async function submit(entered: BookingDetails) {
    if (!selectedSlot) return;

    setSubmitting(true);
    setProblem(null);
    setServerErrors({});

    const outcome = await submitBookingRequest({
      ...entered,
      start: selectedSlot,
    });

    setSubmitting(false);

    if (outcome.kind === "confirmed") {
      setDetails(entered);
      setResult(outcome.result);
      goTo("done");
      return;
    }

    if (outcome.kind === "invalid") {
      setServerErrors(outcome.fields);
      return;
    }

    if (outcome.kind === "slot-taken") {
      // Re-read the day so the list shows the slot as taken, then send the
      // visitor back to pick again.
      setSelectedSlot(null);
      setProblem("slot-taken");
      setReload((token) => token + 1);
      goTo("time");
      return;
    }

    setProblem(outcome.kind);
  }

  function reset() {
    setSelectedDate(null);
    setSelectedSlot(null);
    setResult(null);
    setDetails(null);
    setProblem(null);
    setServerErrors({});
    goTo("date");
  }

  if (!month || !focusedDate || !today) {
    return <Skeleton dict={dict} />;
  }

  const slots: Slot[] = availability?.slots ?? [];
  const mode = availability?.mode ?? "provisional";
  const canBook = mode !== "offline";

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
      <div>
        <Steps current={step} dict={dict} />

        {/* `scroll-mt` keeps the step clear of the fixed header when focus
            moves here between steps and the browser scrolls it into view. */}
        <div
          ref={stepRef}
          tabIndex={-1}
          className="mt-10 scroll-mt-32 focus:outline-none"
        >
          {step === "done" && result && details ? (
            <Confirmation
              result={result}
              details={details}
              businessTimeZone={config.timeZone}
              intlTag={intlTag}
              locale={locale}
              dict={dict}
              onBookAnother={reset}
            />
          ) : null}

          {step === "date" ? (
            <>
              {/* The step indicator and the month heading already say this on
                  screen, so it is announced rather than repeated — and it keeps
                  the outline going h1 → h2 → h3 instead of skipping a level. */}
              <h2 className="sr-only">{dict.booking.calendar.heading}</h2>
              <AvailabilityNotice mode={mode} dict={dict} />
              <div className="mt-9">
                <CalendarMonth
                  month={month}
                  days={availability?.days ?? []}
                  selected={selectedDate}
                  focusedDate={focusedDate}
                  onFocusDate={(date) => setFocusOverride(date)}
                  onSelect={chooseDate}
                  onMonthChange={(next) => {
                    setMonthOverride(next);
                    // Keep the roving focus inside the month now on screen.
                    if (focusedDate.slice(0, 7) !== next) {
                      const first = `${next}-01`;
                      setFocusOverride(first < range.from ? range.from : first);
                    }
                  }}
                  minDate={range.from}
                  maxDate={range.to}
                  loading={loading}
                  intlTag={intlTag}
                  dict={dict}
                />
              </div>
            </>
          ) : null}

          {step === "time" && selectedDate ? (
            <>
              <h2 className="sr-only">{dict.booking.slots.heading}</h2>

              {problem === "slot-taken" ? (
                <Problem
                  title={dict.booking.problems.takenTitle}
                  body={dict.booking.problems.takenBody}
                />
              ) : null}

              <button
                type="button"
                onClick={() => goTo("date")}
                className="link-underline text-[0.875rem] text-graphite hover:text-ink"
              >
                ← {dict.booking.slots.backToDates}
              </button>

              <div className="mt-7">
                <SlotList
                  date={selectedDate}
                  slots={slots}
                  selected={selectedSlot}
                  onSelect={chooseSlot}
                  loading={loading}
                  visitorTimeZone={timeZone}
                  businessTimeZone={config.timeZone}
                  slotMinutes={availability?.slotMinutes ?? config.slotMinutes}
                  intlTag={intlTag}
                  dict={dict}
                />
              </div>
            </>
          ) : null}

          {step === "details" && selectedSlot ? (
            <>
              {problem === "failed" ? (
                <Problem
                  title={dict.booking.problems.failedTitle}
                  body={dict.booking.problems.failedBody}
                />
              ) : null}

              {problem === "no-server" ? (
                <Problem
                  title={dict.booking.problems.noServerTitle}
                  body={dict.booking.problems.noServerBody}
                  action={
                    <a
                      href={`mailto:${contact.info}`}
                      className="link-underline mt-3 inline-block text-[0.875rem] font-medium text-ink"
                    >
                      {dict.booking.problems.emailUs}
                    </a>
                  }
                />
              ) : null}

              <button
                type="button"
                onClick={() => goTo("time")}
                className="link-underline text-[0.875rem] text-graphite hover:text-ink"
              >
                ← {dict.booking.details.back}
              </button>

              <h2 className="font-display mt-7 text-[1.375rem] leading-none font-bold tracking-[-0.03em]">
                {dict.booking.details.heading}
              </h2>

              <div className="mt-8">
                <DetailsForm
                  locale={locale}
                  dict={dict}
                  timeZone={timeZone}
                  submitting={submitting}
                  serverErrors={serverErrors}
                  onSubmit={submit}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Running summary: what has been chosen so far, and the honest fallback. */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        {step !== "done" ? (
          <div className="border border-rule bg-paper-soft p-7">
            <h3 className="eyebrow text-graphite">
              {dict.booking.details.summaryTitle}
            </h3>

            <p
              className={cn(
                "font-display mt-4 text-[1.25rem] leading-tight font-bold tracking-[-0.03em]",
                !selectedDate && "text-fog",
              )}
            >
              {selectedSlot
                ? formatLongDate(new Date(selectedSlot), timeZone, intlTag)
                : selectedDate
                  ? formatLongDate(new Date(`${selectedDate}T12:00:00Z`), "UTC", intlTag)
                  : dict.booking.details.summaryEmpty}
            </p>

            <p className="mt-2 text-[0.9375rem] text-graphite tabular-nums">
              {selectedSlot
                ? `${formatTime(new Date(selectedSlot), timeZone, intlTag)} · ${
                    availability?.slotMinutes ?? config.slotMinutes
                  } min · ${formatZoneAbbreviation(
                    new Date(selectedSlot),
                    timeZone,
                    intlTag,
                  )}`
                : fill(dict.booking.slots.durationNote, {
                    minutes: config.slotMinutes,
                  })}
            </p>

            {!canBook ? (
              <p className="mt-5 border-t border-rule pt-5 text-[0.8125rem] leading-relaxed text-graphite">
                {dict.booking.availability.offlineBody}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 border border-rule p-7">
          <h3 className="font-display text-[1.125rem] leading-tight font-bold tracking-[-0.02em]">
            {dict.booking.fallback.title}
          </h3>
          <p className="mt-2.5 text-[0.875rem] leading-relaxed text-graphite">
            {dict.booking.fallback.body}
          </p>
          <ButtonLink
            href={route(locale, "contact")}
            variant="outline"
            size="sm"
            className="mt-5 w-full"
          >
            {dict.booking.fallback.cta}
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}

function Problem({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div role="alert" className="mb-7 border-l-2 border-danger bg-danger/5 px-5 py-4">
      <p className="text-[0.9375rem] font-medium text-danger">{title}</p>
      <p className="mt-1 max-w-[58ch] text-[0.875rem] leading-relaxed text-graphite">
        {body}
      </p>
      {action}
    </div>
  );
}

/**
 * Server-rendered placeholder.
 *
 * Holds the calendar's shape so the page does not jump when the real grid
 * arrives, and says what it is doing rather than showing an empty box.
 */
function Skeleton({ dict }: { dict: Dictionary }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
      <div>
        <Steps current="date" dict={dict} />

        <div className="mt-10">
          <p className="text-[0.875rem] text-graphite" role="status">
            {dict.booking.calendar.loading}
          </p>

          <div aria-hidden="true" className="mt-9">
            <div className="h-6 w-40 bg-rule/60" />
            <div className="mt-6 grid grid-cols-7 gap-0.5 border-t border-rule pt-4">
              {Array.from({ length: 35 }, (_, index) => (
                <div key={index} className="aspect-square bg-rule/25" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside aria-hidden="true">
        <div className="h-44 border border-rule bg-paper-soft" />
      </aside>
    </div>
  );
}

export function BookingSkeleton({ dict }: { dict: Dictionary }) {
  return <Skeleton dict={dict} />;
}
