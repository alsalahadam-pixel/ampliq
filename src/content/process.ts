import type { Step } from "@/content/types";

/** The five stages every engagement runs through, in the same order. */
export const processSteps: Step[] = [
  {
    title: { en: "Understand", de: "Verstehen" },
    body: {
      en: "What the business does, who buys, what's actually holding growth back — and what has already been tried.",
      de: "Was das Unternehmen macht, wer kauft, was Wachstum wirklich bremst — und was bereits versucht wurde.",
    },
  },
  {
    title: { en: "Strategy", de: "Strategie" },
    body: {
      en: "A written plan: the position, the priorities, and the order the work happens in. Approved before anything is designed.",
      de: "Ein schriftlicher Plan: Position, Prioritäten und Reihenfolge der Arbeit. Freigegeben, bevor gestaltet wird.",
    },
  },
  {
    title: { en: "Design", de: "Gestalten" },
    body: {
      en: "The visual and verbal system, developed on the pieces that matter most rather than on abstract concepts.",
      de: "Das visuelle und sprachliche System, entwickelt an den wichtigsten Stücken statt an abstrakten Konzepten.",
    },
  },
  {
    title: { en: "Deliver", de: "Umsetzen" },
    body: {
      en: "Build, produce, launch. Tested properly, with tracking in place and nothing handed over half-finished.",
      de: "Bauen, produzieren, launchen. Sauber getestet, mit funktionierendem Tracking und ohne halbfertige Übergaben.",
    },
  },
  {
    title: { en: "Grow", de: "Wachsen" },
    body: {
      en: "Measure what happened, keep what works, cut what doesn't. The part most agencies skip once the invoice is paid.",
      de: "Messen, was passiert ist, behalten, was wirkt, streichen, was nicht wirkt. Der Teil, den die meisten Agenturen nach der Rechnung überspringen.",
    },
  },
];
