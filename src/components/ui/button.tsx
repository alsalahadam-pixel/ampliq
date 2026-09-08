import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Tone = "light" | "dark";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-[2px] px-6 text-[0.9375rem] font-medium tracking-[-0.01em] leading-none h-13 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

/** `tone` describes the surface the button sits on, not the button itself. */
const variants: Record<Variant, Record<Tone, string>> = {
  primary: {
    light: "bg-ink text-paper hover:bg-accent",
    dark: "bg-paper text-ink hover:bg-accent hover:text-white",
  },
  outline: {
    light: "border border-rule-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
    dark: "border border-white/25 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  },
  ghost: {
    light: "text-ink hover:text-accent px-0",
    dark: "text-paper hover:text-accent-soft px-0",
  },
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        "h-3.5 w-3.5 shrink-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  withArrow?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  tone = "light",
  withArrow = true,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant][tone], className)} {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  tone = "light",
  withArrow = false,
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  withArrow?: boolean;
} & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant][tone], className)} {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </button>
  );
}

/** Inline text link with the underline that draws in on hover. */
export function TextLink({
  href,
  children,
  className,
  withArrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]",
        className,
      )}
    >
      <span className="link-underline">{children}</span>
      {withArrow ? <Arrow /> : null}
    </Link>
  );
}
