import { Section, Eyebrow } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import { pad } from "@/lib/utils";

/**
 * Editorial problem statement. Deliberately not a card grid: a long headline on
 * the left, and the symptoms as a numbered list of hairline-separated lines
 * that read like a diagnosis.
 */
export function Problem({ dict }: { dict: Dictionary }) {
  const { problem } = dict.home;

  return (
    <Section tone="paper" labelledBy="problem-heading">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div data-reveal>
              <Eyebrow>{problem.eyebrow}</Eyebrow>
            </div>
            <h2
              id="problem-heading"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              className="text-display-lg mt-6 max-w-[14ch]"
            >
              {problem.headline}
            </h2>
            <p
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              className="text-lead mt-8 max-w-[46ch] text-graphite"
            >
              {problem.body}
            </p>
          </div>

          <div className="lg:col-span-6 lg:pt-3">
            <ol className="border-t border-rule">
              {problem.symptoms.map((symptom, index) => (
                <li
                  key={symptom}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                  className="group flex items-baseline gap-5 border-b border-rule py-5 sm:gap-8"
                >
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
                    {pad(index + 1)}
                  </span>
                  <span className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] sm:text-[1.1875rem]">
                    {symptom}
                  </span>
                </li>
              ))}
            </ol>
            <p
              data-reveal
              className="mt-8 max-w-[44ch] text-[0.9375rem] leading-relaxed text-graphite"
            >
              {problem.close}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
