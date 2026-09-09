import Link from "next/link";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * Every page opens on the same ink band. It gives the site a consistent
 * entrance, keeps the fixed header legible in one predictable state, and means
 * a visitor always knows which page they landed on.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  meta,
  actions,
  breadcrumb,
  size = "default",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: { label: string; href: string };
  size?: "default" | "large" | "compact";
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-paper">
      {/* A single hairline rather than another large mark — the DISC is kept
          for the home hero and the closing CTA so it stays a signature. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 hidden h-px w-[38%] bg-gradient-to-r from-transparent to-accent/60 lg:block"
      />

      <div
        className={cn(
          "shell relative",
          size === "large" && "pt-36 pb-20 lg:pt-52 lg:pb-28",
          size === "default" && "pt-34 pb-16 lg:pt-46 lg:pb-24",
          size === "compact" && "pt-32 pb-12 lg:pt-42 lg:pb-16",
        )}
      >
        {breadcrumb ? (
          <Link
            href={breadcrumb.href}
            className="eyebrow inline-flex items-center gap-2 text-fog transition-colors duration-200 hover:text-paper"
          >
            <span aria-hidden="true">←</span>
            {breadcrumb.label}
          </Link>
        ) : eyebrow ? (
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        ) : null}

        <h1
          data-enter="mask"
          className={cn(
            "mt-7 block max-w-[19ch]",
            size === "large" ? "text-display-xl" : "text-display-lg",
          )}
        >
          <span>{title}</span>
        </h1>

        {lead ? (
          <p
            data-enter
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="text-lead mt-7 max-w-[52ch] text-fog"
          >
            {lead}
          </p>
        ) : null}

        {actions ? (
          <div
            data-enter
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            {actions}
          </div>
        ) : null}

        {meta ? <div className="mt-12 border-t border-white/12 pt-7">{meta}</div> : null}
      </div>
    </section>
  );
}
