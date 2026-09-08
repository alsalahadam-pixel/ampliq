import {
  DISC_DOT,
  DISC_RING_PATH,
  DISC_TAIL_PATH,
  DISC_VIEWBOX,
} from "@/components/brand/disc-geometry";
import { cn } from "@/lib/utils";

type DiscProps = {
  className?: string;
  /** Set when the mark stands alone and no adjacent text names the brand. */
  title?: string;
};

/**
 * The DISC mark. Inherits `currentColor`, so light, dark and monochrome
 * treatments are the same geometry with a different text colour — never a
 * different file.
 */
export function Disc({ className, title }: DiscProps) {
  return (
    <svg
      viewBox={DISC_VIEWBOX}
      className={cn("block", className)}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={DISC_RING_PATH} />
      <path d={DISC_TAIL_PATH} />
      <circle cx={DISC_DOT.cx} cy={DISC_DOT.cy} r={DISC_DOT.r} />
    </svg>
  );
}

type LogoProps = {
  variant?: "lockup" | "disc" | "wordmark";
  className?: string;
  /** Rendered as the accessible name when the mark stands alone. */
  title?: string;
};

/**
 * The AMPLIQ logo. One component, every surface — header, footer, mobile menu,
 * OG images — so the mark can never diverge between pages.
 *
 * Sizing is driven by `font-size` on the wrapper: the DISC is set in `em`, which
 * keeps the lockup's proportions locked at any scale.
 */
export function Logo({ variant = "lockup", className, title }: LogoProps) {
  if (variant === "disc") {
    return <Disc className={cn("h-8 w-8", className)} title={title ?? "AMPLIQ"} />;
  }

  const wordmark = (
    <span className="font-display text-[1em] leading-none font-extrabold tracking-[-0.02em] uppercase">
      AMPLIQ
    </span>
  );

  if (variant === "wordmark") {
    return (
      <span className={cn("inline-flex items-center text-[1.25rem]", className)}>
        {wordmark}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.34em] text-[1.25rem] whitespace-nowrap",
        className,
      )}
    >
      <Disc className="h-[0.92em] w-[0.92em] shrink-0" />
      {wordmark}
    </span>
  );
}
