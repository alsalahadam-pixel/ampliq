import type { Insight } from "@/content/types";

/**
 * Editorial articles. Written to be genuinely useful to a business owner
 * deciding how to spend a marketing budget — every price band stated here is
 * AMPLIQ's own, not a claim about the wider market.
 *
 * To publish a new article, add an entry here: the index page, the article
 * template, the sitemap and the Article schema all read from this file.
 */
export const insights: Insight[] = [
  {
    slug: "what-a-business-website-costs-in-germany",
    category: { en: "Websites", de: "Websites" },
    title: {
      en: "What does a business website cost in Germany?",
      de: "Was kostet eine Website für ein Unternehmen in Deutschland?",
    },
    excerpt: {
      en: "Quotes for the same brief range from a few hundred euros to five figures. Here's what actually drives the number — and how to tell which end you belong at.",
      de: "Angebote für dasselbe Briefing reichen von wenigen Hundert Euro bis fünfstellig. Was den Preis wirklich bestimmt — und woran Sie erkennen, wo Sie stehen.",
    },
    publishedAt: "2026-08-18",
    readingMinutes: 6,
    intro: {
      en: [
        "It's the first question almost every company asks, and the honest answer is unsatisfying: it depends. Not because agencies are being evasive, but because \"a website\" describes anything from a single page to a fifty-page site with a booking system behind it.",
        "What follows is how the number is actually built, so you can read a quote properly instead of comparing two totals that describe different projects.",
      ],
      de: [
        "Es ist die erste Frage fast jedes Unternehmens, und die ehrliche Antwort ist unbefriedigend: Es kommt darauf an. Nicht, weil Agenturen ausweichen, sondern weil „eine Website“ alles bezeichnet — von einer einzelnen Seite bis zu fünfzig Seiten mit Buchungssystem dahinter.",
        "Im Folgenden geht es darum, wie die Zahl tatsächlich entsteht. Damit Sie ein Angebot lesen können, statt zwei Summen zu vergleichen, die unterschiedliche Projekte beschreiben.",
      ],
    },
    sections: [
      {
        heading: {
          en: "What you're actually paying for",
          de: "Wofür Sie tatsächlich bezahlen",
        },
        paragraphs: {
          en: [
            "Design and code are the visible part, but they're rarely the majority of the work. On most projects the largest single cost is deciding what the site should say and in what order — the structure, the messaging and the content itself.",
            "That's why a client who arrives with finished text, real photography and a clear idea of their audience will always pay less than one who doesn't, for an identical-looking result.",
          ],
          de: [
            "Design und Code sind der sichtbare Teil, selten aber der größte. Bei den meisten Projekten ist der teuerste Einzelposten die Entscheidung darüber, was die Seite sagen soll und in welcher Reihenfolge — Struktur, Botschaft und die Inhalte selbst.",
            "Deshalb zahlt ein Kunde mit fertigen Texten, echten Bildern und einer klaren Vorstellung der Zielgruppe für ein optisch identisches Ergebnis immer weniger als einer ohne.",
          ],
        },
        bullets: {
          en: [
            "Structure and content strategy — often 30–40% of the effort",
            "Design of every template, at every breakpoint",
            "Development, testing and performance work",
            "Content: copy, photography, video",
            "Setup: hosting, analytics, search console, legal pages",
          ],
          de: [
            "Struktur und Inhaltsstrategie — oft 30–40 % des Aufwands",
            "Design jedes Templates, auf jedem Breakpoint",
            "Entwicklung, Tests und Performance-Arbeit",
            "Inhalte: Texte, Fotografie, Video",
            "Setup: Hosting, Analytics, Search Console, Rechtstexte",
          ],
        },
      },
      {
        heading: {
          en: "Three price bands, and who belongs in them",
          de: "Drei Preisklassen — und wer wo hingehört",
        },
        paragraphs: {
          en: [
            "These are our own bands rather than a market survey, but they map closely to what most serious providers in Germany quote.",
            "Below roughly €500 you are buying a template filled in with your logo. That's a legitimate choice for a business testing an idea — just don't expect it to differentiate you, and expect to replace it rather than extend it.",
            "Between €500 and €2,500 you get a focused, custom-built site: a handful of well-designed pages, your own content, proper technical setup. For most small and mid-sized companies this is the sensible band, and it covers the majority of what a visitor will ever see.",
            "Above €2,500 you're paying for depth: more templates, original photography and video, a brand system rather than a colour palette, and the strategy work that makes the site part of something larger. This is where a site starts doing marketing work rather than just existing.",
          ],
          de: [
            "Das sind unsere eigenen Bänder, keine Marktstudie — sie decken sich aber weitgehend mit dem, was seriöse Anbieter in Deutschland aufrufen.",
            "Unter rund 500 € kaufen Sie ein Template mit Ihrem Logo. Für ein Unternehmen, das eine Idee testet, ist das legitim — erwarten Sie nur keine Differenzierung, und rechnen Sie damit, es später zu ersetzen statt zu erweitern.",
            "Zwischen 500 € und 2.500 € entsteht eine fokussierte, individuell gebaute Seite: einige wenige, gut gestaltete Seiten, eigene Inhalte, sauberes technisches Setup. Für die meisten kleinen und mittleren Unternehmen ist das die sinnvolle Klasse — und sie deckt fast alles ab, was ein Besucher je zu sehen bekommt.",
            "Über 2.500 € bezahlen Sie Tiefe: mehr Templates, eigene Fotografie und Video, ein Markensystem statt einer Farbpalette und die Strategiearbeit, die die Seite zum Teil eines größeren Ganzen macht. Hier beginnt eine Website, Marketingarbeit zu leisten, statt nur zu existieren.",
          ],
        },
      },
      {
        heading: {
          en: "The costs that appear afterwards",
          de: "Die Kosten, die danach auftauchen",
        },
        paragraphs: {
          en: [
            "A quote that only covers build is incomplete. Ask about hosting and domain, ongoing updates and security, content changes after launch, and — in Germany specifically — who is responsible for the Impressum, privacy policy and cookie consent being legally correct.",
            "The last point catches people out. A developer can implement a consent banner; only a lawyer can tell you whether your privacy policy is adequate for the tools you're running.",
          ],
          de: [
            "Ein Angebot, das nur die Umsetzung abdeckt, ist unvollständig. Fragen Sie nach Hosting und Domain, laufenden Updates und Sicherheit, Inhaltsänderungen nach dem Launch — und in Deutschland ausdrücklich danach, wer dafür verantwortlich ist, dass Impressum, Datenschutzerklärung und Cookie-Einwilligung rechtlich tragen.",
            "Der letzte Punkt wird regelmäßig unterschätzt. Ein Entwickler kann ein Consent-Banner einbauen; ob Ihre Datenschutzerklärung zu den eingesetzten Tools passt, kann Ihnen nur ein Anwalt sagen.",
          ],
        },
      },
      {
        heading: {
          en: "How to compare two quotes properly",
          de: "Wie Sie zwei Angebote richtig vergleichen",
        },
        paragraphs: {
          en: [
            "Put the totals aside and compare scope line by line. How many unique templates? Who writes the content? Is photography included? How many feedback rounds? What happens if you want a change in month three?",
            "A cheaper quote is often cheaper because it excludes the two most expensive things — content and revisions — and those reappear as invoices later.",
          ],
          de: [
            "Legen Sie die Summen beiseite und vergleichen Sie den Umfang Zeile für Zeile. Wie viele eigenständige Templates? Wer schreibt die Inhalte? Ist Fotografie enthalten? Wie viele Feedbackrunden? Was passiert bei einer Änderung im dritten Monat?",
            "Ein günstigeres Angebot ist oft deshalb günstiger, weil es die zwei teuersten Dinge ausklammert — Inhalte und Korrekturschleifen. Beide kommen später als Rechnung zurück.",
          ],
        },
      },
    ],
    closing: {
      en: "If you want a straight estimate for your situation, describe the business and what the site has to achieve. We'll tell you which band you're in — including when the honest answer is that you need less than you asked for.",
      de: "Wenn Sie eine klare Einschätzung für Ihre Situation wollen, beschreiben Sie das Unternehmen und was die Seite leisten soll. Wir sagen Ihnen, in welcher Klasse Sie liegen — auch dann, wenn die ehrliche Antwort lautet, dass Sie weniger brauchen als gedacht.",
    },
    seo: {
      title: {
        en: "What does a business website cost in Germany? (2026 guide)",
        de: "Was kostet eine Website für ein Unternehmen in Deutschland?",
      },
      description: {
        en: "What actually drives website pricing in Germany: scope, content, templates and the costs that appear after launch — plus how to compare two quotes properly.",
        de: "Was den Website-Preis in Deutschland wirklich bestimmt: Umfang, Inhalte, Templates und die Kosten nach dem Launch — plus ein fairer Angebotsvergleich.",
      },
    },
  },

  {
    slug: "branding-is-more-than-a-logo",
    category: { en: "Branding", de: "Branding" },
    title: {
      en: "Why good branding is more than a logo",
      de: "Warum gutes Branding mehr ist als ein Logo",
    },
    excerpt: {
      en: "Companies buy a logo and wonder why nothing changed. Recognition comes from the system around it — and that's the part most businesses never commission.",
      de: "Unternehmen kaufen ein Logo und wundern sich, dass nichts passiert. Wiedererkennung entsteht aus dem System drumherum — genau dem Teil, den kaum jemand beauftragt.",
    },
    publishedAt: "2026-08-04",
    readingMinutes: 5,
    intro: {
      en: [
        "Cover the logo on any piece of communication from a strong brand and you can usually still name the company. That's not an accident, and it's not the logo doing the work.",
        "What you're recognising is the system: a typeface used consistently, a specific way of cropping images, a colour that appears in the same role every time, a tone of voice that doesn't change between a job ad and a product page.",
      ],
      de: [
        "Decken Sie bei einer starken Marke das Logo ab — meist erkennen Sie das Unternehmen trotzdem. Das ist kein Zufall, und es ist nicht das Logo, das die Arbeit macht.",
        "Was Sie erkennen, ist das System: eine konsequent eingesetzte Schrift, ein bestimmter Bildschnitt, eine Farbe, die immer dieselbe Rolle spielt, ein Ton, der zwischen Stellenanzeige und Produktseite nicht wechselt.",
      ],
    },
    sections: [
      {
        heading: {
          en: "What a logo can and can't do",
          de: "Was ein Logo kann — und was nicht",
        },
        paragraphs: {
          en: [
            "A logo is a marker. Its job is to be distinctive, legible at small sizes and usable everywhere from a favicon to a vehicle. That's a real job, and a bad logo genuinely costs you.",
            "But a logo can't make your proposal look like your website, stop your team building presentations from scratch, or tell a customer what kind of company you are. Those are system problems, and buying a nicer marker doesn't solve them.",
          ],
          de: [
            "Ein Logo ist eine Kennzeichnung. Seine Aufgabe ist es, unterscheidbar zu sein, in kleinen Größen lesbar zu bleiben und überall zu funktionieren — vom Favicon bis zur Fahrzeugbeschriftung. Das ist eine echte Aufgabe, und ein schlechtes Logo kostet tatsächlich.",
            "Ein Logo kann aber nicht dafür sorgen, dass Ihr Angebot wie Ihre Website aussieht, dass Ihr Team Präsentationen nicht jedes Mal neu baut oder dass ein Kunde versteht, was für ein Unternehmen Sie sind. Das sind Systemfragen — eine hübschere Kennzeichnung löst sie nicht.",
          ],
        },
      },
      {
        heading: {
          en: "The parts that actually create recognition",
          de: "Die Teile, die Wiedererkennung erzeugen",
        },
        paragraphs: {
          en: [
            "Recognition is repetition. Every element below has to be decided once and then repeated — that repetition, not novelty, is what makes a brand feel established.",
          ],
          de: [
            "Wiedererkennung entsteht durch Wiederholung. Jedes der folgenden Elemente wird einmal entschieden und dann wiederholt — genau diese Wiederholung, nicht Neuheit, lässt eine Marke etabliert wirken.",
          ],
        },
        bullets: {
          en: [
            "Typography — usually the single strongest recognition cue after colour",
            "A colour system with defined roles, not just a palette",
            "Layout and spacing rules that give everything the same rhythm",
            "Art direction: how photography is shot, cropped and treated",
            "Tone of voice, including what you never say",
            "Templates, so the system survives contact with everyday work",
          ],
          de: [
            "Typografie — nach der Farbe meist das stärkste Erkennungsmerkmal",
            "Ein Farbsystem mit definierten Rollen, nicht nur eine Palette",
            "Layout- und Abstandsregeln, die allem denselben Rhythmus geben",
            "Art Direction: wie fotografiert, geschnitten und bearbeitet wird",
            "Tonalität — einschließlich dessen, was Sie nie sagen",
            "Vorlagen, damit das System den Arbeitsalltag übersteht",
          ],
        },
      },
      {
        heading: {
          en: "Why brand guidelines usually fail",
          de: "Warum Brand Guidelines meist scheitern",
        },
        paragraphs: {
          en: [
            "Most guideline documents are written to be admired rather than used. Forty pages of philosophy, three pages of rules, and no answer to the question someone actually has at 4pm on a Thursday: what font do I use in this slide, and how big?",
            "A guideline that gets used is short, specific and paired with working templates. If following the rules is slower than ignoring them, they will be ignored — and no amount of internal communication changes that.",
          ],
          de: [
            "Die meisten Guideline-Dokumente sind zum Bewundern geschrieben, nicht zum Benutzen. Vierzig Seiten Philosophie, drei Seiten Regeln — und keine Antwort auf die Frage, die donnerstags um 16 Uhr wirklich ansteht: Welche Schrift nehme ich in dieser Folie, und wie groß?",
            "Guidelines, die genutzt werden, sind kurz, konkret und kommen mit fertigen Vorlagen. Wenn das Befolgen der Regeln länger dauert als das Ignorieren, werden sie ignoriert — daran ändert auch interne Kommunikation nichts.",
          ],
        },
      },
      {
        heading: {
          en: "Where to start if the budget is limited",
          de: "Womit anfangen, wenn das Budget begrenzt ist",
        },
        paragraphs: {
          en: [
            "Start with the things a customer sees most often, not with the things that feel most exciting to redesign. For most companies that's the website, the proposal document and whatever they send by email — in that order.",
            "Fix the typography and spacing across those three, apply one consistent image treatment, and you'll get most of the visible benefit of a rebrand for a fraction of the cost. The logo can wait.",
          ],
          de: [
            "Beginnen Sie bei dem, was Kunden am häufigsten sehen — nicht bei dem, was am meisten Lust auf Redesign macht. Für die meisten Unternehmen sind das die Website, das Angebotsdokument und was per E-Mail rausgeht, in dieser Reihenfolge.",
            "Bringen Sie Typografie und Abstände in diesen drei Dingen in Ordnung und wenden Sie eine einheitliche Bildbehandlung an: Damit erreichen Sie den größten Teil der sichtbaren Wirkung eines Rebrands zu einem Bruchteil der Kosten. Das Logo kann warten.",
          ],
        },
      },
    ],
    closing: {
      en: "If your brand looks different in every document, the fix is usually a system rather than a redesign. That's a smaller, cheaper piece of work than most companies expect.",
      de: "Wenn Ihre Marke in jedem Dokument anders aussieht, ist die Lösung meist ein System und kein Redesign. Das ist ein kleineres und günstigeres Projekt, als die meisten erwarten.",
    },
    seo: {
      title: {
        en: "Why good branding is more than a logo",
        de: "Warum gutes Branding mehr ist als ein Logo",
      },
      description: {
        en: "Recognition comes from typography, colour roles, layout rules and art direction — not the mark. What actually creates a consistent brand, and where to start on a small budget.",
        de: "Wiedererkennung entsteht durch Typografie, Farbrollen, Layoutregeln und Art Direction — nicht durch das Logo. Was eine konsistente Marke ausmacht und wo man mit kleinem Budget beginnt.",
      },
    },
  },

  {
    slug: "website-redesign-mistakes",
    category: { en: "Websites", de: "Websites" },
    title: {
      en: "Website redesign: the mistakes that cost companies customers",
      de: "Website-Redesign: Diese Fehler kosten Unternehmen Kunden",
    },
    excerpt: {
      en: "A redesign is one of the few marketing projects that can leave you measurably worse off. Here are the five ways it usually happens.",
      de: "Ein Redesign gehört zu den wenigen Marketingprojekten, die messbar schaden können. Fünf Wege, wie das üblicherweise passiert.",
    },
    publishedAt: "2026-07-21",
    readingMinutes: 6,
    intro: {
      en: [
        "New sites usually look better than the ones they replace. That's the easy part, and it's why redesign projects are rarely judged honestly until the numbers come in three months later.",
        "The failure modes below are common, expensive and almost entirely preventable — but only before launch.",
      ],
      de: [
        "Neue Seiten sehen fast immer besser aus als ihre Vorgänger. Das ist der einfache Teil — und der Grund, warum Redesigns selten ehrlich bewertet werden, bis drei Monate später die Zahlen kommen.",
        "Die folgenden Fehler sind häufig, teuer und fast vollständig vermeidbar — aber nur vor dem Launch.",
      ],
    },
    sections: [
      {
        heading: {
          en: "1. Throwing away the URLs",
          de: "1. Die URLs wegwerfen",
        },
        paragraphs: {
          en: [
            "This is the big one. Every page that ranked, every link another site pointed at you, every bookmark — all of it hangs off a URL. Change the structure without a redirect map and you don't just lose the ranking, you lose the accumulated credibility behind it.",
            "The fix is unglamorous: export every existing URL before the rebuild, decide where each one points afterwards, and implement permanent redirects at launch. Not the week after.",
          ],
          de: [
            "Der große Fehler. Jede rankende Seite, jeder Link von außen, jedes Lesezeichen hängt an einer URL. Wer die Struktur ohne Weiterleitungskarte ändert, verliert nicht nur das Ranking, sondern die aufgebaute Glaubwürdigkeit dahinter.",
            "Die Lösung ist unspektakulär: alle bestehenden URLs vor dem Neuaufbau exportieren, für jede entscheiden, wohin sie künftig zeigt, und die dauerhaften Weiterleitungen zum Launch einrichten. Nicht in der Woche danach.",
          ],
        },
      },
      {
        heading: {
          en: "2. Deleting the pages that quietly worked",
          de: "2. Die Seiten löschen, die still funktioniert haben",
        },
        paragraphs: {
          en: [
            "Redesigns are usually driven by how the site looks, so the decision about what to keep gets made on aesthetic grounds. An old, ugly page that brings in steady search traffic gets cut because it doesn't fit the new design.",
            "Before deciding anything, pull twelve months of analytics and sort pages by entries and conversions. Anything in the top twenty gets rebuilt, not removed — however dated it looks.",
          ],
          de: [
            "Redesigns entstehen meist aus dem Blick auf die Optik — entsprechend ästhetisch fällt die Entscheidung, was bleibt. Eine alte, hässliche Seite mit konstantem Suchtraffic fliegt raus, weil sie nicht ins neue Design passt.",
            "Ziehen Sie vor jeder Entscheidung zwölf Monate Analytics und sortieren Sie nach Einstiegen und Conversions. Was in den Top zwanzig steht, wird neu gebaut, nicht gelöscht — egal wie alt es aussieht.",
          ],
        },
      },
      {
        heading: {
          en: "3. Making it slower",
          de: "3. Die Seite langsamer machen",
        },
        paragraphs: {
          en: [
            "New sites often arrive heavier: large hero images, a video background, animation libraries, three tracking scripts. On a good office connection nobody notices. On a phone on mobile data, the visitor leaves before the page renders.",
            "Set a performance budget before design starts and treat it as a requirement, not an optimisation to attempt later.",
          ],
          de: [
            "Neue Seiten kommen oft schwerer daher: große Bildflächen, Video im Hintergrund, Animationsbibliotheken, drei Tracking-Skripte. Im Büro mit gutem Netz fällt das nicht auf. Auf dem Handy im Mobilfunknetz ist der Besucher weg, bevor die Seite erscheint.",
            "Legen Sie ein Performance-Budget vor dem Design fest und behandeln Sie es als Anforderung — nicht als Optimierung, die man später versucht.",
          ],
        },
      },
      {
        heading: {
          en: "4. Designing for the homepage",
          de: "4. Für die Startseite gestalten",
        },
        paragraphs: {
          en: [
            "Everyone reviews the homepage. Meanwhile, most visitors from search land on a service or product page, and a good share never see the homepage at all.",
            "Design the pages people actually arrive on with the same care — including a clear next step on each one, because a visitor who lands deep in the site shouldn't have to navigate back to the top to find out how to get in touch.",
          ],
          de: [
            "Alle begutachten die Startseite. Gleichzeitig landen die meisten Besucher aus der Suche auf einer Leistungs- oder Produktseite — und ein erheblicher Teil sieht die Startseite nie.",
            "Gestalten Sie die tatsächlichen Einstiegsseiten mit derselben Sorgfalt, inklusive klarem nächsten Schritt auf jeder Seite. Wer tief einsteigt, sollte nicht erst nach oben navigieren müssen, um zu erfahren, wie man Kontakt aufnimmt.",
          ],
        },
      },
      {
        heading: {
          en: "5. Launching without measurement in place",
          de: "5. Ohne Messung launchen",
        },
        paragraphs: {
          en: [
            "If tracking is rebuilt at the same time as the site, and events are named differently, you lose the ability to compare before and after. Six months later nobody can say whether the redesign helped.",
            "Keep the old measurement running until the new one is verified, and write down what you expect to improve — enquiries, not pageviews — before launch day.",
          ],
          de: [
            "Wird das Tracking gleichzeitig mit der Seite neu aufgesetzt und werden Events anders benannt, verlieren Sie die Vergleichbarkeit. Ein halbes Jahr später kann niemand sagen, ob das Redesign geholfen hat.",
            "Lassen Sie die alte Messung laufen, bis die neue verifiziert ist, und halten Sie vor dem Launch schriftlich fest, was sich verbessern soll — Anfragen, nicht Seitenaufrufe.",
          ],
        },
      },
    ],
    closing: {
      en: "A redesign should be judged on enquiries three months later, not on how it looks in the launch email. If you're planning one, the audit is the cheapest part and the one that decides everything else.",
      de: "Ein Redesign wird an den Anfragen drei Monate später gemessen, nicht am Eindruck in der Launch-Mail. Wenn Sie eines planen: Das Audit ist der günstigste Teil — und der, der über alles andere entscheidet.",
    },
    seo: {
      title: {
        en: "Website redesign mistakes that cost companies customers",
        de: "Website-Redesign: Fehler, die Unternehmen Kunden kosten",
      },
      description: {
        en: "Five preventable redesign failures: lost URLs, deleted pages that worked, slower load times, homepage-only thinking and missing measurement.",
        de: "Fünf vermeidbare Redesign-Fehler: verlorene URLs, gelöschte funktionierende Seiten, längere Ladezeiten, Startseiten-Fokus und fehlende Messung.",
      },
    },
  },
];

export const insightBySlug = Object.fromEntries(
  insights.map((insight) => [insight.slug, insight]),
);

export const sortedInsights = [...insights].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);
