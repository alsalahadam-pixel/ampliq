import { Fragment } from "react";

import { cn } from "@/lib/utils";

/**
 * Splits a headline into words so each can reveal on its own.
 *
 * Done on the server, from a plain string, so the markup is identical on both
 * sides of hydration — the animation is pure CSS and never touches the DOM.
 * Assistive technology reads the original sentence: the words are inline spans
 * separated by real text nodes, not a list of fragments.
 *
 * The spaces sit BETWEEN the masked spans, never inside them. Each word span
 * is an `overflow: hidden` inline-block, and a browser trims trailing
 * whitespace at the edge of one — putting the space inside runs every word
 * into the next.
 *
 * Use it on section headlines. The hero keeps its two-line mask, a
 * deliberately heavier entrance than anything further down the page.
 */
export function SplitWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <span data-words className={cn("inline", className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span>
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
