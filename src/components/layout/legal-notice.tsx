import type { Dictionary } from "@/lib/dictionary";

/**
 * Draft banner shown on both legal pages.
 *
 * The structure of these documents is in place, but the company details and
 * legal wording still have to be supplied and reviewed by a lawyer. Saying so
 * on the page is the honest option — an Impressum with invented details would
 * be worse than an obviously unfinished one.
 */
export function LegalDraftNotice({ dict }: { dict: Dictionary }) {
  return (
    <div
      role="note"
      className="border-l-2 border-accent bg-accent-wash px-6 py-5"
    >
      <p className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-ink">
        {dict.legal.draftNoticeTitle}
      </p>
      <p className="mt-2 max-w-[70ch] text-[0.9375rem] leading-relaxed text-graphite">
        {dict.legal.draftNoticeBody}
      </p>
    </div>
  );
}

/** A single Impressum row; unset values render as a labelled gap. */
export function LegalValue({
  label,
  value,
  missingLabel,
}: {
  label: string;
  value: string | null;
  missingLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:gap-8">
      <dt className="text-[0.9375rem] text-graphite sm:w-56 sm:shrink-0">{label}</dt>
      <dd className="text-[0.9375rem] text-ink">
        {value ?? (
          <span className="inline-flex items-center gap-2 text-graphite italic">
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full bg-danger"
            />
            {missingLabel}
          </span>
        )}
      </dd>
    </div>
  );
}
