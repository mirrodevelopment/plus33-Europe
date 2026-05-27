/**
 * FILE: fragment.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Interactive behaviors for layout shells and sticky components.
 *
 * RESPONSIBILITIES:
 * - Controls the mobile side drawer navigation panel expansion.
 * - Handles body scrolling lock/unlock scrollbar compensation.
 * - Implements smart scrolling header updates (reveals solid backgrounds, hides on scroll down).
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Initializes the layout's interactive navigation controllers, bindings, and scroll behaviors.
 * @returns {void}
 */
export function initNavbar() {
    // ═════════ DOM REFERENCES ═════════
    const nav = document.getElementById('plus33-nav');
    const toggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const close = document.getElementById('menu-close');

    if (!toggle || !sideMenu) return;

    // ═════════ EVENT LISTENERS ═════════

    // Close side panel drawer and release scroll lock
    const closeMenu = () => {
        sideMenu.classList.remove('plus33-nav__panel--open');
        toggle.classList.remove('plus33-nav__toggle--open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        toggle.setAttribute('aria-expanded', 'false');
        sideMenu.setAttribute('aria-hidden', 'true');
    };

    // Toggle side panel drawer and release/lock viewport scroll
    toggle.addEventListener('click', () => {
        const isOpen = sideMenu.classList.contains('plus33-nav__panel--open');
        if (isOpen) {
            closeMenu();
        } else {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarWidth + 'px';
            document.body.style.overflow = 'hidden';
            sideMenu.classList.add('plus33-nav__panel--open');
            toggle.classList.add('plus33-nav__toggle--open');
            toggle.setAttribute('aria-expanded', 'true');
            sideMenu.setAttribute('aria-hidden', 'false');
        }
    });

    if (close) close.addEventListener('click', closeMenu);

    // Close panel when any navigation link is clicked
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ─── Logo click → scroll to hero ──────────────────────────────────────────
    // Selects both desktop and mobile logo anchors
    const logoLinks = document.querySelectorAll(
        '.plus33-nav__logo--desktop, .plus33-nav__logo--mobile'
    );

    logoLinks.forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();

            const hero = document.getElementById('home-hero');

            if (hero) {
                // Already on home — just smooth-scroll to hero
                hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // On another SPA page — navigate home, then scroll once mounted
                window.plus33Router?.navigate('/');
                // Wait for the page fragment to mount, then scroll
                const waitForHero = setInterval(() => {
                    const h = document.getElementById('home-hero');
                    if (h) {
                        clearInterval(waitForHero);
                        setTimeout(() => h.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
                    }
                }, 50);
            }
        });
    });

    // Smart Scroll: Solid background toggles and sliding hide/show transitions
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add solid background after 80px
        if (currentScrollY > 80) {
            nav.classList.add('plus33-nav--solid');
        } else {
            nav.classList.remove('plus33-nav--solid');
        }

        // Smart hide/show (only after 200px to avoid jitter)
        if (currentScrollY > 200) {
            if (currentScrollY > lastScrollY) {
                nav.classList.add('plus33-nav--hidden');    // scrolling down → hide
            } else {
                nav.classList.remove('plus33-nav--hidden'); // scrolling up → show
            }
        } else {
            nav.classList.remove('plus33-nav--hidden');     // near top → always show
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}
