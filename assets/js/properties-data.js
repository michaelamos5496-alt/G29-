/*
  Shared property listing data — used by the homepage category cards,
  properties-category.html, and property-detail.html.
  Placeholder listings — swap for real property data once available
  (see /docs/08-content-models.md for the intended Property fields).
*/
window.G29_PROPERTIES = [
  // Apartments
  {
    slug: 'city-view-apartments',
    title: 'City View Apartments',
    subtitle: 'Osu, Accra',
    location: 'Osu, Accra, Ghana',
    category: 'Apartment',
    tags: ['Apartment', 'For Rent'],
    status: 'For Rent',
    beds: 3,
    baths: 2,
    floorArea: '180 m²',
    yearBuilt: 2021,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Rent'],
    featured: true,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'City View Apartments offers modern, low-maintenance living in the heart of Osu, with easy access to Accra\'s best restaurants, nightlife, and business districts. Each unit features an open-plan layout, full kitchen, and private balcony.',
      'G29 Property Consult manages leasing and tenant relations for this building on behalf of the owner.'
    ],
    amenities: ['Private balcony', 'Open-plan kitchen', 'Elevator access', 'Secure parking', '24-hour security', 'Backup water supply']
  },
  {
    slug: 'ridge-loft-apartments',
    title: 'Ridge Loft Apartments',
    subtitle: 'Ridge, Accra',
    location: 'Ridge, Accra, Ghana',
    category: 'Apartment',
    tags: ['Apartment', 'For Rent'],
    status: 'For Rent',
    beds: 2,
    baths: 2,
    floorArea: '95 m²',
    yearBuilt: 2022,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Rent'],
    featured: true,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Ridge Loft Apartments places you minutes from Accra\'s diplomatic and business district, with a bright open living area and large windows overlooking the city.',
      'G29 Property Consult manages leasing and tenant relations for this building on behalf of the owner.'
    ],
    amenities: ['Floor-to-ceiling windows', 'Open-plan living', 'Elevator access', '24-hour security', 'Secure parking', 'Backup water supply']
  },
  {
    slug: 'dzorwulu-garden-apartments',
    title: 'Dzorwulu Garden Apartments',
    subtitle: 'Dzorwulu, Accra',
    location: 'Dzorwulu, Accra, Ghana',
    category: 'Apartment',
    tags: ['Apartment', 'For Sale'],
    status: 'For Sale',
    beds: 2,
    baths: 1,
    floorArea: '85 m²',
    yearBuilt: 2016,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Dzorwulu Garden Apartments is a quiet, plant-filled residence tucked away from the main road, ideal for buyers who want easy access to Airport City without the noise.',
      'G29 Property Consult is handling the sale on behalf of the owner.'
    ],
    amenities: ['Private balcony', 'Built-in storage', 'Shared garden courtyard', 'Secure parking', '24-hour security']
  },

  // Villas
  {
    slug: 'poolside-villa',
    title: 'Poolside Villa',
    subtitle: 'East Legon, Accra',
    location: 'East Legon, Accra, Ghana',
    category: 'Villa',
    tags: ['Villa', 'For Sale'],
    status: 'For Sale',
    beds: 4,
    baths: 4,
    floorArea: '320 m²',
    yearBuilt: 2020,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy', 'Investment'],
    featured: true,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Poolside Villa is a private 4-bedroom retreat in East Legon, built around a landscaped garden and swimming pool. The layout balances open living spaces with quiet, self-contained bedroom wings.',
      'G29 Property Consult is managing the sale, including viewings and legal coordination.'
    ],
    amenities: ['Private swimming pool', 'Landscaped garden', 'Fitted kitchen', 'Staff quarters', 'Secure parking for 3 vehicles', 'Backup power']
  },
  {
    slug: 'skyline-residence',
    title: 'Skyline Residence',
    subtitle: 'Airport Residential Area, Accra',
    location: 'Airport Residential Area, Accra, Ghana',
    category: 'Villa',
    tags: ['Villa', 'For Sale'],
    status: 'For Sale',
    beds: 5,
    baths: 5,
    floorArea: '420 m²',
    yearBuilt: 2019,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy', 'Investment'],
    featured: true,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Skyline Residence is a striking 5-bedroom villa set in Accra\'s Airport Residential Area, offering panoramic views, an infinity-edge pool, and expansive glass-walled living spaces designed for natural light. Every detail — from the open-plan kitchen to the private terrace — has been finished to a premium standard.',
      'G29 Property Consult is managing the sale on behalf of the owner, including viewings, negotiation, and full legal coordination through to closing.'
    ],
    amenities: ['Infinity-edge pool', 'Private terrace & garden', 'Open-plan kitchen', 'Fitted wardrobes throughout', 'Dedicated staff quarters', 'Secure parking for 4 vehicles', 'Backup power & water storage', '24-hour estate security']
  },
  {
    slug: 'ridge-hillside-villa',
    title: 'Ridge Hillside Villa',
    subtitle: 'North Ridge, Accra',
    location: 'North Ridge, Accra, Ghana',
    category: 'Villa',
    tags: ['Villa', 'For Sale'],
    status: 'For Sale',
    beds: 4,
    baths: 4,
    floorArea: '350 m²',
    yearBuilt: 2021,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy', 'Investment'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Ridge Hillside Villa sits on an elevated plot in North Ridge, with a covered outdoor lounge, swimming pool, and uninterrupted views over the surrounding neighborhood.',
      'G29 Property Consult is managing the sale, including viewings and legal coordination.'
    ],
    amenities: ['Private swimming pool', 'Covered outdoor lounge', 'Landscaped garden', 'Fitted kitchen', 'Secure parking for 3 vehicles', 'Backup power']
  },

  // Houses
  {
    slug: 'cedar-house',
    title: 'Cedar House',
    subtitle: 'Cantonments, Accra',
    location: 'Cantonments, Accra, Ghana',
    category: 'House',
    tags: ['House', 'For Sale'],
    status: 'For Sale',
    beds: 4,
    baths: 3,
    floorArea: '260 m²',
    yearBuilt: 2018,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy'],
    featured: true,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Cedar House is a contemporary 4-bedroom family home in Cantonments, finished with warm timber accents and large glazed openings that bring in natural light throughout the day.',
      'G29 Property Consult is handling the sale on behalf of the owner.'
    ],
    amenities: ['Private driveway', 'Landscaped front garden', 'Fitted kitchen', 'Study / home office', 'Secure parking for 2 vehicles', '24-hour estate security']
  },
  {
    slug: 'open-plan-residence',
    title: 'Open-Plan Residence',
    subtitle: 'Labone, Accra',
    location: 'Labone, Accra, Ghana',
    category: 'House',
    tags: ['House', 'For Rent'],
    status: 'For Rent',
    beds: 3,
    baths: 2,
    floorArea: '210 m²',
    yearBuilt: 2017,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Rent'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Open-Plan Residence is a bright 3-bedroom home in Labone with an open living and dining layout, ideal for entertaining. Large windows and skylights keep the interiors naturally lit throughout the day.',
      'G29 Property Consult manages leasing for this property.'
    ],
    amenities: ['Open-plan living & dining', 'Skylights', 'Fitted kitchen', 'Private garden', 'Secure parking', 'Close to international schools']
  },
  {
    slug: 'roman-ridge-house',
    title: 'Roman Ridge House',
    subtitle: 'Roman Ridge, Accra',
    location: 'Roman Ridge, Accra, Ghana',
    category: 'House',
    tags: ['House', 'For Sale'],
    status: 'For Sale',
    beds: 3,
    baths: 3,
    floorArea: '230 m²',
    yearBuilt: 2019,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy'],
    featured: true,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Roman Ridge House pairs a renovated kitchen and open living area with three generously sized bedrooms, in one of Accra\'s most established residential neighborhoods.',
      'G29 Property Consult is handling the sale on behalf of the owner.'
    ],
    amenities: ['Renovated kitchen', 'Open-plan living & dining', 'Private driveway', 'Fitted wardrobes', 'Secure parking for 2 vehicles', '24-hour estate security']
  },

  // Penthouses
  {
    slug: 'skyline-penthouse-suite',
    title: 'Skyline Penthouse Suite',
    subtitle: 'Airport Residential Area, Accra',
    location: 'Airport Residential Area, Accra, Ghana',
    category: 'Penthouse',
    tags: ['Penthouse', 'For Sale'],
    status: 'For Sale',
    beds: 3,
    baths: 3,
    floorArea: '240 m²',
    yearBuilt: 2022,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy', 'Investment'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Skyline Penthouse Suite occupies the top floor of a boutique residential building in Airport Residential, with wraparound glazing, a private terrace, and uninterrupted views over the surrounding treetops.',
      'G29 Property Consult is managing the sale on behalf of the owner, including viewings and legal coordination.'
    ],
    amenities: ['Private terrace', 'Wraparound glazing', 'Open-plan living', 'Fitted kitchen', 'Elevator access', 'Secure parking for 2 vehicles', '24-hour estate security']
  },
  {
    slug: 'ridge-view-penthouse',
    title: 'Ridge View Penthouse',
    subtitle: 'North Ridge, Accra',
    location: 'North Ridge, Accra, Ghana',
    category: 'Penthouse',
    tags: ['Penthouse', 'For Sale'],
    status: 'For Sale',
    beds: 2,
    baths: 2,
    floorArea: '165 m²',
    yearBuilt: 2023,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Ridge View Penthouse is a bright, newly finished top-floor unit in North Ridge, with premium fixtures throughout and a layout designed for entertaining.',
      'G29 Property Consult is handling the sale on behalf of the owner.'
    ],
    amenities: ['Private balcony', 'Premium fixtures', 'Open-plan living', 'Elevator access', 'Secure parking', '24-hour security']
  },

  // Commercial
  {
    slug: 'ridge-business-suites',
    title: 'Ridge Business Suites',
    subtitle: 'Ridge, Accra',
    location: 'Ridge, Accra, Ghana',
    category: 'Commercial',
    tags: ['Commercial', 'For Rent'],
    status: 'For Rent',
    beds: 6,
    baths: 2,
    floorArea: '420 m²',
    yearBuilt: 2020,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Rent'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Ridge Business Suites offers six fitted office units across a modern low-rise building in Ridge, with floor-to-ceiling glazing and flexible floor plates suited to small and mid-sized teams.',
      'G29 Property Consult manages leasing for this building on behalf of the owner.'
    ],
    amenities: ['Floor-to-ceiling glazing', 'Flexible office layouts', 'Elevator access', 'Backup power', 'Secure parking', '24-hour security']
  },
  {
    slug: 'osu-retail-office-space',
    title: 'Osu Retail & Office Space',
    subtitle: 'Osu, Accra',
    location: 'Osu, Accra, Ghana',
    category: 'Commercial',
    tags: ['Commercial', 'For Rent'],
    status: 'For Rent',
    beds: 4,
    baths: 2,
    floorArea: '310 m²',
    yearBuilt: 2018,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Rent'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Osu Retail & Office Space sits on a high-visibility corridor in Osu, with ground-floor retail frontage and office space above, ideal for a business wanting both a storefront and a working headquarters in one location.',
      'G29 Property Consult manages leasing for this property on behalf of the owner.'
    ],
    amenities: ['Ground-floor retail frontage', 'Independent office floor', 'Air conditioning throughout', 'Backup power', 'On-site parking', '24-hour security']
  },

  // Townhouses
  {
    slug: 'cantonments-townhouse',
    title: 'Cantonments Townhouse',
    subtitle: 'Cantonments, Accra',
    location: 'Cantonments, Accra, Ghana',
    category: 'Townhouse',
    tags: ['Townhouse', 'For Sale'],
    status: 'For Sale',
    beds: 3,
    baths: 3,
    floorArea: '195 m²',
    yearBuilt: 2021,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Buy'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Cantonments Townhouse is a low-maintenance 3-bedroom unit within a small, gated development, with a private courtyard entrance and shared landscaped grounds.',
      'G29 Property Consult is handling the sale on behalf of the owner.'
    ],
    amenities: ['Gated development', 'Private courtyard entrance', 'Shared landscaped grounds', 'Fitted kitchen', 'Secure parking', '24-hour estate security']
  },
  {
    slug: 'dzorwulu-mews-townhouse',
    title: 'Dzorwulu Mews Townhouse',
    subtitle: 'Dzorwulu, Accra',
    location: 'Dzorwulu, Accra, Ghana',
    category: 'Townhouse',
    tags: ['Townhouse', 'For Rent'],
    status: 'For Rent',
    beds: 2,
    baths: 2,
    floorArea: '140 m²',
    yearBuilt: 2019,
    price: null,
    priceLabel: 'Price on Application',
    purpose: ['Rent'],
    featured: false,
    availability: 'Available now',
    video: null,
    floorPlans: [],
    marketSnapshot: null,
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop'
    ],
    description: [
      'Dzorwulu Mews Townhouse is part of a small, quiet mews development off the main road, with a private garden and easy access to Airport City.',
      'G29 Property Consult manages leasing for this property.'
    ],
    amenities: ['Private garden', 'Mews-style development', 'Fitted kitchen', 'Secure parking', 'Backup water supply', '24-hour security']
  }
];

window.G29_CATEGORIES = [
  {
    name: 'Apartments',
    type: 'Apartment',
    description: 'City-center living, ready to rent or buy',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Villas',
    type: 'Villa',
    description: 'Private pools, gardens, and premium finishes',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Houses',
    type: 'House',
    description: 'Family homes across Accra\'s established suburbs',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Penthouses',
    type: 'Penthouse',
    description: 'Top-floor living with skyline views and private terraces',
    image: 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Commercial',
    type: 'Commercial',
    description: 'Office and retail space across Accra\'s business districts',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Townhouses',
    type: 'Townhouse',
    description: 'Modern, low-maintenance homes in gated developments',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop'
  }
];

window.G29_propertyDetailUrl = function (slug) {
  return 'property-detail.html?slug=' + encodeURIComponent(slug);
};
