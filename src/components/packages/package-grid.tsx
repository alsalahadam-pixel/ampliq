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
    <div className="grid gap-px overflow-hidden border border-rule bg-rule lg:grid-cols-3">
      {packages.map((tier, index) => {
        const dark = Boolean(tier.emphasis);

        return (
          <article
            key={tier.slug}
            data-reveal
            style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
            className={cn(
              "flex flex-col p-8 lg:p-10",
              dark ? "on-dark bg-ink text-paper" : "bg-paper text-ink",
            )}
          >
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

            <div className="mt-10">
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
                  <span className="font-display text-[2.75rem] leading-none font-bold tracking-[-0.04em]">
                    {tier.price[locale]}
                  </span>
                </p>
              ) : (
                <p className="font-display text-[2rem] leading-none font-bold tracking-[-0.035em]">
                  {dict.packages.custom}
                </p>
              )}
              <p
                className={cn(
                  "mt-2 text-xs",
                  dark ? "text-fog" : "text-graphite",
                )}
              >
                {dict.packages.scopeNote}
              </p>
              <p
                className={cn(
                  "font-display mt-5 text-lg leading-snug font-semibold tracking-[-0.02em]",
                  dark ? "text-paper" : "text-ink",
                )}
              >
                {tier.positioning[locale]}
              </p>
            </div>

            <div className="mt-8">
              <h4 className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                {dict.packages.forWho}
              </h4>
              <p
                className={cn(
                  "mt-3 text-[0.9375rem] leading-relaxed",
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

            <div className="mt-8">
              <h4 className={cn("eyebrow", dark ? "text-fog" : "text-graphite")}>
                {tier.includesLabel?.[locale] ?? dict.packages.includes}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {tier.includes[locale].map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed">
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

            <div className="mt-10 flex flex-1 items-end">
              <ButtonLink
                href={route(locale, "start")}
                variant={dark ? "primary" : "outline"}
                tone={dark ? "dark" : "light"}
                className="w-full"
              >
                {tier.priceKind === "custom" ? dict.cta.talk : dict.cta.start}
              </ButtonLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}
