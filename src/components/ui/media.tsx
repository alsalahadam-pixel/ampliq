import Image from "next/image";

import { DiscField } from "@/components/brand/disc-field";
import { mediaSlots, type MediaSlotName } from "@/content/media";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * A reserved place for a photograph.
 *
 * The site has no photography yet. Rather than build sections that assume
 * there will never be any — and then have to be rebuilt when there is — every
 * intended photograph has a named slot in `@/content/media`, and this
 * component renders it.
 *
 * The box is the same size either way. Until a slot has a file it holds a
 * brand panel built from the DISC geometry, which reads as a deliberate
 * graphic rather than a missing image; the moment `src` is filled in, the
 * photograph occupies exactly the same box. No section is re-laid out, and
 * because the aspect ratio is declared up front nothing shifts while the
 * image loads.
 */
export function Media({
  slot,
  locale,
  className,
  sizes,
  priority = false,
}: {
  slot: MediaSlotName;
  locale: Locale;
  className?: string;
  /**
   * What width the box occupies at each breakpoint, so the browser can pick a
   * file rather than downloading the largest one. Required once a real
   * photograph is in place; harmless before then.
   */
  sizes: string;
  priority?: boolean;
}) {
  const entry = mediaSlots[slot];

  return (
    <div
      data-reveal
      className={cn("relative isolate overflow-hidden bg-paper-soft", className)}
      style={{ aspectRatio: entry.ratio }}
    >
      {entry.src ? (
        <Image
          src={entry.src}
          alt={entry.alt[locale]}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <BrandPanel />
      )}
    </div>
  );
}

/**
 * What a slot holds until there is a photograph: the same DISC field the hero
 * and the closing panel use, on the site's own paper and held well back. An
 * empty slot therefore still looks like AMPLIQ rather than like a missing
 * image — and it is the one thing on the page that will visibly change when
 * the photography arrives.
 */
function BrandPanel() {
  return (
    <div className="absolute inset-0 flex items-center justify-center border border-rule">
      <DiscField
        tone="light"
        className="h-[62%] w-auto max-w-[62%] text-accent/30"
        markClassName="text-rule-strong"
      />
    </div>
  );
}
