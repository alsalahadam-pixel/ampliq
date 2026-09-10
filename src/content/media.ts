import type { Localized } from "@/lib/i18n";

/**
 * Where photography goes.
 *
 * AMPLIQ has no photography yet. Every intended photograph is registered here
 * with the box it will occupy and the alt text it will carry, and the sections
 * that hold them are already built around those boxes — so adding a picture is
 * filling in `src`, not re-laying out a page.
 *
 * To add a photograph:
 *
 *   1. put the file in `public/media/` (a 2× export is plenty — `next/image`
 *      derives the smaller sizes and serves AVIF or WebP automatically)
 *   2. set `src` below to `/media/<file>`
 *   3. check the alt text still describes what the picture actually shows
 *
 * Nothing else changes. The aspect ratio is declared here, so the space is
 * already reserved and the page does not shift as the file loads.
 *
 * **Alt text must describe the real photograph.** The text below describes
 * what each slot is *for*; when a picture goes in, correct it to what is in
 * the frame. Do not ship a description of a photograph that does not exist.
 */
export type MediaSlot = {
  /** CSS aspect ratio, e.g. "4 / 5". Fixed up front so nothing shifts. */
  ratio: string;
  /** What the finished photograph shows. Revise it with the real picture. */
  alt: Localized<string>;
  /** Path under `public/`, or null while the slot is still empty. */
  src: string | null;
  /** What the slot is for, for whoever fills it in. */
  note: string;
};

export const mediaSlots = {
  "about-team": {
    ratio: "3 / 2",
    alt: {
      en: "AMPLIQ at work",
      de: "AMPLIQ bei der Arbeit",
    },
    src: null,
    note: "Landscape beside the About statement. Working shot rather than a posed team photo — the page's claim is that you work with the people doing the work.",
  },
} as const satisfies Record<string, MediaSlot>;

export type MediaSlotName = keyof typeof mediaSlots;

/** Slots still waiting for a photograph, for the launch checklist. */
export const emptyMediaSlots = Object.entries(mediaSlots)
  .filter(([, slot]) => slot.src === null)
  .map(([name, slot]) => ({ name, note: slot.note }));
