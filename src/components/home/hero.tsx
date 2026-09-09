import { DiscField } from "@/components/brand/disc-field";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const hero = dict.home.hero;

  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-paper">
      {/* Decorative mark: large, cropped by the viewport edge, never centred. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-24 w-[72vw] max-w-[560px] text-accent/55 sm:-top-20 sm:-right-20 lg:top-1/2 lg:right-[-6%] lg:w-[46vw] lg:max-w-[720px] lg:-translate-y-1/2"
      >
        <DiscField markClassName="text-paper/[0.09]" />
      </div>

      <div className="shell relative flex min-h-[92svh] flex-col justify-between pt-32 pb-10 lg:min-h-[94svh] lg:pt-44 lg:pb-12">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <div data-enter>
              <Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>
            </div>

            <h1 className="text-display-2xl mt-7 lg:mt-9">
              <span data-enter="mask" className="block">
                <span style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
                  {hero.headlineTop}
                </span>
              </span>
              <span data-enter="mask" className="block">
                <span style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
                  {hero.headlineBottom}
                  {/* The full stop is the DISC's centre dot, in the accent. */}
                  <span
                    aria-hidden="true"
                    className="ml-[0.06em] inline-block h-[0.13em] w-[0.13em] translate-y-[-0.06em] rounded-full bg-accent align-baseline"
                  />
                  <span className="sr-only">.</span>
                </span>
              </span>
            </h1>

            <p
              data-enter
              style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
              className="text-lead mt-7 max-w-[54ch] text-paper/75 lg:mt-8"
            >
              {hero.lead}
            </p>

            <div
              data-enter
              style={{ "--reveal-delay": "360ms" } as React.CSSProperties}
              className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <ButtonLink href={route(locale, "contact")} tone="dark" size="lg">
                {dict.cta.start}
              </ButtonLink>
              <ButtonLink
                href={route(locale, "work")}
                variant="outline"
                tone="dark"
                size="lg"
              >
                {dict.cta.work}
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* System preview: the three layers, stated before the visitor scrolls. */}
        <div
          data-enter
          style={{ "--reveal-delay": "460ms" } as React.CSSProperties}
          className="mt-16 border-t border-white/12 pt-6 lg:mt-10 lg:pt-8"
        >
          <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            {hero.pillars.map((pillar, index) => (
              <li key={pillar.key} className="flex items-baseline gap-3">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent-soft">
                  0{index + 1}
                </span>
                <span className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="font-display text-base font-semibold tracking-[-0.02em] text-paper">
                    {pillar.label}
                  </span>
                  <span className="text-sm text-fog">{pillar.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
