import { Disc } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { defaultLocale } from "@/lib/i18n";
import { route } from "@/lib/routes";

/**
 * 404 within a locale. `not-found` components receive no params, so this falls
 * back to the default language — the header and footer around it still render
 * in the locale the visitor was in.
 */
export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <section className="on-dark relative isolate flex min-h-[80svh] items-center overflow-hidden bg-ink text-paper">
      <div className="shell relative py-24">
        <Disc className="h-12 w-12 text-paper/30" />
        <p className="font-mono mt-10 text-[0.6875rem] tracking-[0.16em] text-accent-soft">
          {dict.notFound.code}
        </p>
        <h1 className="text-display-lg mt-5 max-w-[16ch]">{dict.notFound.title}</h1>
        <p className="text-lead mt-6 max-w-[46ch] text-fog">{dict.notFound.body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href={route(defaultLocale, "home")} tone="dark">
            {dict.cta.backHome}
          </ButtonLink>
          <ButtonLink href={route(defaultLocale, "services")} variant="outline" tone="dark">
            {dict.cta.allServices}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
