// Homepage content, copied verbatim from https://brewocrat2-iota.vercel.app (no invented data)

export const brand = {
  name: 'Brewocrat',
  fullName: 'Brewocrat Brewery Skybar & Kitchen',
  tagline: 'Brewery. Skybar. Kitchen.',
  intro:
    'Brewocrat is Gurugram’s rooftop brewery, skybar and kitchen, serving fresh beer brewed on-site with no preservatives. Come for the taps, stay for the live music, the open skyline and good company.',
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
  { title: 'Shahi Paneer Tikka Lababdar', category: 'Chef’s Claypot Specialty', price: '₹595', image: '/images/special-dish1.webp' },
  { title: 'Smokey Mutton Rogan Josh', category: 'Signature Tandoor Hearth', price: '₹745', image: '/images/bhuna_gosht_curry.webp' },
  { title: 'Dum Pukht Zafrani Biryani', category: 'Heritage Awadhi Handi', price: '₹645', image: '/images/special-dish3.webp' },
  { title: 'Wood-Fired Truffle Margherita', category: 'Artisan Sourdough Pizza', price: '₹625', image: '/images/special-dish4.webp' },
  { title: 'Big Fat Mezze Feast Platter', category: 'Mediterranean Sharing', price: '₹695', image: '/images/mediterranean_platter.webp' },
  { title: 'Charcoal Smokey Mutton Tikkas', category: 'Sigri Charcoal Grills', price: '₹685', image: '/images/special-dish2.webp' },
]

export const moments = [
  { title: 'FAMILY GATHERING', subtitle: 'Warm Comfort & Multi-Cuisine Feasts', desc: 'Generous dining tables, kid-friendly multi-cuisine favourites, intimate acoustics, and wood-fired sharing platters in our climate-controlled salon.', features: ['Spacious Family Booths', 'Kid-Friendly Menu Options', 'Intimate Acoustic Dining'], cta: 'Reserve Family Table', image: '/images/venue/6c597800757903f5a442c7ea37bd6c13.webp' },
  { title: 'CORPORATE MEETING', subtitle: 'Productive Mixers & Team Celebrations', desc: 'High-speed Wi-Fi, private lounge zones, fresh craft draught beer on flow, and curated multi-course business buffets for company celebrations & mixers.', features: ['AV Presentation Support', 'Curated Corporate Packages', 'GST Billing Ready'], cta: 'Book Corporate Event', image: '/images/venue/512291b716cdc11a22c515ae092cbdcb.webp' },
  { title: 'DJ SETS', subtitle: 'High-Voltage Weekend Nightlife', desc: 'Live resident & guest DJs spinning commercial Bollywood, Punjabi club hits & electronic house under Gurugram’s starry skybar terrace.', features: ['Weekend Live DJs', 'Concert-Grade Acoustics', 'Signature Cocktail Pitchers'], cta: 'Reserve Party Lounge', image: '/images/venue/800dea653d01ee7809661aa6055d96ca.webp' },
  { title: 'GATHERINGS', subtitle: 'Breezy Courtyard Socials & Sundowners', desc: 'Open-air courtyard energy, 3-litre craft beer towers at the table, live sports screenings on giant displays, and casual high-top tables for your crew.', features: ['Fairy-Lit Pergola Seating', 'Live Match Screenings', 'Ice-Cored Beer Towers'], cta: 'Gather Your Crew', image: '/images/venue/7cbf0f9e69ab18ec07dea52f3766ab4a.webp' },
  { title: 'PARTIES', subtitle: 'Birthdays, Anniversaries & Milestones', desc: 'Bespoke party decor, dedicated bar team, custom celebration cake presentation, and private terrace cabanas for your unforgettable milestone.', features: ['Private Terrace Cabanas', 'Dedicated Service Butler', 'Tailored Celebration Menus'], cta: 'Plan A Celebration', image: '/images/slider-1.webp' },
]

export const universes = [
  { name: 'The Kitchen', zone: 'The Salon · Indoor', line: 'Wood-fired plates, soft jazz', img: '/images/venue/6c597800757903f5a442c7ea37bd6c13.webp' },
  { name: 'The Brewery', zone: 'The Courtyard · Open-air', line: 'Fresh taps, live energy', img: '/images/venue/a6cef196266bc7353481d501e90503fe.webp' },
  { name: 'The Skybar', zone: 'The Terrace · Rooftop', line: 'Sundowners above the skyline', img: '/images/venue/800dea653d01ee7809661aa6055d96ca.webp' },
]

export const testimonials = [
  { text: 'Brewocrat is hands down the best microbrewery in Gurgaon! The Belgian Tropical Ale was poured frost cold and had the most incredible citrus aroma. The Smokey Mutton Tikka paired with the rooftop breeze made it an unforgettable evening.', author: 'Rohan Verma', role: 'Verified Google Patron', date: 'February 2025' },
  { text: 'The aesthetic of this rooftop is unmatched. Warm amber lighting, copper brewery tanks, and plush seating. Loved the Big Fat Mezze Platter and the wood-fired pizza. Great live DJ and cricket screening vibe!', author: 'Priya Sharma', role: 'Gurgaon Food & Nightlife Critic', date: 'January 2025' },
  { text: 'Outstanding hospitality from start to finish. We booked a 3L beer tower for our team gathering — the ice core kept it cold for hours. The craft cocktails like Indian Sapphire are works of art.', author: 'Amit Gupta', role: 'Regular Guest', date: 'March 2025' },
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
  desc: 'Select any tap to examine tasting notes, aromatic character, and chef-recommended food pairings.',
  notesLabel: 'Aromatic Tasting Notes',
  pairingsLabel: 'Perfect Food Pairings',
  cta: 'Order A Pitcher at Table',
}
export const socialServes = {
  eyebrow: 'DESIGNED FOR THE TABLE',
  title: 'Tabletop Social Formats',
  desc: 'Craft beer is meant to be shared. Experience our curated social serves.',
  items: [
    { eyebrow: 'THE TASTING RACK', title: 'Flight Paddles', desc: 'Cannot decide? Order a wooden flight paddle featuring 4 or 6 tasting chalices of each fresh tap, guided by notes from our master brewer.', cta: 'Reserve Tasting Flight', image: '/images/venue/ea3adbabd87e47ffa47e0f6e33394a2d.webp' },
    { eyebrow: 'THE GROUP ANCHOR', title: '3-Litre Ice-Cored Towers', desc: 'Keep the party pouring straight at your table. Our illuminated 3-litre tabletop beer towers feature an integrated ice core that maintains a 2°C chilled pour down to the final glass.', cta: 'Book Table With Beer Tower', image: '/images/craft_beer_tower.webp' },
  ],
}
// From the site's /events page
export const eventsCopy = {
  eyebrow: 'WEEKLY LIVE PROGRAMMING',
  title: ['What\u2019s On At ', 'Brewocrat.'],
  desc: 'From Wednesday unplugged sufi sets and retro mixtape nights to high-energy Friday Bollywood and Saturday live euphoria, our stage brings Gurugram together every night.',
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
  desc: 'A visual taste of fresh taps, long tables, open kitchens, and the nights that keep Gurugram coming back.',
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
