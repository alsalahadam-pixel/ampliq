import Image from "next/image";
import Link from "next/link";

import { Disc } from "@/components/brand/logo";
import type { Project } from "@/content/types";
import { Arrow } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { workHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Project imagery slot.
 *
 * Until real screenshots exist, this renders a considered placeholder — the
 * mark, a hairline frame and the project name — rather than a stock photo or a
 * grey box. Setting `src` on the gallery entry swaps in the real image with no
 * layout change.
 */
export function ProjectMedia({
  project,
  locale,
  label,
  className,
  priority = false,
  src,
  alt,
  tone = "dark",
}: {
  project: Project;
  locale: Locale;
  label: string;
  className?: string;
  priority?: boolean;
  src?: string | null;
  alt?: string;
  /** Alternates the placeholder so a gallery isn't a run of identical panels. */
  tone?: "dark" | "light";
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-soft", className)}>
        <Image
          src={src}
          alt={alt ?? project.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        dark ? "bg-ink" : "border border-rule bg-paper",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-4 border sm:inset-6",
          dark ? "border-white/10" : "border-rule",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-16 -bottom-20 h-64 w-64",
          dark ? "text-white/[0.04]" : "text-ink/[0.04]",
        )}
      >
        <Disc className="h-full w-full" />
      </span>
      <div className="relative flex flex-col items-center gap-4 px-8 text-center">
        <Disc className={cn("h-9 w-9", dark ? "text-paper/50" : "text-ink/30")} />
        <span
          className={cn(
            "font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {project.title}
        </span>
        <span
          className={cn(
            "font-mono text-[0.625rem] tracking-[0.16em] uppercase",
            dark ? "text-fog" : "text-graphite",
          )}
        >
          {label}
        </span>
      </div>
      <span className="sr-only">{project.category[locale]}</span>
    </div>
  );
}

export function ProjectCard({
  project,
  locale,
  dict,
  featured = false,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  featured?: boolean;
  priority?: boolean;
}) {
  const cover = project.gallery[0];

  return (
    <article className="group">
      <Link href={workHref(locale, project.slug)} className="block">
        <ProjectMedia
          project={project}
          locale={locale}
          label={dict.work.imagePlaceholder}
          src={cover?.src}
          alt={cover?.alt[locale]}
          priority={priority}
          className={featured ? "aspect-[16/10]" : "aspect-[4/3]"}
        />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3
                className={cn(
                  "font-display font-bold tracking-[-0.03em]",
                  featured ? "text-display-sm" : "text-xl",
                )}
              >
                {project.title}
              </h3>
              {project.status === "concept" ? (
                <span className="border border-rule-strong px-2 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-graphite uppercase">
                  {dict.common.concept}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-graphite">{project.category[locale]}</p>
            {featured ? (
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-graphite">
                {project.summary[locale]}
              </p>
            ) : null}
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] sm:pt-1">
            <span className="link-underline">{dict.cta.readMore}</span>
            <Arrow />
          </span>
        </div>
      </Link>
    </article>
  );
}
