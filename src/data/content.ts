// Homepage content, copied verbatim from https://brewocrat2-iota.vercel.app (no invented data)

export const brand = {
  name: 'Brewocrat',
  fullName: 'Brewocrat Brewery Skybar & Kitchen',
  tagline: 'Brewery. Skybar. Kitchen.',
  intro:
    'Gurugram’s rooftop brewery, skybar and kitchen. Beer brewed on-site, and live music under the open sky.',
  heroVideo: '/video/hero.mp4',
  heroPoster: '/video/hero-poster.webp',
  emblem: '/Logopng-02-300.webp',
  logo: '/images/logo-720.webp',
  navEmblem: '/images/nav-emblem-gold.webp',
  navEmblem2x: '/images/nav-emblem-gold@2x.webp',
  introImage: { src: '/home_1.webp', alt: 'The Brewocrat dining room and live music stage' },
}

export const contact = {
  fullName: 'Brewocrat Brewery Skybar & Kitchen',
  phone1: '+91 73032 03535',
  phone1Href: 'tel:+917303203535',
  phone2: '+91 124 378 9363',
  phone2Href: 'tel:+911243789363',
  email: 'booking@brewocrat.com',
  whatsapp: 'https://wa.me/917303203535',
  addressShort: '2nd Floor, Element One Mall, Sector 47, South City 2, Gurgaon (Valet Parking Available)',
  addressFooter: 'Element One, Block A, 2nd Floor, Sector 47, South City 2, Gurgaon, Haryana 122018',
  hoursDays: 'Monday – Sunday',
  hours: '12:00 PM Afternoon to 01:00 AM Midnight (Daily)',
  hoursFooter: 'Daily - 12.00 PM to 1.00 AM',
  mapEmbed:
    'https://maps.google.com/maps?q=Brewocrat%20Element%20One%20Sector%2047%20Gurugram&t=&z=15&ie=UTF8&iwloc=&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Brewocrat+Element+One+Sector+47+Gurugram',
  reviewsLink: 'https://www.google.com/search?q=Brewocrat+Sector+47+Gurugram+reviews',
  facebook: 'https://www.facebook.com/brewocrat',
  instagram: 'https://www.instagram.com/brewocrat',
  zomato: 'https://www.zomato.com/ncr/brewocrat-brewery-skybar-kitchen-sector-47-gurgaon',
  copyright: '© 2026 Brewocrat Services Pvt. Ltd. All Rights Reserved.',
  credit: { label: 'YR IT Solutions', href: 'https://www.yritsolutions.com/' },
}

export const taps = [
  { id: 'golden-pour', title: 'GOLDEN POUR', label: ['GOLDEN', 'POUR'], abv: '5.0%', ibu: '22', temp: '2°C', image: '/images/beers/beer_golden_pour.webp', liquid: ['#F6D25E', '#E0A21C', '#C77F0C'], foam: ['#FFFDF4', '#F6E9C6'], badge: ['#E7B44A', '#B9822A'], ink: '#2A1A10' },
  { id: 'tropical-ale', title: 'TROPICAL ALE', label: ['TROPICAL', 'ALE'], abv: '4.8%', ibu: '15', temp: '2°C', image: '/images/beers/beer_tropical_ale.webp', liquid: ['#F8CE7A', '#EDA23A', '#D9822A'], foam: ['#FFFAF0', '#F8E8CC'], badge: ['#F0963A', '#C2621A'], ink: '#2A1A10' },
  { id: 'pale-ale', title: 'CRAFT PALE ALE', label: ['PALE', 'ALE'], abv: '5.4%', ibu: '34', temp: '3°C', image: '/images/beers/beer_pale_ale.webp', liquid: ['#E59A3C', '#C26A1C', '#A04E10'], foam: ['#FFF8EA', '#F2DDB8'], badge: ['#C9683A', '#8E3A1C'], ink: '#FFF3DF' },
  { id: 'dark-lager', title: 'SMOKY DARK LAGER', label: ['DARK', 'LAGER'], abv: '5.2%', ibu: '20', temp: '4°C', image: '/images/beers/beer_dark_lager.webp', liquid: ['#5A2A14', '#31150A', '#1B0A04'], foam: ['#EBD3A8', '#CDA876'], badge: ['#4A2A1A', '#22110A'], ink: '#E9BE63' },
] as const

// From the site's /brewhouse "beer notes" (xk) list
export const tapNotes: Record<string, string> = {
  'golden-pour': 'Crisp · Clean',
  'tropical-ale': 'Fruity · Citrus',
  'pale-ale': 'Hoppy · Balanced',
  'dark-lager': 'Smoky · Roasted',
}

export const plates = [
  { title: 'Shahi Paneer Tikka Lababdar', category: 'Chef’s Claypot Specialty', image: '/images/special-dish1.webp' },
  { title: 'Smokey Mutton Rogan Josh', category: 'Signature Tandoor Hearth', image: '/images/bhuna_gosht_curry.webp' },
  { title: 'Dum Pukht Zafrani Biryani', category: 'Heritage Awadhi Handi', image: '/images/special-dish3.webp' },
  { title: 'Wood-Fired Truffle Margherita', category: 'Artisan Sourdough Pizza', image: '/images/special-dish4.webp' },
  { title: 'Big Fat Mezze Feast Platter', category: 'Mediterranean Sharing', image: '/images/mediterranean_platter.webp' },
  { title: 'Charcoal Smokey Mutton Tikkas', category: 'Sigri Charcoal Grills', image: '/images/special-dish2.webp' },
]

export const moments = [
  { title: 'Family gathering', subtitle: 'Shared tables in the salon', desc: 'Family booths, kid-friendly plates, and wood-fired platters.', features: ['Family booths', 'Kid-friendly plates', 'Quieter dining'], cta: 'Reserve Family Table', image: '/images/venue/6c597800757903f5a442c7ea37bd6c13.webp' },
  { title: 'Corporate meeting', subtitle: 'Mixers and team tables', desc: 'Wi-Fi, a private lounge, and draught beer for the team.', features: ['AV support', 'Group packages', 'GST billing'], cta: 'Book Corporate Event', image: '/images/venue/512291b716cdc11a22c515ae092cbdcb.webp' },
  { title: 'DJ sets', subtitle: 'Weekends on the skybar', desc: 'Resident and guest DJs on the terrace.', features: ['Weekend DJs', 'Courtyard sound', 'Cocktail pitchers'], cta: 'Reserve Party Lounge', image: '/images/venue/800dea653d01ee7809661aa6055d96ca.webp' },
  { title: 'Gatherings', subtitle: 'Courtyard sundowners', desc: 'Open-air tables, beer towers, and match screenings.', features: ['Pergola seating', 'Match screenings', 'Beer towers'], cta: 'Gather Your Crew', image: '/images/venue/7cbf0f9e69ab18ec07dea52f3766ab4a.webp' },
  { title: 'Parties', subtitle: 'Birthdays and milestones', desc: 'A private terrace setup for the celebration.', features: ['Terrace cabanas', 'Dedicated service', 'Celebration menus'], cta: 'Plan A Celebration', image: '/images/slider-1.webp' },
]

export const universes = [
  { name: 'The Kitchen', zone: 'The Salon · Indoor', line: 'Wood-fired plates, soft jazz', img: '/images/venue/6c597800757903f5a442c7ea37bd6c13.webp' },
  { name: 'The Brewery', zone: 'The Courtyard · Open-air', line: 'Fresh taps, live energy', img: '/images/venue/a6cef196266bc7353481d501e90503fe.webp' },
  { name: 'The Skybar', zone: 'The Terrace · Rooftop', line: 'Sundowners above the skyline', img: '/images/venue/800dea653d01ee7809661aa6055d96ca.webp' },
]

export const testimonials = [
  { text: 'Brewocrat is hands down the best microbrewery in Gurgaon! The Belgian Tropical Ale was poured frost cold and had the most incredible citrus aroma. The Smokey Mutton Tikka paired with the rooftop breeze made it an unforgettable evening.', author: 'Rohan Verma', role: 'Verified Google Patron', date: 'February 2025' },
  { text: 'The aesthetic of this rooftop is unmatched. Warm amber lighting, copper brewery tanks, and plush seating. Loved the Big Fat Mezze Platter and the wood-fired pizza. Great live DJ and cricket screening vibe!', author: 'Priya Sharma', role: 'Gurgaon Food & Nightlife Critic', date: 'January 2025' },
  { text: 'Outstanding hospitality from start to finish. We booked a 3L beer tower for our team gathering - the ice core kept it cold for hours. The craft cocktails like Indian Sapphire are works of art.', author: 'Amit Gupta', role: 'Regular Guest', date: 'March 2025' },
]

export const rating = '4.8 / 5 on Google Reviews'

export const footerImages = [
  { src: '/images/footer-img-1.webp', alt: 'Brewocrat Ambience' },
  { src: '/images/footer-img-2.webp', alt: 'Brewocrat Craft Beer' },
]

export const interiors = [
  '/interior/bar.webp', '/interior/brewocrat_interior.webp', '/interior/exterior.webp',
  '/interior/exterior2.webp', '/interior/interior_seating.webp', '/interior/seating2.webp',
]

// From the site's /brewhouse page
export const dossier = {
  eyebrow: 'POURING LIVE TODAY',
  title: 'The Tap Dossier',
  desc: 'Choose a tap for notes and pairings.',
  notesLabel: 'Aromatic Tasting Notes',
  pairingsLabel: 'Perfect Food Pairings',
  cta: 'Order A Pitcher at Table',
}
export const socialServes = {
  eyebrow: 'DESIGNED FOR THE TABLE',
  title: 'Tabletop Social Formats',
  desc: 'Beer made to share.',
  items: [
    { eyebrow: 'THE TASTING RACK', title: 'Flight Paddles', desc: 'A paddle of 4 or 6 house taps.', cta: 'Reserve Tasting Flight', image: '/images/venue/ea3adbabd87e47ffa47e0f6e33394a2d.webp' },
    { eyebrow: 'THE GROUP ANCHOR', title: '3-Litre Ice-Cored Towers', desc: 'A 3-litre table tower with an ice core.', cta: 'Book Table With Beer Tower', image: '/images/craft_beer_tower.webp' },
  ],
}
// From the site's /events page
export const eventsCopy = {
  eyebrow: 'WEEKLY LIVE PROGRAMMING',
  title: ['What\u2019s On At ', 'Brewocrat.'],
  desc: 'Unplugged Wednesdays, mixtape Thursdays, and Bollywood Fridays.',
  headlinerEyebrow: 'THIS WEEK\u2019S HEADLINER',
  headliner: 'Friday Bollywood & Punjabi Night',
  headlinerMeta: 'Featuring DJ Sumit Live • 8:00 PM Onwards',
  headlinerDesc: 'Our biggest weekly night. Full venue energy across the open-air courtyard and skybar terrace. Table reservations are strongly recommended as seating reaches capacity early.',
  rules: 'Cover / reservation rules apply after 9:30 PM. Book online to guarantee your table.',
  whatsappCta: 'Enquire Live Lineup on WhatsApp',
}
// From the site's /gallery + home journal copy
export const galleryCopy = {
  eyebrow: 'THE BREWOCRAT JOURNAL',
  title: ['Brewed for ', 'good company.'],
  desc: 'Fresh taps, long tables, and nights in Gurugram.',
}
// From the site's /book-table page
export const bookingCopy = {
  eyebrow: 'Your evening, your table',
  title: 'Make room for a good night.',
  desc: 'A courtyard toast, a rooftop sunset, or a long dinner with your favourite people.',
  zones: ['Best available', 'Indoor Salon', 'Courtyard', 'Skybar Terrace'],
  special: 'For a special request, call',
}
export const spaces = [
  { name: 'The Salon', note: 'Indoor · ~100', img: '/images/spirits_wine_coolers.webp' },
  { name: 'The Courtyard', note: 'Open-air · ~90', img: '/images/cocktails_bar.webp' },
  { name: 'The Terrace', note: 'Skybar · ~60', img: '/images/craft_beer_tower.webp' },
]
