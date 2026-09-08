import { Section, SectionHeader } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import { pad } from "@/lib/utils";

export function Principles({ dict }: { dict: Dictionary }) {
  const { principles } = dict.home;

  return (
    <Section tone="paper-soft" labelledBy="principles-heading">
      <div className="shell">
        <SectionHeader
          id="principles-heading"
          eyebrow={principles.eyebrow}
          headline={principles.headline}
          lead={principles.body}
        />

        <ul className="mt-14 grid gap-x-16 border-t border-rule-strong lg:mt-20 lg:grid-cols-2">
          {principles.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 90}ms` } as React.CSSProperties}
              className="flex gap-6 border-b border-rule py-8 sm:gap-10"
            >
              <span className="font-mono text-[0.6875rem] leading-[1.6] tracking-[0.16em] text-accent">
                {pad(index + 1)}
              </span>
              <div>
                <h3 className="font-display text-[1.375rem] leading-tight font-bold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-graphite">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
