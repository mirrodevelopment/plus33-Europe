/**
 * FILE: store.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the specialty coffee reserve menu store page.
 *
 * RESPONSIBILITIES:
 * - Controls the category filters and hides/shows relevant products in real-time.
 * - Updates items counts in the category header bar.
 * - Coordinates entry stagger animations using GSAP.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the specialty coffee store locator page interactive systems.
 * @returns {Function} Clean up teardown function.
 */
export function mountStorePage() {
    const filterButtons = document.querySelectorAll('.store-cat-btn');
    const showcaseGrid = document.getElementById('products-showcase-grid');
    const counterText = document.getElementById('store-counter-text');
    let productsList = [];

    // Render products list based on category filter
    const renderProducts = (categoryFilter) => {
        if (!showcaseGrid) return;
        
        let filtered = productsList;
        if (categoryFilter !== 'all') {
            filtered = productsList.filter(p => p.category && p.category.split(',').map(c => c.trim()).includes(categoryFilter));
        }

        // Rebuild DOM
        showcaseGrid.innerHTML = filtered.map(product => {
            const tagsHtml = product.notes ? product.notes.split(',')
                .map(note => `<span class="notes-tag">${note.trim()}</span>`).join('') : '';
            
            const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
            
            return `
                <a href="/product/${product.id}" style="text-decoration: none; color: inherit; display: block;">
                  <article class="product-card reveal" data-category="${product.category}">
                    <div class="product-card__media">
                      <img src="${product.imagePath}" alt="${product.name}" class="product-img" loading="lazy" />
                      ${badgeHtml}
                      <div class="product-overlay-action">
                        <span class="view-details-text">Selected Reserve</span>
                      </div>
                    </div>
                    <div class="product-card__body">
                      <div class="product-meta">
                        <span class="product-origin">${product.origin}</span>
                        <span class="product-roast">Roast: ${product.roast}</span>
                      </div>
                      <h3 class="product-title text-cream">${product.name}</h3>
                      <p class="product-desc">${product.description}</p>
                      <div class="product-details-row">
                        <div class="product-notes-tags">
                          ${tagsHtml}
                        </div>
                      </div>
                      <div class="product-purchase">
                        <span class="product-price">€${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </article>
                </a>
            `;
        }).join('');

        // Apply GSAP staggers to the freshly rendered cards
        const productCards = showcaseGrid.querySelectorAll('.product-card');
        if (productCards.length > 0) {
            gsap.fromTo(productCards, 
                { opacity: 0, y: 15 }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.5, 
                    stagger: 0.03, 
                    ease: 'power2.out' 
                }
            );
        }

        if (counterText) {
            counterText.textContent = `Showing ${filtered.length} Reserve Selection${filtered.length !== 1 ? 's' : ''}`;
        }
    };

    const onFilterClick = (btn) => {
        filterButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterCategory = btn.getAttribute('data-category');
        renderProducts(filterCategory);
    };

    const handleFilterClick = (e) => {
        onFilterClick(e.currentTarget);
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // Fetch products dynamically from relational H2 database
    fetch('/api/store/products')
        .then(res => res.json())
        .then(data => {
            productsList = data;

            // ── URL Query Param Category Pre-select ──
            // Allows homepage showcase cards to deep-link: /store?category=hot-coffee
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
            console.error('Failed to fetch specialty products catalog', err);
        });

    // ═════════ ENTRANCE TIMELINES ═════════
    gsap.from('.store-hero__content .reveal', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.store-cat-btn', {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.1
    });

    // ═════════ CLEANUP Lifecycle Hook ═════════
    return () => {
        filterButtons.forEach(btn => {
            btn.removeEventListener('click', handleFilterClick);
        });
        console.log('+33 Store | Specialty Coffee Reserve Systems Unmounted');
    };
}
