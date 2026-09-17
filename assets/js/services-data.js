/*
  Service detail content — same slug->record pattern as properties-data.js,
  rendered by service-detail.js based on ?slug=. Keeps the four services-hero
  tiles (index.html) and this data in sync in one place.
*/
window.G29_SERVICES = [
  {
    slug: 'property-management',
    name: 'Property Management',
    tagline: 'Hands-on care for your investment',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    intro: [
      'Owning a rental property in Accra shouldn’t mean fielding late-night maintenance calls or chasing rent yourself. G29 manages the day-to-day so your property stays occupied, well cared for, and generating consistent returns.',
      'From tenant sourcing to move-out inspections, our team handles the details — with clear, regular reporting so you always know exactly where things stand.'
    ],
    features: [
      'Tenant sourcing & vetting',
      'Rent collection & remittance',
      'Routine maintenance coordination',
      '24-hour emergency response coordination',
      'Move-in / move-out inspections',
      'Monthly owner statements'
    ],
    process: [
      { title: 'Property onboarding', desc: 'A full condition report and inventory before your property goes on the market.' },
      { title: 'Marketing & placement', desc: 'Listing, viewings, and tenant vetting to find a reliable, well-matched tenant.' },
      { title: 'Ongoing management', desc: 'Rent collection, maintenance, and regular reporting for the life of the tenancy.' },
      { title: 'Renewal or exit', desc: 'Lease renewal support, or a smooth handover and inspection at move-out.' }
    ]
  },
  {
    slug: 'real-estate-brokerage',
    name: 'Real Estate Brokerage',
    tagline: 'Buy, sell, and lease with confidence',
    heroImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1600&auto=format&fit=crop',
    intro: [
      'Whether you’re buying your first home, selling an investment property, or leasing office space, G29’s brokerage team brings local market knowledge and a clear, transparent process to every deal.',
      'We represent your side of the transaction — pricing it right, presenting it well, and negotiating firmly on your behalf.'
    ],
    features: [
      'Buyer representation',
      'Seller & listing representation',
      'Residential and commercial leasing',
      'Market comparables & pricing guidance',
      'Negotiation support',
      'Closing coordination'
    ],
    process: [
      { title: 'Consultation', desc: 'We start by understanding your budget, timeline, and must-haves.' },
      { title: 'Search or listing prep', desc: 'Curated property matches for buyers, or pricing and presentation for sellers.' },
      { title: 'Viewings & negotiation', desc: 'Coordinated viewings and firm, informed negotiation on your behalf.' },
      { title: 'Offer to close', desc: 'Paperwork, due diligence, and coordination through to signature.' }
    ]
  },
  {
    slug: 'property-valuation',
    name: 'Property Valuation',
    tagline: 'Accurate insight for informed decisions',
    heroImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
    intro: [
      'Know what your property is really worth before you sell, buy, insure, or refinance. Our valuations are grounded in current Accra market data — not guesswork.',
      'Every report is prepared to be clear enough for a first-time seller and rigorous enough for an institutional investor.'
    ],
    features: [
      'Market valuation reports',
      'Rental yield analysis',
      'Pre-sale / pre-purchase valuation',
      'Insurance valuation support',
      'Portfolio valuation for investors',
      'Comparative market analysis'
    ],
    process: [
      { title: 'Site inspection', desc: 'An on-site assessment of condition, finishes, and specification.' },
      { title: 'Market research', desc: 'Comparable sales and rental data across the relevant neighborhood.' },
      { title: 'Valuation report', desc: 'A clear, documented valuation with the reasoning behind the number.' },
      { title: 'Walkthrough', desc: 'We talk you through the findings and what they mean for your decision.' }
    ]
  },
  {
    slug: 'advisory-services',
    name: 'Advisory Services',
    tagline: 'Strategic guidance for property investors',
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop',
    intro: [
      'For investors building or rebalancing a property portfolio in Accra, G29 provides the strategic guidance to make confident, well-informed calls — not just individual transactions.',
      'We work as an ongoing sounding board: market entry, portfolio review, and the due diligence that protects your capital.'
    ],
    features: [
      'Investment strategy & market entry',
      'Portfolio review',
      'Development feasibility input',
      'Financing & structuring guidance',
      'Risk & due diligence support',
      'Ongoing advisory retainer options'
    ],
    process: [
      { title: 'Discovery call', desc: 'Understanding your goals, timeline, and risk appetite.' },
      { title: 'Market analysis', desc: 'Research into the neighborhoods and asset types that fit your strategy.' },
      { title: 'Strategy recommendation', desc: 'A clear, prioritized set of recommendations — not a generic report.' },
      { title: 'Ongoing support', desc: 'Continued advisory as opportunities and your portfolio evolve.' }
    ]
  }
];
