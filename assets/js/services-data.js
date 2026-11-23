/*
  Service detail content — same slug->record pattern as properties-data.js,
  rendered by service-detail.js based on ?slug=. Keeps the four services-hero
  tiles (index.html) and this data in sync in one place. Service names and
  descriptions follow G29's About Us document.
*/
// NEEDS INPUT: features and process steps below are working copy built from
// the About Us document's service descriptions — confirm with G29.
window.G29_SERVICES = [
  {
    slug: 'facility-management',
    name: "Facility Management",
    tagline: "Upkeep, supervision and operational support",
    heroImage: 'assets/images/services/facility-management.jpg',
    intro: [
      "Our facility management services are designed to maintain and enhance the value of properties through efficient upkeep, supervision, and operational support.",
      "At G29 we don’t just manage properties — we help our clients protect, improve, and maximize the value of their investments, with clear, regular reporting so you always know where things stand."
    ],
    features: [
      "Property & facility management",
      "Routine upkeep & maintenance coordination",
      "On-site supervision",
      "Operational support",
      "Tenant sourcing & rent collection",
      "Monthly owner statements"
    ],
    process: [
      { title: "Property onboarding", desc: "A full condition report and inventory before we take over day-to-day care." },
      { title: "Upkeep & supervision", desc: "Scheduled maintenance, inspections, and supervision of service providers." },
      { title: "Operational support", desc: "Day-to-day coordination so the property runs smoothly for owners and occupants." },
      { title: "Reporting", desc: "Regular, transparent reporting on condition, costs, and results." }
    ]
  },
  {
    slug: 'brokerage',
    name: "Brokerage (Sales & Rentals)",
    tagline: "Sales and rentals, done right",
    heroImage: 'assets/images/services/brokerage.jpg',
    intro: [
      "We specialize in property rentals, helping individuals and businesses secure the right properties at competitive prices and with flexible payment options, while assisting property owners in finding reliable tenants.",
      "We deal with all manner and style of property — from studio flats, conversions and purpose-built apartments to new homes, villas, town houses and detached houses."
    ],
    features: [
      "Buyer representation",
      "Seller & listing representation",
      "Rentals for individuals and businesses",
      "Flexible payment options",
      "Reliable tenant sourcing for owners",
      "Negotiation & closing coordination"
    ],
    process: [
      { title: "Consultation", desc: "We start by understanding your budget, timeline, and must-haves." },
      { title: "Search or listing prep", desc: "Curated property matches for buyers and tenants, or pricing and presentation for owners." },
      { title: "Viewings & negotiation", desc: "Coordinated viewings and firm, informed negotiation on your behalf." },
      { title: "Offer to close", desc: "Paperwork, due diligence, and coordination through to signature." }
    ]
  },
  {
    slug: 'real-estate-advisory',
    name: "Real Estate Advisory",
    tagline: "Informed property and investment decisions",
    heroImage: 'assets/images/services/real-estate-advisory.jpg',
    intro: [
      "We offer expert property advisory, guiding clients in making informed property and investment decisions with confidence.",
      "We work as an ongoing sounding board: market entry, portfolio review, and the due diligence that protects your capital."
    ],
    features: [
      "Investment strategy & market entry",
      "Portfolio review",
      "Development feasibility input",
      "Financing & structuring guidance",
      "Risk & due diligence support",
      "Ongoing advisory retainer options"
    ],
    process: [
      { title: "Discovery call", desc: "Understanding your goals, timeline, and risk appetite." },
      { title: "Market analysis", desc: "Research into the neighborhoods and asset types that fit your strategy." },
      { title: "Strategy recommendation", desc: "A clear, prioritized set of recommendations — not a generic report." },
      { title: "Ongoing support", desc: "Continued advisory as opportunities and your portfolio evolve." }
    ]
  },
  {
    slug: 'refurbishment-renovation',
    name: "Refurbishment & Renovation Works",
    tagline: "Modern, functional, value-enhancing spaces",
    heroImage: 'assets/images/services/refurbishment-renovation.jpg',
    intro: [
      "Our renovation services transform homes and spaces into functional, modern, and value-enhancing environments, delivered with professionalism and attention to detail.",
      "Our ethos is a personal, proactive service with clear communication, from the first walk-through to handover."
    ],
    features: [
      "Home and space refurbishment",
      "Renovation works",
      "Modern, functional finishes",
      "Project planning & supervision",
      "Attention to detail",
      "Value-enhancing upgrades"
    ],
    process: [
      { title: "Site assessment", desc: "We walk the property with you and understand what needs to change." },
      { title: "Scope & plan", desc: "A clear scope of works, timeline, and budget agreed before work starts." },
      { title: "Works & supervision", desc: "Professional delivery with regular updates and on-site supervision." },
      { title: "Handover", desc: "A final walkthrough to make sure every detail meets the brief." }
    ]
  }
];
