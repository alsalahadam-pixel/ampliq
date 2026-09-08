"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { href, route } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

function useNavItems(locale: Locale, dict: Dictionary): NavItem[] {
  return [
    { label: dict.nav.work, href: route(locale, "work") },
    { label: dict.nav.services, href: route(locale, "services") },
    { label: dict.nav.packages, href: route(locale, "packages") },
    { label: dict.nav.about, href: route(locale, "about") },
    { label: dict.nav.insights, href: route(locale, "insights") },
  ];
}

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const items = useNavItems(locale, dict);

  // Any navigation closes the menu. Adjusting state during render (rather than
  // in an effect) also covers back/forward navigation, and avoids rendering the
  // open menu for a frame after the route has already changed.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Solid header once the visitor leaves the hero.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const isActive = useCallback(
    (target: string) => pathname === target || pathname.startsWith(`${target}/`),
    [pathname],
  );

  const solid = scrolled && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
          solid
            ? "border-b border-rule bg-paper/90 text-ink backdrop-blur-md"
            : "border-b border-transparent text-paper",
          !solid && "on-dark",
        )}
      >
        <div className="shell flex h-18 items-center justify-between gap-6 lg:h-22">
          <Link
            href={href(locale)}
            className="shrink-0 transition-opacity duration-200 hover:opacity-70"
            aria-label="AMPLIQ — home"
          >
            <Logo className="text-[1.125rem] lg:text-[1.3125rem]" />
          </Link>

          <nav aria-label={dict.nav.primary} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "link-underline text-[0.9375rem] tracking-[-0.01em] transition-opacity duration-200",
                      isActive(item.href) ? "opacity-100" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <LanguageSwitcher locale={locale} label={dict.nav.language} />
            <span
              aria-hidden="true"
              className={cn("h-5 w-px", solid ? "bg-rule-strong" : "bg-white/25")}
            />
            <ButtonLink
              href={route(locale, "contact")}
              variant={solid ? "primary" : "outline"}
              tone={solid ? "light" : "dark"}
              className="h-11 px-5 text-sm"
            >
              {dict.cta.start}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex items-center gap-2.5 p-2 lg:hidden"
          >
            <span className="eyebrow">{open ? dict.nav.close : dict.nav.menu}</span>
            <MenuGlyph open={open} />
          </button>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        locale={locale}
        dict={dict}
        isActive={isActive}
      />
    </>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span
        className={cn(
          "absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "top-1/2 rotate-45" : "top-1",
        )}
      />
      <span
        className={cn(
          "absolute left-0 block h-px bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "top-1/2 w-full -rotate-45" : "top-[11px] w-3/5",
        )}
      />
    </span>
  );
}

/**
 * Full-screen menu. Not a dropdown: on mobile the navigation gets the same
 * typographic treatment as the rest of the site.
 */
function MobileMenu({
  open,
  onClose,
  items,
  locale,
  dict,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  locale: Locale;
  dict: Dictionary;
  isActive: (href: string) => boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={dict.nav.menu}
      className="on-dark fixed inset-0 z-40 flex flex-col bg-ink text-paper lg:hidden"
    >
      <div className="shell flex min-h-0 flex-1 flex-col justify-between pt-24 pb-10">
        <nav aria-label={dict.nav.primary} className="min-h-0 overflow-y-auto">
          <ul className="flex flex-col">
            {items.map((item, index) => (
              <li key={item.href} className="border-b border-white/10">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-5"
                >
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-fog">
                    0{index + 1}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[2rem] leading-none font-semibold tracking-[-0.03em]",
                      isActive(item.href) ? "text-paper" : "text-paper/85",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-8 pt-10">
          <ButtonLink
            href={route(locale, "contact")}
            variant="primary"
            tone="dark"
            className="w-full"
          >
            {dict.cta.start}
          </ButtonLink>
          <div className="flex items-center justify-between">
            <LanguageSwitcher locale={locale} label={dict.nav.language} size="lg" />
            <Logo variant="disc" className="h-6 w-6 text-paper/40" title="AMPLIQ" />
          </div>
        </div>
      </div>
    </div>
  );
}
