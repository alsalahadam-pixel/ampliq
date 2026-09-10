import { cn } from "@/lib/utils";

/**
 * Splits a headline into words so each can reveal on its own.
 *
 * Done on the server, from a plain string, so the markup is identical on both
 * sides of hydration — the animation is pure CSS and never touches the DOM.
 * Assistive technology reads the original sentence: the words are inline
 * spans separated by real spaces, not a list of fragments.
 *
 * Use it on section headlines. The hero keeps its two-line mask, which is a
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
        <span key={`${word}-${index}`}>
          <span>{word}</span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
