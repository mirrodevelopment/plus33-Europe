/**
 * FILE: product-details.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Cinematic Controller for the Product Details Page.
 * Fetches dynamic data from the Spring Boot REST API
 * and powers the interactive brewing calculator.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

// Offline/Static Fallback Products Database (guarantees flawless operation offline)
const FALLBACK_PRODUCTS = [
  {
    id: 1, name: "Café Filtre", category: "equipment", price: 6.00,
    origin: "Kenya Nyeri Wash-Lot", roast: "Light", badge: "Single Origin",
    notes: "Filter Drip, Wash-Lot, Red Currant", imagePath: "/local/assets/products/coffee-bag/edition-printemps.png",
    description: "A traditional hand-poured filter drip bag highlighting clean single-origin nuances. Slow-brewed for exceptional cup clarity and complex red currant acidity."
  },
  {
    id: 2, name: "Cappuccino", category: "blends", price: 6.50,
    origin: "Organic Blend · In-Salon", roast: "Rich & Velvety", badge: "Best Seller",
    notes: "Silky Milk, Double Espresso, Latte Art", imagePath: "/local/assets/products/coffee's/hot-classics.png",
    description: "Expertly steamed milk poured over a rich double espresso base, creating a thick, luxurious blanket of velvety microfoam. Perfectly finished with hand-crafted latte art."
  },
  {
    id: 3, name: "Latte / Flat White", category: "blends", price: 6.80,
    origin: "Brazilian Cerrado · In-Salon", roast: "Smooth & Creamy", badge: "Atelier Standard",
    notes: "Steamed Milk, Ristretto, Velvety", imagePath: "/local/assets/products/coffee's/Latte-Flat-White.jpg",
    description: "Your choice between our smooth, milk-forward Caffè Latte or the bolder, velvety Flat White crafted with ristretto extraction and micro-textured steamed milk."
  },
  {
    id: 4, name: "Chai Latte", category: "blends", price: 7.00,
    origin: "Nilgiri Tea & Spices", roast: "Aromatic & Spiced", badge: "House Specialty",
    notes: "Masala Spices, Oat Milk, Aromatic", imagePath: "/local/assets/products/coffee-bag/cinnamon.png",
    description: "An elegant infusion of slow-brewed black tea leaves, crushed cardamoms, cinnamon bark, and wild ginger, finished with lightly textured organic oat milk."
  },
  {
    id: 5, name: "Pumpkin Latte", category: "blends", price: 7.50,
    origin: "Atelier Blend · In-Salon", roast: "Warm & Comforting", badge: "Autumn Special",
    notes: "Pumpkin Coulis, Nutmeg, Vanilla Bean", imagePath: "/local/assets/products/coffee's/Pumpkin-Latte.jpg",
    description: "A refined autumnal luxury. Double shot of specialty espresso combined with slow-simmered pumpkin coulis, warm winter spices, and real Madagascar vanilla."
  },
  {
    id: 6, name: "Matcha", category: "pastry", price: 7.20,
    origin: "Uji, Kyoto, Japan", roast: "Spring First-Harvest", badge: "Ceremonial Grade",
    notes: "Kyoto Origin, Umami, Emerald Green", imagePath: "/local/assets/products/coffee-bag/tea-powder.jpeg",
    description: "Stone-ground spring tencha leaves from Uji, Kyoto. Traditional bamboo-whisked preparation delivering a vibrant emerald green color and a smooth, mellow umami profile."
  },
  {
    id: 7, name: "Matcha Vanille", category: "pastry", price: 7.50,
    origin: "Kyoto & Madagascar", roast: "Velvet Layers", badge: "Pastry Lab Blend",
    notes: "Vanilla Nectar, Ceremonial Uji, Layered", imagePath: "/local/assets/products/coffee's/Matcha-Vanille.jpg",
    description: "A luxurious layered creation pairing whisked Ceremonial Uji Matcha with organic Madagascar vanilla bean nectar and chilled velvet milk."
  },
  {
    id: 8, name: "Thé Glacé d'Hiver", category: "origin", price: 7.00,
    origin: "Provence Blend · Cold Infused", roast: "Floral & Fruity", badge: "Botanical Brew",
    notes: "Cold Steeped, Forest Berries, Elderflower", imagePath: "/local/assets/products/coffee's/iced-coffees.png",
    description: "\"Winter Iced Tea\" — A delicate, 12-hour cold-steeped botanical infusion featuring wild forest berries, organic elderflower, citrus peels, and a dash of winter spice."
  },
  {
    id: 9, name: "Tiramisu Glacé", category: "origin", price: 8.50,
    origin: "Plus33 Pastry Lab", roast: "Rich & Decadent", badge: "Seasonal Dessert",
    notes: "Mascarpone, Savoiardi, Cocoa Dust", imagePath: "/local/assets/products/deserts/Tiramisu-Glace.jpg",
    description: "A dessert in a glass. Layers of chilled double espresso, sweet whipped mascarpone cream, house-baked savoiardi crumbs, and a dusting of dark French cocoa powder."
  },
  {
    id: 10, name: "Iced Punch Coco", category: "origin", price: 8.00,
    origin: "Tropical Sourced · Iced", roast: "Sweet & Hydrating", badge: "Exotic Reserve",
    notes: "Coconut Water, Sweet Cream, Lime Splash", imagePath: "/local/assets/products/coffee's/Iced-Punch-Coco-cocktail.jpg",
    description: "An ultra-refreshing Parisian-tropical fusion. Chilled organic coconut water, whipped sweet coconut cream, and a splash of lime juice poured over crystal ice spheres."
  },
  {
    id: 11, name: "Sachet de Café", category: "equipment", price: 24.00,
    origin: "Ethiopia Yirgacheffe & Geisha", roast: "Light-Medium Blend", badge: "Micro-Lot Pouch",
    notes: "Whole Bean, Geisha Blend, Paris Sourced", imagePath: "/local/assets/products/coffee-bag/the-prestige-edition.png",
    description: "Our signature luxury whole bean coffee pouch. Hand-packaged and nitrogen-flushed in Paris to guarantee peak aroma, featuring sweet notes of jasmine, bergamot, and honey. 250g."
  },
  {
    id: 12, name: "Cerrado & Colombia", category: "equipment", price: 22.00,
    origin: "Cerrado & Huila Regions", roast: "Medium Roast", badge: "House Reserve",
    notes: "Whole Bean, Smooth Body, Caramel Finish", imagePath: "/local/assets/products/coffee-bag/Brazil-Cerrado-Colombia.jpg",
    description: "A signature house blend balancing sweet Brazilian Cerrado with vibrant Colombian Huila beans. Hand-packaged to offer a rich milk chocolate body with toasted hazelnut aromas."
  },
  {
    id: 13, name: "Signature Dark Roast", category: "equipment", price: 21.00,
    origin: "Central & South America", roast: "Dark Roast", badge: "Intense Selection",
    notes: "Whole Bean, Dark Cacao, Bold Body", imagePath: "/local/assets/products/coffee-bag/dark-roast.png",
    description: "A bold, deep espresso blend roasted slightly longer to express rich dark cacao notes, heavy-bodied texture, and a smooth, bittersweet smoky caramel finish."
  },
  {
    id: 14, name: "+33 Atelier Gift Pack", category: "equipment", price: 63.30,
    origin: "Curated Selection", roast: "Multi-Roast Edition", badge: "Luxury Set",
    notes: "Gift Box, Curated Reserve, Handcrafted", imagePath: "/local/assets/products/merchant/gift-pack.jpeg",
    description: "The ultimate sensory coffee gift. Beautifully boxed collection including two of our micro-lot single-origin filter bags, one whole bean reserve pouch, and custom brand cards."
  },
  {
    id: 15, name: "+33 Organic Tote", category: "equipment", price: 18.00,
    origin: "Parisian Atelier", roast: "Cotton Canvas", badge: "Ritual Object",
    notes: "Organic Cotton, French Design, Everyday Carry", imagePath: "/local/assets/products/merchant/plus33-tote.png",
    description: "Heavyweight organic cotton canvas tote featuring our hand-pressed signature wordmark. Durable, elegant, and designed to carry your daily coffee ritual essentials."
  }
];

/**
 * Mounts the dynamic Product Details interactive system.
 * @param {string|number} productId - The selected product ID
 * @returns {Function} Teardown cleanup function
 */
export function mountProductDetailsPage(productId) {
  const root = document.getElementById('product-details-root');
  if (!root) return;

  const id = parseInt(productId, 10);
  
  // History back-navigation for details-back-btn if referred from same site, otherwise default href=/store
  const backBtn = document.querySelector('.details-back-btn');
  const handleBackClick = (e) => {
    if (document.referrer && document.referrer.includes(window.location.host)) {
      e.preventDefault();
      window.history.back();
    }
  };
  if (backBtn) {
    backBtn.addEventListener('click', handleBackClick);
  }
  
  // Define internal state for the calculator
  let currentMethod = 'v60'; // v60, chemex, aeropress
  let currentCups = 1;

  // Brewing configurations
  const CALC_CONFIG = {
    v60:       { ratio: 16, grind: 'Medium-Fine', temp: '94°C', label: 'Hario V60' },
    chemex:    { ratio: 15, grind: 'Medium-Coarse', temp: '92°C', label: 'Chemex' },
    aeropress: { ratio: 12, grind: 'Fine', temp: '88°C', label: 'AeroPress' }
  };

  // Helper to determine if product is a brewable coffee bag/filter
  const _isBrewableCoffee = (product) => {
    if (!product || !product.notes) return false;
    const notesLower = product.notes.toLowerCase();
    return notesLower.includes('whole bean') || notesLower.includes('filter drip');
  };

  const initCalculatorListeners = () => {
    const tabs = document.querySelectorAll('.details-calc-tab');
    const slider = document.getElementById('calc-cup-slider');
    const valCups = document.getElementById('calc-val-cups');

    if (!slider) return;

    // Tabs clicks
    const handleTabClick = (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentMethod = e.currentTarget.getAttribute('data-method');
      updateCalculator();
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });

    // Slider input change
    const handleSliderInput = (e) => {
      currentCups = parseInt(e.target.value, 10);
      if (valCups) {
        valCups.textContent = currentCups + (currentCups === 1 ? ' Cup (200ml)' : ' Cups (' + (currentCups * 200) + 'ml)');
      }
      updateCalculator();
    };

    slider.addEventListener('input', handleSliderInput);

    // Initial update
    updateCalculator();

    return () => {
      tabs.forEach(tab => tab.removeEventListener('click', handleTabClick));
      slider.removeEventListener('input', handleSliderInput);
    };
  };

  const updateCalculator = () => {
    const conf = CALC_CONFIG[currentMethod];
    const waterVol = currentCups * 200; // 200ml per cup
    const coffeeDose = Math.round(waterVol / conf.ratio);

    const doseVal = document.getElementById('calc-result-dose');
    const waterVal = document.getElementById('calc-result-water');
    const grindVal = document.getElementById('calc-result-grind');
    const tempVal = document.getElementById('calc-result-temp');

    if (doseVal) doseVal.textContent = coffeeDose + ' g';
    if (waterVal) waterVal.textContent = waterVol + ' ml';
    if (grindVal) grindVal.textContent = conf.grind;
    if (tempVal) tempVal.textContent = conf.temp;
  };

  const renderProductDetails = (product) => {
    // Styles are loaded natively via product-details.css

    const tagsHtml = product.notes ? product.notes.split(',')
      .map(note => `<span class="details-note-tag">${note.trim()}</span>`).join('') : '';

    const badgeHtml = product.badge ? `<div class="details-info__badge">${product.badge}</div>` : '';

    const isCoffee = _isBrewableCoffee(product);

    root.innerHTML = `
      <!-- Left: Column Immersive Image -->
      <div class="details-display reveal-item">
        <img src="${product.imagePath}" alt="${product.name}" class="details-display__img" />
      </div>

      <!-- Right: Column Premium Editorial Details -->
      <div class="details-info reveal-item">
        ${badgeHtml}
        <h1 class="display-lg details-info__title text-cream">${product.name}</h1>
        <div class="details-info__price">€${product.price.toFixed(2)}</div>
        <p class="details-info__desc">${product.description}</p>

        <!-- Spec Highlights -->
        <div class="details-specs">
          <div class="details-spec-item">
            <span class="details-spec-label">Terroir</span>
            <span class="details-spec-val">${product.origin || 'Exclusive Atelier Selection'}</span>
          </div>
          <div class="details-spec-item">
            <span class="details-spec-label">Roast level</span>
            <span class="details-spec-val">${product.roast || 'Balanced Custom Profile'}</span>
          </div>
          <div class="details-spec-item">
            <span class="details-spec-label">Flavor profile</span>
            <div class="details-notes-list">
              ${tagsHtml}
            </div>
          </div>
        </div>

        <!-- Interactive Brewing Calculator (Only show for brewable coffee selections) -->
        ${isCoffee ? `
          <div class="details-calculator">
            <h3 class="details-calculator__title">Atelier Brewing Guide</h3>
            
            <div class="details-calc-tabs" role="tablist">
              <button class="details-calc-tab active" data-method="v60" role="tab">Hario V60</button>
              <button class="details-calc-tab" data-method="chemex" role="tab">Chemex</button>
              <button class="details-calc-tab" data-method="aeropress" role="tab">AeroPress</button>
            </div>

            <div class="details-calc-slider-group">
              <div class="details-calc-slider-header">
                <span>Select Brew Volume</span>
                <span id="calc-val-cups" class="text-gold">1 Cup (200ml)</span>
              </div>
              <input type="range" id="calc-cup-slider" class="details-calc-slider" min="1" max="4" value="1" step="1" />
            </div>

            <div class="details-calc-results">
              <div class="details-result-item">
                <span class="details-result-label">Coffee Dose</span>
                <span id="calc-result-dose" class="details-result-val">12 g</span>
              </div>
              <div class="details-result-item">
                <span class="details-result-label">Water Target</span>
                <span id="calc-result-water" class="details-result-val">200 ml</span>
              </div>
              <div class="details-result-item" style="margin-top: 10px;">
                <span class="details-result-label">Grind Size</span>
                <span id="calc-result-grind" class="details-result-val">Medium-Fine</span>
              </div>
              <div class="details-result-item" style="margin-top: 10px;">
                <span class="details-result-label">Water Temp</span>
                <span id="calc-result-temp" class="details-result-val">94°C</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Initialize Calculator Listeners if brewable coffee
    let calculatorCleanup = null;
    if (isCoffee) {
      calculatorCleanup = initCalculatorListeners();
    }

    // GSAP Reveals
    if (window.gsap) {
      window.gsap.from('.reveal-item', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }

    return () => {
      if (typeof calculatorCleanup === 'function') {
        calculatorCleanup();
      }
    };
  };

  let calcTeardown = null;

  // Fetch the selected product dynamically
  fetch(`/api/store/products/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    })
    .then(product => {
      calcTeardown = renderProductDetails(product);
    })
    .catch(err => {
      console.warn('REST API unavailable, loading offline local registry product...', err);
      const fallback = FALLBACK_PRODUCTS.find(p => p.id === id);
      if (fallback) {
        calcTeardown = renderProductDetails(fallback);
      } else {
        root.innerHTML = `<div class="t-body text-center" style="grid-column: span 2; padding: 100px 0;">Product Reserve Selection not found.</div>`;
      }
    });

  // Explicit SPA Teardown Hook
  return () => {
    if (typeof calcTeardown === 'function') {
      calcTeardown();
    }
    if (backBtn) {
      backBtn.removeEventListener('click', handleBackClick);
    }
    // Styles are loaded natively via product-details.css
  };
}
