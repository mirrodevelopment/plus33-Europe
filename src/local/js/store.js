/**
 * FILE: store.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the PLUS33 luxury editorial catalog store page.
 *
 * RESPONSIBILITIES:
 * - Renders editorial product cards (no ecommerce UI).
 * - Powers category filters with image-based nav cards.
 * - Randomly curates "Featured Picks" on each page visit.
 * - Handles URL query param deep-linking (?category=xxx).
 * - Coordinates entrance animations via GSAP.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Maps raw API category slugs to display-friendly labels and editorial descriptions.
 */
const CATEGORY_META = {
    'hot-coffee':  { label: 'Hot Coffee',          desc: 'Expertly crafted espresso rituals and warm café classics.' },
    'iced-coffee': { label: 'Iced & Cold Drinks',  desc: 'Refreshing handcrafted cold beverages for every mood.' },
    'desserts':    { label: 'Snacks & Desserts',   desc: 'Fresh-baked pastries and indulgent sweet treats.' },
    'retail':      { label: 'Beans & Retail',      desc: 'Curated coffee beans, single-origins and signature blends.' },
    'merchandise': { label: 'Gifts & Merchandise', desc: 'Ritual objects, totes and curated PLUS33 gift sets.' },
    'signature':   { label: 'Signature Collection',desc: 'The finest expressions of the PLUS33 atelier.' },
};

/**
 * Builds the editorial card HTML for a single product.
 * No ecommerce elements — catalog-first luxury layout.
 * @param {Object} product
 * @returns {string} HTML string
 */
function buildProductCard(product) {
    const cats = product.category ? product.category.split(',').map(c => c.trim()) : [];
    const primaryCat = cats[0] || '';
    const catMeta = CATEGORY_META[primaryCat] || {};
    const catLabel = catMeta.label || primaryCat;

    return `
        <a href="/product/${product.id}" style="text-decoration: none; color: inherit; display: block; height: 100%;">
          <article class="product-card reveal" data-category="${product.category || ''}">
            <div class="product-card__media">
              <img src="${product.imagePath}" alt="${product.name}" class="product-img" loading="lazy" />
            </div>
            
            <div class="product-card__body">
              <span class="product-category-tag">${catLabel}</span>
              <div class="product-title-line"></div>
              <h3 class="product-title">${product.name}</h3>
              <span class="product-price">€${product.price.toFixed(2)}</span>
            </div>
          </article>
        </a>
    `;
}

/**
 * Returns a shuffled copy of an array (Fisher-Yates).
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Picks randomized featured items — at least one from each category, up to 8 total.
 * @param {Array} allProducts
 * @returns {Array} Up to 8 products
 */
function pickFeaturedProducts(allProducts) {
    const categoryOrder = ['hot-coffee', 'iced-coffee', 'desserts', 'retail', 'merchandise', 'signature'];
    const picked = new Set();
    const result = [];

    // First pass: pick 1 random from each category
    for (const cat of categoryOrder) {
        const pool = allProducts.filter(p => {
            const cats = (p.category || '').split(',').map(c => c.trim());
            return cats.includes(cat);
        });
        if (pool.length > 0) {
            const chosen = shuffle(pool)[0];
            if (!picked.has(chosen.id)) {
                picked.add(chosen.id);
                result.push(chosen);
            }
        }
    }

    // Second pass: fill up to 8 from any remaining
    const remaining = shuffle(allProducts.filter(p => !picked.has(p.id)));
    for (const p of remaining) {
        if (result.length >= 8) break;
        result.push(p);
    }

    return result.slice(0, 8);
}

/**
 * Animates newly rendered product cards with GSAP stagger.
 * @param {HTMLElement} container
 */
function animateCards(container) {
    // Disabled entrance fade/slide animations to ensure all product cards are fully visible immediately
}

/**
 * Mounts the PLUS33 specialty coffee store page systems.
 * @returns {Function} Cleanup / teardown function.
 */
export function mountStorePage() {
    const filterButtons = document.querySelectorAll('.store-cat-btn');
    const showcaseGrid  = document.getElementById('products-showcase-grid');
    const categorySectionsEl = document.getElementById('store-category-sections');
    let productsList = [];

    /**
     * Renders all products grouped by category for the 'All Rituals' view.
     * Prepends a random 4-product "Featured Products" section that changes every refresh.
     */
    const renderFeatured = () => {
        // Hide the flat "Featured Picks" grid section
        const gridSection = document.querySelector('.store-grid-section');
        if (gridSection) gridSection.style.display = 'none';

        if (!categorySectionsEl) return;

        // ── Featured Products: 4 random picks, different on every refresh ──
        const featuredPicks = shuffle([...productsList]).slice(0, 4);
        const featuredHtml = featuredPicks.length > 0 ? `
            <section class="store-category-section store-featured-section">
              <div class="container">
                <div class="cat-section-header reveal">
                  <div>
                    <div class="cat-section-label featured-label">✦ Featured Products</div>
                    <h2 class="cat-section-title">Curated for you today</h2>
                  </div>
                  <span class="cat-section-count featured-refresh-note">Refreshes every visit</span>
                </div>
                <div class="products-grid products-grid--4col">
                  ${featuredPicks.map(buildProductCard).join('')}
                </div>
              </div>
            </section>
        ` : '';

        // ── Category sections ──
        const categoryOrder = ['hot-coffee', 'iced-coffee', 'desserts', 'retail', 'merchandise', 'signature'];

        const grouped = {};
        categoryOrder.forEach(cat => { grouped[cat] = []; });

        productsList.forEach(p => {
            if (!p.category) return;
            const primaryCat = p.category.split(',')[0].trim();
            if (grouped[primaryCat] !== undefined) {
                grouped[primaryCat].push(p);
            }
        });

        const sectionsHtml = categoryOrder
            .filter(cat => grouped[cat].length > 0)
            .map(cat => {
                const meta = CATEGORY_META[cat] || { label: cat, desc: '' };
                const count = grouped[cat].length;
                const cardsHtml = grouped[cat].map(buildProductCard).join('');
                return `
                    <section class="store-category-section">
                      <div class="container">
                        <div class="cat-section-header reveal">
                          <div>
                            <div class="cat-section-label">${meta.label}</div>
                            <h2 class="cat-section-title">${meta.desc}</h2>
                          </div>
                          <span class="cat-section-count">${count} selection${count !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="products-grid">
                          ${cardsHtml}
                        </div>
                      </div>
                    </section>
                `;
            })
            .join('');

        categorySectionsEl.innerHTML = (featuredHtml + sectionsHtml) || `
            <div class="store-empty-state">
              <div class="store-empty-icon">☕</div>
              <p class="store-empty-title">Coming Soon</p>
              <p class="store-empty-desc">The collection is being curated. Check back soon.</p>
            </div>`;

        animateCards(categorySectionsEl);
    };

    /**
     * Renders all products in the selected category into a dedicated editorial section.
     * @param {string} categoryFilter  The data-category value ('all' or specific slug)
     */
    const renderCategory = (categoryFilter) => {
        if (!categorySectionsEl) return;

        if (categoryFilter === 'all') {
            categorySectionsEl.innerHTML = '';
            renderFeatured();
            return;
        }

        // Hide featured picks section when a specific category is active
        const gridSection = document.querySelector('.store-grid-section');
        if (gridSection) gridSection.style.display = 'none';

        const filtered = productsList.filter(p => {
            if (!p.category) return false;
            return p.category.split(',').map(c => c.trim()).includes(categoryFilter);
        });

        const meta = CATEGORY_META[categoryFilter] || { label: categoryFilter, desc: '' };

        const cardsHtml = filtered.length > 0
            ? filtered.map(buildProductCard).join('')
            : `<div class="store-empty-state">
                 <div class="store-empty-icon">☕</div>
                 <p class="store-empty-title">Coming Soon</p>
                 <p class="store-empty-desc">This collection is being curated. Check back soon.</p>
               </div>`;

        categorySectionsEl.innerHTML = `
            <section class="store-category-section">
              <div class="container">
                <div class="cat-section-header reveal">
                  <div>
                    <div class="cat-section-label">${meta.label}</div>
                    <h2 class="cat-section-title">${meta.desc}</h2>
                  </div>
                  ${filtered.length > 0 ? `<span class="cat-section-count">${filtered.length} selection${filtered.length !== 1 ? 's' : ''}</span>` : ''}
                </div>
                <div class="products-grid">
                  ${cardsHtml}
                </div>
              </div>
            </section>
        `;

        animateCards(categorySectionsEl);

        // Scroll to section
        requestAnimationFrame(() => {
            categorySectionsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    /**
     * Handles filter button clicks — updates active state and renders category.
     * @param {HTMLButtonElement} btn
     */
    const onFilterClick = (btn) => {
        filterButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderCategory(btn.getAttribute('data-category'));
    };

    const handleFilterClick = (e) => onFilterClick(e.currentTarget);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // ── Fetch products from API ──
    fetch('/api/store/products')
        .then(res => res.json())
        .then(data => {
            productsList = data;

            // URL query param deep-link: /store?category=hot-coffee
            const params = new URLSearchParams(window.location.search);
            const preselect = params.get('category');
            let targetBtn = null;

            if (preselect) {
                targetBtn = document.querySelector(`.store-cat-btn[data-category="${preselect}"]`);
            }

            if (!targetBtn) {
                targetBtn = document.querySelector('.store-cat-btn.active');
            }

            if (targetBtn) {
                onFilterClick(targetBtn);
            }
        })
        .catch(err => {
            console.error('[+33 Store] Failed to fetch specialty products catalog', err);
            if (showcaseGrid) {
                showcaseGrid.innerHTML = `<div class="store-empty-state">
                    <div class="store-empty-icon">☕</div>
                    <p class="store-empty-title">Unable to load catalog</p>
                    <p class="store-empty-desc">Please refresh the page or try again shortly.</p>
                </div>`;
            }
        });

    // ── Entrance Animations ──
    // Disabled entrance fade/slide animations to ensure all category buttons and hero elements are fully visible immediately

    // ── Cleanup ──
    return () => {
        filterButtons.forEach(btn => {
            btn.removeEventListener('click', handleFilterClick);
        });
        console.log('[+33 Store] Specialty Coffee Reserve Systems Unmounted');
    };
}
