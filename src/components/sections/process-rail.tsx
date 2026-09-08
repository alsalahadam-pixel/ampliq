import { processSteps } from "@/content/process";
import { Section, SectionHeader } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { pad } from "@/lib/utils";

/** Columns rise slightly across the row — progression, without a diagram. */
const rise = ["lg:pt-16", "lg:pt-12", "lg:pt-8", "lg:pt-4", "lg:pt-0"];

export function ProcessRail({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { process } = dict.home;

  return (
    <Section tone="ink" labelledBy="process-heading">
      <div className="shell">
        <SectionHeader
          id="process-heading"
          eyebrow={process.eyebrow}
          headline={process.headline}
          lead={process.body}
          tone="dark"
        />

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5 lg:gap-6">
          {processSteps.map((step, index) => (
            <li
              key={step.title.en}
              data-reveal
              style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              className={`border-t border-white/15 pt-6 ${rise[index]}`}
            >
              <span
                aria-hidden="true"
                className="font-display block text-[3.25rem] leading-none font-bold tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)]"
              >
                {pad(index + 1)}
              </span>
              <h3 className="font-display mt-5 text-lg font-bold tracking-[-0.02em] uppercase">
                <span className="sr-only">
                  {pad(index + 1)} —{" "}
                </span>
                {step.title[locale]}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-fog">
                {step.body[locale]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
