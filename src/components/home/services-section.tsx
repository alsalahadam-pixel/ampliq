import { ServiceIndex } from "@/components/services/service-index";
import { Section, SectionHeader } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export function ServicesSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { services } = dict.home;

  return (
    <Section tone="paper-soft" labelledBy="services-heading">
      <div className="shell">
        <SectionHeader
          id="services-heading"
          eyebrow={services.eyebrow}
          headline={services.headline}
          lead={services.body}
        />
        <div className="mt-14 lg:mt-20">
          <ServiceIndex locale={locale} />
        </div>
      </div>
    </Section>
  );
}
