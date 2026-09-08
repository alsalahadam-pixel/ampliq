/**
 * English — the primary language and the source of truth for the dictionary
 * shape. `de.ts` is typed against this file, so a missing German string is a
 * build error rather than a silent fallback.
 */
export const en = {
  meta: {
    localeLabel: "English",
    switchTo: "Switch to German",
  },

  nav: {
    work: "Work",
    services: "Services",
    packages: "Packages",
    about: "About",
    insights: "Insights",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primary: "Primary",
    language: "Language",
  },

  cta: {
    start: "Start a project",
    consultation: "Free consultation",
    work: "See our work",
    allWork: "All work",
    allServices: "All services",
    allInsights: "All insights",
    readMore: "Read",
    backToWork: "Back to work",
    backToInsights: "Back to insights",
    backHome: "Back to home page",
    talk: "Talk to us",
  },

  common: {
    skipToContent: "Skip to content",
    email: "Email",
    of: "of",
    concept: "Concept",
    inProgress: "In progress",
    scrollHint: "Scroll",
    placeholderNotice: "Placeholder — to be supplied before launch",
  },

  home: {
    hero: {
      eyebrow: "Marketing & creative agency — Germany",
      headlineTop: "Marketing,",
      headlineBottom: "amplified",
      lead: "AMPLIQ connects brand, design and marketing into one system — so your company looks the way it actually performs, and gets found by the people who should be finding it.",
      pillars: [
        { key: "build", label: "Build", note: "Websites that work" },
        { key: "create", label: "Create", note: "Brand and content" },
        { key: "grow", label: "Grow", note: "Reach and leads" },
      ],
    },

    positioning: {
      eyebrow: "Who this is for",
      headline: "For companies ready to look the part.",
      body: "We work with businesses that have something real to sell and know their marketing doesn't show it yet — B2B and SaaS, professional services, hospitality and retail, real estate, and local companies with regional ambition.",
      marquee: [
        "Brand systems",
        "Websites",
        "Redesigns",
        "Photography",
        "Video",
        "SEO",
        "Meta Ads",
        "Social content",
        "Landing pages",
        "Visual identity",
        "Campaign strategy",
        "Lead generation",
      ],
    },

    problem: {
      eyebrow: "The problem",
      headline: "Strong companies deserve strong marketing.",
      body: "Most businesses don't have a marketing problem. They have a coherence problem. The work is good and the team is good — and then everything a customer actually sees was built at a different time, by different people, to a different standard.",
      symptoms: [
        "The website is years behind the business.",
        "The brand looks different on every channel.",
        "Content gets produced ad hoc, or not at all.",
        "Photography looks bought, not made.",
        "Ads run without a strategy behind them.",
        "Nobody finds you when they search.",
      ],
      close: "None of it is fatal on its own. Together, it quietly costs customers.",
    },

    system: {
      eyebrow: "The AMPLIQ system",
      headline: "Three parts. One system.",
      body: "Marketing stops working when it's bought in pieces. We build the three layers that make each other stronger — a foundation people trust, work worth showing, and the reach to put it in front of the right people.",
      note: "Every engagement starts with the layer that's holding you back.",
    },

    work: {
      eyebrow: "Selected work",
      headline: "Work that has to do a job.",
      body: "A small, deliberate portfolio. Every project here is described as what it actually was — no invented results, no borrowed credentials.",
      openTitle: "The next one could be yours",
      openBody: "We're early, and we'd rather show three honest things than twenty invented ones. If you want a project made properly, that's the conversation to have.",
    },

    services: {
      eyebrow: "What we do",
      headline: "Everything a brand needs to be seen — and nothing it doesn't.",
      body: "Twelve disciplines, organised into three layers. Take one, or take the system.",
    },

    packages: {
      eyebrow: "Packages",
      headline: "Clear starting points.",
      body: "Every business starts from a different place, so these are entry points rather than fixed menus. We confirm scope and a fixed price after the first conversation.",
      unsureTitle: "Not sure what you need?",
      unsureBody: "Tell us where the business is today. We'll tell you honestly what would move the needle first — even when that's less work than you expected.",
    },

    process: {
      eyebrow: "How we work",
      headline: "A process you can follow.",
      body: "Five stages, the same every time. You always know what's happening, what's next, and what we need from you.",
    },

    principles: {
      eyebrow: "Why AMPLIQ",
      headline: "How we think about the work.",
      body: "Not claims about ourselves — the rules we actually work by.",
      items: [
        {
          title: "Strategy before design.",
          body: "We ask what the work has to achieve before deciding what it looks like.",
        },
        {
          title: "Design with a function.",
          body: "Every layout, image and line is there to move someone one step further.",
        },
        {
          title: "One brand, not a pile of tactics.",
          body: "Channels either feed each other or they waste each other's budget.",
        },
        {
          title: "Creativity with commercial intent.",
          body: "Work should be worth looking at and worth what it costs.",
        },
        {
          title: "Transparent communication.",
          body: "Clear scope, clear pricing, clear status. No agency fog.",
        },
        {
          title: "Long-term thinking.",
          body: "We build assets you still own and still use in three years.",
        },
      ],
    },

    about: {
      eyebrow: "About",
      headline: "An independent studio, built the way we'd want to be hired.",
      body: "The people you brief are the people who do the work. No account layer, no handover to a junior team, no sixty-slide deck before anything gets made.",
      link: "More about AMPLIQ",
    },

    insights: {
      eyebrow: "Insights",
      headline: "Straight answers to the questions clients actually ask.",
      body: "What things cost, what's worth doing first, and what quietly wastes money.",
    },

    finalCta: {
      eyebrow: "Start here",
      headline: "Ready to amplify your brand?",
      body: "Tell us where your business is today and what you want to reach. You'll get a straight answer on scope, timeline and budget — not a pitch deck.",
    },
  },

  work: {
    title: "Work",
    lead: "A small portfolio, honestly presented. Each project describes the work that was actually done.",
    metaClient: "Client",
    metaYear: "Year",
    metaCategory: "Discipline",
    metaScope: "Scope",
    metaRole: "Role",
    metaStatus: "Status",
    challenge: "The brief",
    approach: "Approach",
    creative: "Creative direction",
    execution: "Execution",
    gallery: "Gallery",
    delivered: "What was delivered",
    learnings: "What we took from it",
    resultsPending:
      "Performance data for this project isn't published here. When measurable results are available and confirmed with the client, they'll be added — we don't estimate numbers.",
    imagePlaceholder: "Project imagery to be added",
    related: "More work",
    conceptNotice:
      "This is a self-initiated concept study, not client work. It's labelled as such everywhere it appears.",
  },

  services: {
    title: "Services",
    lead: "Three layers, twelve disciplines. Each one can stand alone — they're just worth more together.",
    problemTitle: "The problem it solves",
    solutionTitle: "How we approach it",
    deliverablesTitle: "What you get",
    processTitle: "How it runs",
    useCasesTitle: "Typical situations",
    faqTitle: "Questions",
    relatedTitle: "Works well with",
    pillarLabel: "Layer",
  },

  packages: {
    title: "Packages",
    lead: "Three starting points and a custom path. Prices are entry points — scope and a fixed quote are confirmed after the first conversation.",
    from: "From",
    custom: "Custom quote",
    forWho: "Who it's for",
    includes: "Typically includes",
    solves: "What it solves",
    scope: "Typical scope",
    engagement: "How it runs",
    customTitle: "Something in between?",
    customBody:
      "Most projects don't fit neatly into a package. Tell us the situation and we'll scope it properly — sometimes that means less than a package, not more.",
    priceNote:
      "Prices are net, excluding VAT, and represent a starting point rather than a fixed project price.",
  },

  about: {
    title: "About",
    lead: "AMPLIQ is an independent marketing and creative studio working with companies in Germany.",
  },

  insights: {
    title: "Insights",
    lead: "Practical writing on branding, websites and marketing for companies in Germany.",
    readingTime: "min read",
    published: "Published",
    updated: "Updated",
    tableOfContents: "In this article",
    moreArticles: "More reading",
    ctaTitle: "Have a question this didn't answer?",
    ctaBody: "Ask it directly. We answer questions about scope and budget without a sales call attached.",
  },

  contact: {
    title: "Start a project.",
    lead: "Tell us where your business is today and what you want to reach. We read every message ourselves and reply within two working days.",
    directTitle: "Prefer email?",
    directBody: "Write to us directly and we'll pick it up from there.",
    consultationTitle: "Rather talk first?",
    consultationBody:
      "A free 30-minute call to work out what's worth doing — with no obligation to book anything afterwards.",
    form: {
      legendAbout: "About you",
      legendProject: "About the project",
      firstName: "First name",
      lastName: "Last name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      phoneOptional: "optional",
      website: "Website",
      websiteOptional: "optional",
      need: "What do you need?",
      needPlaceholder: "Select a starting point",
      budget: "Budget",
      timeline: "Timeline",
      services: "Services you're interested in",
      servicesHint: "Select as many as apply.",
      message: "Anything else we should know?",
      messagePlaceholder:
        "What's the business, what's not working, and what would make this project a success?",
      submit: "Send enquiry",
      submitting: "Sending…",
      required: "Required",
      privacyNote:
        "We use your details to answer your enquiry. Nothing else, and nothing passed on.",
      privacyLink: "Privacy policy",
      successTitle: "Thank you — that's arrived.",
      successBody:
        "We'll read it properly and come back to you within two working days, usually sooner.",
      successAgain: "Send another enquiry",
      errorTitle: "That didn't send.",
      errorBody:
        "Something went wrong on the way. Please try again, or email us directly and we'll pick it up.",
      previewTitle: "Preview mode — nothing was sent.",
      previewBody:
        "This form has no delivery endpoint configured yet, so your message was not transmitted anywhere. Connect a provider before launch.",
      errors: {
        firstName: "Please enter your first name.",
        lastName: "Please enter your last name.",
        email: "Please enter a valid email address.",
        emailFormat: "That email address doesn't look right.",
        need: "Please choose what you need.",
        message: "Please tell us a little about the project.",
        summary: "Please check the highlighted fields.",
      },
      needOptions: [
        { value: "website", label: "A new website" },
        { value: "redesign", label: "A website redesign" },
        { value: "branding", label: "Branding or visual identity" },
        { value: "content", label: "Photography, video or content" },
        { value: "growth", label: "SEO, ads or social" },
        { value: "full", label: "A full marketing partner" },
        { value: "other", label: "Something else" },
      ],
      budgetOptions: [
        { value: "500-1000", label: "€500 – €1,000" },
        { value: "1000-2500", label: "€1,000 – €2,500" },
        { value: "2500-5000", label: "€2,500 – €5,000" },
        { value: "5000+", label: "€5,000+" },
        { value: "unsure", label: "Not sure yet" },
      ],
      timelineOptions: [
        { value: "asap", label: "As soon as possible" },
        { value: "1-3", label: "1–3 months" },
        { value: "3-6", label: "3–6 months" },
        { value: "flexible", label: "Flexible" },
      ],
      serviceOptions: [
        "Website",
        "Redesign",
        "SEO",
        "Meta Ads",
        "Social media",
        "Branding",
        "Photography",
        "Video",
        "Graphic design",
        "Full marketing",
        "Other",
      ],
    },
  },

  legal: {
    imprintTitle: "Imprint",
    privacyTitle: "Privacy policy",
    cookiesTitle: "Cookie settings",
    lastUpdated: "Last updated",
    draftNoticeTitle: "This document is not complete.",
    draftNoticeBody:
      "The structure is in place, but the company details and legal text still have to be supplied and reviewed by a qualified lawyer before this site goes live. Nothing on this page should be treated as legal advice or as a completed disclosure.",
    missingValue: "To be supplied",
  },

  notFound: {
    code: "404",
    title: "This page doesn't exist.",
    body: "The link may be old, or the page may have moved. The work is still where you left it.",
  },

  footer: {
    tagline: "Marketing, amplified.",
    navTitle: "Navigation",
    socialTitle: "Social",
    legalTitle: "Legal",
    contactTitle: "Contact",
    rights: "All rights reserved.",
    builtNote: "Designed and built in-house.",
    ctaLine: "Have a project in mind?",
  },
};

/**
 * The dictionary contract. Types stay widened (no `as const`) so translations
 * are checked structurally rather than against English string literals.
 */
export type Dictionary = typeof en;
