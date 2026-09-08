import type { Project } from "@/content/types";

/**
 * The portfolio.
 *
 * Deliberately short. Everything here describes work that was actually carried
 * out; nothing states a result, a metric, a testimonial or a commercial
 * relationship that hasn't been confirmed. Where a detail isn't known it is
 * left out rather than filled in — an empty field is recoverable, an invented
 * one is not.
 *
 * To extend: add project imagery to /public/work/<slug>/ and set the `src`
 * values below, then fill in brief/approach once the client has signed off on
 * what may be published.
 */
export const projects: Project[] = [
  {
    slug: "ihms-global",
    title: "IHMS Global",
    client: "IHMS Global",
    year: null,
    status: "client",
    category: {
      en: "Website design & development",
      de: "Webdesign & Entwicklung",
    },
    summary: {
      en: "Design and development of the IHMS Global website — structure, interface design and a responsive front-end build.",
      de: "Design und Entwicklung der Website von IHMS Global — Struktur, Interface-Design und responsive Frontend-Umsetzung.",
    },
    role: {
      en: "Design and development",
      de: "Design und Entwicklung",
    },
    scope: {
      en: [
        "Information architecture",
        "Interface design",
        "Responsive front-end development",
        "Performance and accessibility work",
      ],
      de: [
        "Informationsarchitektur",
        "Interface-Design",
        "Responsive Frontend-Entwicklung",
        "Performance und Barrierefreiheit",
      ],
    },
    brief: {
      en: [
        "IHMS Global needed a website that presents the organisation clearly and works properly on every screen its visitors actually use.",
        "The engagement covered both sides of that: the design of the site's structure and interface, and the front-end development that turns it into something that loads quickly and holds together at every breakpoint.",
      ],
      de: [
        "IHMS Global brauchte eine Website, die die Organisation klar darstellt und auf jedem Bildschirm sauber funktioniert, den die Besucher tatsächlich nutzen.",
        "Das Projekt umfasste beide Seiten davon: die Gestaltung von Struktur und Interface sowie die Frontend-Entwicklung, die daraus eine schnell ladende, auf jedem Breakpoint stabile Seite macht.",
      ],
    },
    approach: {
      en: [
        "Structure came before surface. The page order and navigation were resolved first, so that every visitor has a clear route from landing to the information they came for.",
        "From there the interface was designed as a small set of reusable templates rather than a collection of one-off pages — which keeps the site consistent and makes it far cheaper to extend later.",
      ],
      de: [
        "Struktur vor Oberfläche: Zuerst wurden Seitenreihenfolge und Navigation geklärt, damit jeder Besucher einen klaren Weg von der Landung bis zur gesuchten Information hat.",
        "Darauf aufbauend entstand das Interface als kleiner Satz wiederverwendbarer Templates statt als Sammlung von Einzelseiten — das hält die Seite konsistent und macht spätere Erweiterungen deutlich günstiger.",
      ],
    },
    creative: {
      en: [
        "A restrained, functional visual direction: a clear typographic hierarchy, generous spacing, and enough contrast that the content stays readable in ordinary conditions rather than only in a design tool.",
        "Layouts were designed to survive real content — long headings, uneven text lengths, and images that will be replaced later without breaking the composition.",
      ],
      de: [
        "Eine zurückhaltende, funktionale Gestaltung: klare typografische Hierarchie, großzügige Abstände und genug Kontrast, damit Inhalte unter normalen Bedingungen lesbar bleiben — nicht nur im Designprogramm.",
        "Die Layouts sind so angelegt, dass sie echte Inhalte aushalten: lange Überschriften, ungleiche Textlängen und Bilder, die später ersetzt werden, ohne die Komposition zu zerstören.",
      ],
    },
    execution: {
      en: [
        "The front-end was built responsively from the smallest breakpoint upwards, so the mobile experience is a designed state rather than a compressed desktop layout.",
        "Performance and accessibility were handled during the build rather than audited afterwards: semantic markup, keyboard-navigable interactions, sensible image handling and restrained JavaScript.",
      ],
      de: [
        "Das Frontend wurde vom kleinsten Breakpoint aufwärts responsiv gebaut — die mobile Ansicht ist ein gestalteter Zustand und kein zusammengestauchtes Desktop-Layout.",
        "Performance und Barrierefreiheit entstanden während der Umsetzung statt im Audit danach: semantisches Markup, per Tastatur bedienbare Interaktionen, sauberes Bildhandling und zurückhaltendes JavaScript.",
      ],
    },
    delivered: {
      en: [
        "Site structure and navigation model",
        "Interface design across all templates",
        "Responsive front-end implementation",
        "Mobile, tablet and desktop states designed individually",
        "Accessible markup and keyboard support",
      ],
      de: [
        "Seitenstruktur und Navigationsmodell",
        "Interface-Design für alle Templates",
        "Responsive Frontend-Umsetzung",
        "Eigens gestaltete Zustände für Mobil, Tablet und Desktop",
        "Barrierearmes Markup und Tastaturbedienung",
      ],
    },
    learnings: {
      en: [
        "Deciding the page order before opening a design file removes most of the argument later — structure disagreements are cheap on paper and expensive in a build.",
        "Designing the mobile state first keeps the content honest. Anything that doesn't survive a 390px column usually wasn't essential on desktop either.",
      ],
      de: [
        "Wenn die Seitenreihenfolge vor der ersten Designdatei steht, entfällt der größte Teil späterer Diskussionen — Strukturfragen sind auf Papier günstig und in der Umsetzung teuer.",
        "Zuerst die mobile Ansicht zu gestalten hält die Inhalte ehrlich. Was eine 390-Pixel-Spalte nicht übersteht, war meist auch auf dem Desktop nicht entscheidend.",
      ],
    },
    gallery: [
      {
        src: null,
        wide: true,
        alt: {
          en: "IHMS Global website — home page on desktop",
          de: "Website IHMS Global — Startseite auf dem Desktop",
        },
      },
      {
        src: null,
        alt: {
          en: "IHMS Global website — interior page layout",
          de: "Website IHMS Global — Layout einer Unterseite",
        },
      },
      {
        src: null,
        alt: {
          en: "IHMS Global website — mobile views",
          de: "Website IHMS Global — mobile Ansichten",
        },
      },
    ],
    seo: {
      title: {
        en: "IHMS Global — website design and development",
        de: "IHMS Global — Webdesign und Entwicklung",
      },
      description: {
        en: "Case study: information architecture, interface design and responsive front-end development for the IHMS Global website.",
        de: "Case Study: Informationsarchitektur, Interface-Design und responsive Frontend-Entwicklung für die Website von IHMS Global.",
      },
    },
  },
];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);
