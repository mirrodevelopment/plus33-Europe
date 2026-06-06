/**
 * FILE: store-data.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Shared destination registry of 27 premium Paris Pony café locations.
 * Serves as the single source of truth for both find-us.js and chatbot.js.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 * @type {Array.<{id: number, name: string, city: string, address: string, lat: number, lng: number, phone: string, openHours: string, narrative: string, pairings: {selection: string, bite: string}, features: string[], img: string, isFeatured: boolean, region: string, category: string}>}
 */

window.CHATBOT_STORES = [
  {
    id: 1,
    name: "Plus33 Maison Paris",
    city: "Paris",
    address: "12 Rue du Bac, 75007 Paris, France",
    lat: 48.8584,
    lng: 2.3262,
    phone: "+33 1 42 61 00 33",
    openHours: "08:00 - 22:00",
    narrative: "A softly lit retreat inspired by late-evening conversations along the Left Bank, crafted for intimate espresso moments and refined lounge culture.",
    pairings: {
      selection: "Nordic Vanilla Espresso",
      bite: "Paris Butter Croissant"
    },
    features: ["Terrace Lounge", "Evening Reserve", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/paris-cafe-interior.png",
    isFeatured: true,
    region: "Europe",
    category: "Flagship Salon"
  },
  {
    id: 2,
    name: "Plus33 Milano Atelier",
    city: "Milan",
    address: "Via Dante 14, 20121 Milano, Italy",
    lat: 45.4665,
    lng: 9.1843,
    phone: "+39 02 89 01 00 33",
    openHours: "07:30 - 23:00",
    narrative: "A refined espresso destination blending Italian craftsmanship with modern lounge ambience, nestled under historic Milanese architecture.",
    pairings: {
      selection: "Sicilia Citrus Cold Brew",
      bite: "Milano Pistachio Biscotti"
    },
    features: ["Terrace Lounge", "Evening Reserve", "Espresso Bar", "Night Lounge"],
    img: "/global/assets/img/milan-lounge-interior.png",
    isFeatured: true,
    region: "Europe",
    category: "Espresso Bar"
  },
  {
    id: 3,
    name: "Plus33 Amsterdam Galerie",
    city: "Amsterdam",
    address: "Prinsengracht 456, 1016 HL Amsterdam, Netherlands",
    lat: 52.3688,
    lng: 4.8856,
    phone: "+31 20 52 10 033",
    openHours: "09:00 - 21:00",
    narrative: "A bright, canal-side gallery displaying contemporary artwork alongside slow-extraction cold brews and botanical tea infusions.",
    pairings: {
      selection: "Nordic Vanilla Espresso",
      bite: "Florence Almond Tart"
    },
    features: ["Quiet Workspace", "Open Courtyard", "WiFi"],
    img: "/global/assets/img/boutique-tablescape.png",
    isFeatured: true,
    region: "Europe",
    category: "Galerie & Brew"
  },
  {
    id: 4,
    name: "Plus33 Vienna Salon",
    city: "Vienna",
    address: "Herrengasse 10, 1010 Wien, Austria",
    lat: 48.2098,
    lng: 16.3654,
    phone: "+43 1 53 30 033",
    openHours: "08:00 - 22:00",
    narrative: "An elegant reserve experience blending warm walnut interiors, quiet jazz ambience, and signature hazelnut espresso rituals.",
    pairings: {
      selection: "Vienna Hazelnut Reserve",
      bite: "Florence Almond Tart"
    },
    features: ["Evening Reserve", "Quiet Workspace", "Private Seating"],
    img: "/global/assets/img/vienna-coffee-house.png",
    isFeatured: true,
    region: "Europe",
    category: "Boutique Reserve"
  },
  {
    id: 5,
    name: "Plus33 Copenhagen Salon",
    city: "Copenhagen",
    address: "Nyhavn 21, 1051 København, Denmark",
    lat: 55.6798,
    lng: 12.5898,
    phone: "+45 33 15 00 33",
    openHours: "08:00 - 19:00",
    narrative: "A clean Scandinavian salon prioritizing workspace minimalism, single-origin V60 pour overs, and fresh organic pastries.",
    pairings: {
      selection: "Nordic Vanilla Espresso",
      bite: "Paris Butter Croissant"
    },
    features: ["Quiet Workspace", "Open Courtyard", "WiFi"],
    img: "/global/assets/img/morning-7eme.png",
    isFeatured: true,
    region: "Europe",
    category: "Scandinavian Atelier"
  },
  {
    id: 6,
    name: "Plus33 Zurich Pavilion",
    city: "Zurich",
    address: "Bahnhofstrasse 24, 8001 Zürich, Switzerland",
    lat: 47.3712,
    lng: 8.5398,
    phone: "+41 44 21 10 033",
    openHours: "08:00 - 20:00",
    narrative: "An architectural lakefront pavilion crafted in dark steel and glass. Famous for its thick reserve chocolates and rich filter blends.",
    pairings: {
      selection: "Barcelona Cocoa Roast",
      bite: "Milano Pistachio Biscotti"
    },
    features: ["Evening Reserve", "Quiet Workspace", "Private Seating", "WiFi"],
    img: "/global/assets/img/boutique-tablescape.png",
    isFeatured: true,
    region: "Europe",
    category: "Bespoke Pavilion"
  },
  {
    id: 7,
    name: "Plus33 Barcelona Terrace",
    city: "Barcelona",
    address: "Passeig de Gràcia 50, 08007 Barcelona, Spain",
    lat: 41.3912,
    lng: 2.1648,
    phone: "+34 93 48 70 033",
    openHours: "08:30 - 23:30",
    narrative: "A sunlit open-air terrace framing beautiful Passeig de Gràcia views. Serves refreshing citrus cold brews and afternoon pairings.",
    pairings: {
      selection: "Sicilia Citrus Cold Brew",
      bite: "Florence Almond Tart"
    },
    features: ["Terrace Lounge", "Open Courtyard", "Night Lounge"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: true,
    region: "Europe",
    category: "Terrace Lounge"
  },
  {
    id: 8,
    name: "Plus33 Florence Palazzo",
    city: "Florence",
    address: "Piazza della Signoria 8, 50122 Firenze, Italy",
    lat: 43.7696,
    lng: 11.2558,
    phone: "+39 055 21 10 033",
    openHours: "08:00 - 22:30",
    narrative: "A Renaissance-style courtyard salon offering historic views, quiet alcoves, and double-extracted traditional espresso shots.",
    pairings: {
      selection: "Vienna Hazelnut Reserve",
      bite: "Florence Almond Tart"
    },
    features: ["Open Courtyard", "Private Seating", "Espresso Bar"],
    img: "/global/assets/img/architecture-taste.png",
    isFeatured: true,
    region: "Europe",
    category: "Heritage Courtyard"
  },
  {
    id: 9,
    name: "Plus33 Berlin Pavilion",
    city: "Berlin",
    address: "Oranienburger Str. 27, 10117 Berlin, Germany",
    lat: 52.5253,
    lng: 13.3924,
    phone: "+49 30 280 0033",
    openHours: "08:00 - 20:00",
    narrative: "An industrial-chic retreat showcasing steel frames and concrete pillars, celebrating minimalist design alongside specialty filter roasts.",
    pairings: {
      selection: "Nordic Vanilla Espresso",
      bite: "Berlin Plum Crumble"
    },
    features: ["Quiet Workspace", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/boutique-tablescape.png",
    isFeatured: true,
    region: "Europe",
    category: "Industrial Pavilion"
  },
  {
    id: 10,
    name: "Plus33 London Atelier",
    city: "London",
    address: "45 Jermyn St, St. James's, London SW1Y 6JD, UK",
    lat: 51.5074,
    lng: -0.1278,
    phone: "+44 20 7930 0033",
    openHours: "08:00 - 21:00",
    narrative: "An elegant space of polished mahogany and brass in the heart of St. James's, bridging British tea rituals with masterfully pulled espresso.",
    pairings: {
      selection: "Earl Grey Espresso Macchiato",
      bite: "Chelsea Bun Scone"
    },
    features: ["Quiet Workspace", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/milan-lounge-interior.png",
    isFeatured: false,
    region: "Europe",
    category: "Exclusive Atelier"
  },
  {
    id: 11,
    name: "Plus33 Rome Galleria",
    city: "Rome",
    address: "Piazza di Spagna 33, 00187 Roma, Italy",
    lat: 41.9060,
    lng: 12.4820,
    phone: "+39 06 699 0033",
    openHours: "07:00 - 23:00",
    narrative: "Steps from the Spanish Steps, our Rome Galleria celebrates Italian espresso traditions in a vault of travertine stone and contemporary gallery displays.",
    pairings: {
      selection: "Sicilia Citrus Cold Brew",
      bite: "Rome Pistachio Cannoli"
    },
    features: ["Terrace Lounge", "Espresso Bar", "Night Lounge"],
    img: "/global/assets/img/milan-lounge-interior.png",
    isFeatured: false,
    region: "Europe",
    category: "Travertine Galleria"
  },
  {
    id: 12,
    name: "Plus33 Prague Cabinet",
    city: "Prague",
    address: "Staroměstské nám. 12, 110 00 Praha 1, Czechia",
    lat: 50.0870,
    lng: 14.4207,
    phone: "+420 224 210 033",
    openHours: "08:30 - 21:30",
    narrative: "A Gothic-inspired hideaway featuring velvet alcoves and curated library walls, designed for slow-extraction filter brews and quiet contemplation.",
    pairings: {
      selection: "Vienna Hazelnut Reserve",
      bite: "Prague Honey Cake"
    },
    features: ["Quiet Workspace", "Private Seating", "WiFi"],
    img: "/global/assets/img/vienna-coffee-house.png",
    isFeatured: false,
    region: "Europe",
    category: "Bibliotheque Cabinet"
  },
  {
    id: 13,
    name: "Plus33 Istanbul Bosphorus",
    city: "Istanbul",
    address: "Kemankeş Karamustafa Paşa, Rıhtım Cd. 33, 34425 Beyoğlu/İstanbul, Turkey",
    lat: 41.0082,
    lng: 28.9784,
    phone: "+90 212 244 0033",
    openHours: "08:00 - 22:30",
    narrative: "A transcontinental sensory escape framing beautiful Bosphorus views, celebrating Turkish heritage coffee spices alongside rich dark-roast rituals.",
    pairings: {
      selection: "Cardamom Velvet Espresso",
      bite: "Istanbul Rosewater Loukoum"
    },
    features: ["Terrace Lounge", "Open Courtyard", "Espresso Bar"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Middle East",
    category: "Bosphorus Lounge"
  },
  {
    id: 14,
    name: "Plus33 Dubai Reserve",
    city: "Dubai",
    address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
    lat: 25.2048,
    lng: 55.2708,
    phone: "+971 4 456 0033",
    openHours: "08:00 - 01:00",
    narrative: "A refined lounge destination blending contemporary luxury with warm golden hospitality, set against soaring skyline perspectives.",
    pairings: {
      selection: "24K Gold Dust Macchiato",
      bite: "Dubai Pistachio Baklava"
    },
    features: ["Evening Reserve", "Terrace Lounge", "Night Lounge"],
    img: "/global/assets/img/luxury-business-space.png",
    isFeatured: false,
    region: "Middle East",
    category: "Skyline Reserve"
  },
  {
    id: 15,
    name: "Plus33 Tokyo Precision",
    city: "Tokyo",
    address: "5-chōme-11-1 Minamiaoyama, Minato City, Tokyo 107-0062, Japan",
    lat: 35.6762,
    lng: 139.6503,
    phone: "+81 3 5468 0033",
    openHours: "08:00 - 23:00",
    narrative: "Quiet midnight espresso rituals inspired by modern Japanese precision, meticulous pour overs, and elevated urban calm.",
    pairings: {
      selection: "Uji Matcha Shot Brew",
      bite: "Aoyama Sweet Azuki Mochi"
    },
    features: ["Quiet Workspace", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Midnight Atelier"
  },
  {
    id: 16,
    name: "Plus33 Singapore Sanctuary",
    city: "Singapore",
    address: "10 Bayfront Ave, Marina Bay Sands, Singapore 018956",
    lat: 1.3521,
    lng: 103.8198,
    phone: "+65 6688 0033",
    openHours: "09:00 - 22:00",
    narrative: "A tropical metropolitan retreat balancing architectural elegance with modern café culture, surrounded by lush botanical gardens.",
    pairings: {
      selection: "Coconut Nectar Drip Coffee",
      bite: "Pandan Coconut Crepe"
    },
    features: ["Open Courtyard", "Quiet Workspace", "WiFi"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Tropical Sanctuary"
  },
  {
    id: 17,
    name: "Plus33 Hong Kong Peak",
    city: "Hong Kong",
    address: "Shop G12, The Landmark, Central, Hong Kong",
    lat: 22.3193,
    lng: 114.1694,
    phone: "+852 2522 0033",
    openHours: "08:00 - 21:00",
    narrative: "A high-elevation glass sanctuary framing harbor vistas, celebrating specialty single-origin espresso and luxury tea culture.",
    pairings: {
      selection: "Oolong Jasmine Cold Brew",
      bite: "Hong Kong Egg Custard Tart"
    },
    features: ["Quiet Workspace", "Private Seating", "WiFi"],
    img: "/global/assets/img/boutique-tablescape.png",
    isFeatured: false,
    region: "Asia",
    category: "Skyline Glasshouse"
  },
  {
    id: 18,
    name: "Plus33 Shanghai Bund",
    city: "Shanghai",
    address: "No. 33 Zhongshan Road (E-1), Huangpu, Shanghai, China",
    lat: 31.2304,
    lng: 121.4737,
    phone: "+86 21 6323 0033",
    openHours: "08:30 - 22:00",
    narrative: "An editorial destination combining art-deco grandeur with signature cold-extraction brews along the historic Bund riverfront.",
    pairings: {
      selection: "Imperial Jasmine Espresso",
      bite: "Shanghai Sweet Red Bean Cake"
    },
    features: ["Evening Reserve", "Terrace Lounge", "Espresso Bar"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Riverfront Grandeur"
  },
  {
    id: 19,
    name: "Plus33 Seoul Hanok",
    city: "Seoul",
    address: "33 Yulgok-ro 5-gil, Jongno-gu, Seoul, South Korea",
    lat: 37.5665,
    lng: 126.9780,
    phone: "+82 2 730 0033",
    openHours: "09:00 - 21:30",
    narrative: "A quiet traditional hanok pavilion reimagined with modern concrete architecture, serving single-origin drip filters and ginger infusions.",
    pairings: {
      selection: "Ginseng Honey Brew",
      bite: "Korean Sweet Rice Cake"
    },
    features: ["Open Courtyard", "Quiet Workspace", "Private Seating"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Hanok Retreat"
  },
  {
    id: 20,
    name: "Plus33 Mumbai Pavilion",
    city: "Mumbai",
    address: "Jio World Drive, BKC, Bandra East, Mumbai, Maharashtra 400051, India",
    lat: 19.0760,
    lng: 72.8777,
    phone: "+91 22 3500 0033",
    openHours: "08:30 - 23:00",
    narrative: "A majestic BKC oasis blending solid teak wood detailing with signature spicy chai espresso mocktails and artisanal baked bites.",
    pairings: {
      selection: "Masala Chai Spiced Espresso",
      bite: "Mumbai Pistachio Mawa Cake"
    },
    features: ["Terrace Lounge", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Metropolitan Oasis"
  },
  {
    id: 21,
    name: "Plus33 Bangkok Oasis",
    city: "Bangkok",
    address: "IconSiam, 299 Charoen Nakhon Rd, Bangkok 10600, Thailand",
    lat: 13.7563,
    lng: 100.5018,
    phone: "+66 2 490 0033",
    openHours: "10:00 - 22:00",
    narrative: "A beautiful riverside terrace overlooking the Chao Phraya, featuring tropical design notes and signature lemongrass filter coffee.",
    pairings: {
      selection: "Lemongrass Citrus Cold Drip",
      bite: "Bangkok Mango Sticky Pastry"
    },
    features: ["Terrace Lounge", "Open Courtyard", "WiFi"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Riverside Sanctuary"
  },
  {
    id: 22,
    name: "Plus33 Coimbatore Heritage",
    city: "Coimbatore",
    address: "33 Race Course Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018, India",
    lat: 11.0168,
    lng: 76.9558,
    phone: "+91 422 222 0033",
    openHours: "08:00 - 22:00",
    narrative: "An elegant heritage estate nestled in tree-lined Race Course, serving premium Nilgiri cold drips and cardamom almond croissants.",
    pairings: {
      selection: "Nilgiri Mountain Filter Drip",
      bite: "Coimbatore Cardamom Croissant"
    },
    features: ["Open Courtyard", "Quiet Workspace", "Private Seating"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Asia",
    category: "Heritage Estate"
  },
  {
    id: 23,
    name: "Plus33 New York Downtown",
    city: "New York City",
    address: "33 Crosby St, New York, NY 10013, USA",
    lat: 40.7128,
    lng: -74.0060,
    phone: "+1 212 966 0033",
    openHours: "08:00 - 23:00",
    narrative: "An intimate late-evening destination inspired by timeless downtown Soho lounge energy, warm lights, and bold double ristrettos.",
    pairings: {
      selection: "Manhattan Dark Espresso Noir",
      bite: "New York Cinnamon Crumb Cake"
    },
    features: ["Evening Reserve", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/boutique-tablescape.png",
    isFeatured: false,
    region: "North America",
    category: "Downtown Lounge"
  },
  {
    id: 24,
    name: "Plus33 Los Angeles Villa",
    city: "Los Angeles",
    address: "8400 Melrose Ave, West Hollywood, CA 90069, USA",
    lat: 34.0522,
    lng: -118.2437,
    phone: "+1 310 659 0033",
    openHours: "07:30 - 20:00",
    narrative: "A light-filled West Hollywood villa featuring high ceilings, white stucco archways, and signature iced citrus tonic espresso drinks.",
    pairings: {
      selection: "Melrose Citrus Tonic Brew",
      bite: "Melrose Avocado Brioche Tart"
    },
    features: ["Open Courtyard", "Terrace Lounge", "WiFi"],
    img: "/global/assets/img/milan-lounge-interior.png",
    isFeatured: false,
    region: "North America",
    category: "Melrose Villa"
  },
  {
    id: 25,
    name: "Plus33 Toronto Reserve",
    city: "Toronto",
    address: "33 Bloor St E, Toronto, ON M4W 3H1, Canada",
    lat: 43.6532,
    lng: -79.3832,
    phone: "+1 416 925 0033",
    openHours: "08:00 - 21:00",
    narrative: "A warm maple wood haven offering double-extraction espresso rituals and quiet study pods for chilly Toronto mornings.",
    pairings: {
      selection: "Canadian Maple Cappuccino",
      bite: "Toronto Maple Pecan Scone"
    },
    features: ["Quiet Workspace", "Private Seating", "WiFi"],
    img: "/global/assets/img/vienna-coffee-house.png",
    isFeatured: false,
    region: "North America",
    category: "Boutique Reserve"
  },
  {
    id: 26,
    name: "Plus33 São Paulo Paulista",
    city: "São Paulo",
    address: "Av. Paulista, 3333 - Bela Vista, São Paulo - SP, 01311-000, Brazil",
    lat: -23.5505,
    lng: -46.6333,
    phone: "+55 11 3253 0033",
    openHours: "08:00 - 22:00",
    narrative: "A grand modernist salon celebrating Brazilian coffee culture, serving heavy-bodied natural processed filter roasts and warm cheese pastries.",
    pairings: {
      selection: "Cerrado Honey Cold Brew",
      bite: "Paulista Warm Pão de Queijo"
    },
    features: ["Terrace Lounge", "Espresso Bar", "WiFi"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "South America",
    category: "Modernist Salon"
  },
  {
    id: 27,
    name: "Plus33 Sydney Harbour",
    city: "Sydney",
    address: "33 Circular Quay W, The Rocks NSW 2000, Australia",
    lat: -33.8688,
    lng: 151.2093,
    phone: "+61 2 9241 0033",
    openHours: "07:30 - 18:30",
    narrative: "An open-air glass pavilion overlooking the historic Rocks harbor, famous for its smooth flat whites and toasted macadamia bites.",
    pairings: {
      selection: "Rocks Macadamia Flat White",
      bite: "Sydney Toasted Almond Croissant"
    },
    features: ["Terrace Lounge", "Open Courtyard", "WiFi"],
    img: "/global/assets/img/outdoor-terrace-cafe.png",
    isFeatured: false,
    region: "Oceania",
    category: "Harbour Pavilion"
  }
];
