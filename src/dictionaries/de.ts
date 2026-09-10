import type { Dictionary } from "@/dictionaries/en";

/**
 * German — written for the German market, not translated word for word.
 * Siezen throughout, no anglicised agency filler.
 */
export const de: Dictionary = {
  meta: {
    localeLabel: "Deutsch",
    switchTo: "Zu Englisch wechseln",
  },

  nav: {
    services: "Leistungen",
    packages: "Pakete",
    about: "Über uns",
    insights: "Insights",
    contact: "Kontakt",
    menu: "Menü",
    close: "Schließen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    primary: "Hauptnavigation",
    language: "Sprache",
  },

  cta: {
    start: "Projekt starten",
    consultation: "Kostenlose Beratung",
    enquiry: "Anfrage senden",
    allServices: "Leistungen entdecken",
    allInsights: "Alle Insights",
    readMore: "Lesen",
    backToInsights: "Zurück zu den Insights",
    backHome: "Zurück zur Startseite",
    talk: "Beratung vereinbaren",
  },

  common: {
    skipToContent: "Zum Inhalt springen",
    email: "E-Mail",
    of: "von",
    concept: "Konzept",
    inProgress: "In Arbeit",
    scrollHint: "Scrollen",
    placeholderNotice: "Platzhalter — muss vor dem Launch ergänzt werden",
  },

  home: {
    hero: {
      eyebrow: "Marketing- & Kreativagentur — Deutschland & Europa",
      headlineTop: "Marketing,",
      headlineBottom: "verstärkt",
      lead: "Marke, Website und Kampagnen als ein System — damit jeder Euro im Marketing den nächsten wirksamer macht.",
      audience: "Für mittelständische und wachsende Unternehmen in Deutschland und Europa.",
      pillars: [
        { key: "build", label: "Build", note: "Websites, die funktionieren" },
        { key: "create", label: "Create", note: "Marke und Content" },
        { key: "grow", label: "Grow", note: "Sichtbarkeit und Anfragen" },
      ],
    },

    positioning: {
      eyebrow: "Für wen wir arbeiten",
      headline: "Für Unternehmen, die mehr von ihrem Marketing erwarten.",
      body: "B2B und SaaS, Dienstleister, Handel und Gastronomie, Immobilien — wachsende und mittelständische Unternehmen in Deutschland und Europa, bei denen das Geschäft stark ist und das Marketing noch nicht nachgezogen hat.",
      marquee: [
        "Markensysteme",
        "Websites",
        "Redesigns",
        "Fotografie",
        "Video",
        "SEO",
        "Meta Ads",
        "Social Content",
        "Landingpages",
        "Visual Identity",
        "Kampagnenstrategie",
        "Leadgenerierung",
      ],
    },

    problem: {
      eyebrow: "Die Ausgangslage",
      headline: "Starke Unternehmen verdienen starkes Marketing.",
      body: "Die meisten Unternehmen haben kein Marketingproblem. Sie haben ein Zusammenhangsproblem. Die Arbeit ist gut, das Team ist gut — und alles, was Kundinnen und Kunden tatsächlich sehen, ist zu unterschiedlichen Zeiten, von unterschiedlichen Leuten und nach unterschiedlichen Maßstäben entstanden.",
      symptoms: [
        "Die Website hinkt dem Unternehmen Jahre hinterher.",
        "Die Marke sieht auf jedem Kanal anders aus.",
        "Content entsteht nebenbei — oder gar nicht.",
        "Die Bilder wirken gekauft, nicht gemacht.",
        "Anzeigen laufen ohne Strategie dahinter.",
        "Bei der Suche taucht niemand bei Ihnen auf.",
      ],
      close: "Für sich genommen ist nichts davon dramatisch. Zusammen kostet es leise Kunden.",
    },

    system: {
      eyebrow: "Das AMPLIQ System",
      headline: "Drei Ebenen. Ein System.",
      body: "Marketing funktioniert nicht mehr, sobald es in Einzelteilen eingekauft wird. Wir bauen die drei Ebenen, die sich gegenseitig stärken: ein Fundament, dem man vertraut, Kreation, die Aufmerksamkeit verdient, und die Reichweite, die beides vor die richtigen Menschen bringt.",
      note: "Jedes Projekt beginnt bei der Ebene, die Sie gerade ausbremst.",
    },


    services: {
      eyebrow: "Was wir machen",
      headline: "Alles, was eine Marke sichtbar macht — und nichts darüber hinaus.",
      body: "Zwölf Disziplinen in drei Ebenen. Einzeln buchbar, im System stärker.",
    },

    packages: {
      eyebrow: "Pakete",
      headline: "Klare Einstiegspunkte.",
      body: "Drei Einstiege. Jede Zahl ist ein Startpunkt für einen definierten Umfang — was dazugehört, stimmen wir ab und halten es schriftlich fest.",
      unsureTitle: "Nicht sicher, was Sie brauchen?",
      unsureBody: "Sagen Sie uns, wo das Unternehmen heute steht. Wir sagen Ihnen ehrlich, was zuerst den Unterschied macht — auch wenn das weniger Aufwand ist als gedacht.",
    },

    process: {
      eyebrow: "Zusammenarbeit",
      headline: "Ein Ablauf, dem Sie folgen können.",
      body: "Fünf Phasen, jedes Mal dieselben. Sie wissen immer, was gerade passiert, was als Nächstes kommt und was wir von Ihnen brauchen.",
    },

    principles: {
      eyebrow: "Warum AMPLIQ",
      headline: "Wie wir über die Arbeit denken.",
      body: "Keine Behauptungen über uns selbst — die Regeln, nach denen wir tatsächlich arbeiten.",
      items: [
        {
          title: "Strategie vor Design.",
          body: "Erst die Frage, was die Arbeit erreichen soll. Dann die Frage, wie sie aussieht.",
        },
        {
          title: "Design mit Funktion.",
          body: "Jedes Layout, jedes Bild und jede Zeile bringt jemanden einen Schritt weiter.",
        },
        {
          title: "Eine Marke statt einzelner Maßnahmen.",
          body: "Kanäle verstärken sich gegenseitig — oder sie verbrennen gegenseitig Budget.",
        },
        {
          title: "Kreativität mit geschäftlichem Zweck.",
          body: "Arbeit soll sehenswert sein und ihren Preis wert.",
        },
        {
          title: "Transparente Kommunikation.",
          body: "Klarer Umfang, klare Preise, klarer Stand. Kein Agenturnebel.",
        },
        {
          title: "Langfristig gedacht.",
          body: "Wir bauen Dinge, die Ihnen gehören und in drei Jahren noch tragen.",
        },
      ],
    },

    about: {
      eyebrow: "Über uns",
      headline: "Für Unternehmen, denen ihr Auftritt nicht gleichgültig ist.",
      body: "Strategie, Design und Marketing aus einer Hand — damit Marke, Website und Kampagnen sich gegenseitig verstärken, statt um Budget zu konkurrieren.",
      link: "Mehr über AMPLIQ",
    },

    insights: {
      eyebrow: "Insights",
      headline: "Klare Antworten auf die Fragen, die wirklich gestellt werden.",
      body: "Was Dinge kosten, was zuerst sinnvoll ist und was still Budget verbrennt.",
    },

    finalCta: {
      eyebrow: "Erster Schritt",
      headline: "Bereit, Ihre Marke zu verstärken?",
      body: "Erzählen Sie uns, wo Ihr Unternehmen heute steht und was Sie erreichen möchten. Sie bekommen eine klare Einschätzung zu Umfang, Zeitrahmen und Budget — keine Pitch-Präsentation.",
    },
  },


  services: {
    title: "Leistungen",
    lead: "Drei Ebenen, zwölf Disziplinen. Jede funktioniert für sich — zusammen sind sie mehr wert.",
    problemTitle: "Das Problem dahinter",
    solutionTitle: "Unsere Herangehensweise",
    deliverablesTitle: "Was Sie bekommen",
    processTitle: "Ablauf",
    useCasesTitle: "Typische Situationen",
    faqTitle: "Fragen",
    relatedTitle: "Passt gut zusammen mit",
    pillarLabel: "Ebene",
  },

  packages: {
    title: "Pakete",
    lead: "Drei Einstiege. Jede Zahl ist ein Startpunkt für einen definierten Umfang — kein Festpreis und nie das gesamte AMPLIQ-Angebot. Jedes Projekt wird individuell kalkuliert, bevor es beginnt.",
    from: "Ab",
    custom: "Individuelles Angebot",
    forWho: "Für wen",
    includes: "Typischerweise enthalten",
    solves: "Was es löst",
    scope: "Typischer Umfang",
    engagement: "Zusammenarbeit",
    customTitle: "Etwas dazwischen?",
    customBody:
      "Die meisten Projekte passen nicht sauber in ein Paket. Beschreiben Sie die Situation, wir schnüren es passend — manchmal heißt das weniger als ein Paket, nicht mehr.",
    scopeNote: "Der Endpreis hängt vom tatsächlich benötigten Umfang ab.",
    priceNote:
      "Alle Preise netto zzgl. USt. und als Startpunkt für einen definierten Umfang zu verstehen, nicht als Festpreis. START ist ein fokussiertes Projekt mit einem definierten Ergebnis — kein Paket aus allem Aufgeführten. Jedes Projekt wird individuell kalkuliert, bevor es beginnt.",
  },

  about: {
    title: "Über uns",
    lead: "Eine Marketing- und Kreativagentur, die Strategie, Design, Content und digitales Wachstum verbindet.",
  },

  insights: {
    title: "Insights",
    lead: "Praktische Texte zu Marke, Website und Marketing für Unternehmen in Deutschland.",
    readingTime: "Min. Lesezeit",
    published: "Veröffentlicht",
    updated: "Aktualisiert",
    tableOfContents: "In diesem Artikel",
    moreArticles: "Weiterlesen",
    ctaTitle: "Eine Frage offen geblieben?",
    ctaBody: "Stellen Sie sie direkt. Fragen zu Umfang und Budget beantworten wir ohne Verkaufsgespräch.",
  },

  contact: {
    title: "Erzählen Sie uns vom Projekt.",
    lead: "Erzählen Sie uns, wo Ihr Unternehmen heute steht und was Sie erreichen möchten. Wir lesen jede Nachricht selbst und antworten innerhalb von zwei Werktagen.",
    directTitle: "Lieber per E-Mail?",
    generalLabel: "Allgemeine Anfragen",
    projectLabel: "Projekte & Angebote",
    helpLabel: "Allgemeine Hilfe",
    directBody: "Schreiben Sie uns direkt, wir übernehmen von dort.",
    consultationTitle: "Lieber erst sprechen?",
    consultationBody:
      "30 Minuten kostenlos, um herauszufinden, was sich lohnt — ohne Verpflichtung, danach etwas zu beauftragen.",
    form: {
      legendAbout: "Zu Ihnen",
      legendProject: "Zum Projekt",
      firstName: "Vorname",
      lastName: "Nachname",
      company: "Unternehmen",
      email: "E-Mail",
      phone: "Telefon",
      phoneOptional: "optional",
      website: "Website",
      websiteOptional: "optional",
      need: "Worum geht es?",
      needPlaceholder: "Einstieg auswählen",
      budget: "Budget",
      timeline: "Zeitrahmen",
      services: "Welche Leistungen interessieren Sie?",
      servicesHint: "Mehrfachauswahl möglich.",
      message: "Was sollten wir sonst noch wissen?",
      messagePlaceholder:
        "Was macht das Unternehmen, was funktioniert gerade nicht, und woran würden Sie den Projekterfolg messen?",
      submit: "Anfrage senden",
      submitting: "Wird gesendet …",
      required: "Pflichtfeld",
      privacyNote:
        "Wir verwenden Ihre Angaben ausschließlich zur Beantwortung Ihrer Anfrage. Keine Weitergabe an Dritte.",
      privacyLink: "Datenschutz",
      successTitle: "Danke — Ihre Anfrage ist angekommen.",
      successBody:
        "Sie liegt bei einem Menschen, nicht in einer Warteschlange. Eine Kopie ist auf dem Weg in Ihr Postfach, und wir melden uns innerhalb von zwei Werktagen — meistens schneller.",
      successAgain: "Weitere Anfrage senden",
      errorTitle: "Das hat nicht geklappt.",
      errorBody:
        "Beim Senden ist etwas schiefgegangen und Ihre Nachricht wurde nicht zugestellt. Bitte versuchen Sie es erneut — oder schreiben Sie uns direkt, dann übernehmen wir von dort.",
      previewTitle: "Es wurde nichts gesendet — diese Seite kann noch keine E-Mails verschicken.",
      previewBody:
        "Ihre Nachricht wurde nirgendwohin übertragen, weil mit dieser Website noch kein E-Mail-Anbieter verbunden ist. Sie haben nichts falsch gemacht. Bis das eingerichtet ist, schreiben Sie uns bitte direkt — dann erreicht es uns.",
      errors: {
        firstName: "Bitte geben Sie Ihren Vornamen an.",
        lastName: "Bitte geben Sie Ihren Nachnamen an.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
        emailFormat: "Diese E-Mail-Adresse sieht nicht korrekt aus.",
        need: "Bitte wählen Sie aus, worum es geht.",
        message: "Bitte beschreiben Sie Ihr Projekt kurz.",
        summary: "Bitte prüfen Sie die markierten Felder.",
      },
      serviceOptions: [
        "Website",
        "Redesign",
        "SEO",
        "Meta Ads",
        "Social Media",
        "Branding",
        "Fotografie",
        "Video",
        "Grafikdesign",
        "Komplettes Marketing",
        "Sonstiges",
      ],
    },
  },


  /**
   * Die Weiche, auf der jeder "Projekt starten"-Button landet. Zwei
   * gleichwertige Wege hinein — schriftliches Briefing oder Gespräch.
   */
  start: {
    metaTitle: "Projekt starten",
    metaDescription:
      "Zwei Wege, mit AMPLIQ zu starten: ein schriftliches Projekt-Briefing senden oder ein kostenloses 30-Minuten-Gespräch buchen. Beides landet bei denselben Menschen.",
    title: "Projekt starten.",
    lead: "Zwei Wege hinein. Schicken Sie uns das Briefing und wir antworten schriftlich, oder nehmen Sie sich eine halbe Stunde und wir sprechen darüber. Beides landet bei denselben Menschen.",
    chooseEyebrow: "Wie möchten Sie beginnen?",
    chooseHeadline: "Womit fangen wir an?",
    brief: {
      index: "01",
      kind: "Schriftlich",
      title: "Projekt-Briefing senden",
      body: "Erzählen Sie uns, wo das Unternehmen steht, was es braucht und welches Budget ungefähr zur Verfügung steht. Wir lesen es selbst und melden uns mit einer ersten Einschätzung zum Umfang.",
      points: [
        "In etwa drei Minuten ausgefüllt",
        "Schriftliche Antwort innerhalb von zwei Werktagen",
        "Kein Telefonat nötig",
      ],
      cta: "Briefing schreiben",
    },
    call: {
      index: "02",
      kind: "Im Gespräch",
      title: "30‑Minuten‑Gespräch buchen",
      body: "Wählen Sie eine Zeit, die Ihnen passt. Keine Pitch-Präsentation — wir hören zu, fragen nach und sagen Ihnen ehrlich, ob wir die Richtigen dafür sind.",
      points: [
        "Dreißig Minuten, kostenlos, unverbindlich",
        "Zeiten in Ihrer eigenen Zeitzone",
        "Sofortige Bestätigung per E-Mail",
      ],
      cta: "Freie Zeiten ansehen",
    },
    directTitle: "Lieber direkt schreiben?",
    directBody:
      "{email} landet im selben Postfach wie das Formular. Keine Vorlage, keine Ticketnummer.",
  },
  booking: {
    title: "Gespräch buchen.",
    lead: "Wählen Sie einen Termin, der Ihnen passt. Dreißig Minuten, ohne Verkaufspräsentation — wir hören zu, fragen nach und sagen Ihnen ehrlich, ob wir die Richtigen dafür sind.",
    metaTitle: "Termin buchen",
    metaDescription:
      "Buchen Sie ein 30-minütiges Gespräch mit AMPLIQ. Termin wählen, Projekt kurz beschreiben — wir kommen vorbereitet.",

    steps: {
      date: "Datum",
      time: "Uhrzeit",
      details: "Angaben",
      done: "Bestätigt",
      stepOf: "Schritt {current} von {total}",
    },

    calendar: {
      heading: "Datum wählen",
      previousMonth: "Vorheriger Monat",
      nextMonth: "Nächster Monat",
      loading: "Verfügbarkeit wird geprüft…",
      weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      dayAvailableOne: "{date} — 1 Termin frei",
      dayAvailableMany: "{date} — {count} Termine frei",
      dayFull: "{date} — ausgebucht",
      dayTooSoon: "{date} — zu kurzfristig",
      dayPast: "{date} — bereits vorbei",
      dayClosed: "{date} — an diesem Tag keine Gespräche",
      legendAvailable: "Frei",
      legendFull: "Ausgebucht",
      legendClosed: "Geschlossen oder zu kurzfristig",
      empty: "Diesen Monat sind keine Termine mehr frei.",
      emptyBody:
        "Versuchen Sie den nächsten Monat oder schreiben Sie uns — wir finden einen Termin.",
    },

    slots: {
      heading: "Uhrzeit wählen",
      backToDates: "Datum ändern",
      none: "An diesem Tag sind keine Termine frei.",
      noneBody:
        "Wählen Sie ein anderes Datum oder senden Sie uns stattdessen eine Anfrage.",
      taken: "Vergeben",
      tooSoon: "Zu kurzfristig",
      past: "Vorbei",
      durationNote: "{minutes} Minuten",
      shownIn: "Zeiten in Ihrer Zeitzone ({zone})",
      alsoIn: "{time} unserer Zeit ({zone})",
      changeZone: "Nicht Ihre Zeitzone?",
      zoneLabel: "Zeiten anzeigen in",
    },

    availability: {
      liveTitle: "Verfügbarkeit in Echtzeit",
      liveBody: "Diese Zeiten sind gerade mit unserem Kalender abgeglichen.",
      provisionalTitle: "Verfügbarkeit ohne Kalenderabgleich",
      provisionalBody:
        "Mit dieser Website ist noch kein Kalender verbunden. Sie sehen unsere veröffentlichten Arbeitszeiten abzüglich der hier bereits gebuchten Termine — keinen Live-Abgleich. Jede Buchung bestätigen wir per E-Mail.",
      offlineTitle: "Verfügbarkeit wird nicht geprüft",
      offlineBody:
        "Hinter dieser Vorschau läuft kein Server. Die Zeiten unten stammen ausschließlich aus unseren veröffentlichten Arbeitszeiten, sind mit keinem Kalender abgeglichen, und eine Buchung kann hier nicht abgeschlossen werden.",
      errorTitle: "Unser Kalender war nicht erreichbar",
      errorBody:
        "Die Zeiten unten sind unsere Arbeitszeiten, kein Live-Abgleich. Senden Sie uns stattdessen eine Anfrage — wir bestätigen einen Termin per E-Mail.",
    },

    details: {
      heading: "Ihre Angaben",
      back: "Uhrzeit ändern",
      name: "Ihr Name",
      email: "E-Mail",
      company: "Unternehmen",
      companyOptional: "optional",
      phone: "Telefon",
      phoneOptional: "optional",
      projectType: "Um welche Art Projekt geht es?",
      projectTypeOptional: "optional",
      projectTypePlaceholder: "Auswählen — oder unten beschreiben",
      message: "Worüber möchten Sie sprechen?",
      messagePlaceholder:
        "Das Unternehmen, was gerade nicht funktioniert, und wie ein gutes Ergebnis aussähe. Ein paar Zeilen genügen.",
      privacyNote:
        "Wir verwenden Ihre Angaben für diesen Termin und die Beantwortung Ihrer Anfrage. Sonst nichts, und nichts wird weitergegeben.",
      privacyLink: "Datenschutzerklärung",
      submit: "Termin bestätigen",
      submitting: "Wird bestätigt…",
      summaryTitle: "Sie buchen",
      summaryEmpty: "Noch kein Termin gewählt",
      errors: {
        summary: "Bitte prüfen Sie die markierten Felder.",
        name: "Bitte geben Sie Ihren Namen ein.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        emailFormat: "Diese E-Mail-Adresse sieht nicht richtig aus.",
        message: "Bitte schreiben Sie uns kurz etwas zum Projekt.",
        tooLong: "Das ist länger, als wir annehmen können.",
      },
    },

    confirmation: {
      title: "Ihr Termin steht.",
      body: "Wir haben die Zeit reserviert und Ihnen eine Bestätigung geschickt. Wenn sich etwas ändert, antworten Sie einfach auf diese E-Mail — dann verschieben wir.",
      emailSent: "Bestätigung an {email} gesendet.",
      emailNotSent:
        "Es wurde keine Bestätigungs-E-Mail versendet — mit dieser Website ist noch kein Mailanbieter verbunden. Ihre Buchung ist gespeichert und für uns sichtbar.",
      calendarNote:
        "Tragen Sie den Termin am besten direkt in Ihren eigenen Kalender ein.",
      addToCalendar: "Zum Kalender hinzufügen",
      whatNext: "Wie es weitergeht",
      whatNextBody:
        "Wir lesen Ihre Angaben vor dem Gespräch, damit wir mit Ihrer Situation anfangen können und nicht mit einer Vorstellungsrunde.",
      bookAnother: "Weiteren Termin buchen",
      backHome: "Zurück zur Startseite",
    },

    problems: {
      takenTitle: "Dieser Termin ist gerade vergeben worden.",
      takenBody:
        "Jemand hat ihn gebucht, während Sie das Formular ausgefüllt haben. Bitte wählen Sie eine andere Zeit — die Liste unten ist aktuell.",
      failedTitle: "Das hat nicht geklappt.",
      failedBody:
        "Unterwegs ist etwas schiefgegangen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt — wir finden einen Termin.",
      noServerTitle: "Diese Vorschau kann keine Buchungen annehmen.",
      noServerBody:
        "Hinter diesem Build läuft kein Server. Es wurde nichts übermittelt und keine Zeit reserviert. Auf der Live-Website schließt dieser Schritt die Buchung ab. Schreiben Sie uns bis dahin einfach — wir vereinbaren einen Termin.",
      emailUs: "Stattdessen E-Mail schreiben",
    },

    fallback: {
      title: "Lieber schreiben als sprechen?",
      body: "Schicken Sie uns die Eckdaten — wir antworten innerhalb von zwei Werktagen.",
      cta: "Anfrage senden",
    },
  },

  legal: {
    indexTitle: "Rechtliches",
    indexLead:
      "Impressum, Datenschutz, AGB und Widerruf. Aufgebaut nach den Vorgaben des deutschen Rechts — alles, was uns noch fehlt, ist als offen markiert statt ausgefüllt.",
    imprintTitle: "Impressum",
    imprintLead: "Anbieterkennzeichnung nach § 5 DDG und § 18 MStV.",
    privacyTitle: "Datenschutzerklärung",
    privacyLead:
      "Was diese Website verarbeitet, warum, auf welcher Rechtsgrundlage — und was Sie von uns verlangen können.",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    termsLead:
      "Die Bedingungen für Projekte mit AMPLIQ: Umfang, Preise, Nutzungsrechte, Haftung und Kündigung.",
    cancellationTitle: "Widerrufsbelehrung",
    cancellationLead:
      "Das gesetzliche Widerrufsrecht für Verbraucher, wie Sie es ausüben und wann es erlischt.",
    cookiesTitle: "Cookie-Richtlinie",
    cookiesLead:
      "Ein funktionales Cookie, gesetzt nur beim Sprachwechsel. Keine Analyse, keine Werbung, kein Tracking.",
    contents: "Inhalt",
    lastUpdated: "Zuletzt aktualisiert",
    draftNoticeLabel: "Dokumentstatus",
    draftNoticeTitle: "Noch nicht vollständig und noch nicht juristisch geprüft.",
    draftNoticeBody:
      "Die Struktur folgt den Vorgaben des deutschen Rechts, und die technischen Beschreibungen entsprechen dem, was dieser Build tatsächlich tut. Die Unternehmensangaben fehlen noch, und der juristische Text wurde nicht von einer Anwältin oder einem Anwalt geprüft. Bis beides erledigt ist, ist dieses Dokument ein Arbeitsstand — keine vollständige Pflichtangabe und keine Rechtsberatung.",
    outstandingRequired: "Vor dem Launch erforderlich:",
    outstandingOptional: "Nur soweit für die Rechtsform einschlägig:",
    missingValue: "Wird noch ergänzt",
    readMore: "Lesen",
  },

  notFound: {
    code: "404",
    title: "Diese Seite gibt es nicht.",
    body: "Der Link ist vielleicht alt oder die Seite ist umgezogen. Alles andere liegt noch da, wo Sie es verlassen haben.",
  },

  footer: {
    tagline: "Marketing, verstärkt.",
    navTitle: "Navigation",
    socialTitle: "Social Media",
    legalTitle: "Rechtliches",
    contactTitle: "Kontakt",
    projectLabel: "Projekte & Angebote",
    helpLabel: "Allgemeine Hilfe",
    rights: "Alle Rechte vorbehalten.",
    builtNote: "Design und Entwicklung im Haus.",
    ctaLine: "Sie haben ein Projekt im Kopf?",
  },
};
