/**
 * FILE: journal.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the PLUS33 luxury editorial journal page.
 *
 * RESPONSIBILITIES:
 * - Fetches article data from the API and renders editorial cards.
 * - Injects featured article into the editorial hero.
 * - Controls category filtering with smooth transitions.
 * - Manages entrance animations using GSAP ScrollTrigger.
 * - Handles newsletter form (cosmetic).
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

// ═════════ MULTI-PARAGRAPH EDITORIAL ESSAYS ═════════
const STORY_CONTENT = {
    "The Soil of Ethiopia": {
        subtitle: "A dispatch from the birthplace of coffee",
        paragraphs: [
            "Tasting coffee from Sidamo is an exercise in tracing time. In these high-elevation forest canopies, coffee cherries mature slowly under the shade of indigenous cordia and acacia trees. The microclimate, rich with volcanic sediment and cooled by mountain winds, fosters a slow, deep absorption of organic nutrients.",
            "We walked the dry beds of these remote farms, running the red earth through our fingers. The soil here feels ancient, teeming with natural bio-diversity that no industrial plantation can replicate. For the farmers, coffee is not an industrial crop; it is a wild inheritance.",
            "In the cup, this terroir expresses itself as a complex jasmine perfume, accompanied by vibrant notes of bergamot, apricot, and a tea-like clarity. It is a flavor profile that demands patience from both the grower and the brewer.",
            "At PLUS33, we source this single-origin lot with a deep reverence for these traditions. Our roasting profile is designed to highlight these delicate florals, keeping the roast light and transparent."
        ],
        pullquote: "“In the highlands of Sidamo, coffee grows the way it has for centuries — wild, shaded, unhurried.”",
        pullquoteAuthor: "Mirro Journal Sourcing Team"
    },
    "Altitude and Terroir: Colombia's Hidden Valleys": {
        subtitle: "High-altitude coffee and the farmers who grow it",
        paragraphs: [
            "High in the Colombian Andes, the valleys are steep, misty, and intensely fertile. Here, the extreme diurnal temperature swings — warm, sunny days followed by chilly, crisp nights — force the coffee cherries to concentrate sugars in a slow struggle for survival.",
            "This volcanic soil is rich in minerals, retaining moisture from the Andean clouds that roll in each afternoon. The result is a bean of remarkable density and structural integrity, carrying a concentrated sweetness that is rare in lower altitudes.",
            "We source from smallholder families in Huila who hand-pick only the most vibrant cherries. Each bean is washed in spring water and dried on raised beds, allowing the natural caramel and stone fruit sweetness to shine.",
            "Our roast profiles for these Colombian micro-lots are meticulously adjusted to celebrate this balance, yielding a cup with a rich milk chocolate body, crisp red apple acidity, and a smooth sugarcane finish."
        ],
        pullquote: "“At 1,900 metres above sea level, Colombian farmers cultivate beans that carry the taste of volcanic soil, mountain rain, and patience.”",
        pullquoteAuthor: "Juan Carlos, Finca El Mirador"
    },
    "Rwanda at Dawn": {
        subtitle: "The quiet revolution of Rwandan specialty coffee",
        paragraphs: [
            "Dawn over Lake Kivu is quiet and cold. The mist hangs thick over the water, slowly rising to reveal the steep, terraced hillsides where Rwandan Bourbon coffee trees thrive. This unique lakeside microclimate keeps temperatures moderate year-round.",
            "Rwanda's specialty coffee revolution is defined by precision. At the washing stations, sorting is a communal art. Cherries are hand-sorted under morning light, floated in fresh water to select only the densest beans, and laid out on raised drying tables.",
            "This level of sorting creates an exceptionally clean cup. The flavor is bright and complex, shifting from black tea and sweet orange blossom to a rich, honeyed mouthfeel that lingers long after the last sip.",
            "By partnering directly with these cooperatives, we ensure that their dedication to quality is rewarded with fair, sustainable premiums. It is a partnership built on a shared pursuit of perfection."
        ],
        pullquote: "“The first light over Lake Kivu reveals terraced hillsides of coffee cherries turning from green to deep crimson.”",
        pullquoteAuthor: "Aline Marie, Washing Station Manager"
    },
    "Roast Profiles: A Visual Atlas": {
        subtitle: "How we listen to the bean before the roast",
        paragraphs: [
            "Roasting is a dialogue between heat and time, where a single second can redefine the character of a crop. We do not roast to hide the bean's origin; we roast to reveal it. Our visual atlas outlines the exact milestones of our roast philosophy.",
            "The journey begins with green coffee, loaded into the drum of our customized Loring roaster. As heat transfers, the beans yellow, releasing moisture and filling the air with the aroma of toasted grain. Then comes the critical phase: development.",
            "At first crack, the bean's cell structure breaks down, releasing aromatic oils. For our filter roasts, we finish the roast shortly after this point, preserving the delicate organic acids and floral aromatics inherent to the terroir.",
            "For our espresso selections, we extend the development time slightly to caramelize natural sugars, creating a heavier body and a smoother finish. Each profile is a signature, tracked to the tenth of a degree."
        ],
        pullquote: "“Light, medium, dark — these are not choices. They are consequences of listening to the bean.”",
        pullquoteAuthor: "Sivasurya, Head Roaster"
    },
    "Science of Extraction": {
        subtitle: "Precision brewing and the mathematics of flavour",
        paragraphs: [
            "To brew coffee is to govern a complex chemical extraction. Water, the universal solvent, washes through the ground coffee, dissolving acids, lipids, sugars, and bitter plant fibers in a strict chronological sequence.",
            "The science of extraction is a pursuit of the balance point. Under-extracted coffee (below 18% extraction yield) is sour and thin, as only the highly soluble organic acids have dissolved. Over-extracted coffee (above 22%) is harsh and bitter.",
            "We monitor our extractions using digital refractometers, measuring total dissolved solids (TDS) to ensure our recipes are precise. But the ultimate test remains the palate of our baristas.",
            "By controlling grind distribution, water temperature, flow rate, and pressure, we create a stable, repeatable extraction that honors the work of the farmers and the roaster."
        ],
        pullquote: "“Between 18% and 22% lies the extraction sweet spot — the narrow window where flavour compounds dissolve perfectly.”",
        pullquoteAuthor: "Atelier Lab Notes"
    },
    "Morning in the 7ème": {
        subtitle: "A Parisian morning through coffee",
        paragraphs: [
            "Paris in the early morning belongs to the bakers and the baristas. Before the traffic begins, our atelier in the 7ème Arrondissement opens its doors. The air is cold, the stone streets are quiet, and the scent of freshly ground espresso begins to drift.",
            "Our morning ritual is a choreography of small gestures: setting the grind, purging the steam wands, and aligning the ceramic cups. The first customer is often a neighbor reading the daily paper, seeking a quiet transition into the day.",
            "Here, coffee is a pause. It is not something gulped from a paper cup on the run. It is an experience enjoyed at the bar or at a small marble table, watching the city wake up under a pale grey sky.",
            "+33 is designed as a sanctuary for these moments. The warm ambient light, the soft acoustic environment, and the smell of fresh pastry combine to create a gentle, cinematic morning ritual."
        ],
        pullquote: "“The seventh arrondissement wakes slowly. The first espresso is pulled before the Eiffel Tower catches sunlight.”",
        pullquoteAuthor: "Atelier Paris 7ème"
    },
    "A Table in Milan": {
        subtitle: "What Italian coffee culture taught us about brevity",
        paragraphs: [
            "In Milan, coffee is a performance. Stand at the bar of any historic pasticceria, and you will witness a display of speed and focus. The barista pulls shots in a rhythmic sequence, and the customer drinks the espresso in three quick sips.",
            "This Italian ritual taught us that coffee is a structural element of the day. It is a brief, intense encounter with flavor. The espresso must be bold, heavy-bodied, and topped with a thick, hazelnut-colored crema.",
            "We designed our espresso blend to capture this Italian intensity while incorporating the clarity of modern specialty coffee. It balances chocolate sweetness with a crisp fruit finish.",
            "Milan reminded us that a café is a public square. It is a place of quick greetings, intense conversations, and a shared appreciation for the beauty of a well-crafted shot of espresso."
        ],
        pullquote: "“Milan taught us that coffee is architecture — brief, precise, and never casual.”",
        pullquoteAuthor: "Milan Field Notes"
    },
    "The Slow Hours": {
        subtitle: "Why the afternoon is our favourite service",
        paragraphs: [
            "There is a quiet window in the afternoon when the energy of the café shifts. The lunch rush has departed, and the dinner crowd is hours away. The sun filters through the windows at a lower angle, casting long shadows across the stone floors.",
            "These are the slow hours, the time we designed PLUS33 for. It is the time for solo reading, deep conversation, or simply staring out at the street while holding a warm cup of filter coffee.",
            "The acoustics soften, and the music shifts to a slower, more introspective tempo. Our baristas have time to talk about origin stories or brew a rare micro-lot with extra care.",
            "We believe that a luxury café should offer both energy and stillness. The slow hours are an invitation to pause, to claim a corner of the atelier, and to let the afternoon unfold without a schedule."
        ],
        pullquote: "“Between 2pm and 4pm, the café breathes differently. The lunch rush dissolves. Conversations become quieter.”",
        pullquoteAuthor: "The Slow Hours Philosophy"
    },
    "The Architecture of Taste": {
        subtitle: "Composing spaces where coffee becomes experience",
        paragraphs: [
            "A space shapes the behavior of the people within it. When we design a new atelier, we do not start with decoration; we start with the flow of the coffee ritual. The counter is our stage, and the seating is a series of quiet viewing pockets.",
            "We choose our materials for their tactile honesty. Raw volcanic stone, hand-brushed brass, oiled oak, and textured plaster. These materials catch the light and age beautifully, developing a patina that tells the story of the space.",
            "The placement of the espresso machine, the height of the bar, the acoustics of the ceiling — everything is composed to reduce visual noise and encourage presence. It is a design language of restraint.",
            "In a world of constant stimulation, our interiors offer a visual rest. By stripping away the unnecessary, we create a frame where the coffee, the conversation, and the light can be fully experienced."
        ],
        pullquote: "“Every +33 atelier begins as a conversation between space and ritual. We don't decorate — we compose.”",
        pullquoteAuthor: "Lead Architect, Mirro Design"
    },
    "Designing Silence: Our Dubai Atelier": {
        subtitle: "Creating calm in the heart of Downtown Dubai",
        paragraphs: [
            "Downtown Dubai is a landscape of steel, glass, and constant movement. In the middle of this high-tempo environment, we wanted to build a sanctuary of absolute silence and calm. A space that felt like an oasis.",
            "Our Dubai atelier is constructed from massive blocks of local desert travertine, offset by raw silk wall panels and minimal bronze details. The layout is open and unhurried, with comfortable seating alcoves recessed into the stone walls.",
            "The heart of the space is a custom-built Modbar system, keeping the counter low and open, allowing for a transparent interaction between the barista and the guest. No high machines block the view.",
            "It is a quiet statement of luxury. By prioritizing space and light over decorative detail, we offer a place where the mind can settle, and the focus can return to the sensory experience of the cup."
        ],
        pullquote: "“In a city that never stops, we created a space that asks you to pause.”",
        pullquoteAuthor: "Dubai Atelier Team"
    },
    "The Object: Our Ceramic Cup": {
        subtitle: "14 months to create the perfect vessel",
        paragraphs: [
            "The tactile connection between the drinker and the cup is the final bridge of our work. For 14 months, we worked with a small, family-owned ceramic studio in northern Portugal to design the ultimate vessel for our coffees.",
            "Every detail of the cup was tested and adjusted. The thickness of the rim, the curvature of the bowl (designed to retain the espresso's crema), the insulating properties of the clay, and the texture of the raw glaze.",
            "The cup weighs exactly 340 grams. This weight is intentional. It creates a physical presence in your hand, reminding you that the coffee you are drinking is a physical craft, not a passing commodity.",
            "The exterior is left raw and textured, retaining the grain of the natural clay, while the interior is finished with a smooth, cream-colored glaze that highlights the color of the brew. It is a functional sculpture."
        ],
        pullquote: "“Heavy. Warm. Intentional. Our signature ceramic cup was developed over 14 months with a Portuguese ceramicist.”",
        pullquoteAuthor: "Atelier Ceramicist"
    },
    "The First Pour": {
        subtitle: "Understanding the bloom and what it reveals",
        paragraphs: [
            "The pour-over coffee ritual begins with a moment of stillness. The barista grinds the single-origin beans, rinses the paper filter with hot water, and pours the grounds into the cone. Then, they pour the first 50 grams of water.",
            "This is the bloom. As the hot water hits the freshly ground coffee, it releases trapped carbon dioxide gas. The grounds swell, rise, and release a rich, aromatic foam. It is the coffee awakening.",
            "The bloom is a visual check of freshness. A bean that does not bloom is a bean that has lost its vitality. Watching this volcanic rise is a reminder of the organic nature of the product.",
            "For 30 seconds, we wait. This pause allows the coffee's cellular structure to open up, ensuring that the subsequent pours can dissolve the flavor compounds evenly. It is the foundation of the cup."
        ],
        pullquote: "“The first pour is never about extraction. It's about awakening. The bloom tells you everything.”",
        pullquoteAuthor: "Barista Training Lead"
    },
    "Why We Never Rush": {
        subtitle: "The philosophy of patience in every cup",
        paragraphs: [
            "In a culture obsessed with speed and optimization, patience is a radical choice. At PLUS33, we do not measure our efficiency by how many cups we serve per hour. We measure it by the quality of the cups we serve.",
            "A hand-poured filter coffee cannot be rushed. It requires a slow, controlled flow of water, poured in concentric circles to ensure an even extraction. It takes four minutes of focused attention.",
            "We will never install automatic brewing machines or loud timers. Our baristas brew by feel, watching the level of the water and checking the color of the stream. They know the rhythm of the bean.",
            "This commitment to slowness is not just about flavor; it is about creating a space where the guests feel that their time is valued. Slow coffee is a luxury we choose to share."
        ],
        pullquote: "“A hand brew at +33 takes exactly the time it needs. We will never install a timer that beeps.”",
        pullquoteAuthor: "Atelier Manifesto"
    },
    "Sunday Espresso": {
        subtitle: "How Sundays change the way we brew",
        paragraphs: [
            "Sundays have a different tempo. The light is softer, the streets are quieter, and the guests sit longer. To match this mood, we make small adjustments to our brewing parameters at the bar.",
            "We adjust the grinders to deliver a slightly coarser grind, yielding a shot with a lighter body and a brighter, fruitier acidity. It is an espresso designed for relaxed drinking, not a quick morning start.",
            "The milk is steamed to a slightly lower temperature to highlight its natural sweetness, making it the perfect match for a lazy afternoon cappuccino. Even our playlist shifts to acoustic jazz.",
            "These small details are our way of marking the rhythm of the week. Sunday at PLUS33 is a weekly ceremony, an appreciation of the slower, gentler side of the coffee ritual."
        ],
        pullquote: "“Sunday is different. Our Sunday espresso is a weekly ceremony of small adjustments.”",
        pullquoteAuthor: "Sunday Atelier Staff"
    }
};

export function mountJournalPage() {
    gsap.registerPlugin(ScrollTrigger);
    let _craftTimeline = null;

    // ═════════ SCROLL PROGRESS BAR ═════════
    const progressBar = document.querySelector('.journal-scroll-progress');
    const _onScrollProgress = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    };
    window.addEventListener('scroll', _onScrollProgress);

    const grid = document.getElementById('journal-grid');
    const featuredRoot = document.getElementById('journal-featured-root');
    const emptyState = document.getElementById('journal-empty');
    if (!grid) return;

    let allStories = [];
    let activeCategory = 'all';

    // ═════════ EDITORIAL MAGAZINE READER (ATELIER READER) ═════════
    function _openReader(story) {
        const reader = document.getElementById('journal-reader');
        if (!reader) return;

        const catEl = document.getElementById('reader-category');
        const dateEl = document.getElementById('reader-date');
        const timeEl = document.getElementById('reader-read-time');
        const titleEl = document.getElementById('reader-title');
        const subtitleEl = document.getElementById('reader-subtitle');
        const imgEl = document.getElementById('reader-img');
        const bodyEl = document.getElementById('reader-body');

        // Set static data
        catEl.textContent = story.category;
        dateEl.textContent = story.dateString;
        timeEl.textContent = story.readTime || '';
        titleEl.textContent = story.title;
        imgEl.src = story.imagePath;
        imgEl.alt = story.title;

        // Retrieve custom essay content
        const essay = STORY_CONTENT[story.title] || {
            subtitle: story.subtitle || "A special dispatch from PLUS33.",
            paragraphs: [story.excerpt || "At PLUS33, coffee is more than just a drink; it is a meticulous craft, an expression of terroir, and a dedicated ritual that connects us from Paris to the world's finest growers."],
            pullquote: null,
            pullquoteAuthor: null
        };

        subtitleEl.textContent = essay.subtitle;

        // Build HTML for body paragraphs and pullquotes
        let bodyHtml = '';
        essay.paragraphs.forEach((p, idx) => {
            bodyHtml += `<p>${p}</p>`;
            // Inject pullquote in the middle
            if (idx === 1 && essay.pullquote) {
                bodyHtml += `
                    <blockquote class="journal-reader__pullquote">
                        ${essay.pullquote}
                        ${essay.pullquoteAuthor ? `<span class="journal-reader__pullquote-author">— ${essay.pullquoteAuthor}</span>` : ''}
                    </blockquote>
                `;
            }
        });
        bodyEl.innerHTML = bodyHtml;

        // Open animation
        reader.style.display = 'flex';
        // Force reflow
        reader.offsetHeight;
        reader.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Staggered GSAP reveal of contents for magical feel
        if (window.gsap) {
            gsap.fromTo('.journal-reader__header > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
            );
            gsap.fromTo('.journal-reader__visual',
                { opacity: 0, scale: 0.97, y: 40 },
                { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.25 }
            );
            gsap.fromTo('.journal-reader__body p, .journal-reader__pullquote',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.35 }
            );
        }
    }

    function _closeReader() {
        const reader = document.getElementById('journal-reader');
        if (!reader) return;

        reader.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            if (!reader.classList.contains('active')) {
                reader.style.display = 'none';
            }
        }, 600); // Wait for transition
    }

    const closeBtn = document.getElementById('journal-reader-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', _closeReader);
    }
    const backdrop = document.querySelector('.journal-reader__backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', _closeReader);
    }

    // ═════════ FETCH & RENDER ═════════
    fetch('/api/journal/stories')
        .then(res => res.json())
        .then(stories => {
            allStories = stories;

            // Inject featured article into hero
            _renderFeatured(stories);

            // Render all non-featured articles into the grid
            _renderGrid(stories);

            // Wire up category filters
            _initFilters();

            // Entrance animations
            _animateGrid();

            // Refresh ScrollTrigger to recalculate viewport coordinates
            setTimeout(() => {
                if (window.ScrollTrigger) {
                    ScrollTrigger.refresh();
                }
            }, 150);
        })
        .catch(err => {
            console.error('Failed to load Coffee Journal feeds', err);
        });


    // ═════════ FEATURED ARTICLE ═════════
    function _renderFeatured(stories) {
        if (!featuredRoot) return;
        const featured = stories.find(s => s.featured);
        if (!featured) return;

        featuredRoot.innerHTML = `
            <div class="journal-featured-card">
                <img src="${featured.imagePath}" alt="${featured.title}" class="journal-featured-card__img" />
                <div class="journal-featured-card__overlay"></div>
                <span class="journal-featured-card__badge">Featured</span>
                <div class="journal-featured-card__content">
                    <span class="journal-featured-card__category">${featured.category}</span>
                    <h2 class="journal-featured-card__title">${featured.title}</h2>
                    ${featured.excerpt ? `<p class="journal-featured-card__excerpt">${featured.excerpt}</p>` : ''}
                    <div class="journal-featured-card__meta">
                        <span>${featured.dateString}</span>
                        <span class="journal-featured-card__meta-dot"></span>
                        <span>${featured.readTime || ''}</span>
                    </div>
                </div>
            </div>
        `;

        // Bind click event
        const card = featuredRoot.querySelector('.journal-featured-card');
        if (card) {
            card.addEventListener('click', () => {
                _openReader(featured);
            });

            gsap.fromTo(card,
                { opacity: 0, y: 40, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.4 }
            );
        }
    }


    // ═════════ ARTICLE GRID ═════════
    function _renderGrid(stories) {
        grid.innerHTML = '';

        // Filter out featured articles for the grid display
        const gridStories = stories.filter(s => !s.featured);

        if (gridStories.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        gridStories.forEach((post, idx) => {
            const article = document.createElement('article');
            
            // Asymmetric editorial grid rhythm (Hero -> Wide -> Tall -> Portrait -> Square)
            let layoutClass = '';
            if (idx === 0) {
                layoutClass = 'journal-article--hero';
            } else if (idx % 4 === 1) {
                layoutClass = 'journal-article--wide';
            } else if (idx % 4 === 2) {
                layoutClass = 'journal-article--tall';
            } else if (idx % 4 === 3) {
                layoutClass = 'journal-article--portrait';
            } else {
                layoutClass = 'journal-article--square';
            }

            article.className = `journal-article ${layoutClass}`;
            article.setAttribute('data-category', post.category);
            article.setAttribute('aria-label', `Journal article: ${post.title}`);

            article.innerHTML = `
                <div class="journal-article__img">
                    <img src="${post.imagePath}" alt="${post.title}" loading="${idx < 4 ? 'eager' : 'lazy'}" />
                </div>
                <div class="journal-article__content">
                    <span class="journal-article__category-pill">${post.category}</span>
                    <h3>${post.title}</h3>
                    ${post.subtitle ? `<span class="journal-article__subtitle">${post.subtitle}</span>` : ''}
                    ${post.excerpt ? `<p class="journal-article__excerpt">${post.excerpt}</p>` : ''}
                    <div class="journal-article__footer">
                        <span class="journal-article__date">${post.dateString}</span>
                        <span class="journal-article__read-time">${post.readTime || ''}</span>
                    </div>
                    <div class="journal-article__read">
                        <span>Read Story</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
            `;

            // Bind click event
            article.addEventListener('click', () => {
                _openReader(post);
            });

            grid.appendChild(article);
        });
    }



    // ═════════ CATEGORY FILTERS ═════════
    function _initFilters() {
        const filterBtns = document.querySelectorAll('.journal-filter-pill');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                activeCategory = btn.getAttribute('data-category');
                _applyFilter();
            });
        });
    }

    function _applyFilter() {
        const articles = grid.querySelectorAll('.journal-article');
        let visibleCount = 0;

        articles.forEach(article => {
            const cat = article.getAttribute('data-category');
            if (activeCategory === 'all' || cat === activeCategory) {
                article.classList.remove('hidden');
                visibleCount++;
            } else {
                article.classList.add('hidden');
            }
        });

        // Show/hide empty state
        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Recalculate layout heights for trigger bounds
        setTimeout(() => {
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        }, 150);
    }


    // ═════════ SCROLL ANIMATIONS ═════════
    function _animateGrid() {
        // Stagger grid articles
        const articleItems = grid.querySelectorAll('.journal-article');
        if (articleItems.length > 0) {
            gsap.fromTo(articleItems,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.journal-page__grid',
                        start: 'top 85%'
                    }
                }
            );
        }
    }

    // ═════════ ENTRANCE TIMELINE ═════════
    // Immediately reveal hero elements with GSAP stagger
    const heroElements = document.querySelectorAll('.journal-editorial-hero .reveal');
    if (heroElements.length > 0) {
        // Remove reveal class to prevent CSS hiding, use GSAP for animation
        heroElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            el.classList.remove('reveal');
        });
        gsap.to(heroElements, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.2,
            clearProps: 'transform'
        });
    }

    // ═════════ REVEAL OBSERVER (UPGRADED TO GSAP) ═════════
    const revealTargets = document.querySelectorAll('.journal-page .reveal, .home-reveal');
    if (revealTargets.length > 0) {
        revealTargets.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }


    // ═════════ NEWSLETTER FORM (Cosmetic) ═════════
    const newsletterForm = document.getElementById('journal-newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            if (input && btn) {
                btn.textContent = 'Subscribed ✓';
                btn.style.background = 'rgba(255, 204, 0, 0.2)';
                btn.style.color = 'var(--copper)';
                btn.style.border = '1px solid var(--copper)';
                input.value = '';
                input.disabled = true;
                btn.disabled = true;
            }
        });
    }


    // ═════════ REDUCED MOTION ═════════
    function _prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /* ══════════════════════════════════════════════════
       5. CRAFT JOURNEY — GSAP ScrollTrigger Card Stack
    ═══════════════════════════════════════════════════ */
    function _initCraftJourney() {
        const sec = document.querySelector('.home-craft-journey');
        const track = document.querySelector('.home-craft-journey__scroll-track');
        const cards = gsap.utils.toArray('.home-craft-journey__card');
        const indicators = gsap.utils.toArray('.home-craft-journey__indicator');
        const textBlocks = gsap.utils.toArray('.home-craft-journey__text-block');
        const mobileStepNames = gsap.utils.toArray('.home-craft-journey__step-name--mobile');

        if (!sec || !track || !cards.length) return;
        if (_prefersReducedMotion() || !window.gsap || !window.ScrollTrigger) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            sec.style.setProperty('overflow', 'visible', 'important');
            sec.style.setProperty('will-change', 'auto', 'important');
        }

        cards.forEach((card, idx) => {
            if (idx === 0) {
                gsap.set(card, { zIndex: 10, opacity: 1, scale: 1, yPercent: 0 });
                card.classList.add('active');
            } else {
                gsap.set(card, { zIndex: 10 - idx, opacity: 0, scale: 0.9, yPercent: 0 });
                card.classList.remove('active');
            }
        });

        textBlocks.forEach((tb, idx) => {
            if (idx === 0) {
                gsap.set(tb, { opacity: 1, yPercent: 0 });
                tb.classList.add('active');
            } else {
                gsap.set(tb, { opacity: 0, yPercent: isMobile ? 0 : 15 });
                tb.classList.remove('active');
            }
        });

        mobileStepNames.forEach((nameEl, idx) => {
            if (idx === 0) {
                nameEl.classList.add('active');
            } else {
                nameEl.classList.remove('active');
            }
        });

        gsap.killTweensOf(cards);
        gsap.killTweensOf(textBlocks);

        const endDistance = isMobile ? '+=2600' : '+=4200';
        const scrubVal = 1.2;
        const ySlideOut = isMobile ? -120 : -130;

        const startHold = 0.20;
        const endHold = 0.20;
        const totalSteps = cards.length - 1;
        const transitionDuration = (1 - startHold - endHold) / totalSteps;

        _craftTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: sec,
                start: 'top top',
                end: endDistance,
                pin: true,
                pinSpacing: true,
                scrub: scrubVal,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    let activeIdx = 0;
                    if (progress < 0.30) activeIdx = 0;
                    else if (progress < 0.50) activeIdx = 1;
                    else if (progress < 0.70) activeIdx = 2;
                    else activeIdx = 3;

                    indicators.forEach((ind, i) => ind.classList.toggle('active', i === activeIdx));
                    textBlocks.forEach((tb, i) => tb.classList.toggle('active', i === activeIdx));
                    cards.forEach((card, i) => card.classList.toggle('active', i === activeIdx));
                    mobileStepNames.forEach((nameEl, i) => nameEl.classList.toggle('active', i === activeIdx));
                }
            }
        });

        for (let i = 0; i < totalSteps; i++) {
            const currentCard = cards[i];
            const nextCard = cards[i + 1];
            const currentImg = currentCard.querySelector('.home-craft-journey__card-img');
            const nextImg = nextCard.querySelector('.home-craft-journey__card-img');
            const currentText = textBlocks[i];
            const nextText = textBlocks[i + 1];
            const t0 = startHold + i * transitionDuration;
            const dur = transitionDuration * 0.50;
            const ease = 'power2.inOut';

            _craftTimeline.to(currentCard,
                { yPercent: ySlideOut, opacity: 0, scale: 0.95, duration: dur, ease },
                t0
            );
            _craftTimeline.to(currentText,
                { yPercent: -30, opacity: 0, duration: dur, ease },
                t0
            );
            if (currentImg) {
                _craftTimeline.to(currentImg,
                    { scale: 1.08, duration: dur, ease },
                    t0
                );
            }

            _craftTimeline.fromTo(nextCard,
                { opacity: 0, scale: 0.94, yPercent: 0 },
                { opacity: 1, scale: 1, yPercent: 0, duration: dur, ease },
                t0
            );
            _craftTimeline.fromTo(nextText,
                { yPercent: 40, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: dur, ease },
                t0
            );
            if (nextImg) {
                _craftTimeline.fromTo(nextImg,
                    { scale: 1.12 },
                    { scale: 1.0, duration: dur, ease },
                    t0
                );
            }
        }

        const _scrollToStep = (idx) => {
            if (!_craftTimeline || !_craftTimeline.scrollTrigger) return;
            const st = _craftTimeline.scrollTrigger;
            const targetProgressMap = [0.10, 0.40, 0.60, 0.85];
            const scrollPos = st.start + targetProgressMap[idx] * (st.end - st.start) + 5;
            window.scrollTo({ top: scrollPos, behavior: 'smooth' });
        };

        indicators.forEach((indicator, idx) => {
            const _onIndicatorClick = (e) => {
                e.preventDefault();
                _scrollToStep(idx);
            };
            indicator.addEventListener('click', _onIndicatorClick);
            indicator._clickHandler = _onIndicatorClick;
        });

        mobileStepNames.forEach((stepName, idx) => {
            const _onStepNameClick = (e) => {
                e.preventDefault();
                _scrollToStep(idx);
            };
            stepName.addEventListener('click', _onStepNameClick);
            stepName._clickHandler = _onStepNameClick;
        });
    }

    _initCraftJourney();

    return () => {
        window.removeEventListener('scroll', _onScrollProgress);
        if (_craftTimeline) {
            if (_craftTimeline.scrollTrigger) {
                _craftTimeline.scrollTrigger.kill(true);
            }
            _craftTimeline.kill();
            _craftTimeline = null;
        }
    };
}
