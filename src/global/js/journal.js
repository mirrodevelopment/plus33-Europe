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

export function mountJournalPage() {
    gsap.registerPlugin(ScrollTrigger);
    let _craftTimeline = null;

    const grid = document.getElementById('journal-grid');
    if (!grid) return;

    // Fetch dynamic Coffee Journal stories from H2 database
    fetch('/api/journal/stories')
        .then(res => res.json())
        .then(stories => {
            grid.innerHTML = '';
            stories.forEach((post) => {
                const article = document.createElement('article');
                article.className = 'journal-article reveal';
                article.setAttribute('aria-label', `Journal article: ${post.title}`);
                article.innerHTML = `
                    <div class="journal-article__img">
                        <img src="${post.imagePath}" alt="${post.title} cover image" />
                    </div>
                    <div class="journal-article__content">
                        <span class="t-label">${post.category} · ${post.dateString}</span>
                        <h3 style="color: var(--cream);">${post.title}</h3>
                        <div class="journal-article__read">
                            <span>Read Story</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                    </div>
                `;
                grid.appendChild(article);
            });

            // Trigger stagger animations once DOM items are injected
            const articleItems = grid.querySelectorAll('.journal-article');
            if (articleItems.length > 0) {
                gsap.fromTo(articleItems,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.journal-page__grid',
                            start: 'top 85%'
                        }
                    }
                );
            }
        })
        .catch(err => {
            console.error('Failed to load Coffee Journal feeds', err);
        });

    // ═════════ ENTRANCE TIMELINES ═════════
    gsap.from('.journal-page__header h1', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Scroll Reveal observer for .home-reveal elements (Philosophy Section)
    const targets = document.querySelectorAll('.home-reveal');
    let revealObs = null;
    if (targets.length > 0) {
        revealObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -60px 0px',
            }
        );
        targets.forEach((el) => revealObs.observe(el));
    }

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
        if (revealObs) {
            revealObs.disconnect();
        }
        if (_craftTimeline) {
            if (_craftTimeline.scrollTrigger) {
                _craftTimeline.scrollTrigger.kill(true);
            }
            _craftTimeline.kill();
            _craftTimeline = null;
        }
    };
}
