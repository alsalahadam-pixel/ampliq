import type { ReactNode } from "react";

import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

/**
 * A value the operator has not supplied yet.
 *
 * Nothing on a public page may show one. Rather than print a bracketed token
 * or invent something plausible, the renderer below simply leaves out any row,
 * sentence or list item that still depends on a missing value — and any
 * chapter left with nothing to say.
 *
 * The document therefore reads as finished at every stage of being filled in:
 * shorter while values are outstanding, complete the moment they are supplied,
 * and never claiming a fact AMPLIQ does not have. `npm run launch-check` is
 * where the gaps are tracked; the page is not.
 */
const UNRESOLVED = /\[[A-Z][A-Z \-/]*\]/;

function resolved(value: string): boolean {
  return !UNRESOLVED.test(value);
}

/**
 * Drops everything that still depends on a value we do not have.
 *
 * Applied to the whole document before anything renders, so a chapter that
 * loses all of its content disappears from both the page and its contents
 * rail rather than standing empty under a heading.
 */
export function withoutUnresolved(chapters: LegalChapter[]): LegalChapter[] {
  return chapters
    .map((chapter) => ({
      ...chapter,
      blocks: chapter.blocks
        .map((block): LegalBlock | null => {
          if (block.kind === "text") {
            return resolved(block.value) ? block : null;
          }
          if (block.kind === "list") {
            const items = block.items.filter(resolved);
            return items.length > 0 ? { ...block, items } : null;
          }
          const rows = block.rows.filter((row) => resolved(row.value));
          return rows.length > 0 ? { ...block, rows } : null;
        })
        .filter((block): block is LegalBlock => block !== null),
    }))
    .filter((chapter) => chapter.blocks.length > 0);
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
  const visible = withoutUnresolved(chapters);

  return (
    <Section tone="paper">
      <div className="shell">
        {before ? <div className="mb-14">{before}</div> : null}

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contents. Sticky on desktop; a plain list on mobile, where a
              sticky rail would eat the screen. */}
          <nav
            aria-label={dict.legal.contents}
            className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="eyebrow text-graphite">{dict.legal.contents}</h2>
            <ol className="mt-5 flex flex-col gap-2.5 border-t border-rule pt-5">
              {visible.map((chapter, index) => (
                <li key={chapter.id} className="flex gap-3">
                  <span className="font-mono text-[0.6875rem] leading-[1.7] tracking-[0.14em] text-graphite">
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
            {visible.map((chapter, index) => (
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
        {block.value}
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
            <span>{item}</span>
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
          <dd className="text-[0.9375rem] text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
