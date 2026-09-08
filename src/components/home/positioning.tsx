import { Eyebrow } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";

/**
 * The credibility beat directly under the hero.
 *
 * There are no client logos to show yet, and inventing them is not an option —
 * so this states who the work is for and lets the disciplines run as a moving
 * band. Honest, and visually stronger than an empty logo row.
 */
export function Positioning({ dict }: { dict: Dictionary }) {
  const { positioning } = dict.home;
  const items = positioning.marquee;

  return (
    <section className="on-dark relative overflow-hidden border-t border-white/10 bg-ink text-paper">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <div data-reveal>
              <Eyebrow tone="dark">{positioning.eyebrow}</Eyebrow>
            </div>
            <h2
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              className="text-display-md mt-6 max-w-[18ch]"
            >
              {positioning.headline}
            </h2>
          </div>
          <p
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-fog lg:col-span-5"
          >
            {positioning.body}
          </p>
        </div>
      </div>

      {/*
        Discipline band. Duplicated once so the loop has no visible seam.
        Decorative: every discipline here is also a real link in the services
        index further down the page, so hiding it from assistive tech avoids a
        long, unnavigable duplicate list.
      */}
      <div
        className="relative flex overflow-hidden border-t border-white/10 py-5"
        aria-hidden="true"
      >
        <div className="marquee-track flex shrink-0 items-center whitespace-nowrap">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center">
              <span className="font-display px-6 text-[0.9375rem] font-medium tracking-[-0.01em] text-paper/70">
                {item}
              </span>
              <span className="h-[3px] w-[3px] rounded-full bg-accent-soft/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
