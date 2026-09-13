import {
  ServiceFamilies,
  type ServiceCard,
} from "@/components/home/service-families";
import { Section, SectionHeader } from "@/components/ui/section";
import { serviceFamilies } from "@/content/service-families";
import { services } from "@/content/services";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";

/**
 * Flattens the six families into one language and resolves each link against
 * the service catalogue — on the server, so neither the catalogue nor the
 * second language reaches the browser.
 */
function buildCards(locale: Locale): ServiceCard[] {
  return serviceFamilies.map((family) => ({
    id: family.id,
    title: family.title[locale],
    summary: family.summary[locale],
    detail: family.detail[locale],
    includes: family.includes[locale],
    links: family.links.flatMap((slug) => {
      const service = services.find((entry) => entry.slug === slug);
      // A slug that no longer exists drops out rather than rendering a dead
      // link: the catalogue is allowed to change without this file knowing.
      return service
        ? [{ href: href(locale, `/services/${slug}`), label: service.title[locale] }]
        : [];
    }),
  }));
}

/**
 * What AMPLIQ does, as the one dark section in the page.
 *
 * The surrounding sections are paper. This one is ink, which is the whole
 * argument made visually: everything else on the page is the case, and this is
 * the range. It is also the only place a visitor can see all six disciplines at
 * once without leaving the homepage — a card opens in place rather than
 * navigating, because "one team, all of it" is not a claim you can make on a
 * page that sends people away six times to read it.
 */
export function ServicesSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const copy = dict.home.services;

  return (
    <Section tone="ink" labelledBy="services-heading">
      <div className="shell">
        <SectionHeader
          id="services-heading"
          tone="dark"
          eyebrow={copy.eyebrow}
          headline={copy.headline}
          lead={copy.body}
        />
        <div className="mt-12 lg:mt-16">
          <ServiceFamilies
            cards={buildCards(locale)}
            labels={{ more: copy.more, less: copy.less }}
          />
        </div>
      </div>
    </Section>
  );
}
