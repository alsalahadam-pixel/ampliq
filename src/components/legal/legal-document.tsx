import type { ReactNode } from "react";

import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import { outstandingLegalFields } from "@/lib/legal";
import { cn } from "@/lib/utils";

/**
 * Highlights `[PLACEHOLDER]` tokens inside a string.
 *
 * A placeholder must never read as finished text. Rendering it in the danger
 * colour, in mono, with a marker, means anyone reading the page — the operator,
 * a lawyer, a visitor — can see at a glance which parts are outstanding.
 */
export function LegalText({ children }: { children: string }) {
  const parts = children.split(/(\[[A-Z][A-Z \-/]*\])/g);

  return (
    <>
      {parts.map((part, index) =>
        /^\[[A-Z][A-Z \-/]*\]$/.test(part) ? (
          <span
            key={index}
            className="font-mono mx-0.5 inline-flex items-center gap-1.5 rounded-[2px] border border-danger/35 bg-danger/8 px-1.5 py-0.5 text-[0.8125em] text-danger"
          >
            <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-danger" />
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
 * The banner every legal page carries while information is missing.
 *
 * It states what is outstanding rather than claiming the document is compliant.
 * Once every required field is supplied and a lawyer has signed the wording
 * off, `legalReviewed` in the environment removes the notice.
 */
export function LegalStatusNotice({ dict }: { dict: Dictionary }) {
  const outstanding = outstandingLegalFields.filter((entry) => entry.required);
  const optional = outstandingLegalFields.filter((entry) => !entry.required);

  return (
    <div role="note" className="border-l-2 border-danger bg-danger/5 px-6 py-5">
      <p className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-ink">
        {dict.legal.draftNoticeTitle}
      </p>
      <p className="mt-2 max-w-[72ch] text-[0.9375rem] leading-relaxed text-graphite">
        {dict.legal.draftNoticeBody}
      </p>

      {outstanding.length > 0 ? (
        <>
          <p className="mt-5 text-[0.8125rem] font-medium text-ink">
            {dict.legal.outstandingRequired}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {outstanding.map((entry) => (
              <li
                key={entry.token}
                className="font-mono rounded-[2px] border border-danger/35 bg-danger/8 px-2 py-1 text-[0.75rem] text-danger"
              >
                [{entry.token}]
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {optional.length > 0 ? (
        <>
          <p className="mt-5 text-[0.8125rem] font-medium text-ink">
            {dict.legal.outstandingOptional}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {optional.map((entry) => (
              <li
                key={entry.token}
                className="font-mono rounded-[2px] border border-rule-strong px-2 py-1 text-[0.75rem] text-graphite"
              >
                [{entry.token}]
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
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
                    className="link-underline text-[0.875rem] leading-relaxed text-graphite transition-colors duration-200 hover:text-ink"
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
