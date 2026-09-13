import { Section, Eyebrow } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import { cn, pad } from "@/lib/utils";

/**
 * Editorial problem statement. Deliberately not a card grid: a long headline on
 * the left, and the symptoms as a numbered list of hairline-separated lines
 * that read like a diagnosis.
 *
 * The list is ordered content → social → brand → website → search → ads, which
 * is both the order the work happens in and the order of AMPLIQ's strengths.
 * The first two carry a step more weight — a size up, full-strength ink, a
 * solid accent numeral — because they are the two a visitor is most likely to
 * recognise themselves in. It is a shift of one step on three properties, not a
 * different treatment: the six still read as one list.
 */
const LEAD_ITEMS = 2;

export function Problem({ dict }: { dict: Dictionary }) {
  const { problem } = dict.home;

  return (
    <Section tone="paper" labelledBy="problem-heading">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div data-reveal>
              <Eyebrow>{problem.eyebrow}</Eyebrow>
            </div>
            <h2
              id="problem-heading"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              className="text-display-lg mt-6 max-w-[15ch]"
            >
              {problem.headline}
            </h2>
            <p
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              className="text-lead mt-8 max-w-[46ch] text-graphite"
            >
              {problem.body}
            </p>
          </div>

          <div className="lg:col-span-6 lg:pt-3">
            <ol className="border-t border-rule">
              {problem.symptoms.map((symptom, index) => {
                const lead = index < LEAD_ITEMS;

                return (
                  <li
                    key={symptom}
                    data-reveal
                    style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                    className="group relative border-b border-rule"
                  >
                    {/* The row's own hairline, drawn left to right over the
                        static one. Same gesture as the accent line on the
                        start-a-project cards, so the site has one hover idiom
                        rather than two. Compositor-only: no layout, no paint. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-600 ease-out-expo group-hover:scale-x-100"
                    />
                    <div className="flex items-baseline gap-5 py-5 transition-transform duration-600 ease-out-expo group-hover:translate-x-1 sm:gap-8">
                      <span
                        className={cn(
                          "font-mono text-[0.6875rem] tracking-[0.16em] transition-colors duration-300",
                          lead ? "text-accent" : "text-accent/55 group-hover:text-accent",
                        )}
                      >
                        {pad(index + 1)}
                      </span>
                      <span
                        className={cn(
                          "font-display leading-snug font-medium tracking-[-0.015em] transition-colors duration-300 group-hover:text-ink",
                          lead
                            ? "text-[1.125rem] text-ink sm:text-[1.3125rem]"
                            : "text-[1.0625rem] text-ink/75 sm:text-[1.1875rem]",
                        )}
                      >
                        {symptom}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p
              data-reveal
              className="mt-8 max-w-[44ch] text-[0.9375rem] leading-relaxed text-graphite"
            >
              {problem.close}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
