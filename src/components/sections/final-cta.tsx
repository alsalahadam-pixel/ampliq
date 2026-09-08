import { DiscField } from "@/components/brand/disc-field";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Closing call to action. Appears at the end of every page, so a visitor never
 * has to scroll back up to find the next step.
 */
export function FinalCta({
  locale,
  dict,
  headline,
  body,
}: {
  locale: Locale;
  dict: Dictionary;
  headline?: string;
  body?: string;
}) {
  const cta = dict.home.finalCta;

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="on-dark relative isolate overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[22%] -bottom-[45%] w-[70vw] max-w-[640px] text-accent/55 lg:-right-[6%] lg:-bottom-[60%] lg:w-[42vw]"
      >
        <DiscField markClassName="text-paper/[0.08]" />
      </div>

      <div className="shell relative py-24 lg:py-36">
        <div className="max-w-[46rem]">
          <div data-reveal>
            <Eyebrow tone="dark">{cta.eyebrow}</Eyebrow>
          </div>
          <h2
            id="final-cta-heading"
            data-reveal
            style={{ "--reveal-delay": "70ms" } as React.CSSProperties}
            className="text-display-xl mt-7 max-w-[15ch]"
          >
            {headline ?? cta.headline}
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
            className="text-lead mt-7 max-w-[48ch] text-fog"
          >
            {body ?? cta.body}
          </p>

          <div
            data-reveal
            style={{ "--reveal-delay": "210ms" } as React.CSSProperties}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <ButtonLink href={route(locale, "contact")} tone="dark">
              {dict.cta.start}
            </ButtonLink>
            <ButtonLink
              href={`${route(locale, "contact")}#consultation`}
              variant="outline"
              tone="dark"
            >
              {dict.cta.consultation}
            </ButtonLink>
          </div>

          <p
            data-reveal
            className="mt-10 text-sm text-fog"
          >
            {dict.footer.ctaLine}{" "}
            <a
              href={`mailto:${site.email}`}
              className="link-underline text-paper transition-colors duration-200 hover:text-accent-soft"
            >
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
