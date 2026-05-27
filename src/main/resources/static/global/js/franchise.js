/**
 * FILE: franchise.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the franchise application page.
 *
 * RESPONSIBILITIES:
 * - Runs entrance animations for the hero section and process step cards.
 * - Handles the digital numbers ticker counters for global metrics.
 * - Captures submit events on the application form and displays simulated server responses.
 * - Runs accordion toggles for frequently asked questions.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the franchise page interactive systems.
 * @returns {void}
 */
export function mountFranchisePage() {
    gsap.registerPlugin(ScrollTrigger);

    // ═════════ ENTRANCE ANIMATIONS ═════════
    gsap.from('.franchise-hero__content h1', {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
    });

    gsap.from('.reveal', {
        scrollTrigger: {
            trigger: '.reveal',
            start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // ═════════ STATS TICKERS ═════════
    const stats = document.querySelectorAll('.franchise-stats__val[data-target]');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: '.franchise-stats',
                start: 'top 90%'
            }
        });
    });

    // ═════════ APPLICATION FORM ═════════
    const form = document.getElementById('franchise-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.textContent = 'SENDING...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'APPLICATION SENT';
                btn.style.background = 'var(--gold)';
                form.reset();
            }, 1500);
        });
    }

    // ═════════ FAQ ACCORDION ═════════
    const faqs = document.querySelectorAll('.faq-question');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const parent = faq.parentElement;
            
            // Close other accordion elements
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            const isActive = parent.classList.toggle('active');
            faq.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    });

    // ═════════ SMOOTH SCROLL FOR APPLY CTAS ═════════
    const applyButtons = document.querySelectorAll('a[href="#apply"]');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetEl = document.getElementById('apply');
            if (targetEl) {
                const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 80; // 80px offset for floating navbar
                const obj = { y: window.scrollY };
                gsap.to(obj, {
                    y: targetY,
                    duration: 1.5,
                    ease: 'power2.out',
                    onUpdate: () => window.scrollTo(0, obj.y)
                });
            }
        });
    });

    // ═════════ GLOBAL EXPANSION MAP ═════════
    let franchiseMapInstance = null;
    (function initFranchiseMap() {
        const mapNode = document.getElementById('franchise-map');
        if (!mapNode || !window.L) return;

        // Center map initially over Europe [Lat, Lng], Zoom level 4.0 to display the expansion footprint beautifully.
        franchiseMapInstance = L.map('franchise-map', {
            center: [48.2, 10.0],
            zoom: 4.0,
            zoomSnap: 0.1,
            minZoom: 1,
            scrollWheelZoom: false,
            fadeAnimation: true,
            zoomAnimation: true,
            worldCopyJump: true   // Enables seamless infinite world looping
        });

        // Light Matter basemap tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(franchiseMapInstance);

        const EXPANSION_MARKERS = [
            { name: "Paris", lat: 48.8584, lng: 2.3262, status: "Flagship Established" },
            { name: "London", lat: 51.5074, lng: -0.1278, status: "Atelier Established" },
            { name: "Rome", lat: 41.9028, lng: 12.4964, status: "Galleria Established" },
            { name: "Florence", lat: 43.7696, lng: 11.2558, status: "Palazzo Established" },
            { name: "Barcelona", lat: 41.3912, lng: 2.1648, status: "Terrace Established" },
            { name: "Amsterdam", lat: 52.3688, lng: 4.8856, status: "Galerie Established" },
            { name: "Vienna", lat: 48.2098, lng: 16.3654, status: "Salon Established" },
            { name: "Copenhagen", lat: 55.6798, lng: 12.5898, status: "Salon Established" },
            { name: "Berlin", lat: 52.5253, lng: 13.3924, status: "Pavilion Established" },
            { name: "Athens", lat: 37.9755, lng: 23.7290, status: "Sanctuary Established" },
            { name: "Prague", lat: 50.0870, lng: 14.4207, status: "Cabinet Established" }
        ];

        EXPANSION_MARKERS.forEach(loc => {
            const customIcon = L.divIcon({
                className: 'gold-custom-marker',
                html: `
                    <div class="marker-pin-dot"></div>
                    <div class="marker-pulse-ring"></div>
                `,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(franchiseMapInstance);
            
            const popupHtml = `
                <div class="popup-card" style="padding: 10px; min-width: 150px; background: transparent; text-align: center; border: none; box-shadow: none;">
                    <span class="popup-eyebrow" style="color: var(--copper); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;">${loc.status}</span>
                    <h4 class="popup-title" style="margin: 6px 0 0; color: var(--navy); font-family: var(--font-serif); font-weight: 400; font-size: 1.1rem;">${loc.name}</h4>
                </div>
            `;
            marker.bindPopup(popupHtml, {
                closeButton: false,
                offset: [0, -10]
            });
        });

        // Draw luxury lines radiating from Paris (Hub) to all other expansion cities
        const hubCoords = [48.8584, 2.3262];
        EXPANSION_MARKERS.forEach(loc => {
            if (loc.name !== "Paris") {
                L.polyline([hubCoords, [loc.lat, loc.lng]], {
                    color: '#B87333', // var(--copper)
                    weight: 1.5,
                    opacity: 0.45,
                    dashArray: '5, 8',
                    interactive: false
                }).addTo(franchiseMapInstance);
            }
        });
    })();

    // Reset franchise map view click handler
    const resetFranchiseBtn = document.getElementById('franchise-map-reset-btn');
    if (resetFranchiseBtn) {
        resetFranchiseBtn.addEventListener('click', () => {
            if (franchiseMapInstance) {
                franchiseMapInstance.flyTo([48.2, 10.0], 4.0, {
                    animate: true,
                    duration: 2.5
                });
            }
        });
    }

    // ═════════ CLEANUP Lifecycle Hook ═════════
    return () => {
        if (franchiseMapInstance) {
            franchiseMapInstance.remove();
            franchiseMapInstance = null;
            console.log('+33 Franchise | Expansion Map Destroyed');
        }
    };
}
