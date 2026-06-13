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

    // Create GSAP context for reliable lifecycle management and cleanup
    const ctx = gsap.context(() => {
        // ═════════ ENTRANCE ANIMATIONS ═════════
        // Immediately trigger entrance animations for the hero section to prevent conflicts with ScrollTrigger
        const heroTl = gsap.timeline();
        heroTl.fromTo('.franchise-hero__content h1', 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }
        )
        .fromTo('.franchise-hero__content p',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
            '-=1.2'
        )
        .fromTo('.franchise-hero__actions',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
            '-=1.0'
        )
        .fromTo('.franchise-stats',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
            '-=0.8'
        );

        // Trigger each reveal element individually as it enters the viewport (excluding the hero elements to prevent conflicts)
        gsap.utils.toArray('.reveal:not(.franchise-hero *)').forEach(el => {
            const targetOpacity = el.classList.contains('apply-brand-seal-signature') ? 0.45 : 1;
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 0,
                    opacity: targetOpacity,
                    duration: 1,
                    ease: 'power2.out'
                }
            );
        });

        // ═════════ LUXURY BUSINESS MODEL ANIMATIONS ═════════
        gsap.from('.luxury-quote-block', {
            scrollTrigger: {
                trigger: '.luxury-quote-block',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 1.2,
            ease: 'power2.out'
        });

        gsap.from('.luxury-pillar', {
            scrollTrigger: {
                trigger: '.luxury-pillars-container',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 25,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        });

        gsap.from('.investment-ledger-card', {
            scrollTrigger: {
                trigger: '.investment-ledger-card',
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    // Animate growth indicator bars
                    const bars = document.querySelectorAll('.indicator-bar[data-width]');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        gsap.to(bar, {
                            width: targetWidth,
                            duration: 2.2,
                            ease: 'power4.out',
                            delay: 0.3
                        });
                    });
                }
            },
            scale: 0.96,
            y: 40,
            opacity: 0,
            duration: 1.4,
            ease: 'power3.out'
        });

        // ═════════ PROSPECTUS ANIMATIONS ═════════
        gsap.from('.inside-item', {
            scrollTrigger: {
                trigger: '.prospectus-inside',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            x: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        });

        gsap.from('.metadata-badge', {
            scrollTrigger: {
                trigger: '.prospectus-metadata',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });

        // ═════════ DESKTOP JOURNEY STEPS ANIMATIONS ═════════
        gsap.from('.journey-desktop-card', {
            scrollTrigger: {
                trigger: '.journey-desktop-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
        });

        // ═════════ FAQ & QUALIFICATIONS ANIMATIONS ═════════
        gsap.from('.qualification-card', {
            scrollTrigger: {
                trigger: '.qualification-cards-list',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            onComplete: () => {
                document.querySelectorAll('.qualification-card').forEach(el => el.classList.add('ready'));
            }
        });

        gsap.from('.luxury-faq-item', {
            scrollTrigger: {
                trigger: '.luxury-faq-accordion',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            onComplete: () => {
                document.querySelectorAll('.luxury-faq-item').forEach(el => el.classList.add('ready'));
            }
        });

        gsap.from('.luxury-cta-card', {
            scrollTrigger: {
                trigger: '.luxury-cta-card',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            scale: 0.98,
            y: 20,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            onComplete: () => {
                const el = document.querySelector('.luxury-cta-card');
                if (el) el.classList.add('ready');
            }
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
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
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
    });

    // Refresh ScrollTrigger coordinates for the dynamic layout changes
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);

    // ═════════ APPLICATION FORM ═════════
    const form = document.getElementById('franchise-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const btnSpan = btn.querySelector('span');
            if (btnSpan) btnSpan.textContent = 'SENDING...';
            else btn.textContent = 'SENDING...';
            btn.disabled = true;

            const payload = {
                name: document.getElementById('f-name').value,
                email: document.getElementById('f-email').value,
                phone: document.getElementById('f-phone').value,
                city: document.getElementById('f-city').value,
                capital: document.getElementById('f-capital').value,
                background: document.getElementById('f-msg').value
            };

            fetch('/api/franchise/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (btnSpan) btnSpan.textContent = 'CONSULTATION REQUESTED';
                    else btn.textContent = 'CONSULTATION REQUESTED';
                    btn.style.background = 'linear-gradient(to right, #C8A46B, #aa771c)';
                    form.reset();
                } else {
                    if (btnSpan) btnSpan.textContent = 'ERROR';
                    else btn.textContent = 'ERROR';
                    btn.style.background = '#d9534f';
                    btn.disabled = false;
                }
            })
            .catch(() => {
                if (btnSpan) btnSpan.textContent = 'ERROR';
                else btn.textContent = 'ERROR';
                btn.style.background = '#d9534f';
                btn.disabled = false;
            });
        });
    }

    // ═════════ FAQ ACCORDION ═════════
    const faqHeaders = document.querySelectorAll('.faq-card-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.parentElement; // .luxury-faq-item
            
            // Close other accordion elements
            document.querySelectorAll('.luxury-faq-item').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                    item.querySelector('.faq-card-header').setAttribute('aria-expanded', 'false');
                }
            });

            const isActive = parent.classList.toggle('active');
            header.setAttribute('aria-expanded', isActive ? 'true' : 'false');
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
    let markersMap = {};
    let handleMapResize = null;

    const EXPANSION_MARKERS = [
        { name: "Paris", lat: 48.8584, lng: 2.3262, status: "Flagship Established" },
        { name: "London", lat: 51.5074, lng: -0.1278, status: "Atelier Established" },
        { name: "New York City", lat: 40.7128, lng: -74.0060, status: "Downtown Lounge" },
        { name: "Tokyo", lat: 35.6762, lng: 139.6503, status: "Midnight Atelier" },
        { name: "Dubai", lat: 25.2048, lng: 55.2708, status: "Skyline Reserve" },
        { name: "Singapore", lat: 1.3521, lng: 103.8198, status: "Tropical Sanctuary" },
        { name: "Sydney", lat: -33.8688, lng: 151.2093, status: "Harbour Pavilion" },
        { name: "São Paulo", lat: -23.5505, lng: -46.6333, status: "Modernist Salon" },
        { name: "Milan", lat: 45.4665, lng: 9.1843, status: "Espresso Bar" },
        { name: "Istanbul", lat: 41.0082, lng: 28.9784, status: "Bosphorus Lounge" }
    ];

    function highlightFranchiseMarker(cityName) {
        Object.keys(markersMap).forEach(name => {
            const m = markersMap[name];
            const element = m.getElement();
            if (element) {
                if (name === cityName) {
                    element.classList.add('gold-custom-marker--active');
                } else {
                    element.classList.remove('gold-custom-marker--active');
                }
            }
        });

        // Toggle active button style
        document.querySelectorAll('.map-city-btn').forEach(btn => {
            const btnCity = btn.getAttribute('data-city');
            if (btnCity === cityName) {
                btn.classList.add('map-city-btn--active');
            } else {
                btn.classList.remove('map-city-btn--active');
            }
        });
    }

    (function initFranchiseMap() {
        const mapNode = document.getElementById('franchise-map');
        if (!mapNode || !window.L) return;

        // Center map initially over the world to display the global expansion footprint beautifully.
        franchiseMapInstance = L.map('franchise-map', {
            center: [25.0, 10.0],
            zoom: 2.0,
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

        EXPANSION_MARKERS.forEach(loc => {
            const customIcon = L.divIcon({
                className: 'gold-custom-marker',
                html: `
                    <div class="marker-pin-wrapper">
                        <img src="/global/find-us/assets/map-pin.png" class="marker-pin-img" alt="${loc.name}" />
                        <div class="marker-pulse-ring"></div>
                        <span class="marker-city-label">${loc.name}</span>
                    </div>
                `,
                iconSize: [36, 58],
                iconAnchor: [18, 42]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(franchiseMapInstance);
            markersMap[loc.name] = marker;

            // Highlight on direct marker click
            marker.on('click', () => {
                highlightFranchiseMarker(loc.name);
            });
            
            const popupHtml = `
                <div class="popup-card">
                    <span class="popup-eyebrow">${loc.status}</span>
                    <h4 class="popup-title">${loc.name}</h4>
                </div>
            `;
            marker.bindPopup(popupHtml, {
                closeButton: false,
                offset: [0, -36]
            });
        });

        // Draw luxury lines radiating from Paris (Hub) to all other expansion cities
        const hubCoords = [48.8584, 2.3262];
        EXPANSION_MARKERS.forEach(loc => {
            if (loc.name !== "Paris") {
                L.polyline([hubCoords, [loc.lat, loc.lng]], {
                    color: '#C8A46B', // var(--f-gold)
                    weight: 1.5,
                    opacity: 0.45,
                    dashArray: '5, 8',
                    interactive: false
                }).addTo(franchiseMapInstance);
            }
        });

        // Force size recalculation to ensure the map renders correctly in mobile/responsive layouts
        setTimeout(() => {
            if (franchiseMapInstance) {
                franchiseMapInstance.invalidateSize();
            }
        }, 500);

        handleMapResize = () => {
            if (franchiseMapInstance) {
                franchiseMapInstance.invalidateSize();
            }
        };
        window.addEventListener('resize', handleMapResize);
    })();

    // City Quick Links Map Control
    const cityButtons = document.querySelectorAll('.map-city-btn');
    cityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cityName = btn.getAttribute('data-city');
            const targetLoc = EXPANSION_MARKERS.find(loc => loc.name === cityName);
            if (targetLoc && franchiseMapInstance) {
                franchiseMapInstance.flyTo([targetLoc.lat, targetLoc.lng], 8.0, {
                    animate: true,
                    duration: 2.0
                });

                highlightFranchiseMarker(cityName);
                const marker = markersMap[cityName];
                if (marker) {
                    setTimeout(() => {
                        marker.openPopup();
                    }, 1800);
                }
            }
        });
    });

    // Reset franchise map view click handler
    const resetFranchiseBtn = document.getElementById('franchise-map-reset-btn');
    if (resetFranchiseBtn) {
        resetFranchiseBtn.addEventListener('click', () => {
            if (franchiseMapInstance) {
                franchiseMapInstance.flyTo([25.0, 10.0], 2.0, {
                    animate: true,
                    duration: 2.5
                });
                
                // Clear active highlights and popups
                Object.keys(markersMap).forEach(name => {
                    const m = markersMap[name];
                    m.closePopup();
                    const element = m.getElement();
                    if (element) {
                        element.classList.remove('gold-custom-marker--active');
                    }
                });

                // Clear active selector button highlights
                document.querySelectorAll('.map-city-btn').forEach(btn => {
                    btn.classList.remove('map-city-btn--active');
                });
            }
        });
    }

    // ═════════ CLEANUP Lifecycle Hook ═════════
    return () => {
        ctx.revert(); // Reverts all GSAP animations and kills ScrollTriggers in context
        if (handleMapResize) {
            window.removeEventListener('resize', handleMapResize);
        }
        if (franchiseMapInstance) {
            franchiseMapInstance.remove();
            franchiseMapInstance = null;
            markersMap = {};
            console.log('+33 Franchise | Expansion Map Destroyed');
        }
    };
}
