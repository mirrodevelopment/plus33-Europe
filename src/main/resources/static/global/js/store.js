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
    const productCards = document.querySelectorAll('.product-card');
    const counterText = document.getElementById('store-counter-text');
    const activeTimeouts = [];

    // ═════════ CATEGORY FILTER SYSTEM ═════════
    const onFilterClick = (btn, isInitial = false) => {
        // Switch active tab class
        filterButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterCategory = btn.getAttribute('data-category');
        let displayedCount = 0;
        const visibleCards = [];

        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            if (filterCategory === 'all' || productCategory === filterCategory) {
                card.style.display = 'flex';
                displayedCount++;
                visibleCards.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // Run stagger animation for shown items
        if (visibleCards.length > 0) {
            gsap.killTweensOf(visibleCards);
            gsap.fromTo(visibleCards, 
                { opacity: 0, y: 15 }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.5, 
                    stagger: isInitial ? 0.05 : 0.03, 
                    ease: 'power2.out' 
                }
            );
        }

        // Update counter label
        if (counterText) {
            counterText.textContent = `Showing ${displayedCount} Reserve Selection${displayedCount !== 1 ? 's' : ''}`;
        }
    };

    // Named handler to ensure proper unbinding during cleanup
    const handleFilterClick = (e) => {
        onFilterClick(e.currentTarget);
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // ═════════ ENTRANCE TIMELINES ═════════
    gsap.from('.store-hero__content .reveal', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Stagger animate the category navigation buttons on load
    gsap.from('.store-cat-btn', {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.1
    });

    // Trigger initial filter on mount (defaults to showing all items under "All Rituals")
    const activeBtn = document.querySelector('.store-cat-btn.active');
    if (activeBtn) {
        onFilterClick(activeBtn, true);
    }

    // ═════════ CLEANUP Lifecycle Hook ═════════
    return () => {
        // Clean up category filters event listeners
        filterButtons.forEach(btn => {
            btn.removeEventListener('click', handleFilterClick);
        });

        // Clear active timeouts to avoid memory leaks or updates to unmounted DOM elements
        activeTimeouts.forEach(clearTimeout);

        console.log('+33 Store | Specialty Coffee Reserve Systems Unmounted');
    };
}
