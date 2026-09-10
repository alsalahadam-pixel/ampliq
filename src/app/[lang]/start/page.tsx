import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Arrow } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/section";
import { processSteps } from "@/content/process";
import { getDictionary, type Dictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { contact } from "@/lib/site";
import { fill, pad } from "@/lib/utils";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/start">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);

  return buildMetadata({
    locale: lang,
    path: "/start",
    title: dict.start.metaTitle,
    description: dict.start.metaDescription,
  });
}

/**
 * The fork.
 *
 * Every "Start a project" button on the site lands here, and here the visitor
 * decides how they want to begin: a written brief, or a call. The two are
 * presented at the same weight — no "recommended" badge, no pre-selected
 * default — because which one is right depends on the person, not on us.
 *
 * Both paths already exist as real pages, so this stays a routing decision
 * rather than another wrapper around the same forms.
 */
export default async function StartPage({ params }: PageProps<"/[lang]/start">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <PageHero
        size="compact"
        eyebrow={dict.start.metaTitle}
        title={dict.start.title}
        lead={dict.start.lead}
      />

      <Section tone="paper" labelledBy="start-choice">
        <div className="shell">
          <h2 id="start-choice" className="sr-only">
            {dict.start.chooseHeadline}
          </h2>

          {/* Side by side, the two cards must agree row for row: the hairline
              above the list and the call to action below it read as one line
              across both, not as two cards that happen to sit together. Subgrid
              does that without pinning any copy to a fixed height, so a longer
              German sentence simply moves both cards' rows together. */}
          <div className="grid gap-6 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_1fr_auto] lg:gap-x-8 lg:gap-y-0">
            <PathCard
              path={dict.start.brief}
              href={route(lang, "contact")}
              delay="0ms"
            />
            <PathCard
              path={dict.start.call}
              href={route(lang, "call")}
              delay="90ms"
            />
          </div>

          <div className="mt-16 grid gap-12 border-t border-rule pt-12 lg:grid-cols-12 lg:gap-16">
            {/* Whichever way they came in, the next three steps are the same.
                Saying so here removes the "what am I signing up for" pause
                before either button. */}
            <div className="lg:col-span-7">
              <Eyebrow>{dict.home.process.eyebrow}</Eyebrow>
              <ol className="mt-6 border-t border-rule">
                {processSteps.slice(0, 3).map((step, index) => (
                  <li
                    key={step.title.en}
                    className="flex gap-5 border-b border-rule py-5"
                  >
                    <span className="font-mono text-[0.6875rem] leading-[1.8] tracking-[0.16em] text-accent">
                      {pad(index + 1)}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.0625rem] font-bold tracking-[-0.02em]">
                        {step.title[lang]}
                      </h3>
                      <p className="mt-1.5 max-w-[54ch] text-[0.9375rem] leading-relaxed text-graphite">
                        {step.body[lang]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border border-rule bg-paper-soft p-7">
                <h3 className="font-display text-[1.125rem] font-bold tracking-[-0.03em]">
                  {dict.start.directTitle}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
                  {fill(dict.start.directBody, { email: contact.info })}
                </p>
                <a
                  href={`mailto:${contact.info}`}
                  className="link-underline mt-1.5 inline-block py-2.5 text-[0.9375rem] font-medium break-all"
                >
                  {contact.info}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.start.metaTitle, path: "/start" },
          ]),
        ]}
      />
    </>
  );
}

type Path = Dictionary["start"]["brief"];

/**
 * One of the two ways in.
 *
 * The whole card is clickable, but the link itself wraps only the title and is
 * stretched over the card with a pseudo-element. That keeps the accessible
 * name short and useful ("Send a project brief") instead of reading out the
 * entire card, while still giving a thumb the full target.
 */
function PathCard({
  path,
  href,
  delay,
}: {
  path: Path;
  href: string;
  delay: string;
}) {
  return (
    <div
      data-reveal
      style={{ "--reveal-delay": delay } as React.CSSProperties}
      className="group relative flex flex-col border border-rule bg-paper-soft p-8 transition-colors duration-300 hover:border-rule-strong focus-within:border-rule-strong sm:p-10 lg:row-span-5 lg:grid lg:grid-rows-subgrid"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
          {path.index}
        </span>
        <span className="eyebrow text-graphite">{path.kind}</span>
      </div>

      <h3 className="font-display mt-6 text-[1.625rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[1.875rem]">
        {/* The link wraps the title only; the pseudo-element stretches its hit
            area over the whole card. The site's own focus ring therefore draws
            around the title — which names the destination — rather than being
            suppressed. */}
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {path.title}
        </Link>
      </h3>

      <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-relaxed text-graphite">
        {path.body}
      </p>

      <ul className="mt-7 flex flex-col gap-2.5 self-start border-t border-rule pt-6">
        {path.points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-[0.875rem] leading-relaxed text-graphite"
          >
            <span
              aria-hidden="true"
              className="mt-[0.62em] h-[5px] w-[5px] shrink-0 rounded-full bg-accent/70"
            />
            {point}
          </li>
        ))}
      </ul>

      {/* Reads as the button it behaves like. The real link is on the title
          above, so this is decoration and stays out of the tab order. */}
      <p
        aria-hidden="true"
        className="mt-8 inline-flex items-center gap-2.5 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-accent"
      >
        {path.cta}
        <Arrow />
      </p>
    </div>
  );
}
