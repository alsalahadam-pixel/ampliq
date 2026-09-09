import { PackageGrid } from "@/components/packages/package-grid";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";

export function PackagesSection({
  locale,
  dict,
  detailed = false,
  withHeader = true,
}: {
  locale: Locale;
  dict: Dictionary;
  detailed?: boolean;
  withHeader?: boolean;
}) {
  const { packages } = dict.home;

  return (
    <Section tone="paper" labelledBy={withHeader ? "packages-heading" : undefined}>
      <div className="shell">
        {withHeader ? (
          <SectionHeader
            id="packages-heading"
            eyebrow={packages.eyebrow}
            headline={packages.headline}
            lead={packages.body}
          />
        ) : (
          /* The page hero carries the h1; the grid still needs a heading of its
             own so the outline does not jump from h1 straight to the card h3s. */
          <h2 className="sr-only">{dict.packages.title}</h2>
        )}

        <div className={withHeader ? "mt-14 lg:mt-20" : ""}>
          <PackageGrid locale={locale} dict={dict} detailed={detailed} />
        </div>

        <p className="mt-5 text-xs text-graphite">{dict.packages.priceNote}</p>

        {/* The custom path — most enquiries land here rather than on a tier. */}
        <div
          data-reveal
          className="mt-12 flex flex-col gap-8 border border-rule bg-paper-soft p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10"
        >
          <div>
            <h3 className="font-display text-[1.625rem] leading-tight font-bold tracking-[-0.03em]">
              {packages.unsureTitle}
            </h3>
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-graphite">
              {packages.unsureBody}
            </p>
          </div>
          <ButtonLink
            href={`${route(locale, "contact")}#consultation`}
            variant="outline"
            className="shrink-0"
          >
            {dict.cta.consultation}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
