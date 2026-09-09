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
