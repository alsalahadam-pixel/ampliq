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
    work: "Arbeiten ansehen",
    allWork: "Alle Arbeiten",
    allServices: "Alle Leistungen",
    allInsights: "Alle Insights",
    readMore: "Lesen",
    backToWork: "Zurück zu den Arbeiten",
    backToInsights: "Zurück zu den Insights",
    backHome: "Zurück zur Startseite",
    talk: "Sprechen wir",
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
      lead: "AMPLIQ verbindet Marke, Design und Marketing zu einem System. Damit Ihr Unternehmen so aussieht, wie es arbeitet — und von den Menschen gefunden wird, die zu Ihnen passen.",
      pillars: [
        { key: "build", label: "Build", note: "Websites, die funktionieren" },
        { key: "create", label: "Create", note: "Marke und Content" },
        { key: "grow", label: "Grow", note: "Sichtbarkeit und Anfragen" },
      ],
    },

    positioning: {
      eyebrow: "Für wen wir arbeiten",
      headline: "Für Unternehmen, die mehr aus ihrer Marke machen wollen.",
      body: "Wir arbeiten mit Unternehmen, die etwas Substanzielles anbieten — und wissen, dass ihr Marketing das noch nicht zeigt. B2B und SaaS, Dienstleister, Gastronomie und Handel, Immobilien und lokale Unternehmen mit regionalem Anspruch.",
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
      body: "Ein bewusst kleines Portfolio. Jedes Projekt hier ist so beschrieben, wie es tatsächlich war — ohne erfundene Ergebnisse und ohne geliehene Referenzen.",
      openTitle: "Das nächste Projekt könnte Ihres sein",
      openBody: "Wir stehen am Anfang und zeigen lieber drei ehrliche Arbeiten als zwanzig erfundene. Wenn Sie ein Projekt richtig gemacht haben wollen, sprechen wir darüber.",
    },

    services: {
      eyebrow: "Was wir machen",
      headline: "Alles, was eine Marke sichtbar macht — und nichts darüber hinaus.",
      body: "Zwölf Disziplinen in drei Ebenen. Einzeln buchbar, im System stärker.",
    },

    packages: {
      eyebrow: "Pakete",
      headline: "Klare Einstiegspunkte.",
      body: "Jedes Unternehmen startet an einem anderen Punkt. Deshalb sind das Einstiege und keine festen Menüs. Umfang und Festpreis halten wir nach dem ersten Gespräch schriftlich fest.",
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
      headline: "Ein unabhängiges Studio — so aufgestellt, wie wir selbst beauftragen würden.",
      body: "Die Menschen, die Sie briefen, sind die Menschen, die arbeiten. Keine Account-Ebene, keine Übergabe an ein Junior-Team, keine sechzig Folien, bevor etwas entsteht.",
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
    lead: "Ein kleines Portfolio, ehrlich dargestellt. Jedes Projekt beschreibt die Arbeit, die tatsächlich gemacht wurde.",
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
      "Leistungsdaten zu diesem Projekt veröffentlichen wir hier nicht. Sobald belastbare Ergebnisse vorliegen und mit dem Kunden abgestimmt sind, ergänzen wir sie — geschätzte Zahlen gibt es bei uns nicht.",
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
    lead: "Drei Einstiegspunkte und ein individueller Weg. Die Preise sind Startpunkte — Umfang und Festpreis halten wir nach dem ersten Gespräch fest.",
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
    priceNote:
      "Alle Preise netto zzgl. USt. und als Startpunkt zu verstehen, nicht als fester Projektpreis.",
  },

  about: {
    title: "Über uns",
    lead: "AMPLIQ ist ein unabhängiges Studio für Marketing und Kreation und arbeitet mit Unternehmen in Deutschland.",
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
