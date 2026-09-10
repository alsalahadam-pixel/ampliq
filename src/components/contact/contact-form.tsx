"use client";

import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { budgetRanges, projectTypes, timelines } from "@/content/enquiry";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { cn } from "@/lib/utils";

type FieldName = "firstName" | "lastName" | "email" | "need" | "message";
type Errors = Partial<Record<FieldName, string>>;

/**
 * `unconfigured` is its own state, distinct from `error`.
 *
 * The visitor did nothing wrong and there is nothing for them to retry: the
 * site has no mail transport yet. Saying "something went wrong, try again"
 * would send them round a loop that cannot succeed.
 */
type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "unconfigured";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-[0.8125rem] font-medium tracking-[-0.005em] text-ink"
      >
        {label}
        {hint ? <span className="text-xs font-normal text-graphite">({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-2 text-[0.8125rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The underlined field.
 *
 * The top gap is the control's own padding rather than a margin, so the text
 * and the rule sit exactly where they did while the tappable box grows from
 * 35px to a comfortable 44 — the difference between hitting a field on a phone
 * and hitting the one above it. 16px text keeps iOS from zooming on focus.
 */
const controlBase =
  "min-h-11 w-full border-b bg-transparent pt-2.5 pb-2.5 text-[1rem] text-ink transition-colors duration-200 placeholder:text-graphite/70 focus:border-accent focus:outline-none";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const form = dict.contact.form;
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [attempted, setAttempted] = useState(false);

  const fieldId = (name: string) => `${id}-${name}`;

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const value = (name: string) => String(data.get(name) ?? "").trim();

    if (!value("firstName")) next.firstName = form.errors.firstName;
    if (!value("lastName")) next.lastName = form.errors.lastName;

    const email = value("email");
    if (!email) next.email = form.errors.email;
    else if (!EMAIL_PATTERN.test(email)) next.email = form.errors.emailFormat;

    if (!value("need")) next.need = form.errors.need;
    if (value("message").length < 10) next.message = form.errors.message;

    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the summary so keyboard and screen-reader users land on it.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data.entries()),
          services: data.getAll("services"),
          locale,
        }),
      });

      // A static export has no route handler behind this path, and a site
      // without a mail provider answers 503. Neither is a failure the visitor
      // can fix by trying again, so both say so instead of pretending.
      if (response.status === 503 || response.status === 404 || response.status === 405) {
        setStatus("unconfigured");
        return;
      }

      if (response.status === 400) {
        const payload = (await response.json().catch(() => null)) as {
          fields?: Record<string, string>;
        } | null;
        setErrors(serverErrorsToMessages(payload?.fields ?? {}, form));
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      if (!response.ok) throw new Error(String(response.status));

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
    }
  }

  /**
   * Re-checks the form as it is typed in, once a submit has already failed.
   *
   * On `change` rather than `blur`: clicking Send blurs whichever field has
   * focus, so blur-triggered validation removes the error summary between
   * mousedown and mouseup — the page reflows, the button moves out from under
   * the pointer, and the first click is swallowed.
   */
  function revalidate() {
    if (!attempted || !formRef.current) return;
    setErrors(validate(new FormData(formRef.current)));
  }

  if (status === "success" || status === "unconfigured") {
    const isPreview = status === "unconfigured";
    return (
      <div
        role="status"
        className="border border-rule bg-paper-soft p-8 sm:p-12"
      >
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M2.5 8.5 6 12l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="font-display mt-6 text-display-sm">
          {isPreview ? form.previewTitle : form.successTitle}
        </h2>
        <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-graphite">
          {isPreview ? form.previewBody : form.successBody}
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setStatus("idle");
            setAttempted(false);
            setErrors({});
          }}
        >
          {form.successAgain}
        </Button>
      </div>
    );
  }

  const errorList = Object.entries(errors) as [keyof Errors, string][];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-12">
      {/* Error summary — the first thing a keyboard user meets after a failed submit. */}
      {errorList.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-danger bg-danger/5 px-5 py-4"
        >
          <p className="text-[0.9375rem] font-medium text-danger">{form.errors.summary}</p>
          <ul className="mt-2 flex flex-col gap-1">
            {errorList.map(([key, message]) => (
              <li key={key}>
                <a href={`#${fieldId(key)}`} className="link-underline text-[0.875rem] text-danger">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status === "error" ? (
        <div role="alert" className="border-l-2 border-danger bg-danger/5 px-5 py-4">
          <p className="text-[0.9375rem] font-medium text-danger">{form.errorTitle}</p>
          <p className="mt-1 text-[0.875rem] text-graphite">{form.errorBody}</p>
        </div>
      ) : null}

      <fieldset className="border-0 p-0">
        <legend className="eyebrow mb-7 text-graphite">{form.legendAbout}</legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label={form.firstName} htmlFor={fieldId("firstName")} error={errors.firstName}>
            <input
              id={fieldId("firstName")}
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              onChange={revalidate}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? `${fieldId("firstName")}-error` : undefined}
              className={cn(controlBase, errors.firstName ? "border-danger" : "border-rule-strong")}
            />
          </Field>

          <Field label={form.lastName} htmlFor={fieldId("lastName")} error={errors.lastName}>
            <input
              id={fieldId("lastName")}
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              onChange={revalidate}
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? `${fieldId("lastName")}-error` : undefined}
              className={cn(controlBase, errors.lastName ? "border-danger" : "border-rule-strong")}
            />
          </Field>

          <Field label={form.company} htmlFor={fieldId("company")}>
            <input
              id={fieldId("company")}
              name="company"
              type="text"
              autoComplete="organization"
              className={cn(controlBase, "border-rule-strong")}
            />
          </Field>

          <Field label={form.email} htmlFor={fieldId("email")} error={errors.email}>
            <input
              id={fieldId("email")}
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={revalidate}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined}
              className={cn(controlBase, errors.email ? "border-danger" : "border-rule-strong")}
            />
          </Field>

          <Field label={form.phone} hint={form.phoneOptional} htmlFor={fieldId("phone")}>
            <input
              id={fieldId("phone")}
              name="phone"
              type="tel"
              autoComplete="tel"
              className={cn(controlBase, "border-rule-strong")}
            />
          </Field>

          <Field label={form.website} hint={form.websiteOptional} htmlFor={fieldId("website")}>
            <input
              id={fieldId("website")}
              name="website"
              type="url"
              inputMode="url"
              placeholder="https://"
              className={cn(controlBase, "border-rule-strong")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="eyebrow mb-7 text-graphite">{form.legendProject}</legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <Field
            label={form.need}
            htmlFor={fieldId("need")}
            error={errors.need}
            className="sm:col-span-2"
          >
            <select
              id={fieldId("need")}
              name="need"
              required
              defaultValue=""
              onChange={revalidate}
              aria-invalid={Boolean(errors.need)}
              aria-describedby={errors.need ? `${fieldId("need")}-error` : undefined}
              className={cn(controlBase, errors.need ? "border-danger" : "border-rule-strong")}
            >
              <option value="" disabled>
                {form.needPlaceholder}
              </option>
              {projectTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[locale]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={form.budget} htmlFor={fieldId("budget")}>
            <select
              id={fieldId("budget")}
              name="budget"
              defaultValue=""
              className={cn(controlBase, "border-rule-strong")}
            >
              <option value="">—</option>
              {budgetRanges.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[locale]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={form.timeline} htmlFor={fieldId("timeline")}>
            <select
              id={fieldId("timeline")}
              name="timeline"
              defaultValue=""
              className={cn(controlBase, "border-rule-strong")}
            >
              <option value="">—</option>
              {timelines.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[locale]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset className="mt-9 border-0 p-0">
          <legend className="text-[0.8125rem] font-medium text-ink">{form.services}</legend>
          <p className="text-fine mt-1 text-graphite">{form.servicesHint}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {form.serviceOptions.map((option) => (
              <label
                key={option}
                className="group inline-flex cursor-pointer items-center gap-2.5 border border-rule-strong px-4 py-3 text-[0.9375rem] transition-colors duration-200 has-checked:border-ink has-checked:bg-ink has-checked:text-paper hover:border-ink"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={option}
                  className="h-3.5 w-3.5 shrink-0 accent-accent"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label={form.message}
          htmlFor={fieldId("message")}
          error={errors.message}
          className="mt-9"
        >
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            required
            onChange={revalidate}
            placeholder={form.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${fieldId("message")}-error` : undefined}
            className={cn(
              controlBase,
              "resize-y leading-relaxed",
              errors.message ? "border-danger" : "border-rule-strong",
            )}
          />
        </Field>
      </fieldset>

      {/* Honeypot. Hidden from people and assistive tech, visible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("company_website")}>Company website</label>
        <input
          id={fieldId("company_website")}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-6 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fine max-w-[46ch] text-graphite">
          {form.privacyNote}{" "}
          <a href={route(locale, "privacy")} className="link-underline text-ink">
            {form.privacyLink}
          </a>
        </p>
        <Button
          type="submit"
          withArrow={status !== "submitting"}
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="shrink-0"
        >
          {status === "submitting" ? (
            <>
              <Spinner />
              {form.submitting}
            </>
          ) : (
            form.submit
          )}
        </Button>
      </div>
    </form>
  );
}

/**
 * The API rejects on the same field names the browser validates, so a
 * server-side rejection lands on the right input rather than in a generic
 * banner.
 */
function serverErrorsToMessages(
  fields: Record<string, string>,
  form: Dictionary["contact"]["form"],
): Errors {
  const messages: Errors = {};
  const names: FieldName[] = ["firstName", "lastName", "email", "need", "message"];

  for (const name of names) {
    const code = fields[name];
    if (!code) continue;
    messages[name] =
      name === "email" && code === "invalid"
        ? form.errors.emailFormat
        : form.errors[name];
  }

  return messages;
}

/** Movement while the request is in flight, so the button is visibly working. */
function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 animate-spin"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" className="opacity-25" />
      <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
    </svg>
  );
}
