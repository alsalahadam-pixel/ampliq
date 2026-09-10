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
    enquiry: "Send an enquiry",
    allServices: "Explore services",
    allInsights: "All insights",
    readMore: "Read",
    backToInsights: "Back to insights",
    backHome: "Back to home page",
    talk: "Book a consultation",
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
      eyebrow: "Marketing & creative agency — Germany & Europe",
      headlineTop: "Marketing,",
      headlineBottom: "amplified",
      lead: "Brand, website and campaigns, built as one system — so every euro you put into marketing makes the next one work harder.",
      audience: "For mid-market and growing companies across Germany and Europe.",
      pillars: [
        { key: "build", label: "Build", note: "Websites that work" },
        { key: "create", label: "Create", note: "Brand and content" },
        { key: "grow", label: "Grow", note: "Reach and leads" },
      ],
    },

    positioning: {
      eyebrow: "Who this is for",
      headline: "For companies that expect more from their marketing.",
      body: "B2B and SaaS, professional services, retail and hospitality, real estate — mid-market and growing companies across Germany and Europe, where the business is strong and the marketing has yet to catch up.",
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
      body: "Marketing stops working when it's bought in pieces. We build the three layers that make each other stronger — a foundation people trust, creative worth paying attention to, and the reach to put both in front of the right people.",
      note: "Every engagement starts with the layer that's holding you back.",
    },


    services: {
      eyebrow: "What we do",
      headline: "Everything a brand needs to be seen — and nothing it doesn't.",
      body: "Twelve disciplines, organised into three layers. Take one, or take the system.",
    },

    packages: {
      eyebrow: "Packages",
      headline: "Clear starting points.",
      body: "Three ways to start. Each figure is an entry point for a defined scope — what that scope covers is agreed with you, then fixed in writing.",
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
      headline: "Built for businesses that care how they show up.",
      body: "Strategy, design and marketing under one roof — so the brand, the site and the campaigns reinforce each other instead of competing for budget.",
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
    lead: "Three ways to start. Each figure is a starting point for a defined scope — not a fixed project price, and never the whole AMPLIQ offering. Every engagement is quoted individually before anything begins.",
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
    scopeNote: "Final price depends on the scope you actually need.",
    priceNote:
      "All prices are net of VAT and are starting points for a defined scope, not fixed project prices. START is one focused project with one defined outcome — not a bundle of everything listed. Every engagement is quoted individually before it begins.",
  },

  about: {
    title: "About",
    lead: "A marketing and creative agency combining strategy, design, content and digital growth.",
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
    title: "Tell us about the project.",
    lead: "Tell us where your business is today and what you want to reach. We read every message ourselves and reply within two working days.",
    directTitle: "Prefer email?",
    generalLabel: "General enquiries",
    projectLabel: "Projects & proposals",
    helpLabel: "General help",
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
        "It's in front of a person, not a queue. A copy is on its way to your inbox, and we'll come back to you within two working days — usually sooner.",
      successAgain: "Send another enquiry",
      errorTitle: "That didn't send.",
      errorBody:
        "Something went wrong on the way and your message was not delivered. Please try again — or email us directly and we'll pick it up from there.",
      previewTitle: "Nothing was sent — this site can't deliver mail yet.",
      previewBody:
        "Your message was not transmitted anywhere, because no email provider is connected to this site yet. Nothing you did caused this. Until it is set up, write to us directly and it will reach us.",
      errors: {
        firstName: "Please enter your first name.",
        lastName: "Please enter your last name.",
        email: "Please enter a valid email address.",
        emailFormat: "That email address doesn't look right.",
        need: "Please choose what you need.",
        message: "Please tell us a little about the project.",
        summary: "Please check the highlighted fields.",
      },
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


  /**
   * The fork every "Start a project" CTA lands on. Two honest ways in — a
   * written brief or a call — presented at equal weight, because neither is
   * a lesser option and the visitor knows which suits them better than we do.
   */
  start: {
    metaTitle: "Start a project",
    metaDescription:
      "Two ways to start with AMPLIQ: send a written project brief, or book a free 30-minute call. Both reach the same people.",
    title: "Start a project.",
    lead: "Two ways in. Send the brief and we come back to you in writing, or take half an hour and we talk it through. Both land with the same people.",
    chooseEyebrow: "Choose how to begin",
    chooseHeadline: "How would you rather start?",
    brief: {
      index: "01",
      kind: "In writing",
      title: "Send a project brief",
      body: "Tell us where the business is, what it needs and roughly what you have to spend. We read it ourselves and come back with a first view on scope.",
      points: [
        "Around three minutes to fill in",
        "A written reply within two working days",
        "No call required",
      ],
      cta: "Write the brief",
    },
    call: {
      index: "02",
      kind: "In conversation",
      title: "Book a 30‑minute call",
      body: "Pick a time that suits you. No pitch deck — we listen, ask what we need to ask, and tell you honestly whether we are the right people for it.",
      points: [
        "Thirty minutes, free, no obligation",
        "Times shown in your own timezone",
        "Confirmed by email straight away",
      ],
      cta: "See available times",
    },
    directTitle: "Rather just write to us?",
    directBody:
      "{email} reaches the same inbox as the form. No template, no ticket number.",
  },
  booking: {
    title: "Book a call.",
    lead: "Pick a time that works for you. Thirty minutes, no pitch deck — we listen, ask what we need to ask, and tell you honestly whether we're the right people for it.",
    metaTitle: "Book a call",
    metaDescription:
      "Book a 30-minute call with AMPLIQ. Choose a time, tell us about the project, and we'll come prepared.",

    steps: {
      date: "Date",
      time: "Time",
      details: "Details",
      done: "Confirmed",
      stepOf: "Step {current} of {total}",
    },

    calendar: {
      heading: "Choose a date",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      loading: "Checking availability…",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      /** Read out to screen readers in place of the bare number. */
      dayAvailableOne: "{date} — 1 time available",
      dayAvailableMany: "{date} — {count} times available",
      dayFull: "{date} — fully booked",
      dayTooSoon: "{date} — too soon to book",
      dayPast: "{date} — already past",
      dayClosed: "{date} — no calls this day",
      legendAvailable: "Available",
      legendFull: "Fully booked",
      legendClosed: "Closed or too soon",
      empty: "No times left this month.",
      emptyBody: "Try the next month, or write to us and we'll find something.",
    },

    slots: {
      heading: "Choose a time",
      backToDates: "Change date",
      none: "No times available on this day.",
      noneBody: "Pick another date, or send an enquiry instead.",
      taken: "Taken",
      tooSoon: "Too soon",
      past: "Past",
      durationNote: "{minutes} minutes",
      shownIn: "Times shown in your timezone ({zone})",
      alsoIn: "{time} our time ({zone})",
      changeZone: "Not your timezone?",
      zoneLabel: "Show times in",
    },

    availability: {
      liveTitle: "Live availability",
      liveBody: "These times are checked against our calendar right now.",
      provisionalTitle: "Availability is provisional",
      provisionalBody:
        "No calendar is connected to this site yet, so these are our published working hours minus bookings already made here — not a live calendar check. We confirm every booking by email.",
      offlineTitle: "Availability is not being checked",
      offlineBody:
        "This preview has no server behind it, so the times below come from our published working hours only. Nothing here has been checked against a calendar and no booking can be completed.",
      errorTitle: "We couldn't reach our calendar",
      errorBody:
        "The times below are our working hours, not a live check. Send an enquiry instead and we'll confirm a time by email.",
    },

    details: {
      heading: "Your details",
      back: "Change time",
      name: "Your name",
      email: "Email",
      company: "Company",
      companyOptional: "optional",
      phone: "Phone",
      phoneOptional: "optional",
      projectType: "What kind of project?",
      projectTypeOptional: "optional",
      projectTypePlaceholder: "Choose one — or leave it and tell us below",
      message: "What would you like to talk about?",
      messagePlaceholder:
        "The business, what isn't working, and what a good outcome looks like. A few lines is plenty.",
      privacyNote:
        "We use your details to hold this call and answer your enquiry. Nothing else, and nothing passed on.",
      privacyLink: "Privacy policy",
      submit: "Confirm booking",
      submitting: "Confirming…",
      summaryTitle: "You're booking",
      summaryEmpty: "No time chosen yet",
      errors: {
        summary: "Please check the highlighted fields.",
        name: "Please enter your name.",
        email: "Please enter a valid email address.",
        emailFormat: "That email address doesn't look right.",
        message: "Please tell us a little about the project.",
        tooLong: "That's longer than we can accept.",
      },
    },

    confirmation: {
      title: "Your call is confirmed.",
      body: "We've held the time and sent you a confirmation. If anything changes, reply to that email and we'll move it.",
      emailSent: "Confirmation sent to {email}.",
      emailNotSent:
        "No confirmation email was sent — this site has no mail provider connected yet. Your booking is recorded and we can see it.",
      calendarNote: "Add it to your own calendar so it doesn't get lost.",
      addToCalendar: "Add to calendar",
      whatNext: "What happens next",
      whatNextBody:
        "We read what you sent before the call, so we can start with your situation rather than a round of introductions.",
      bookAnother: "Book another time",
      backHome: "Back to home page",
    },

    problems: {
      takenTitle: "That time has just gone.",
      takenBody:
        "Someone booked it while you were filling this in. Pick another time — the list below is up to date.",
      failedTitle: "That didn't go through.",
      failedBody:
        "Something went wrong on the way. Please try again, or email us directly and we'll sort out a time.",
      noServerTitle: "This preview can't take bookings.",
      noServerBody:
        "There's no server behind this build, so nothing was submitted and no time has been held. On the live site this step completes the booking. For now, email us and we'll arrange a time.",
      emailUs: "Email us instead",
    },

    fallback: {
      title: "Rather write than talk?",
      body: "Send the details and we'll reply within two working days.",
      cta: "Send an enquiry",
    },
  },

  legal: {
    indexTitle: "Legal",
    indexLead:
      "Imprint, privacy, terms and cancellation — written to the structure German law expects.",
    imprintTitle: "Imprint",
    imprintLead: "Provider identification under § 5 DDG and § 18 MStV.",
    privacyTitle: "Privacy policy",
    privacyLead:
      "What this website processes, why, on what legal basis, and what you can ask us to do about it.",
    termsTitle: "Terms & conditions",
    termsLead:
      "The terms that apply to AMPLIQ engagements: scope, prices, rights of use, liability and notice.",
    cancellationTitle: "Cancellation policy",
    cancellationLead:
      "The statutory right of withdrawal for consumers, how to exercise it, and when it expires.",
    cookiesTitle: "Cookie policy",
    cookiesLead:
      "One functional cookie, set only if you switch language. No analytics, no advertising, no tracking.",
    contents: "Contents",
    lastUpdated: "Last updated",
    readMore: "Read",
  },

  notFound: {
    code: "404",
    title: "This page doesn't exist.",
    body: "The link may be old, or the page may have moved. Everything else is still where you left it.",
  },

  footer: {
    tagline: "Marketing, amplified.",
    navTitle: "Navigation",
    socialTitle: "Social",
    legalTitle: "Legal",
    contactTitle: "Contact",
    projectLabel: "Projects & proposals",
    helpLabel: "General help",
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
