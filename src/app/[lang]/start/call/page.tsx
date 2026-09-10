import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingFlow } from "@/components/booking/booking-flow";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { publicBookingConfig } from "@/lib/booking/config";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/start/call">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);

  return buildMetadata({
    locale: lang,
    path: "/start/call",
    title: dict.booking.metaTitle,
    description: dict.booking.metaDescription,
  });
}

export default async function BookCallPage({ params }: PageProps<"/[lang]/start/call">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  // Only the public half of the configuration crosses to the browser: working
  // hours and slot length, never the buffer, credentials or anything read from
  // the owner's calendar.
  const config = publicBookingConfig();

  return (
    <>
      {/* The compact band, not the default one: this is the page where the
          calendar has to be reachable, and the site's entrance is still the
          same ink block every other page opens on. */}
      <PageHero
        size="compact"
        breadcrumb={{ label: dict.start.metaTitle, href: route(lang, "start") }}
        title={dict.booking.title}
        lead={dict.booking.lead}
      />

      <Section tone="paper">
        <div className="shell">
          <BookingFlow config={config} locale={lang} dict={dict} />
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.start.metaTitle, path: "/start" },
            { name: dict.booking.metaTitle, path: "/start/call" },
          ]),
        ]}
      />
    </>
  );
}
