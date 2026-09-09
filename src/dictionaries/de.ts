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
    work: "Arbeiten",
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
    work: "Arbeiten ansehen",
    allWork: "Alle Arbeiten ansehen",
    allServices: "Leistungen entdecken",
    allInsights: "Alle Insights",
    readMore: "Lesen",
    backToWork: "Zurück zu den Arbeiten",
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
      eyebrow: "Marketing- & Kreativagentur — Deutschland",
      headlineTop: "Marketing,",
      headlineBottom: "verstärkt",
      lead: "Marke, Website und Kampagnen als ein System — damit jeder Euro im Marketing den nächsten wirksamer macht.",
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
      body: "Marketing funktioniert nicht mehr, sobald es in Einzelteilen eingekauft wird. Wir bauen die drei Ebenen, die sich gegenseitig stärken: ein Fundament, dem man vertraut, Arbeiten, die man zeigen kann, und die Reichweite, die beides vor die richtigen Menschen bringt.",
      note: "Jedes Projekt beginnt bei der Ebene, die Sie gerade ausbremst.",
    },

    work: {
      eyebrow: "Ausgewählte Arbeiten",
      headline: "Arbeiten, die eine Aufgabe haben.",
      body: "Ausgewählte Projekte, vollständig dokumentiert: die Aufgabe, der Gedanke dahinter und das, was tatsächlich entstanden ist.",
      openTitle: "Das nächste Projekt beginnen",
      openBody: "Sagen Sie uns, was das Unternehmen erreichen soll. Umfang, Zeitrahmen und Budget stehen fest, bevor die Arbeit beginnt.",
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

  work: {
    title: "Arbeiten",
    lead: "Ausgewählte Projekte, jedes vollständig dokumentiert — Aufgabe, Herangehensweise und Ergebnis.",
    metaClient: "Kunde",
    metaYear: "Jahr",
    metaCategory: "Disziplin",
    metaScope: "Umfang",
    metaRole: "Rolle",
    metaStatus: "Status",
    challenge: "Die Aufgabe",
    approach: "Herangehensweise",
    creative: "Kreative Richtung",
    execution: "Umsetzung",
    gallery: "Galerie",
    delivered: "Was entstanden ist",
    learnings: "Was wir mitgenommen haben",
    resultsPending:
      "Leistungsdaten zu diesem Projekt veröffentlichen wir hier nicht. Wo Ergebnisse gemessen und mit dem Kunden abgestimmt sind, stehen sie auf der Seite — geschätzte Zahlen gibt es bei uns nicht.",
    imagePlaceholder: "Projektbilder folgen",
    related: "Weitere Arbeiten",
    conceptNotice:
      "Eine eigeninitiierte Konzeptstudie, kein Kundenprojekt. Sie ist überall entsprechend gekennzeichnet.",
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
    lead: "Drei Einstiege und ein individueller Weg. Jede Zahl ist ein Startpunkt für einen definierten Umfang — individuell kalkuliert, bevor die Arbeit beginnt.",
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
    scopeNote: "Der Umfang hängt von Ihrem Projekt ab.",
    priceNote:
      "Alle Preise netto zzgl. USt. und als Startpunkt für einen definierten Umfang zu verstehen — kein fester Projektpreis. Jedes Projekt wird individuell kalkuliert.",
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
    title: "Projekt starten.",
    lead: "Erzählen Sie uns, wo Ihr Unternehmen heute steht und was Sie erreichen möchten. Wir lesen jede Nachricht selbst und antworten innerhalb von zwei Werktagen.",
    directTitle: "Lieber per E-Mail?",
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
        "Wir lesen sie in Ruhe und melden uns innerhalb von zwei Werktagen, meistens schneller.",
      successAgain: "Weitere Anfrage senden",
      errorTitle: "Das hat nicht geklappt.",
      errorBody:
        "Beim Senden ist etwas schiefgegangen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per E-Mail.",
      previewTitle: "Vorschaumodus — es wurde nichts gesendet.",
      previewBody:
        "Für dieses Formular ist noch kein Versandziel hinterlegt, Ihre Nachricht wurde also nirgendwohin übertragen. Vor dem Launch muss ein Anbieter verbunden werden.",
      errors: {
        firstName: "Bitte geben Sie Ihren Vornamen an.",
        lastName: "Bitte geben Sie Ihren Nachnamen an.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
        emailFormat: "Diese E-Mail-Adresse sieht nicht korrekt aus.",
        need: "Bitte wählen Sie aus, worum es geht.",
        message: "Bitte beschreiben Sie Ihr Projekt kurz.",
        summary: "Bitte prüfen Sie die markierten Felder.",
      },
      needOptions: [
        { value: "website", label: "Eine neue Website" },
        { value: "redesign", label: "Ein Website-Redesign" },
        { value: "branding", label: "Branding oder Visual Identity" },
        { value: "content", label: "Fotografie, Video oder Content" },
        { value: "growth", label: "SEO, Ads oder Social Media" },
        { value: "full", label: "Einen festen Marketingpartner" },
        { value: "other", label: "Etwas anderes" },
      ],
      budgetOptions: [
        { value: "500-1000", label: "500 € – 1.000 €" },
        { value: "1000-2500", label: "1.000 € – 2.500 €" },
        { value: "2500-5000", label: "2.500 € – 5.000 €" },
        { value: "5000+", label: "5.000 €+" },
        { value: "unsure", label: "Noch unsicher" },
      ],
      timelineOptions: [
        { value: "asap", label: "So schnell wie möglich" },
        { value: "1-3", label: "1–3 Monate" },
        { value: "3-6", label: "3–6 Monate" },
        { value: "flexible", label: "Flexibel" },
      ],
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

  booking: {
    title: "Projekt starten.",
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
    imprintTitle: "Impressum",
    privacyTitle: "Datenschutzerklärung",
    cookiesTitle: "Cookie-Einstellungen",
    lastUpdated: "Zuletzt aktualisiert",
    draftNoticeTitle: "Dieses Dokument ist nicht vollständig.",
    draftNoticeBody:
      "Die Struktur steht, die Unternehmensangaben und die rechtlichen Texte müssen jedoch noch ergänzt und vor dem Launch anwaltlich geprüft werden. Nichts auf dieser Seite ist eine Rechtsberatung oder eine vollständige Pflichtangabe.",
    missingValue: "Wird ergänzt",
  },

  notFound: {
    code: "404",
    title: "Diese Seite gibt es nicht.",
    body: "Der Link ist vielleicht alt oder die Seite ist umgezogen. Die Arbeiten liegen noch da, wo Sie sie verlassen haben.",
  },

  footer: {
    tagline: "Marketing, verstärkt.",
    navTitle: "Navigation",
    socialTitle: "Social",
    legalTitle: "Rechtliches",
    contactTitle: "Kontakt",
    rights: "Alle Rechte vorbehalten.",
    builtNote: "Design und Entwicklung im Haus.",
    ctaLine: "Sie haben ein Projekt im Kopf?",
  },
};
