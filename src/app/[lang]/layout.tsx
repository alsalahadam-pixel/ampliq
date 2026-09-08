import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { Analytics } from "@/components/layout/analytics";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/navigation/header";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localeTags, locales } from "@/lib/i18n";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";

import "../globals.css";

/**
 * Archivo carries the headlines, Inter the body copy, JetBrains Mono the
 * labels and indices. Three faces, all variable and subset to latin, loaded
 * self-hosted by next/font so there is no layout shift and no request to
 * Google at runtime.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: "#0F0F0E",
  colorScheme: "light",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default:
        locale === "de"
          ? "AMPLIQ — Marketing- & Kreativagentur"
          : "AMPLIQ — Marketing & creative agency",
      template: "%s — AMPLIQ",
    },
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    formatDetection: { telephone: false },
  };
}

/**
 * Reveal runtime.
 *
 * Inline and framework-free: it runs before the page paints, so nothing
 * flashes, and it costs no hydration. If JavaScript never runs — or the
 * visitor prefers reduced motion — the `js` class is never added and every
 * element stays visible, which is why the CSS hides elements only under
 * `html.js`.
 */
const revealRuntime = `(function(){var d=document,r=d.documentElement;try{if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.classList.add('js');var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('is-revealed');io.unobserve(es[i].target);}}},{rootMargin:'0px 0px -8% 0px',threshold:0.05});var watch=function(el){if(el.__r)return;el.__r=1;io.observe(el);};var scan=function(n){if(!n||n.nodeType!==1&&n.nodeType!==9)return;if(n.matches&&n.matches('[data-reveal]'))watch(n);if(!n.querySelectorAll)return;var els=n.querySelectorAll('[data-reveal]');for(var i=0;i<els.length;i++)watch(els[i]);};scan(d);new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)scan(a[j]);}}).observe(d.documentElement,{childList:true,subtree:true});d.addEventListener('DOMContentLoaded',function(){scan(d);});window.addEventListener('load',function(){scan(d);});}catch(e){r.classList.remove('js');}})();`;

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html
      lang={localeTags[lang]}
      className={`${archivo.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: revealRuntime }} />

        <a
          href="#main"
          className="sr-only rounded-[2px] focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          {dict.common.skipToContent}
        </a>

        <Header locale={lang} dict={dict} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer locale={lang} dict={dict} />

        <JsonLd data={[organizationSchema(lang), websiteSchema(lang)]} />
        <Analytics />
      </body>
    </html>
  );
}
