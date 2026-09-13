"use client";

import Link from "next/link";
import { useState } from "react";

import { ServiceCover } from "@/components/home/service-cover";
import type { ServiceFamily } from "@/content/service-families";
import { cn, pad } from "@/lib/utils";

/**
 * One card's worth of text, already in one language, already resolved against
 * the service catalogue. The catalogue is 1,200 lines of two-language page
 * content; importing it here to look up two link titles put the whole thing in
 * the browser bundle and cost 24 KB of JavaScript that no visitor ever reads.
 * The section resolves it on the server instead and passes down strings.
 */
export type ServiceCard = {
  id: ServiceFamily["id"];
  title: string;
  summary: string;
  detail: string;
  includes: string[];
  links: { href: string; label: string }[];
};

/**
 * The six services, as one row of work rather than six separate purchases.
 *
 * ## Why a client component
 *
 * The section is server-rendered apart from one thing: a card opens in place.
 * That is the whole argument of the section — everything is here, you do not
 * have to go anywhere — so a link to a page would undercut it. The expanded
 * state is a standard disclosure: `aria-expanded` on the control,
 * `aria-controls` pointing at the panel, `hidden` when closed. Nothing is
 * animated that the browser cannot do on the compositor.
 *
 * ## Why the card head is a button
 *
 * The whole card is clickable via the stretched-pseudo-element the rest of the
 * site uses, but the accessible name is only the title. A screen reader hears
 * "Film & Photography, collapsed", not the title plus a sentence of summary.
 *
 * ## Mobile
 *
 * One row, scrolled horizontally, snapping card to card. Each card is 78% of
 * the viewport so the next one is always visibly there — the affordance is the
 * neighbour, not an arrow or a row of dots. Above `sm` it becomes an ordinary
 * grid and every scroll property stops applying.
 */
export function ServiceFamilies({
  cards,
  labels,
}: {
  cards: ServiceCard[];
  labels: { more: string; less: string };
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul
      className={cn(
        // Mobile: a snapping rail that bleeds into the shell's gutter, so a
        // card can sit flush to the edge while the first one still lines up
        // with the headline above it.
        "no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2",
        // Above sm the rail stops being a rail.
        "sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0",
        "lg:grid-cols-3 lg:gap-6",
        // Closed, the cards stretch so every row's footer lines up. Opened,
        // they stop: otherwise the two cards beside an expanded one inherit its
        // height and carry a column of dead space to the footer.
        open ? "sm:items-start" : "sm:items-stretch",
      )}
    >
      {cards.map((family, index) => {
        const isOpen = open === family.id;
        const panelId = `service-${family.id}-panel`;

        return (
          <li
            key={family.id}
            data-reveal
            style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
            className="w-[78vw] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <article
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-lg border transition-colors duration-500",
                isOpen
                  ? "border-accent-soft/40 bg-white/[0.05]"
                  : "border-white/12 bg-white/[0.025] hover:border-white/20",
              )}
            >
              {/* The cover. Scales inside its own clip on hover — transform
                  only, so nothing around it is laid out again. */}
              <div className="relative aspect-[2/1] overflow-hidden bg-ink-raised sm:aspect-[16/10]">
                <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
                  <ServiceCover id={family.id} />
                </div>
                {/* Grounds the drawing into the card rather than letting it
                    stop at a hard edge. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink/70 to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-600 ease-out-expo group-hover:scale-x-100"
                />
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent-soft">
                  {pad(index + 1)}
                </span>

                <h3 className="mt-3">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : family.id)}
                    className={cn(
                      "font-display text-[1.1875rem] leading-tight font-bold tracking-[-0.02em] text-paper",
                      "text-left transition-colors duration-300 hover:text-white",
                      // The whole card, clickable — without lengthening the
                      // accessible name past the title.
                      "after:absolute after:inset-0 after:content-['']",
                    )}
                  >
                    {family.title}
                  </button>
                </h3>

                <p className="mt-3 text-[0.9375rem] leading-relaxed text-fog">
                  {family.summary}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4 sm:mt-auto sm:pt-5">
                  <span className="text-fine text-fog transition-colors duration-300 group-hover:text-paper/90">
                    {isOpen ? labels.less : labels.more}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo",
                      isOpen
                        ? "rotate-180 border-accent-soft/50 text-accent-soft"
                        : "border-white/20 text-paper/70 group-hover:translate-x-0.5 group-hover:border-white/40 group-hover:text-paper",
                    )}
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                      <path
                        d="M3 6 L8 11 L13 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </div>

                {/* Closed, this is `hidden` rather than a zero-height box: it
                    leaves the tab order and the accessibility tree entirely,
                    which a clipped element does not. */}
                <div id={panelId} hidden={!isOpen} className="pt-4">
                  <p className="text-[0.9375rem] leading-relaxed text-paper/85">
                    {family.detail}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {family.includes.map((item) => (
                      <li
                        key={item}
                        className="text-fine rounded-full border border-white/15 px-2.5 py-1 text-fog"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {family.links.length > 0 ? (
                    <ul className="relative z-10 mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
                      {family.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="link-underline text-[0.875rem] text-paper/85 transition-colors duration-200 hover:text-white"
                          >
                            {link.label}
                            <span aria-hidden="true" className="ml-1.5 text-accent-soft">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
