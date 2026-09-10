import type { ReactNode } from "react";

import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import { outstandingLegalFields } from "@/lib/legal";
import { cn } from "@/lib/utils";

/**
 * Marks `[PLACEHOLDER]` tokens inside a string.
 *
 * A placeholder still has to be unmistakable — a reader must never take one for
 * finished text — but it should not shout. The treatment is the brand's own:
 * the mono face already used for labels and indices, a hairline box, and the
 * accent that marks every other "this is a system element" on the site.
 *
 * Nothing is hidden to make the page look finished. The token is legible, it
 * names exactly what is missing, and the notice at the top of each document
 * lists the same set.
 */
export function LegalText({ children }: { children: string }) {
  const parts = children.split(/(\[[A-Z][A-Z \-/]*\])/g);

  return (
    <>
      {parts.map((part, index) =>
        /^\[[A-Z][A-Z \-/]*\]$/.test(part) ? (
          <span
            key={index}
            title="To be supplied before launch"
            className="font-mono mx-0.5 inline-block rounded-[2px] border border-rule-strong bg-paper-soft px-1.5 py-[0.1em] text-[0.78em] tracking-[0.04em] text-graphite"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * The header every legal page carries while information is outstanding.
 *
 * Styled as part of the document, not as a build warning: the site's own paper
 * surface, a hairline border, the accent dot that marks a system element
 * everywhere else. It still says exactly what is missing and that the wording
 * is unreviewed — that is a legal necessity, not a decoration — but it reads as
 * a considered editorial note rather than an error.
 */
export function LegalStatusNotice({ dict }: { dict: Dictionary }) {
  const outstanding = outstandingLegalFields.filter((entry) => entry.required);
  const optional = outstandingLegalFields.filter((entry) => !entry.required);

  // Once every required field is supplied and the wording is reviewed, the
  // notice disappears of its own accord and the document simply reads as
  // finished. Nothing has to be edited to make that happen.
  if (outstanding.length === 0 && optional.length === 0) return null;

  return (
    <aside
      aria-label={dict.legal.draftNoticeTitle}
      className="border border-rule bg-paper-soft px-6 py-6 sm:px-8 sm:py-7"
    >
      <p className="eyebrow flex items-center gap-3 text-graphite">
        <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-accent" />
        {dict.legal.draftNoticeLabel}
      </p>

      <p className="font-display mt-4 text-[1.125rem] leading-snug font-bold tracking-[-0.025em] text-ink">
        {dict.legal.draftNoticeTitle}
      </p>
      <p className="mt-3 max-w-[72ch] text-[0.9375rem] leading-relaxed text-graphite">
        {dict.legal.draftNoticeBody}
      </p>

      <dl className="mt-6 flex flex-col gap-5 border-t border-rule pt-5">
        {outstanding.length > 0 ? (
          <div>
            <dt className="text-[0.8125rem] font-medium text-ink">
              {dict.legal.outstandingRequired}
            </dt>
            <dd className="mt-2.5">
              <ul className="flex flex-wrap gap-1.5">
                {outstanding.map((entry) => (
                  <li
                    key={entry.token}
                    className="font-mono rounded-[2px] border border-rule-strong bg-paper px-2 py-1 text-[0.6875rem] tracking-[0.04em] text-ink"
                  >
                    [{entry.token}]
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}

        {optional.length > 0 ? (
          <div>
            <dt className="text-[0.8125rem] font-medium text-graphite">
              {dict.legal.outstandingOptional}
            </dt>
            <dd className="mt-2.5">
              <ul className="flex flex-wrap gap-1.5">
                {optional.map((entry) => (
                  <li
                    key={entry.token}
                    className="font-mono rounded-[2px] border border-rule px-2 py-1 text-[0.6875rem] tracking-[0.04em] text-graphite"
                  >
                    [{entry.token}]
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}

export type LegalBlock =
  | { kind: "text"; value: string }
  | { kind: "list"; items: string[] }
  | { kind: "rows"; rows: { label: string; value: string }[] };

export type LegalChapter = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

/** Renders one document: contents rail on the left, chapters on the right. */
export function LegalDocument({
  chapters,
  dict,
  updated,
  before,
}: {
  chapters: LegalChapter[];
  dict: Dictionary;
  /** ISO date the wording last changed. */
  updated: string;
  /** Optional block above the chapters, e.g. the Impressum entity table. */
  before?: ReactNode;
}) {
  return (
    <Section tone="paper">
      <div className="shell">
        <LegalStatusNotice dict={dict} />

        {before ? <div className="mt-14">{before}</div> : null}

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contents. Sticky on desktop; a plain list on mobile, where a
              sticky rail would eat the screen. */}
          <nav
            aria-label={dict.legal.contents}
            className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="eyebrow text-graphite">{dict.legal.contents}</h2>
            <ol className="mt-5 flex flex-col gap-2.5 border-t border-rule pt-5">
              {chapters.map((chapter, index) => (
                <li key={chapter.id} className="flex gap-3">
                  <span className="font-mono text-[0.6875rem] leading-[1.7] tracking-[0.14em] text-fog">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${chapter.id}`}
                    className="link-underline -my-2.5 inline-block py-2.5 text-[0.875rem] leading-relaxed text-graphite transition-colors duration-200 hover:text-ink"
                  >
                    {chapter.heading}
                  </a>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-t border-rule pt-5 text-xs text-graphite">
              {dict.legal.lastUpdated}:{" "}
              <time dateTime={updated}>{updated}</time>
            </p>
          </nav>

          <div className="lg:col-span-8 lg:col-start-5">
            {chapters.map((chapter, index) => (
              <section
                key={chapter.id}
                id={chapter.id}
                aria-labelledby={`${chapter.id}-heading`}
                className={cn(
                  "scroll-mt-28",
                  index > 0 && "mt-14 border-t border-rule pt-14",
                )}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.6875rem] tracking-[0.14em] text-accent"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2
                    id={`${chapter.id}-heading`}
                    className="font-display text-[1.5rem] leading-tight font-bold tracking-[-0.03em]"
                  >
                    {chapter.heading}
                  </h2>
                </div>

                <div className="mt-6 flex flex-col gap-5">
                  {chapter.blocks.map((block, blockIndex) => (
                    <LegalBlockView key={blockIndex} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  if (block.kind === "text") {
    return (
      <p className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-graphite">
        <LegalText>{block.value}</LegalText>
      </p>
    );
  }

  if (block.kind === "list") {
    return (
      <ul className="flex max-w-[70ch] flex-col gap-2.5">
        {block.items.map((item, index) => (
          <li key={index} className="flex gap-3 text-[0.9375rem] leading-relaxed text-graphite">
            <span
              aria-hidden="true"
              className="mt-[0.6em] h-[5px] w-[5px] shrink-0 rounded-full bg-accent/70"
            />
            <span>
              <LegalText>{item}</LegalText>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <dl className="max-w-[70ch] border-t border-rule">
      {block.rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:gap-8"
        >
          <dt className="text-[0.9375rem] text-graphite sm:w-56 sm:shrink-0">
            {row.label}
          </dt>
          <dd className="text-[0.9375rem] text-ink">
            <LegalText>{row.value}</LegalText>
          </dd>
        </div>
      ))}
    </dl>
  );
}
