"use client";

import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { projectTypes } from "@/content/enquiry";
import { LIMITS } from "@/lib/booking/validate";
import type { BookingDetails } from "@/lib/booking/types";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { cn } from "@/lib/utils";

type FieldName = "name" | "email" | "company" | "phone" | "message";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

export function DetailsForm({
  locale,
  dict,
  timeZone,
  submitting,
  /** Server-side field errors, keyed the same way as the client's. */
  serverErrors,
  onSubmit,
}: {
  locale: Locale;
  dict: Dictionary;
  timeZone: string;
  submitting: boolean;
  serverErrors: Record<string, string>;
  onSubmit: (details: BookingDetails) => void;
}) {
  const t = dict.booking.details;
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);

  const fieldId = (name: string) => `${id}-${name}`;

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const name = value("name");
    if (name.length < 2) next.name = t.errors.name;
    else if (name.length > LIMITS.name) next.name = t.errors.tooLong;

    const email = value("email");
    if (!email) next.email = t.errors.email;
    else if (!EMAIL_PATTERN.test(email)) next.email = t.errors.emailFormat;

    const message = value("message");
    if (message.length < 10) next.message = t.errors.message;
    else if (message.length > LIMITS.message) next.message = t.errors.tooLong;

    if (value("company").length > LIMITS.company) next.company = t.errors.tooLong;
    if (value("phone").length > LIMITS.phone) next.phone = t.errors.tooLong;

    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const data = new FormData(event.currentTarget);

    // Honeypot: real people leave this empty.
    if (String(data.get("company_website") ?? "")) return;

    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const value = (name: string) => String(data.get(name) ?? "").trim();

    onSubmit({
      name: value("name"),
      email: value("email"),
      company: value("company"),
      phone: value("phone") || undefined,
      projectType: value("projectType") || undefined,
      message: value("message"),
      timeZone,
      locale,
    });
  }

  /**
   * Re-checks the form as it is typed in, but only after a failed submit.
   *
   * Deliberately wired to `onChange` rather than `onBlur`. Clicking the submit
   * button blurs whichever field has focus, so blur-triggered validation
   * removes the error summary *between* mousedown and mouseup — the page
   * reflows, the button slides up out from under the pointer, and the click
   * never lands. Validating as the visitor types settles the layout long
   * before they reach the button, and clears each error the moment it is
   * actually fixed.
   */
  function revalidate() {
    if (!attempted || !formRef.current) return;
    setErrors(validate(new FormData(formRef.current)));
  }

  // Server-side rejections are merged in so a field the browser accepted but
  // the API did not still gets marked.
  const merged: Errors = { ...errors };
  for (const [field, code] of Object.entries(serverErrors)) {
    if (field in merged || !isFieldName(field)) continue;
    merged[field] =
      code === "tooLong"
        ? t.errors.tooLong
        : field === "email"
          ? t.errors.email
          : field === "name"
            ? t.errors.name
            : t.errors.message;
  }

  const errorList = Object.entries(merged) as [FieldName, string][];

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {errorList.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-danger bg-danger/5 px-5 py-4"
        >
          <p className="text-[0.9375rem] font-medium text-danger">{t.errors.summary}</p>
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

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label={t.name} htmlFor={fieldId("name")} error={merged.name}>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.name}
            onChange={revalidate}
            aria-invalid={Boolean(merged.name)}
            aria-describedby={merged.name ? `${fieldId("name")}-error` : undefined}
            className={cn(controlBase, merged.name ? "border-danger" : "border-rule-strong")}
          />
        </Field>

        <Field label={t.email} htmlFor={fieldId("email")} error={merged.email}>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={LIMITS.email}
            onChange={revalidate}
            aria-invalid={Boolean(merged.email)}
            aria-describedby={merged.email ? `${fieldId("email")}-error` : undefined}
            className={cn(controlBase, merged.email ? "border-danger" : "border-rule-strong")}
          />
        </Field>

        <Field
          label={t.company}
          hint={t.companyOptional}
          htmlFor={fieldId("company")}
          error={merged.company}
        >
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            onChange={revalidate}
            className={cn(controlBase, merged.company ? "border-danger" : "border-rule-strong")}
          />
        </Field>

        <Field
          label={t.phone}
          hint={t.phoneOptional}
          htmlFor={fieldId("phone")}
          error={merged.phone}
        >
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            onChange={revalidate}
            className={cn(controlBase, merged.phone ? "border-danger" : "border-rule-strong")}
          />
        </Field>

        {/* Optional, but it lets us come to the call already pointed in the
            right direction — and it reaches the inbox as a readable label. */}
        <Field
          label={t.projectType}
          hint={t.projectTypeOptional}
          htmlFor={fieldId("projectType")}
          className="sm:col-span-2"
        >
          <select
            id={fieldId("projectType")}
            name="projectType"
            defaultValue=""
            className={cn(controlBase, "border-rule-strong")}
          >
            <option value="">{t.projectTypePlaceholder}</option>
            {projectTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label[locale]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t.message}
          htmlFor={fieldId("message")}
          error={merged.message}
          className="sm:col-span-2"
        >
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            required
            maxLength={LIMITS.message}
            onChange={revalidate}
            placeholder={t.messagePlaceholder}
            aria-invalid={Boolean(merged.message)}
            aria-describedby={merged.message ? `${fieldId("message")}-error` : undefined}
            className={cn(
              controlBase,
              "resize-y leading-relaxed",
              merged.message ? "border-danger" : "border-rule-strong",
            )}
          />
        </Field>
      </div>

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

      <div className="flex flex-col gap-6 border-t border-rule pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fine max-w-[46ch] text-graphite">
          {t.privacyNote}{" "}
          <a href={route(locale, "privacy")} className="link-underline text-ink">
            {t.privacyLink}
          </a>
        </p>
        <Button type="submit" withArrow disabled={submitting} className="shrink-0">
          {submitting ? t.submitting : t.submit}
        </Button>
      </div>
    </form>
  );
}

function isFieldName(value: string): value is FieldName {
  return ["name", "email", "company", "phone", "message"].includes(value);
}
