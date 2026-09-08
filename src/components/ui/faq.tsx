import { cn } from "@/lib/utils";

/**
 * FAQ list built on native `<details>` — keyboard accessible, works without
 * JavaScript, and announced correctly by screen readers with no ARIA of our own.
 */
export function FaqList({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  return (
    <div className={cn("border-t border-rule", className)}>
      {items.map((item) => (
        <details key={item.question} className="group border-b border-rule">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.125rem] leading-snug font-semibold tracking-[-0.02em] sm:text-[1.25rem]">
              {item.question}
            </span>
            <span
              aria-hidden="true"
              className="relative mt-2 block h-3 w-3 shrink-0 text-accent"
            >
              <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-current" />
              <span className="absolute top-0 left-1/2 block h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-[68ch] pb-7 text-[0.9375rem] leading-relaxed text-graphite">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
