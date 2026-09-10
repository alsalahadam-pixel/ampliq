import type { Service } from "@/content/types";

/**
 * The service catalogue. One entry renders one page at /[lang]/services/[slug]
 * plus its card in the index and its Service schema — so adding a discipline is
 * a data change, never a new template.
 */
export const services: Service[] = [
  {
    slug: "web-design",
    pillar: "build",
    title: { en: "Web design", de: "Webdesign" },
    tagline: {
      en: "A website that earns the enquiry",
      de: "Eine Website, die zur Anfrage führt",
    },
    summary: {
      en: "Custom websites designed around what a buyer needs to decide — then built to load fast and stay easy to update.",
      de: "Individuelle Websites, gebaut um das, was Interessenten zur Entscheidung brauchen — schnell geladen und einfach zu pflegen.",
    },
    problem: {
      en: "Most business websites are built around the org chart instead of the buyer. Everything is technically present, nothing is persuasive, and the enquiry form sits at the end of a page nobody finishes reading.",
      de: "Die meisten Unternehmenswebsites sind nach dem Organigramm gebaut, nicht nach dem Kunden. Alles ist irgendwo vorhanden, überzeugend ist nichts — und das Kontaktformular steht am Ende einer Seite, die niemand zu Ende liest.",
    },
    solution: {
      en: "We start with the decision your visitor is trying to make and design the page order around it: what you do, who it's for, proof, scope, price signal, next step. Then we build it as a fast, accessible site you can actually maintain.",
      de: "Wir starten bei der Entscheidung, die Ihr Besucher treffen will, und bauen die Seitenreihenfolge darum: Was Sie tun, für wen, welcher Beleg, welcher Umfang, welches Preissignal, welcher nächste Schritt. Daraus entsteht eine schnelle, barrierearme Website, die Sie selbst pflegen können.",
    },
    deliverables: {
      en: [
        "Sitemap and page-by-page content structure",
        "Design system: type scale, colour, spacing, components",
        "Desktop, tablet and mobile designs for every template",
        "Copy direction, or full copywriting where needed",
        "Development, responsive build and performance tuning",
        "Handover with an editing guide and analytics wired up",
      ],
      de: [
        "Sitemap und Inhaltsstruktur Seite für Seite",
        "Designsystem: Typografie, Farbe, Abstände, Komponenten",
        "Designs für Desktop, Tablet und Mobil für jedes Template",
        "Textrichtung oder vollständiges Copywriting",
        "Entwicklung, responsiver Aufbau und Performance-Feinschliff",
        "Übergabe inklusive Redaktionsanleitung und Analytics",
      ],
    },
    process: [
      {
        title: { en: "Structure", de: "Struktur" },
        body: {
          en: "Goals, audience and the decision path — agreed before a single layout exists.",
          de: "Ziele, Zielgruppe und Entscheidungsweg — abgestimmt, bevor das erste Layout entsteht.",
        },
      },
      {
        title: { en: "Design", de: "Design" },
        body: {
          en: "Key templates first, in full detail, so you approve the real thing rather than a mood board.",
          de: "Zuerst die Kern-Templates in voller Ausarbeitung — Sie beurteilen das Ergebnis, kein Moodboard.",
        },
      },
      {
        title: { en: "Build", de: "Umsetzung" },
        body: {
          en: "Responsive development, accessibility and Core Web Vitals handled as part of the build.",
          de: "Responsive Entwicklung, Barrierefreiheit und Core Web Vitals sind Teil der Umsetzung.",
        },
      },
      {
        title: { en: "Launch", de: "Launch" },
        body: {
          en: "Testing, redirects, tracking, then a walkthrough so your team can run it.",
          de: "Tests, Weiterleitungen, Tracking und eine Einweisung, damit Ihr Team übernehmen kann.",
        },
      },
    ],
    useCases: {
      en: [
        "A company whose website no longer matches the quality of its work",
        "A business that gets traffic but almost no enquiries",
        "A new brand that needs a credible first site, quickly",
      ],
      de: [
        "Ein Unternehmen, dessen Website nicht mehr zur Qualität der Arbeit passt",
        "Ein Betrieb mit Besuchern, aber kaum Anfragen",
        "Eine neue Marke, die schnell einen glaubwürdigen Auftritt braucht",
      ],
    },
    faqs: [
      {
        question: {
          en: "How long does a website take?",
          de: "Wie lange dauert eine Website?",
        },
        answer: {
          en: "A focused site is typically three to six weeks; a larger multi-template site runs longer. The variable is almost never design — it's how quickly content and feedback come back.",
          de: "Eine fokussierte Website dauert meist drei bis sechs Wochen, größere Seiten mit vielen Templates länger. Der Engpass ist fast nie das Design, sondern wie schnell Inhalte und Feedback zurückkommen.",
        },
      },
      {
        question: {
          en: "Can we edit the site ourselves afterwards?",
          de: "Können wir die Seite später selbst pflegen?",
        },
        answer: {
          en: "Yes. We agree up front which parts your team needs to change regularly and make exactly those editable, rather than handing over a system where everything is technically possible and nothing is obvious.",
          de: "Ja. Wir legen vorab fest, welche Bereiche Sie regelmäßig ändern, und machen genau die editierbar — statt ein System zu übergeben, in dem alles möglich und nichts naheliegend ist.",
        },
      },
      {
        question: {
          en: "Do you write the content too?",
          de: "Schreiben Sie auch die Texte?",
        },
        answer: {
          en: "We can. Many clients supply raw material and we shape it; others hand the whole thing over. Either way the structure comes first, because content written into a fixed layout is always worse.",
          de: "Können wir. Viele Kunden liefern Rohmaterial, das wir schärfen, andere geben es komplett ab. In beiden Fällen kommt die Struktur zuerst — Text, der in ein fertiges Layout gepresst wird, ist immer schlechter.",
        },
      },
    ],
    related: ["website-redesign", "branding", "seo"],
    seo: {
      title: {
        en: "Web design for companies in Germany",
        de: "Webdesign für Unternehmen in Deutschland",
      },
      description: {
        en: "Custom web design built around the buyer's decision: clear structure, fast pages and a route to enquiry. Designed and developed by AMPLIQ.",
        de: "Individuelles Webdesign, gebaut um die Kundenentscheidung: klare Struktur, schnelle Seiten, klarer Weg zur Anfrage. Design und Entwicklung von AMPLIQ.",
      },
    },
  },

  {
    slug: "website-redesign",
    pillar: "build",
    title: { en: "Website redesign", de: "Website-Redesign" },
    tagline: {
      en: "Keep what works, fix what costs you",
      de: "Behalten, was funktioniert. Ändern, was kostet",
    },
    summary: {
      en: "A redesign that starts with evidence — what people actually do on your site — rather than with a new colour palette.",
      de: "Ein Redesign, das mit Fakten beginnt — was Menschen auf Ihrer Seite tatsächlich tun — und nicht mit einer neuen Farbpalette.",
    },
    problem: {
      en: "Redesigns often throw away the parts that were quietly working. Rankings drop, familiar paths disappear, and six months later the numbers are worse than before — with a prettier site.",
      de: "Redesigns werfen oft genau das weg, was still funktioniert hat. Rankings brechen ein, gewohnte Wege verschwinden, und ein halbes Jahr später sind die Zahlen schlechter als vorher — bei hübscherer Seite.",
    },
    solution: {
      en: "We audit first: which pages bring traffic, where people drop out, which URLs carry ranking. Then we redesign around those findings and migrate carefully, with redirects mapped before launch, not after.",
      de: "Wir prüfen zuerst: Welche Seiten bringen Traffic, wo springen Menschen ab, welche URLs tragen Rankings. Danach gestalten wir entlang dieser Erkenntnisse und migrieren sauber — Weiterleitungen stehen vor dem Launch, nicht danach.",
    },
    deliverables: {
      en: [
        "Audit of content, traffic, conversion paths and technical health",
        "Prioritised list of what to keep, cut and rebuild",
        "New design system and templates",
        "Full redirect map and migration plan",
        "Rebuild with performance and accessibility fixes",
        "Post-launch check on rankings, speed and conversion",
      ],
      de: [
        "Audit von Inhalten, Traffic, Conversion-Wegen und Technik",
        "Priorisierte Liste: behalten, streichen, neu bauen",
        "Neues Designsystem und neue Templates",
        "Vollständige Weiterleitungskarte und Migrationsplan",
        "Neuaufbau inklusive Performance- und Barrierefreiheitsfixes",
        "Kontrolle nach dem Launch: Rankings, Ladezeit, Conversion",
      ],
    },
    process: [
      {
        title: { en: "Audit", de: "Audit" },
        body: {
          en: "Analytics, search data and a page-by-page review of what the current site earns.",
          de: "Analytics, Suchdaten und eine seitenweise Bewertung dessen, was die Seite heute leistet.",
        },
      },
      {
        title: { en: "Decide", de: "Entscheiden" },
        body: {
          en: "An explicit keep/cut/rebuild decision per page, agreed with you before design starts.",
          de: "Pro Seite eine klare Entscheidung: behalten, streichen, neu bauen — abgestimmt vor dem Design.",
        },
      },
      {
        title: { en: "Redesign", de: "Redesign" },
        body: {
          en: "New structure and design applied to the templates that actually carry the business.",
          de: "Neue Struktur und neues Design für die Templates, die das Geschäft tatsächlich tragen.",
        },
      },
      {
        title: { en: "Migrate", de: "Migration" },
        body: {
          en: "Redirects, tracking parity and a staged launch so nothing disappears silently.",
          de: "Weiterleitungen, gleiche Messung und ein stufenweiser Launch, damit nichts still verschwindet.",
        },
      },
    ],
    useCases: {
      en: [
        "A site that looks dated but still brings in search traffic worth protecting",
        "A business that has outgrown a template bought years ago",
        "A merger or repositioning that leaves the old site telling the wrong story",
      ],
      de: [
        "Eine Seite, die alt aussieht, aber weiterhin wertvollen Suchtraffic bringt",
        "Ein Unternehmen, dem ein vor Jahren gekauftes Template zu klein geworden ist",
        "Eine Neuausrichtung, nach der die alte Seite die falsche Geschichte erzählt",
      ],
    },
    faqs: [
      {
        question: {
          en: "Will we lose our Google rankings?",
          de: "Verlieren wir unsere Google-Rankings?",
        },
        answer: {
          en: "Not if the migration is done properly. Ranking loss after a redesign is nearly always caused by unmapped URLs, removed content or a slower site — all avoidable, and all planned for before launch.",
          de: "Nicht bei sauberer Migration. Rankingverluste nach einem Redesign entstehen fast immer durch nicht weitergeleitete URLs, gelöschte Inhalte oder eine langsamere Seite — alles vermeidbar und vorab eingeplant.",
        },
      },
      {
        question: {
          en: "Is a redesign cheaper than a new site?",
          de: "Ist ein Redesign günstiger als eine neue Website?",
        },
        answer: {
          en: "Sometimes, but not automatically. If the structure and platform are sound, a redesign is faster. If the foundations are the problem, rebuilding is usually cheaper than working around them.",
          de: "Manchmal, aber nicht automatisch. Sind Struktur und Plattform in Ordnung, geht ein Redesign schneller. Liegt das Problem im Fundament, ist ein Neuaufbau meist günstiger als jeder Umweg.",
        },
      },
      {
        question: {
          en: "Can you work with our existing platform?",
          de: "Können Sie mit unserem bestehenden System arbeiten?",
        },
        answer: {
          en: "Usually yes. We'll tell you honestly if the platform is the thing holding the site back, and what a move would actually involve, before you commit to anything.",
          de: "In der Regel ja. Wenn das System selbst die Bremse ist, sagen wir das offen — inklusive dessen, was ein Wechsel wirklich bedeutet, bevor Sie sich festlegen.",
        },
      },
    ],
    related: ["web-design", "seo", "graphic-design"],
    seo: {
      title: {
        en: "Website redesign without losing what works",
        de: "Website-Redesign ohne Verluste",
      },
      description: {
        en: "Evidence-led website redesign: audit first, keep the pages that earn, migrate with a full redirect map. Redesign and rebuild by AMPLIQ.",
        de: "Website-Redesign auf Datenbasis: erst Audit, wertvolle Seiten erhalten, saubere Migration mit vollständigen Weiterleitungen. Von AMPLIQ.",
      },
    },
  },

  {
    slug: "branding",
    pillar: "create",
    title: { en: "Branding", de: "Branding" },
    tagline: {
      en: "A brand people can recognise twice",
      de: "Eine Marke, die man zweimal wiedererkennt",
    },
    summary: {
      en: "Positioning, voice and the visual system that carries them — so every touchpoint looks like it came from the same company.",
      de: "Positionierung, Tonalität und das visuelle System dahinter — damit jeder Kontaktpunkt nach demselben Unternehmen aussieht.",
    },
    problem: {
      en: "A logo is not a brand. Without a defined position and a system to apply it, every new document, ad and post drifts a little further, and the company ends up looking smaller and less certain than it is.",
      de: "Ein Logo ist keine Marke. Ohne definierte Position und ein System zur Anwendung driftet jedes neue Dokument, jede Anzeige, jeder Post ein Stück weiter — und das Unternehmen wirkt kleiner und unsicherer, als es ist.",
    },
    solution: {
      en: "We define what you stand for, who it's for and how you sound, then build the visual system that makes it repeatable — with rules clear enough that people who aren't designers can follow them.",
      de: "Wir definieren, wofür Sie stehen, für wen und wie Sie klingen — und bauen das visuelle System, das es wiederholbar macht. Mit Regeln, die auch Nicht-Designer anwenden können.",
    },
    deliverables: {
      en: [
        "Positioning: what you do, for whom, and why it's different",
        "Messaging framework and tone of voice",
        "Logo system and brand mark applications",
        "Colour, typography and layout principles",
        "Brand guidelines as a usable document, not a poster",
        "Core templates so the system survives contact with daily work",
      ],
      de: [
        "Positionierung: was Sie tun, für wen und warum anders",
        "Botschaftsgerüst und Tonalität",
        "Logosystem und Anwendungen der Bildmarke",
        "Farbe, Typografie und Layoutprinzipien",
        "Brand Guidelines als nutzbares Dokument, nicht als Poster",
        "Basisvorlagen, damit das System den Arbeitsalltag übersteht",
      ],
    },
    process: [
      {
        title: { en: "Interrogate", de: "Verstehen" },
        body: {
          en: "Interviews, competitor review and a hard look at how you're currently understood.",
          de: "Gespräche, Wettbewerbsanalyse und ein ehrlicher Blick darauf, wie man Sie heute versteht.",
        },
      },
      {
        title: { en: "Position", de: "Positionieren" },
        body: {
          en: "A written position and message hierarchy, agreed before anything is drawn.",
          de: "Schriftliche Position und Botschaftshierarchie — abgestimmt, bevor gezeichnet wird.",
        },
      },
      {
        title: { en: "Design", de: "Gestalten" },
        body: {
          en: "One considered direction, developed properly, rather than three half-built options.",
          de: "Eine durchdachte Richtung, sauber ausgearbeitet — statt drei halbfertiger Optionen.",
        },
      },
      {
        title: { en: "Systemise", de: "Systematisieren" },
        body: {
          en: "Guidelines, templates and the assets your team needs on a Monday morning.",
          de: "Guidelines, Vorlagen und die Assets, die Ihr Team am Montagmorgen braucht.",
        },
      },
    ],
    useCases: {
      en: [
        "A company that has grown past the identity it started with",
        "A business that looks different in every document and channel",
        "A new venture that needs to look established from day one",
      ],
      de: [
        "Ein Unternehmen, das seiner ursprünglichen Identität entwachsen ist",
        "Ein Betrieb, der in jedem Dokument und Kanal anders aussieht",
        "Eine Neugründung, die vom ersten Tag an etabliert wirken muss",
      ],
    },
    faqs: [
      {
        question: {
          en: "Do we need a full rebrand, or just a tidy-up?",
          de: "Brauchen wir einen kompletten Rebrand oder nur Aufräumen?",
        },
        answer: {
          en: "Often a tidy-up. If the name and position still fit and only the execution has drifted, a refreshed system costs a fraction of a rebrand and gets most of the benefit.",
          de: "Oft reicht Aufräumen. Wenn Name und Position weiterhin passen und nur die Umsetzung verwildert ist, kostet ein aufgeräumtes System einen Bruchteil und bringt den größten Teil des Effekts.",
        },
      },
      {
        question: {
          en: "How many logo options do we get?",
          de: "Wie viele Logo-Varianten bekommen wir?",
        },
        answer: {
          en: "One direction, worked out properly, with variants for real situations — sizes, backgrounds, formats. Presenting five directions mostly proves that four of them weren't believed in.",
          de: "Eine Richtung, sauber ausgearbeitet, mit Varianten für reale Situationen: Größen, Hintergründe, Formate. Fünf Richtungen zeigen meist vor allem, dass an vieren niemand geglaubt hat.",
        },
      },
      {
        question: {
          en: "Will this work for a company as small as ours?",
          de: "Funktioniert das auch für ein kleines Unternehmen?",
        },
        answer: {
          en: "Smaller companies benefit most. When there's no marketing department to hold things together, a simple system is what keeps the brand consistent.",
          de: "Gerade kleine Unternehmen profitieren. Wenn keine Marketingabteilung alles zusammenhält, sorgt ein einfaches System für Konsistenz.",
        },
      },
    ],
    related: ["visual-identity", "graphic-design", "web-design"],
    seo: {
      title: {
        en: "Branding for companies outgrowing their identity",
        de: "Branding für Unternehmen im Wachstum",
      },
      description: {
        en: "Positioning, messaging and a visual system your team can actually apply. Branding and brand guidelines by AMPLIQ.",
        de: "Positionierung, Botschaften und ein visuelles System, das Ihr Team anwenden kann. Branding und Brand Guidelines von AMPLIQ.",
      },
    },
  },

  {
    slug: "visual-identity",
    pillar: "create",
    title: { en: "Visual identity", de: "Visual Identity" },
    tagline: {
      en: "The system behind the logo",
      de: "Das System hinter dem Logo",
    },
    summary: {
      en: "Type, colour, layout, imagery and motion defined as one coherent system — the part that makes a brand recognisable at a glance.",
      de: "Typografie, Farbe, Layout, Bildsprache und Motion als ein zusammenhängendes System — der Teil, der eine Marke auf einen Blick erkennbar macht.",
    },
    problem: {
      en: "Companies invest in a logo and then improvise everything around it. Recognition comes from the system — the type, the spacing, the way images are cropped — far more than from the mark itself.",
      de: "Unternehmen investieren in ein Logo und improvisieren alles drumherum. Wiedererkennung entsteht aber aus dem System — Schrift, Abstände, Bildschnitt — weit mehr als aus der Marke selbst.",
    },
    solution: {
      en: "We define the elements that repeat and the rules that hold them together, then prove the system on real applications rather than on abstract example boards.",
      de: "Wir definieren die wiederkehrenden Elemente und die Regeln dahinter — und weisen das System an echten Anwendungen nach, nicht an abstrakten Beispielseiten.",
    },
    deliverables: {
      en: [
        "Typographic system with a defined hierarchy and scale",
        "Colour system including accessible contrast pairings",
        "Grid, spacing and layout principles",
        "Art direction for photography and illustration",
        "Iconography and graphic devices",
        "Applied examples across print, web and social",
      ],
      de: [
        "Typografisches System mit definierter Hierarchie und Skala",
        "Farbsystem inklusive barrierefreier Kontrastpaare",
        "Raster-, Abstands- und Layoutprinzipien",
        "Art Direction für Fotografie und Illustration",
        "Icons und grafische Elemente",
        "Angewendete Beispiele für Print, Web und Social",
      ],
    },
    process: [
      {
        title: { en: "Audit", de: "Bestandsaufnahme" },
        body: {
          en: "What already exists, what's worth keeping, and where the inconsistency actually comes from.",
          de: "Was vorhanden ist, was bleiben sollte und woher die Uneinheitlichkeit wirklich kommt.",
        },
      },
      {
        title: { en: "Define", de: "Definieren" },
        body: {
          en: "The core elements: type, colour, grid, image treatment.",
          de: "Die Kernelemente: Schrift, Farbe, Raster, Bildbehandlung.",
        },
      },
      {
        title: { en: "Apply", de: "Anwenden" },
        body: {
          en: "The system tested on the formats you actually produce most often.",
          de: "Das System an den Formaten getestet, die Sie am häufigsten produzieren.",
        },
      },
      {
        title: { en: "Document", de: "Dokumentieren" },
        body: {
          en: "Rules written so a non-designer can apply them without asking.",
          de: "Regeln so geschrieben, dass auch Nicht-Designer sie ohne Rückfrage anwenden.",
        },
      },
    ],
    useCases: {
      en: [
        "A brand with a good logo and inconsistent everything else",
        "A team producing their own materials without a system to follow",
        "A company preparing for a website or campaign that needs a foundation first",
      ],
      de: [
        "Eine Marke mit gutem Logo und uneinheitlichem Rest",
        "Ein Team, das eigene Materialien ohne System erstellt",
        "Ein Unternehmen vor Website oder Kampagne, dem das Fundament fehlt",
      ],
    },
    faqs: [
      {
        question: {
          en: "How is this different from branding?",
          de: "Was ist der Unterschied zum Branding?",
        },
        answer: {
          en: "Branding includes the strategic part — position, audience, message. Visual identity is the design system that expresses it. If your position is already clear, you may only need this.",
          de: "Branding umfasst den strategischen Teil: Position, Zielgruppe, Botschaft. Visual Identity ist das Designsystem, das ihn ausdrückt. Ist Ihre Position klar, brauchen Sie unter Umständen nur diesen Teil.",
        },
      },
      {
        question: {
          en: "Do we get the source files?",
          de: "Bekommen wir die Quelldateien?",
        },
        answer: {
          en: "Yes. Every asset we produce is handed over in editable and export formats, and it's yours. No hostage files.",
          de: "Ja. Alle Assets werden in bearbeitbaren und exportierten Formaten übergeben und gehören Ihnen. Keine Dateien als Druckmittel.",
        },
      },
      {
        question: {
          en: "Can you work with our existing colours?",
          de: "Können Sie mit unseren bestehenden Farben arbeiten?",
        },
        answer: {
          en: "Often yes, sometimes with adjustments — many long-standing brand colours fail accessibility contrast requirements and need a tuned variant for digital use.",
          de: "Meist ja, teils mit Anpassungen: Viele gewachsene Markenfarben erfüllen die Kontrastanforderungen nicht und brauchen für digitale Anwendungen eine abgestimmte Variante.",
        },
      },
    ],
    related: ["branding", "graphic-design", "photography"],
    seo: {
      title: {
        en: "Visual identity systems that stay consistent",
        de: "Visual-Identity-Systeme, die konsistent bleiben",
      },
      description: {
        en: "Type, colour, grid and art direction defined as one system, documented so your team can apply it. Visual identity design by AMPLIQ.",
        de: "Typografie, Farbe, Raster und Art Direction als ein System — dokumentiert für Ihr Team. Visual-Identity-Design von AMPLIQ.",
      },
    },
  },

  {
    slug: "graphic-design",
    pillar: "create",
    title: { en: "Graphic design", de: "Grafikdesign" },
    tagline: {
      en: "Everything else your brand has to produce",
      de: "Alles andere, was Ihre Marke produzieren muss",
    },
    summary: {
      en: "Presentations, print, sales material and social assets, produced to the same standard as the brand itself.",
      de: "Präsentationen, Print, Vertriebsunterlagen und Social Assets — im selben Standard wie die Marke selbst.",
    },
    problem: {
      en: "The brand looks sharp on the website and then falls apart in the proposal deck, the trade fair banner and the price list — which are exactly the documents customers spend the most time with.",
      de: "Die Marke wirkt auf der Website scharf und zerfällt in der Angebotspräsentation, im Messebanner und in der Preisliste — also genau dort, wo Kunden am längsten hinsehen.",
    },
    solution: {
      en: "We design the materials you produce most, and turn them into templates your team can reuse without a designer in the loop.",
      de: "Wir gestalten die Materialien, die Sie am häufigsten brauchen, und machen daraus Vorlagen, die Ihr Team ohne Designer weiterverwenden kann.",
    },
    deliverables: {
      en: [
        "Presentation and proposal templates",
        "Print: brochures, one-pagers, price lists, stationery",
        "Trade fair and signage artwork",
        "Social media templates and campaign assets",
        "Editable master files in the tools your team already uses",
        "Print-ready export and production support",
      ],
      de: [
        "Vorlagen für Präsentationen und Angebote",
        "Print: Broschüren, One-Pager, Preislisten, Geschäftsausstattung",
        "Messe- und Beschilderungsgrafiken",
        "Social-Media-Vorlagen und Kampagnen-Assets",
        "Bearbeitbare Master-Dateien in Ihren gewohnten Programmen",
        "Druckfertige Daten und Produktionsbegleitung",
      ],
    },
    process: [
      {
        title: { en: "Inventory", de: "Bestandsaufnahme" },
        body: {
          en: "What you produce, how often, and who has to make it.",
          de: "Was Sie produzieren, wie oft und wer es erstellen muss.",
        },
      },
      {
        title: { en: "Design", de: "Gestaltung" },
        body: {
          en: "The highest-value formats first, designed against the brand system.",
          de: "Zuerst die wertvollsten Formate, gestaltet auf Basis des Markensystems.",
        },
      },
      {
        title: { en: "Templatise", de: "Vorlagen bauen" },
        body: {
          en: "Locked-down templates that stay on-brand when someone else edits them.",
          de: "Geschützte Vorlagen, die markenkonform bleiben, auch wenn andere sie bearbeiten.",
        },
      },
      {
        title: { en: "Support", de: "Begleiten" },
        body: {
          en: "Print checks, file prep and quick turnarounds when something is needed fast.",
          de: "Druckkontrolle, Datenaufbereitung und schnelle Umsetzung, wenn es eilig ist.",
        },
      },
    ],
    useCases: {
      en: [
        "A sales team building decks from scratch every time",
        "Print material that undercuts an otherwise strong brand",
        "A campaign that needs consistent assets across many formats",
      ],
      de: [
        "Ein Vertrieb, der jede Präsentation neu zusammenbaut",
        "Printmaterial, das eine an sich starke Marke schwächt",
        "Eine Kampagne, die konsistente Assets über viele Formate braucht",
      ],
    },
    faqs: [
      {
        question: {
          en: "Can you work with our existing brand guidelines?",
          de: "Können Sie mit unseren Brand Guidelines arbeiten?",
        },
        answer: {
          en: "Yes — we'd rather extend a system you already own than replace it. If the guidelines have gaps, we'll flag them and propose additions instead of quietly inventing new rules.",
          de: "Ja — wir erweitern lieber ein vorhandenes System, als es zu ersetzen. Wo Lücken bestehen, benennen wir sie und schlagen Ergänzungen vor, statt still neue Regeln zu erfinden.",
        },
      },
      {
        question: {
          en: "Do you handle printing?",
          de: "Übernehmen Sie auch den Druck?",
        },
        answer: {
          en: "We prepare production-ready files and can coordinate with your printer, including proofs. Printing is invoiced by the printer directly, so you keep the margin visible.",
          de: "Wir liefern druckfertige Daten und koordinieren auf Wunsch mit Ihrer Druckerei, inklusive Proofs. Der Druck wird direkt von der Druckerei abgerechnet — so bleibt die Marge transparent.",
        },
      },
      {
        question: {
          en: "Is there an ongoing option?",
          de: "Gibt es eine laufende Betreuung?",
        },
        answer: {
          en: "Yes. Many clients keep a monthly design allocation for the steady stream of small pieces, which is cheaper and faster than briefing each one as a separate project.",
          de: "Ja. Viele Kunden buchen ein monatliches Designkontingent für die vielen kleinen Aufgaben — günstiger und schneller, als jedes Stück einzeln zu beauftragen.",
        },
      },
    ],
    related: ["visual-identity", "branding", "social-media"],
    seo: {
      title: {
        en: "Graphic design for presentations, print and social",
        de: "Grafikdesign für Print, Präsentation und Social",
      },
      description: {
        en: "On-brand decks, print material, signage and social assets — delivered as reusable templates. Graphic design by AMPLIQ.",
        de: "Markenkonforme Präsentationen, Printmaterial, Beschilderung und Social Assets als wiederverwendbare Vorlagen. Grafikdesign von AMPLIQ.",
      },
    },
  },

  {
    slug: "photography",
    pillar: "create",
    title: { en: "Photography", de: "Fotografie" },
    tagline: {
      en: "Pictures of your actual company",
      de: "Bilder Ihres tatsächlichen Unternehmens",
    },
    summary: {
      en: "Company, portrait and product photography, art-directed to fit the brand system and shot to last for years.",
      de: "Unternehmens-, Porträt- und Produktfotografie — art-directed für Ihr Markensystem und auf Jahre angelegt.",
    },
    problem: {
      en: "Stock photography is instantly recognisable as stock, and it tells a visitor that there was nothing real worth showing. Meanwhile the genuinely impressive parts of the business are never photographed at all.",
      de: "Stockfotos erkennt man sofort — und sie sagen Besuchern, dass es offenbar nichts Echtes zu zeigen gab. Gleichzeitig wird das wirklich Beeindruckende im Unternehmen nie fotografiert.",
    },
    solution: {
      en: "We plan the shoot against where the images will be used — website, decks, ads, social — and direct it so people look competent rather than posed. You end up with a library, not a folder of near-identical frames.",
      de: "Wir planen das Shooting entlang der späteren Verwendung — Website, Präsentationen, Anzeigen, Social — und führen so Regie, dass Menschen kompetent wirken statt gestellt. Am Ende steht eine Bibliothek, kein Ordner mit fast gleichen Motiven.",
    },
    deliverables: {
      en: [
        "Shot list built from the formats the images have to fill",
        "Half or full-day shoot with direction on site",
        "Team portraits with a consistent, repeatable look",
        "Workplace, process and product photography",
        "Edited, retouched images in web and print resolutions",
        "Crops prepared for the key formats, including social",
      ],
      de: [
        "Shotlist auf Basis der Formate, die gefüllt werden müssen",
        "Halb- oder Ganztagesshooting mit Regie vor Ort",
        "Teamporträts in einheitlicher, wiederholbarer Bildsprache",
        "Arbeitsumfeld-, Prozess- und Produktfotografie",
        "Bearbeitete und retuschierte Bilder für Web und Print",
        "Zuschnitte für die wichtigsten Formate, inklusive Social",
      ],
    },
    process: [
      {
        title: { en: "Plan", de: "Planung" },
        body: {
          en: "Where the pictures go first, then what has to be in front of the camera.",
          de: "Erst die spätere Verwendung, dann das Motiv vor der Kamera.",
        },
      },
      {
        title: { en: "Prepare", de: "Vorbereitung" },
        body: {
          en: "Locations, timing, wardrobe notes and a schedule that respects everyone's working day.",
          de: "Orte, Timing, Kleidungshinweise und ein Ablauf, der den Arbeitstag respektiert.",
        },
      },
      {
        title: { en: "Shoot", de: "Shooting" },
        body: {
          en: "Directed on the day — most people photograph badly when left to stand there.",
          de: "Mit Regie am Tag selbst — ohne Anleitung wirken die meisten Menschen auf Fotos steif.",
        },
      },
      {
        title: { en: "Deliver", de: "Übergabe" },
        body: {
          en: "Selection, retouching and a named, organised library you can find things in.",
          de: "Auswahl, Retusche und eine benannte, geordnete Bibliothek, in der man etwas wiederfindet.",
        },
      },
    ],
    useCases: {
      en: [
        "A website redesign that has no real imagery to work with",
        "A team page still showing people who left three years ago",
        "A product or service that is genuinely impressive in person",
      ],
      de: [
        "Ein Website-Redesign ohne verwendbares eigenes Bildmaterial",
        "Eine Teamseite mit Menschen, die vor drei Jahren gegangen sind",
        "Ein Produkt oder eine Leistung, die vor Ort wirklich beeindruckt",
      ],
    },
    faqs: [
      {
        question: {
          en: "How many images do we get?",
          de: "Wie viele Bilder bekommen wir?",
        },
        answer: {
          en: "Enough to fill the formats agreed in the shot list, with alternatives — typically a few dozen finished images from a day, not several hundred near-duplicates.",
          de: "So viele, wie die vereinbarte Shotlist verlangt, plus Alternativen — meist einige Dutzend finale Bilder pro Tag statt mehrerer Hundert Beinahe-Duplikate.",
        },
      },
      {
        question: {
          en: "What about usage rights?",
          de: "Wie sind die Nutzungsrechte geregelt?",
        },
        answer: {
          en: "You receive unlimited usage rights for your own marketing, in all media, without a time limit. This is agreed in writing before the shoot.",
          de: "Sie erhalten unbefristete, medienübergreifende Nutzungsrechte für Ihr eigenes Marketing. Das halten wir vor dem Shooting schriftlich fest.",
        },
      },
      {
        question: {
          en: "Our team hates being photographed.",
          de: "Unser Team lässt sich ungern fotografieren.",
        },
        answer: {
          en: "That's normal, and it's a directing problem rather than a people problem. Short slots, clear instructions and no audience solve most of it.",
          de: "Das ist normal und eher eine Frage der Regie als der Menschen. Kurze Slots, klare Anweisungen und kein Publikum lösen den größten Teil.",
        },
      },
    ],
    related: ["video", "visual-identity", "web-design"],
    seo: {
      title: {
        en: "Business photography: team, workplace and product",
        de: "Unternehmensfotografie: Team, Umfeld, Produkt",
      },
      description: {
        en: "Art-directed company photography planned around where the images will be used. Team portraits, workplace and product shoots by AMPLIQ.",
        de: "Art-directed Unternehmensfotografie, geplant entlang der späteren Verwendung. Teamporträts, Arbeitsumfeld und Produkt von AMPLIQ.",
      },
    },
  },

  {
    slug: "video",
    pillar: "create",
    title: { en: "Video", de: "Video" },
    tagline: {
      en: "Short films with a job to do",
      de: "Kurze Filme mit einer Aufgabe",
    },
    summary: {
      en: "Company films, product videos and short-form social content — produced and edited around a specific purpose.",
      de: "Unternehmensfilme, Produktvideos und Short-Form-Content für Social — produziert und geschnitten für einen konkreten Zweck.",
    },
    problem: {
      en: "Most company videos are made because someone decided there should be a video. Without a defined job — explain, reassure, demonstrate, recruit — they get watched for four seconds and never used again.",
      de: "Die meisten Unternehmensvideos entstehen, weil jemand entschieden hat, dass es ein Video geben soll. Ohne klare Aufgabe — erklären, überzeugen, zeigen, rekrutieren — werden sie vier Sekunden gesehen und nie wieder verwendet.",
    },
    solution: {
      en: "We agree the one thing the video has to achieve and where it will run, then produce for that — including the vertical cutdowns, captions and thumbnails that decide whether anyone watches at all.",
      de: "Wir legen fest, was das Video erreichen soll und wo es läuft — und produzieren genau dafür, inklusive vertikaler Schnitte, Untertitel und Thumbnails, die darüber entscheiden, ob überhaupt jemand zusieht.",
    },
    deliverables: {
      en: [
        "Concept, script and shot planning",
        "Filming with lighting and sound handled properly",
        "Edit, grade, sound mix and motion graphics",
        "Subtitles in German and English",
        "Vertical and square cutdowns for social",
        "Master files and platform-ready exports",
      ],
      de: [
        "Konzept, Skript und Drehplanung",
        "Dreh mit sauberem Licht und Ton",
        "Schnitt, Farbkorrektur, Tonmischung und Motion Graphics",
        "Untertitel auf Deutsch und Englisch",
        "Vertikale und quadratische Schnitte für Social Media",
        "Masterdateien und plattformfertige Exporte",
      ],
    },
    process: [
      {
        title: { en: "Define", de: "Festlegen" },
        body: {
          en: "One job, one audience, one place it runs. Everything else follows from that.",
          de: "Eine Aufgabe, eine Zielgruppe, ein Kanal. Alles Weitere folgt daraus.",
        },
      },
      {
        title: { en: "Script", de: "Skript" },
        body: {
          en: "Written and approved before filming — rewriting in the edit is the expensive way.",
          de: "Vor dem Dreh geschrieben und freigegeben — im Schnitt umschreiben ist der teure Weg.",
        },
      },
      {
        title: { en: "Film", de: "Dreh" },
        body: {
          en: "Efficient shoot days planned around your operations, not against them.",
          de: "Effiziente Drehtage, geplant entlang Ihres Betriebs, nicht dagegen.",
        },
      },
      {
        title: { en: "Edit", de: "Schnitt" },
        body: {
          en: "Two review rounds included, then every format you actually need delivered at once.",
          de: "Zwei Feedbackrunden inklusive, danach alle benötigten Formate in einem Rutsch.",
        },
      },
    ],
    useCases: {
      en: [
        "A service that is hard to explain in text alone",
        "A recruitment problem where people can't picture the workplace",
        "A social channel that needs consistent short-form material",
      ],
      de: [
        "Eine Leistung, die sich in Text allein schwer erklären lässt",
        "Recruiting, bei dem sich niemand den Arbeitsplatz vorstellen kann",
        "Ein Social-Kanal, der regelmäßig Short-Form-Material braucht",
      ],
    },
    faqs: [
      {
        question: {
          en: "How long should a company video be?",
          de: "Wie lang sollte ein Unternehmensvideo sein?",
        },
        answer: {
          en: "Shorter than you think. Sixty to ninety seconds for a website film, fifteen to thirty for social. Length is a symptom — if it needs three minutes, the message usually isn't decided yet.",
          de: "Kürzer als gedacht. 60 bis 90 Sekunden für die Website, 15 bis 30 für Social. Länge ist ein Symptom: Wenn es drei Minuten braucht, steht die Botschaft meist noch nicht.",
        },
      },
      {
        question: {
          en: "Do we need actors?",
          de: "Brauchen wir Schauspieler?",
        },
        answer: {
          en: "Rarely. Real staff are more convincing when they're directed well and given short, specific things to say rather than a script to perform.",
          de: "Selten. Echte Mitarbeitende wirken überzeugender, wenn sie gut geführt werden und kurze, konkrete Aussagen machen, statt ein Skript zu spielen.",
        },
      },
      {
        question: {
          en: "Can you film in one day?",
          de: "Schaffen Sie den Dreh an einem Tag?",
        },
        answer: {
          en: "Usually — a well-planned single day at one location covers a main film plus a batch of social cutdowns. Multiple locations or seasons need more.",
          de: "Meist ja: Ein gut geplanter Tag an einem Ort deckt einen Hauptfilm plus mehrere Social-Schnitte ab. Mehrere Standorte oder Jahreszeiten brauchen mehr.",
        },
      },
    ],
    related: ["photography", "social-media", "meta-ads"],
    seo: {
      title: {
        en: "Video production for companies and social media",
        de: "Videoproduktion für Unternehmen und Social Media",
      },
      description: {
        en: "Company films, product video and short-form social content produced around a defined purpose, with cutdowns and subtitles included. Video by AMPLIQ.",
        de: "Unternehmensfilme, Produktvideos und Short-Form-Content mit klarem Zweck — inklusive Schnittvarianten und Untertiteln. Video von AMPLIQ.",
      },
    },
  },

  {
    slug: "seo",
    pillar: "grow",
    title: { en: "SEO", de: "SEO" },
    tagline: {
      en: "Be found by people already looking",
      de: "Gefunden werden von Menschen, die schon suchen",
    },
    summary: {
      en: "Technical, content and local SEO focused on the searches that actually lead to enquiries — not on vanity rankings.",
      de: "Technisches, inhaltliches und lokales SEO für die Suchanfragen, die zu Anfragen führen — nicht für Ranking-Kosmetik.",
    },
    problem: {
      en: "Plenty of companies rank for their own name and nothing else. The searches where a buyer is actively looking for what they sell go to competitors — often to competitors with a weaker product and a better-structured site.",
      de: "Viele Unternehmen ranken für den eigenen Namen und sonst nichts. Die Suchanfragen, bei denen jemand aktiv nach ihrer Leistung sucht, gehen an Wettbewerber — oft an solche mit schwächerem Angebot und besser strukturierter Seite.",
    },
    solution: {
      en: "We find the searches with real commercial intent, fix what stops the site from ranking, and build the pages that deserve to. Slower than ads and considerably cheaper over time.",
      de: "Wir identifizieren Suchanfragen mit echter Kaufabsicht, beheben, was das Ranking blockiert, und bauen die Seiten, die es verdienen. Langsamer als Anzeigen und auf Dauer deutlich günstiger.",
    },
    deliverables: {
      en: [
        "Keyword and intent research for your market, in German",
        "Technical audit: indexing, speed, structure, Core Web Vitals",
        "On-page optimisation and internal linking structure",
        "Content plan for the pages worth ranking",
        "Local SEO and Google Business Profile setup where relevant",
        "Monthly reporting on rankings, traffic and enquiries",
      ],
      de: [
        "Keyword- und Intent-Recherche für Ihren Markt, auf Deutsch",
        "Technisches Audit: Indexierung, Ladezeit, Struktur, Core Web Vitals",
        "Onpage-Optimierung und interne Verlinkung",
        "Contentplan für die Seiten, die ein Ranking verdienen",
        "Lokales SEO und Google-Unternehmensprofil, wo sinnvoll",
        "Monatliches Reporting zu Rankings, Traffic und Anfragen",
      ],
    },
    process: [
      {
        title: { en: "Research", de: "Recherche" },
        body: {
          en: "What people actually type, what they mean by it, and what it's worth to you.",
          de: "Was Menschen tatsächlich eingeben, was sie meinen und was es Ihnen wert ist.",
        },
      },
      {
        title: { en: "Fix", de: "Beheben" },
        body: {
          en: "The technical blockers first — there's no point optimising a page Google struggles to read.",
          de: "Zuerst die technischen Blocker — eine Seite zu optimieren, die Google kaum lesen kann, bringt nichts.",
        },
      },
      {
        title: { en: "Build", de: "Aufbauen" },
        body: {
          en: "Pages written for the search and the buyer at the same time.",
          de: "Seiten, die gleichzeitig für die Suche und für den Kunden geschrieben sind.",
        },
      },
      {
        title: { en: "Measure", de: "Messen" },
        body: {
          en: "Reported against enquiries, not against a screenshot of position three.",
          de: "Bewertet an Anfragen, nicht am Screenshot von Position drei.",
        },
      },
    ],
    useCases: {
      en: [
        "A company invisible for the terms its buyers search",
        "A site that lost traffic after a redesign or migration",
        "A local business competing with national providers",
      ],
      de: [
        "Ein Unternehmen, das für seine relevanten Suchbegriffe unsichtbar ist",
        "Eine Seite, die nach Redesign oder Migration Traffic verloren hat",
        "Ein lokaler Anbieter im Wettbewerb mit überregionalen Playern",
      ],
    },
    faqs: [
      {
        question: {
          en: "How long until SEO works?",
          de: "Wann wirkt SEO?",
        },
        answer: {
          en: "Technical fixes can show within weeks. Competitive rankings usually take three to six months, sometimes longer. Anyone promising page one in four weeks is selling something else.",
          de: "Technische Korrekturen wirken teils in Wochen. Umkämpfte Rankings brauchen meist drei bis sechs Monate, manchmal länger. Wer Seite eins in vier Wochen verspricht, verkauft etwas anderes.",
        },
      },
      {
        question: {
          en: "Do we need to publish a blog?",
          de: "Müssen wir einen Blog betreiben?",
        },
        answer: {
          en: "Only if your buyers actually search for the things a blog would answer. For many businesses, strong service and location pages do far more than a weekly article nobody reads.",
          de: "Nur wenn Ihre Kunden tatsächlich nach den Themen suchen. Für viele Unternehmen bringen starke Leistungs- und Standortseiten deutlich mehr als ein Wochenartikel, den niemand liest.",
        },
      },
      {
        question: {
          en: "Is SEO better than ads?",
          de: "Ist SEO besser als Anzeigen?",
        },
        answer: {
          en: "They do different jobs. Ads buy visibility now and stop when you stop paying; SEO compounds but starts slowly. Most companies need paid traffic while search builds.",
          de: "Beides hat andere Aufgaben. Anzeigen kaufen Sichtbarkeit sofort und enden mit dem Budget, SEO baut sich langsam auf und bleibt. Die meisten brauchen bezahlten Traffic, während die Suche wächst.",
        },
      },
    ],
    related: ["web-design", "website-redesign", "meta-ads"],
    seo: {
      title: {
        en: "SEO for German businesses: found by buyers, not bots",
        de: "SEO für Unternehmen in Deutschland",
      },
      description: {
        en: "Technical, content and local SEO focused on searches with commercial intent, reported against enquiries. SEO by AMPLIQ.",
        de: "Technisches, inhaltliches und lokales SEO für Suchanfragen mit Kaufabsicht — gemessen an Anfragen. SEO von AMPLIQ.",
      },
    },
  },

  {
    slug: "meta-ads",
    pillar: "grow",
    title: { en: "Meta Ads", de: "Meta Ads" },
    tagline: {
      en: "Paid reach with a strategy behind it",
      de: "Bezahlte Reichweite mit Strategie dahinter",
    },
    summary: {
      en: "Facebook and Instagram advertising built on a clear offer, real creative and a landing page that can convert.",
      de: "Facebook- und Instagram-Werbung auf Basis eines klaren Angebots, echter Creatives und einer Landingpage, die konvertieren kann.",
    },
    problem: {
      en: "Meta Ads get blamed for results that were decided elsewhere. Weak creative, a vague offer, and a homepage used as a landing page will lose money at any budget and with any targeting.",
      de: "Meta Ads bekommen die Schuld für Ergebnisse, die woanders entstehen. Schwache Creatives, ein unklares Angebot und die Startseite als Landingpage verbrennen Geld — bei jedem Budget und jedem Targeting.",
    },
    solution: {
      en: "We fix the offer and the destination before we spend anything, then run a small number of well-made creative variants and let the data decide. We tell you when ads are the wrong tool.",
      de: "Wir klären Angebot und Zielseite, bevor Budget fließt, testen anschließend wenige, gut gemachte Creative-Varianten und lassen die Daten entscheiden. Wenn Anzeigen das falsche Mittel sind, sagen wir das.",
    },
    deliverables: {
      en: [
        "Offer and audience definition before any spend",
        "Campaign structure and account setup",
        "Ad creative: static, and short-form video where it fits",
        "Landing page or dedicated conversion path",
        "Tracking and conversion setup, GDPR-compliant",
        "Ongoing optimisation and plain-language reporting",
      ],
      de: [
        "Angebot und Zielgruppe definiert, bevor Budget fließt",
        "Kampagnenstruktur und Kontoeinrichtung",
        "Ad Creatives: statisch und, wo passend, Short-Form-Video",
        "Landingpage oder eigener Conversion-Pfad",
        "Tracking- und Conversion-Setup, DSGVO-konform",
        "Laufende Optimierung und verständliches Reporting",
      ],
    },
    process: [
      {
        title: { en: "Offer", de: "Angebot" },
        body: {
          en: "What exactly is being advertised, to whom, and why they'd act now.",
          de: "Was genau beworben wird, für wen und warum jetzt gehandelt wird.",
        },
      },
      {
        title: { en: "Destination", de: "Zielseite" },
        body: {
          en: "A page built for the ad. Sending paid traffic to a homepage wastes most of it.",
          de: "Eine Seite für die Anzeige. Bezahlter Traffic auf der Startseite verpufft größtenteils.",
        },
      },
      {
        title: { en: "Test", de: "Testen" },
        body: {
          en: "A controlled set of creative and audience variants, with enough budget to learn something.",
          de: "Ein kontrollierter Satz Creative- und Zielgruppenvarianten mit genug Budget für belastbare Erkenntnisse.",
        },
      },
      {
        title: { en: "Scale", de: "Skalieren" },
        body: {
          en: "Spend follows what works, and we say so when the ceiling has been reached.",
          de: "Budget folgt dem, was funktioniert — und wir sagen es, wenn die Decke erreicht ist.",
        },
      },
    ],
    useCases: {
      en: [
        "A clear offer that needs volume faster than SEO can deliver",
        "A local business with a defined catchment area",
        "A launch, opening or seasonal campaign with a deadline",
      ],
      de: [
        "Ein klares Angebot, das schneller Volumen braucht, als SEO liefert",
        "Ein lokales Unternehmen mit klarem Einzugsgebiet",
        "Ein Launch, eine Eröffnung oder eine Saisonkampagne mit Termin",
      ],
    },
    faqs: [
      {
        question: {
          en: "What's a realistic monthly budget?",
          de: "Welches Monatsbudget ist realistisch?",
        },
        answer: {
          en: "Media spend needs to be high enough for the platform to learn — for most local and B2B campaigns that means a few hundred euros a month at minimum, separate from management. Below that, results are noise.",
          de: "Das Mediabudget muss hoch genug sein, damit die Plattform lernen kann — für lokale und B2B-Kampagnen sind das meist mindestens einige Hundert Euro monatlich, zusätzlich zur Betreuung. Darunter sind Ergebnisse Zufall.",
        },
      },
      {
        question: {
          en: "Do Meta Ads work for B2B?",
          de: "Funktionieren Meta Ads im B2B?",
        },
        answer: {
          en: "Sometimes, for awareness and for reaching decision-makers who don't search. For narrow, high-value B2B niches, they're often the wrong channel and we'll say so before you spend.",
          de: "Manchmal — für Bekanntheit und Entscheider, die nicht suchen. In engen, hochpreisigen B2B-Nischen sind sie oft der falsche Kanal, und das sagen wir vor dem ersten Euro.",
        },
      },
      {
        question: {
          en: "Who owns the ad account?",
          de: "Wem gehört das Werbekonto?",
        },
        answer: {
          en: "You do. We work inside your Business Manager, so the account, data and audiences stay with you if we stop working together.",
          de: "Ihnen. Wir arbeiten in Ihrem Business Manager — Konto, Daten und Zielgruppen bleiben bei Ihnen, auch wenn die Zusammenarbeit endet.",
        },
      },
    ],
    related: ["social-media", "video", "web-design"],
    seo: {
      title: {
        en: "Meta Ads that pay back: Facebook and Instagram",
        de: "Meta Ads: Facebook- und Instagram-Werbung",
      },
      description: {
        en: "Facebook and Instagram campaigns built on a clear offer, real creative and a landing page that converts. Meta Ads management by AMPLIQ.",
        de: "Facebook- und Instagram-Kampagnen mit klarem Angebot, echten Creatives und konvertierender Landingpage. Meta-Ads-Betreuung von AMPLIQ.",
      },
    },
  },

  {
    slug: "social-media",
    pillar: "grow",
    title: { en: "Social media", de: "Social Media" },
    tagline: {
      en: "A channel that looks maintained",
      de: "Ein Kanal, der gepflegt aussieht",
    },
    summary: {
      en: "Strategy, content production and management for the one or two platforms where your customers actually are.",
      de: "Strategie, Content-Produktion und Betreuung für die ein bis zwei Plattformen, auf denen Ihre Kunden wirklich sind.",
    },
    problem: {
      en: "An abandoned profile is worse than no profile. A visitor who checks your Instagram and finds three posts from last spring draws a conclusion about the whole company — and it isn't a kind one.",
      de: "Ein verwaistes Profil ist schlechter als gar keines. Wer Ihr Instagram öffnet und drei Posts vom letzten Frühjahr findet, zieht Rückschlüsse auf das ganze Unternehmen — und keine freundlichen.",
    },
    solution: {
      en: "We pick the platforms that make sense, build a content system you can sustain, and produce in batches so a channel doesn't depend on someone finding time on a Friday afternoon.",
      de: "Wir wählen die sinnvollen Plattformen, bauen ein Content-System, das Sie durchhalten, und produzieren in Blöcken — damit ein Kanal nicht davon abhängt, dass freitagnachmittags jemand Zeit findet.",
    },
    deliverables: {
      en: [
        "Channel strategy: which platforms, and what for",
        "Content pillars and a posting rhythm you can keep",
        "Batch production of photo, video and graphic content",
        "Captions and hashtags written in German",
        "Scheduling, publishing and community management",
        "Monthly review of what performed and why",
      ],
      de: [
        "Kanalstrategie: welche Plattformen und wofür",
        "Content-Säulen und ein Rhythmus, den Sie halten können",
        "Blockproduktion von Foto-, Video- und Grafik-Content",
        "Captions und Hashtags auf Deutsch",
        "Planung, Veröffentlichung und Community-Management",
        "Monatliche Auswertung: was lief und warum",
      ],
    },
    process: [
      {
        title: { en: "Focus", de: "Fokussieren" },
        body: {
          en: "One or two platforms done properly beats five kept alive badly.",
          de: "Ein bis zwei Plattformen richtig gemacht schlagen fünf schlecht gepflegte.",
        },
      },
      {
        title: { en: "System", de: "System" },
        body: {
          en: "Repeatable content types, so nobody starts from a blank page each week.",
          de: "Wiederkehrende Content-Formate, damit niemand wöchentlich bei null beginnt.",
        },
      },
      {
        title: { en: "Produce", de: "Produzieren" },
        body: {
          en: "Shot and designed in batches — a month of material in a day.",
          de: "In Blöcken fotografiert und gestaltet — ein Monat Material an einem Tag.",
        },
      },
      {
        title: { en: "Review", de: "Auswerten" },
        body: {
          en: "Monthly: what earned attention, what to drop, what to make more of.",
          de: "Monatlich: was Aufmerksamkeit gebracht hat, was wegfällt, wovon mehr entsteht.",
        },
      },
    ],
    useCases: {
      en: [
        "A profile that has been dormant long enough to be noticeable",
        "A company that posts but sees nothing come back",
        "A brand that needs to look active while recruiting",
      ],
      de: [
        "Ein Profil, dessen Stillstand inzwischen auffällt",
        "Ein Unternehmen, das postet, aber nichts zurückbekommt",
        "Eine Marke, die während des Recruitings aktiv wirken muss",
      ],
    },
    faqs: [
      {
        question: {
          en: "How often do we need to post?",
          de: "Wie oft müssen wir posten?",
        },
        answer: {
          en: "Consistently rather than constantly. Two good posts a week that keep coming beats daily posting that stops after a month.",
          de: "Verlässlich statt ständig. Zwei gute Beiträge pro Woche, die dauerhaft kommen, schlagen tägliche Posts, die nach einem Monat enden.",
        },
      },
      {
        question: {
          en: "Which platform should we be on?",
          de: "Auf welcher Plattform sollten wir sein?",
        },
        answer: {
          en: "Where your customers already spend time — usually Instagram for consumer-facing and local businesses, LinkedIn for B2B. Being on both badly helps nobody.",
          de: "Dort, wo Ihre Kunden ohnehin sind — meist Instagram für endkundennahe und lokale Unternehmen, LinkedIn für B2B. Beides halbherzig hilft niemandem.",
        },
      },
      {
        question: {
          en: "Can our team take it over later?",
          de: "Kann unser Team das später übernehmen?",
        },
        answer: {
          en: "That's often the goal. We build the system and produce the first months, then hand over templates and a rhythm your team can actually maintain.",
          de: "Das ist oft das Ziel. Wir bauen das System, produzieren die ersten Monate und übergeben dann Vorlagen und einen Rhythmus, den Ihr Team halten kann.",
        },
      },
    ],
    related: ["video", "photography", "meta-ads"],
    seo: {
      title: {
        en: "Social media marketing and content production",
        de: "Social-Media-Marketing und Content-Produktion",
      },
      description: {
        en: "Strategy, batch content production and management for the platforms your customers use. Social media by AMPLIQ.",
        de: "Strategie, Content-Produktion in Blöcken und Betreuung für die Plattformen Ihrer Kunden. Social Media von AMPLIQ.",
      },
    },
  },
];

export const serviceBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service]),
);

export function servicesByPillar(pillar: string) {
  return services.filter((service) => service.pillar === pillar);
}
