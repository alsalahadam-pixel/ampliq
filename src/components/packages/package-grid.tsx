import { packages } from "@/content/packages";
import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("mt-[0.4em] h-3 w-3 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 8.5 6 12l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Tier comparison. The recommended tier is emphasised by inverting it — an ink
 * card between two paper ones — rather than by shouting "best value" at the
 * visitor.
 *
 * Two layouts, and the breakpoint is `lg` because that is where three columns
 * of this much copy stop being legible.
 *
 * **From `lg`:** the three cards share one frame, separated by `gap-px` over a
 * `bg-rule` backdrop so the hairlines between them are the background showing
 * through rather than three borders that have to agree with each other.
 *
 * **Below `lg`:** a horizontal rail, one card at a time with the next one
 * visibly beside it. Stacked, each card was 910px on an 844px phone — a
 * screenful each and three screenfuls of scrolling to compare three numbers,
 * which is the opposite of what a comparison is for. Side by side they are
 * compared by swiping, which is how a price table is read. The rail bleeds into
 * the shell's gutter so a card can sit flush to the edge while the first still
 * lines up with the headline above it.
 *
 * `detailed` keeps the stack. The packages page adds scope, engagement and the
 * problem each tier solves, which is 1,279px of card — too tall to swipe, and
 * on that page the visitor has arrived to read rather than to skim.
 */
export function PackageGrid({
  locale,
  dict,
  detailed = false,
}: {
  locale: Locale;
  dict: Dictionary;
  detailed?: boolean;
}) {
  return (
    <div
      className={cn(
        detailed
          ? "grid gap-px overflow-hidden border border-rule bg-rule"
          : [
              "no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3",
              "overflow-x-auto px-6 pb-1",
              "lg:mx-0 lg:grid lg:snap-none lg:gap-px lg:overflow-hidden lg:px-0 lg:pb-0",
              "lg:border lg:border-rule lg:bg-rule",
            ].join(" "),
        "lg:grid lg:grid-cols-3",
      )}
    >
      {packages.map((tier, index) => {
        const dark = Boolean(tier.emphasis);

        return (
          <article
            key={tier.slug}
            data-reveal
            style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
            className={cn(
              // The whole card lifts very slightly on hover and the accent
              // rule above it draws across. Enough to feel responsive; far
              // short of a card that floats.
              "group relative flex flex-col transition-[transform,background-color] duration-500 ease-out-expo",
              // Tighter on a phone, where the card is ~300px wide and every
              // step of vertical rhythm is paid for in swipe distance.
              "px-5 py-6 sm:p-8 lg:p-10",
              dark
                ? "on-dark bg-ink text-paper hover:bg-ink-soft"
                : "bg-paper text-ink hover:bg-paper-soft",
              "hover:lg:-translate-y-1",
              // On the rail each card carries its own frame; in the grid the
              // shared backdrop does it, so the border comes off again.
              detailed
                ? ""
                : [
                    "w-[82vw] max-w-[21rem] shrink-0 snap-start",
                    "overflow-hidden rounded-lg border",
                    dark ? "border-rule-dark" : "border-rule",
                    "lg:w-auto lg:max-w-none lg:shrink lg:rounded-none lg:border-0",
                  ].join(" "),
            )}
          >
            {/* Accent rule that draws across the top of the card on hover. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-600 ease-out-expo group-hover:scale-x-100",
                dark ? "bg-accent-soft" : "bg-accent",
              )}
            />

            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-mono text-[0.6875rem] tracking-[0.16em]",
                  dark ? "text-accent-soft" : "text-accent",
                )}
              >
                {pad(tier.index)}
              </span>
              <h3 className="font-display text-sm font-bold tracking-[0.14em] uppercase">
                {tier.name}
              </h3>
            </div>

            <div className="mt-6 sm:mt-10">
              {tier.priceKind === "from" ? (
                <p className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-mono text-[0.6875rem] tracking-[0.16em] uppercase",
                      dark ? "text-fog" : "text-graphite",
                    )}
                  >
                    {dict.packages.from}
                  </span>
                  <span className="font-display text-[2.25rem] leading-none font-bold tracking-[-0.04em] sm:text-[2.75rem]">
                    {tier.price[locale]}
                  </span>
                </p>
              ) : (
                <p className="font-display text-[1.75rem] leading-none font-bold tracking-[-0.035em] sm:text-[2rem]">
                  {dict.packages.custom}
                </p>
              )}
              <p
                className={cn(
                  "mt-2 text-fine",
                  dark ? "text-fog" : "text-graphite",
                )}
              >
                {dict.packages.scopeNote}
              </p>
              <p
                className={cn(
                  "font-display mt-4 text-base leading-snug font-semibold tracking-[-0.02em] sm:mt-5 sm:text-lg",
                  dark ? "text-paper" : "text-ink",
                )}
              >
                {tier.positioning[locale]}
              </p>
            </div>

            <div className="mt-5 sm:mt-8">
              <h4 className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                {dict.packages.forWho}
              </h4>
              <p
                className={cn(
                  "mt-3 text-[0.875rem] leading-[1.6] sm:text-[0.9375rem] sm:leading-relaxed",
                  dark ? "text-paper/80" : "text-graphite",
                )}
              >
                {tier.forWho[locale]}
              </p>
            </div>

            {detailed ? (
              <div className="mt-8">
                <h4 className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                  {dict.packages.solves}
                </h4>
                <p
                  className={cn(
                    "mt-3 text-[0.9375rem] leading-relaxed",
                    dark ? "text-paper/80" : "text-graphite",
                  )}
                >
                  {tier.solves[locale]}
                </p>
              </div>
            ) : null}

            <div className="mt-5 sm:mt-8">
              {/* Two tiers replace the generic label with a sentence of their
                  own ("a START project is one of these — not all of them").
                  A sentence set in uppercase mono with label tracking shouts,
                  and wraps to two lines on a phone, so it is set as what it
                  is. The short generic label stays an eyebrow. */}
              {tier.includesLabel ? (
                <h4
                  className={cn(
                    "text-fine font-medium",
                    dark ? "text-fog" : "text-graphite",
                  )}
                >
                  {tier.includesLabel[locale]}
                </h4>
              ) : (
                <h4 className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                  {dict.packages.includes}
                </h4>
              )}
              <ul className="mt-3.5 flex flex-col gap-1.5 sm:mt-4 sm:gap-2.5">
                {tier.includes[locale].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[0.875rem] leading-[1.5] sm:gap-3 sm:text-[0.9375rem] sm:leading-relaxed"
                  >
                    <Check className={dark ? "text-accent-soft" : "text-accent"} />
                    <span className={dark ? "text-paper/90" : "text-ink"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {detailed ? (
              <dl
                className={cn(
                  "mt-8 flex flex-col gap-4 border-t pt-6 text-[0.9375rem]",
                  dark ? "border-white/12" : "border-rule",
                )}
              >
                <div>
                  <dt className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                    {dict.packages.scope}
                  </dt>
                  <dd className={cn("mt-2", dark ? "text-paper/80" : "text-graphite")}>
                    {tier.scope[locale]}
                  </dd>
                </div>
                <div>
                  <dt className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                    {dict.packages.engagement}
                  </dt>
                  <dd className={cn("mt-2", dark ? "text-paper/80" : "text-graphite")}>
                    {tier.engagement[locale]}
                  </dd>
                </div>
              </dl>
            ) : null}

            <div className="mt-6 flex flex-1 items-end sm:mt-10">
              <ButtonLink
                href={route(locale, "start")}
                variant={dark ? "primary" : "outline"}
                tone={dark ? "dark" : "light"}
                className="w-full"
              >
                {/* One CTA across all three tiers, SCALE included: every tier
                    starts with the same conversation, so offering a different
                    verb for the custom one only made it look less available. */}
                {dict.cta.start}
              </ButtonLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}
