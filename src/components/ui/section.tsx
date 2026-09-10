import type { ReactNode } from "react";

import { SplitWords } from "@/components/ui/split-words";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "accent";
}) {
  const tones = {
    light: "text-graphite",
    dark: "text-fog",
    accent: "text-accent",
  };

  return (
    <p className={cn("eyebrow flex items-center gap-3", tones[tone], className)}>
      <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rounded-full bg-current" />
      {children}
    </p>
  );
}

/**
 * Section shell. `tone` sets the surface; sections alternate between paper and
 * ink to give the page its rhythm rather than relying on card borders.
 */
export function Section({
  children,
  id,
  tone = "paper",
  className,
  as: Tag = "section",
  bleed = false,
  labelledBy,
}: {
  children: ReactNode;
  id?: string;
  tone?: "paper" | "paper-soft" | "ink" | "transparent";
  className?: string;
  as?: "section" | "div" | "article" | "aside";
  bleed?: boolean;
  labelledBy?: string;
}) {
  const tones = {
    paper: "bg-paper text-ink",
    "paper-soft": "bg-paper-soft text-ink",
    ink: "bg-ink text-paper on-dark",
    transparent: "",
  };

  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative",
        tones[tone],
        bleed ? "" : "py-16 sm:py-24 lg:py-36",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * The standard section opener: eyebrow, headline, optional lead paragraph.
 * Reused everywhere so vertical rhythm and type hierarchy stay identical.
 */
export function SectionHeader({
  eyebrow,
  headline,
  lead,
  id,
  tone = "light",
  align = "start",
  className,
  action,
}: {
  eyebrow?: string;
  headline: ReactNode;
  lead?: string;
  id?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {/* The hairline draws itself in as the section arrives — the quietest
          possible way to mark where one section ends and the next begins. */}
      <span
        aria-hidden="true"
        data-reveal="rule"
        className={cn(
          "block h-px w-full origin-left",
          tone === "dark" ? "bg-white/15" : "bg-rule",
        )}
      />

      {eyebrow ? <Eyebrow tone={tone === "dark" ? "dark" : "light"}>{eyebrow}</Eyebrow> : null}
      <div
        className={cn(
          "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16",
          align === "center" && "lg:flex-col lg:items-center",
        )}
      >
        {/* A string headline reveals word by word; anything richer is left
            alone, because splitting it would break its own markup. */}
        <h2
          id={id}
          data-reveal={typeof headline === "string" ? undefined : ""}
          className={cn(
            "text-display-lg max-w-[16ch]",
            align === "center" && "max-w-[22ch]",
          )}
        >
          {typeof headline === "string" ? <SplitWords text={headline} /> : headline}
        </h2>
        {lead ? (
          <p
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className={cn(
              "text-lead max-w-[46ch] lg:pb-2",
              tone === "dark" ? "text-fog" : "text-graphite",
              align === "center" && "text-center",
            )}
          >
            {lead}
          </p>
        ) : null}
        {action}
      </div>
    </div>
  );
}

/** Hairline used to separate editorial blocks. */
export function Rule({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <hr
      className={cn(
        "border-0 border-t",
        tone === "dark" ? "border-white/12" : "border-rule",
        className,
      )}
    />
  );
}
