/**
 * FILE: journal.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Controller for the journal/lifestyle dispatches page.
 *
 * RESPONSIBILITIES:
 * - Injects article items dynamically into the journal grid.
 * - Controls entrance animations for headers and list items using GSAP ScrollTrigger.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the journal page interactive systems and builds the article list grid.
 * @returns {void}
 */
export function mountJournalPage() {
    gsap.registerPlugin(ScrollTrigger);

    // ═════════ ARTICLE DATA REGISTRY ═════════
    const ARTICLES = [
        { id: 1, title: 'The Soil of Ethiopia', category: 'Origin', date: 'May 12, 2024', img: '/global/assets/img/soil-ethiopia.png' },
        { id: 2, title: 'Morning in the 7ème', category: 'Lifestyle', date: 'May 08, 2024', img: '/global/assets/img/morning-7eme.png' },
        { id: 3, title: 'The Architecture of Taste', category: 'Design', date: 'April 28, 2024', img: '/global/assets/img/architecture-taste.png' }
    ];

    // ═════════ GRID RENDERING ═════════
    const grid = document.getElementById('journal-grid');
    if (grid) {
        grid.innerHTML = '';
        ARTICLES.forEach((post) => {
            const article = document.createElement('article');
            article.className = 'journal-article reveal';
            article.setAttribute('aria-label', `Journal article: ${post.title}`);
            article.innerHTML = `
                <div class="journal-article__img">
                    <img src="${post.img}" alt="${post.title} cover image" />
                </div>
                <div class="journal-article__content">
                    <span class="t-label">${post.category} · ${post.date}</span>
                    <h3 style="color: var(--cream);">${post.title}</h3>
                    <div class="journal-article__read">
                        <span>Read Story</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
            `;
            grid.appendChild(article);
        });
    }

    // ═════════ ENTRANCE TIMELINES ═════════
    gsap.from('.journal-page__header h1', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    gsap.from('.journal-article', {
        scrollTrigger: {
            trigger: '.journal-page__grid',
            start: 'top 85%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });
}
