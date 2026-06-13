/**
 * FILE: chatbot-data.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Paris Pony — Coffee Assistant knowledge base.
 * Contains all predefined Q&A sets, quick actions, and
 * keyword arrays for each page context.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

const CHATBOT_DATA = {

  /* ═══════════════════════════════════════════
     HOME PAGE  —  route: /
  ════════════════════════════════════════════ */
  home: {
    quickActions: [
      'Best Drinks',
      'Cold Coffee',
      'Find Café',
      'Franchise',
      'Popular Picks'
    ],
    qa: [
      {
        keywords: ['best', 'popular', 'favorite', 'top', 'good', 'signature', 'picks'],
        answer: 'Our customer favorites include **Café Filtre**, **Cappuccino**, **Latte / Flat White**, and chilled **Tiramisu Glacé**.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['drink', 'coffee', 'beverage', 'menu', 'latte', 'espresso'],
        answer: 'Explore our signature coffee collection featuring hot classics like **Café Filtre**, iced coffees, matcha drinks & seasonal specials.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['snack', 'food', 'dessert', 'croissant', 'eat', 'bite'],
        answer: 'Pair your coffee with our premium café bites and desserts, like our warm **Paris Butter Croissant** or artisanal **Milano Pistachio Biscotti** available at select cafés!\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['suggest', 'sugust', 'recommend', 'choice', 'pick'],
        answer: 'Try our **Signature Hazelnut Latte**, **Caramel Cold Brew**, or **Tiramisu Glacé** — customer favorites.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['story', 'about', 'history', 'who are', 'brand'],
        answer: '**+33 Paris** was born from a love of Parisian café culture. We brew premium coffee with elegance, warmth, and a modern touch.\n\n[Read our Journal](/journal)'
      },
      {
        keywords: ['franchise', 'partner', 'business', 'own a', 'open a'],
        answer: 'Interested in a **+33 Paris franchise**? Visit our Franchise page or tap "Franchise Info" below to learn more.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['location', 'find', 'nearest', 'where', 'café', 'cafe', 'store location', 'address'],
        answer: 'Find your nearest **+33 Paris café** on our Find Us page — we\'re spreading across cities.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['refreshing', 'cold', 'iced', 'summer', 'chill'],
        answer: 'Our chilled **Thé Glacé d\'Hiver**, **Tiramisu Glacé** & **Iced Punch Coco** are perfect for a refreshing pick-me-up. Chilled to perfection.\n\n[Explore Menu](/store)'
      }
    ]
  },

  /* ═══════════════════════════════════════════
     STORE PAGE  —  route: /store
     (maps to coffee menu questions)
  ════════════════════════════════════════════ */
  store: {
    quickActions: [
      'Hot Coffee',
      'Iced Drinks',
      'Desserts',
      'Best Sellers',
      'Use My Location'
    ],
    qa: [
      {
        keywords: ['hot coffee', 'warm coffee', 'classic', 'hot drink', 'latte', 'cappuccino', 'flat white', 'filtre'],
        answer: 'Our hot classics — traditional **Café Filtre**, classic **Cappuccino**, and a rich **Latte / Flat White**. Perfect to warm your soul.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['iced', 'cold brew', 'iced coffee', 'cold drink', 'chilled', 'iced drinks', 'punch'],
        answer: 'Cool off with our chilled selection — **Thé Glacé d\'Hiver**, **Tiramisu Glacé**, and **Iced Punch Coco**. Effortlessly Parisian.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['dessert', 'desserts', 'sweet', 'croissant', 'pastry', 'bites'],
        answer: 'Sweet pairings — our warm **Paris Butter Croissant**, **Milano Pistachio Biscotti**, or a layered **Tiramisu Glacé**!\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['best sellers', 'best seller', 'popular', 'recommend', 'pick'],
        answer: 'Store favorites right now — **Café Filtre**, **Matcha Vanille** & **Tiramisu Glacé**. Our guests keep coming back for these.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['decaf', 'non-caffeine', 'caffeine free', 'no caffeine'],
        answer: 'We offer non-caffeinated options like ceremonial **Matcha**, **Matcha Vanille**, and chilled **Thé Glacé d\'Hiver**! Same craft, less buzz.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['price', 'cost', 'how much', 'pricing'],
        answer: 'Menu pricing varies by location. Visit your nearest **+33 Paris café** or check the in-store menu for current pricing.\n\n[Find a Café](/find-us)'
      }
    ]
  },

  /* ═══════════════════════════════════════════
     FRANCHISE PAGE  —  route: /franchise
  ════════════════════════════════════════════ */
  franchise: {
    quickActions: [
      'How to Start',
      'Benefits',
      'Support Offered',
      'Contact Team'
    ],
    qa: [
      {
        keywords: ['how to start', 'get started', 'apply', 'begin', 'open a franchise', 'how do i'],
        answer: 'Starting is simple — fill out the **interest form** on this page and our business team will guide you from day one.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['benefit', 'advantage', 'why franchise', 'what do i get', 'perks'],
        answer: '**+33 Paris** franchisees get **full brand support**, **barista training**, **supply chain access** & **ongoing business guidance**.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['support', 'training', 'help', 'assistance', 'team support'],
        answer: 'We provide **full setup support** — brand kit, barista training, interior design guidance & continuous operational help.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['contact', 'reach', 'email', 'call', 'speak', 'talk to'],
        answer: 'Reach our franchise team via the **contact form** on this page — we respond within **48 hours**.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['investment', 'cost', 'capital', 'money', 'funding', 'fee', 'price'],
        answer: 'Investment details are shared after your initial enquiry — our team will walk you through the **full financial plan**.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['location', 'where', 'city', 'country', 'international', 'global', 'expand'],
        answer: '**+33 Paris** is expanding **globally** — we welcome franchise enquiries from all cities and countries.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['timeline', 'how long', 'duration', 'when', 'opening time'],
        answer: 'From enquiry to opening — typically **3–6 months** depending on your location and setup. Our team manages every step.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['requirement', 'criteria', 'qualify', 'eligibility', 'who can'],
        answer: 'We look for **passionate individuals** who share our love of premium coffee and hospitality — experience helps, but drive matters more.\n\n[Franchise Info](/franchise)'
      }
    ]
  },

  /* ═══════════════════════════════════════════
     FIND US PAGE  —  route: /find-us
     (maps to location & contact questions)
  ════════════════════════════════════════════ */
  findus: {
    quickActions: [
      'Use My Location',
      'Opening Hours',
      'WhatsApp Support',
      'Contact Us'
    ],
    qa: [
      {
        keywords: ['nearest', 'closest', 'near me', 'find café', 'find cafe', 'where is', 'locate', 'nearby', 'streo', 'stroe', 'location', 'use my location'],
        answer: 'I will find your closest café right now! Please allow location access when prompted, or type the name of a city (e.g. *Paris, London, Tokyo, Mumbai*).\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['opening hours', 'timing', 'open time', 'close time', 'when open', 'working hours', 'schedule'],
        answer: 'Most **+33 Paris cafés** are open **7 AM – 10 PM daily**. Hours may vary by location — check the map listing for your nearest café.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['whatsapp', 'chat support', 'message us', 'instant support'],
        answer: 'Yes! We offer **WhatsApp support** for quick queries. Find the number on your nearest location listing on this page.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['contact', 'email', 'call', 'reach', 'support', 'speak to'],
        answer: 'Reach us via the contact details on this page — we\'re always happy to help.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['parking', 'accessibility', 'wheelchair', 'disabled'],
        answer: 'Most **+33 Paris cafés** are accessible and have nearby parking. Check individual location details on the map for specifics.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['takeaway', 'take away', 'order online', 'pickup', 'pick up'],
        answer: 'We offer quick pickup and takeaway at all locations. Simply order ahead via our app to have your beverage or pastries ready when you arrive.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['city', 'country', 'which cities', 'locations', 'branches'],
        answer: '**+33 Paris** is in multiple cities and growing — explore all locations on the map above.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['reservation', 'booking', 'table', 'reserve'],
        answer: 'Reservations are available at select locations. **Contact your nearest café directly** for booking enquiries.\n\n[Find a Café](/find-us)'
      }
    ]
  },

  /* ═══════════════════════════════════════════
     JOURNAL PAGE  —  route: /journal
  ════════════════════════════════════════════ */
  journal: {
    quickActions: [
      'Latest Articles',
      'Coffee Guides',
      'Café Stories',
      'Visit Our Store'
    ],
    qa: [
      {
        keywords: ['latest', 'new article', 'recent post', 'newest', 'just published'],
        answer: 'Our **latest journal entries** are shown above — stories from our cafés, barista craft guides & Parisian inspirations.\n\n[Read our Journal](/journal)'
      },
      {
        keywords: ['coffee guide', 'how to', 'brewing', 'barista tips', 'technique', 'brew at home'],
        answer: 'Explore our **brewing guides** in the Journal — from French press to espresso, our baristas share their secrets.\n\n[Read our Journal](/journal)'
      },
      {
        keywords: ['paris', 'parisian', 'café culture', 'french', 'story', 'inspiration'],
        answer: 'Our Journal is rooted in **Parisian café culture** — art, people, and the ritual of coffee. Enjoy the read.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['subscribe', 'newsletter', 'email update', 'notification'],
        answer: 'Subscribe to our **newsletter** at the bottom of the Journal — get fresh stories and café updates delivered to you.\n\n[Read our Journal](/journal)'
      },
      {
        keywords: ['write', 'contribute', 'submit article', 'collaboration'],
        answer: 'Interested in contributing to the **Journal**? Reach out via the contact page — we love discovering great voices.\n\n[Read our Journal](/journal)'
      }
    ]
  },

  /* ═══════════════════════════════════════════
     GLOBAL FALLBACKS  —  checked on every page
     after page-specific QA is exhausted
  ════════════════════════════════════════════ */
  global: {
    qa: [
      {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'bonjour', 'yo'],
        answer: 'Bonjour! Welcome to the **Paris Pony** coffee assistant. How can I help you today.'
      },
      {
        keywords: ['thank', 'thanks', 'merci', 'appreciate', 'helpful'],
        answer: 'My pleasure! Feel free to ask anything else — I\'m always here.'
      },
      {
        keywords: ['bye', 'goodbye', 'see you', 'ciao', 'au revoir'],
        answer: 'Au revoir! Come back anytime — **Paris Pony** is always here for you.'
      },
      {
        keywords: ['franchise', 'partner', 'business opportunity'],
        answer: 'Explore franchise opportunities on our **Franchise page** — a chance to carry a piece of Paris.\n\n[Franchise Info](/franchise)'
      },
      {
        keywords: ['menu', 'drinks', 'coffee', 'what do you have'],
        answer: 'Discover the **+33 Paris** beverage menu — from classics like **Café Filtre**, **Cappuccino**, and **Late / Flat White**, to our signature **Chai Latte**, **Pumpkin Latte**, **Matcha**, **Matcha Vanille**, **Thé Glacé d\'Hiver**, **Tiramisu Glacé**, and **Iced Punch Coco**! Sourced with our **Sachet de Café**!\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['location', 'find us', 'where', 'nearest', 'café', 'cafe', 'stroe', 'streo', 'nearby', 'use my location'],
        answer: 'I will find your closest café right now! Please allow location access when prompted, or type the name of a city (e.g. *Paris, London, Tokyo, Mumbai*).\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['journal', 'blog', 'article', 'read', 'stories'],
        answer: 'Visit our **Journal** for café stories, brewing guides & Parisian inspirations.\n\n[Read our Journal](/journal)'
      },
      {
        keywords: ['contact', 'support', 'help', 'email', 'reach'],
        answer: 'Head to our **Find Us page** for contact details — or use the **WhatsApp support** option for quick help.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['price', 'cost', 'how much', 'pricing'],
        answer: 'Pricing varies by location. Visit your nearest **+33 Paris café** or check in-store menus for details.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['wifi', 'wi-fi', 'internet', 'work from'],
        answer: 'Most **+33 Paris cafés** offer **complimentary Wi-Fi** — perfect for working from a Parisian café corner.\n\n[Find a Café](/find-us)'
      },
      {
        keywords: ['gift', 'voucher', 'gift card', 'present'],
        answer: 'Gift vouchers are available at select locations. Ask your nearest barista for details.'
      },
      {
        keywords: ['vegan', 'plant based', 'dairy free', 'oat milk', 'almond milk', 'soy'],
        answer: 'We offer **oat, almond & soy milk** alternatives across all our locations — just ask your barista.\n\n[Explore Menu](/store)'
      },
      {
        keywords: ['allergy', 'allergic', 'gluten', 'nut free', 'intolerance'],
        answer: 'Please speak directly with your barista about any **allergies** — they\'ll guide you to safe options.'
      }
    ]
  }

}; // END CHATBOT_DATA
