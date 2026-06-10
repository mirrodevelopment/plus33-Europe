/**
 * FILE: home.js
 * PAGE: Homepage
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Homepage controller — manages all interactive
 * behaviors isolated to the PLUS33 homepage.
 * ══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────
     STATE & REFS
  ──────────────────────────────────────────────────── */
  let _revealObserver = null;
  let _rafId = null;
  let _ticking = false;
  let _scrollY = 0;
  let _heroImg = null;
  let _craftTimeline = null;

  let _carouselProducts = [];
  let _carouselActiveIndex = 0;
  let _carouselCleanup = null;
  let _carouselInterval = null;

  let _categoryShowcaseCleanup = null;
  let _signatureCollectionCleanup = null;
  let _bakeryShowcaseCleanup = null;
  let _bestSellersShowcaseCleanup = null;
  let _rewardsCleanup = null;
  let _appCleanup = null;

  /* ──────────────────────────────────────────────────
     CONSTANTS
  ──────────────────────────────────────────────────── */
  const PARALLAX_FACTOR = 0.25;   // fraction of scroll offset for hero parallax
  const REVEAL_THRESHOLD = 0.15;   // 15% of element must be visible to trigger


  /* ══════════════════════════════════════════════════
     PUBLIC API — initHome
  ═══════════════════════════════════════════════════ */
  function initHome() {
    _heroImg = document.querySelector('.home-hero__bg-img');

    _initScrollReveal();
    _initParallax();
    _initScrollIndicator();
    _initSignatureCollection();
    _initCarousel();
    _initSbxSlider();
    _initCategoryShowcase();
    _initBakeryShowcase();
    _initBestSellersShowcase();
    _rewardsCleanup = _initRewardsSystem();
    _appCleanup = _initAppSystem();

    return { destroy };
  }


  /* ══════════════════════════════════════════════════
     1. SCROLL-REVEAL  — Intersection Observer
  ═══════════════════════════════════════════════════ */
  function _initScrollReveal() {
    const targets = document.querySelectorAll('.home-reveal');
    if (!targets.length) return;

    _revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            _revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: REVEAL_THRESHOLD,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    targets.forEach((el) => _revealObserver.observe(el));
  }


  /* ══════════════════════════════════════════════════
     2. HERO PARALLAX — rAF throttled
  ═══════════════════════════════════════════════════ */
  function _initParallax() {
    if (!_heroImg || _prefersReducedMotion()) return;

    const content = document.querySelector('.home-hero__content');

    function _onScroll() {
      _scrollY = window.scrollY;
      if (!_ticking) {
        _rafId = requestAnimationFrame(_applyParallax);
        _ticking = true;
      }
    }

    function _applyParallax() {
      const offset = _scrollY * PARALLAX_FACTOR;
      _heroImg.style.transform = `scale(1.04) translateY(${offset}px)`;

      const fadeThreshold = window.innerHeight || 700;
      const opacity = Math.max(0, 1 - _scrollY / (fadeThreshold * 0.85));

      if (content) {
        content.style.opacity = opacity;
        const contentOffset = _scrollY * 0.15;
        content.style.transform = `translateY(${-contentOffset}px)`;
      }

      _heroImg.style.opacity = opacity;

      _ticking = false;
    }

    window.addEventListener('scroll', _onScroll, { passive: true });
    _heroImg._scrollHandler = _onScroll;
  }

  /* ══════════════════════════════════════════════════
     4. SCROLL INDICATOR
  ═══════════════════════════════════════════════════ */
  function _initScrollIndicator() {
    const scrollEl = document.querySelector('.home-hero__scroll');
    if (!scrollEl) return;

    const _onScrollClick = (e) => {
      e.preventDefault();
      const target = document.getElementById('home-signature-collection');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    scrollEl.addEventListener('click', _onScrollClick);
    scrollEl._clickHandler = _onScrollClick;

    const hero = document.getElementById('home-hero');
    if (!hero) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          scrollEl.style.opacity = entry.isIntersecting ? '1' : '0';
          scrollEl.style.pointerEvents = entry.isIntersecting ? 'auto' : 'none';
        });
      },
      { threshold: 0.05 }
    );

    obs.observe(hero);
    scrollEl._intersectionObs = obs;
  }



  /* ══════════════════════════════════════════════════
     5B. DYNAMIC PRODUCT CAROUSEL (STRIP)
     ═══════════════════════════════════════════════════ */
  function _initCarousel() {
    const track = document.getElementById('hero-strip-track');
    const prevBtn = document.getElementById('hero-strip-prev');
    const nextBtn = document.getElementById('hero-strip-next');
    if (!track) return;

    let _isTransitioning = false;

    fetch('/api/store/products')
      .then(res => res.json())
      .then(products => {
        if (!products.length) return;

        // Filter: only display drinks (hot-coffee, iced-coffee)
        _carouselProducts = products.filter(p => p.category && (
          p.category.split(',').map(c => c.trim()).includes('hot-coffee') ||
          p.category.split(',').map(c => c.trim()).includes('iced-coffee')
        ));
        
        if (!_carouselProducts.length) return;

        const tiramisuIdx = _carouselProducts.findIndex(p => p.name === 'Tiramisu Glacé');
        if (tiramisuIdx !== -1) {
          _carouselActiveIndex = tiramisuIdx;
        } else {
          _carouselActiveIndex = Math.floor(_carouselProducts.length / 2);
        }

        _renderCarousel();
        // Wait briefly for DOM rendering/layout before centering
        setTimeout(() => {
          _updateCarouselState(false); // Initial render, no transition animation
          _startAutoPlay();
        }, 50);
      })
      .catch(err => console.error('Failed to load carousel products:', err));

    function _renderCarousel() {
      // Infinite Loop: Clone last 5 items to prepend, and first 5 items to append
      const clonedEnd = _carouselProducts.slice(-5);
      const clonedStart = _carouselProducts.slice(0, 5);
      const displayList = [...clonedEnd, ..._carouselProducts, ...clonedStart];

      // Palette matching pink, green, yellow, tan from the Starbucks reference image
      const colors = ['#E49EB3', '#7DA383', '#D6B87E', '#C2A182'];

      track.innerHTML = displayList.map((product, idx) => {
        const bgColor = colors[idx % colors.length];
        return `
          <div class="home-hero__strip-card" data-dom-index="${idx}" data-index="${(idx - 5 + _carouselProducts.length) % _carouselProducts.length}">
            <a href="/product/${product.id}" class="home-hero__strip-card-link">
              <div class="home-hero__strip-thumb" style="background: ${bgColor};">
                <img src="${product.imagePath}" alt="${product.name}"
                  onerror="this.style.display='none';this.parentElement.classList.add('strip-thumb--placeholder')" />
              </div>
            </a>
            <span class="home-hero__strip-name">${product.name}</span>
            <a href="/product/${product.id}" class="home-hero__strip-cta">Experience <span>+</span></a>
          </div>
        `;
      }).join('');
    }

    function _updateCarouselState(animate = true) {
      const cards = track.querySelectorAll('.home-hero__strip-card');
      const N = _carouselProducts.length;
      if (!cards.length || N === 0) return;

      const container = track.parentElement;
      if (!container) return;

      // 1. Calculate dynamic layout variables to cover the visible carousel area
      const style = window.getComputedStyle(container);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const contentWidth = container.offsetWidth - paddingLeft - paddingRight;

      const isMobile = window.innerWidth <= 768;
      const visibleCount = 3; // Always show exactly 3 cards, matching the reference image layout
      const gap = isMobile ? 16 : 32;
      const cardWidth = (contentWidth - (visibleCount - 1) * gap) / visibleCount;
      const halfVisible = Math.floor(visibleCount / 2);

      // Set dynamic layout properties
      track.style.gap = `${gap}px`;

      const activeDOMIndex = _carouselActiveIndex + 5;

      cards.forEach((card, idx) => {
        // Apply the calculated width to cover the carousel area perfectly
        card.style.width = `${cardWidth}px`;

        const diff = idx - activeDOMIndex;

        if (diff === 0) {
          card.classList.add('home-hero__strip-card--featured');
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
          card.style.visibility = 'visible';
        } else if (Math.abs(diff) <= halfVisible) {
          card.classList.remove('home-hero__strip-card--featured');
          card.style.opacity = '0.55';
          card.style.pointerEvents = 'auto';
          card.style.visibility = 'visible';
        } else {
          card.classList.remove('home-hero__strip-card--featured');
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.visibility = 'hidden';
        }
      });

      const activeCard = cards[activeDOMIndex];
      if (activeCard) {
        const activeCenterRelative = activeCard.offsetLeft + activeCard.offsetWidth / 2;
        const containerCenter = container.offsetWidth / 2;
        const translateX = containerCenter - activeCenterRelative - paddingLeft;

        if (animate) {
          track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          track.style.transition = 'none';
        }
        track.style.transform = `translateX(${translateX}px)`;

        // Dynamic Showcase Update:
        // Automatically sync the main center image, floating card title, description, and price labels with the active carousel item!
        const activeProduct = _carouselProducts[_carouselActiveIndex];
        if (activeProduct) {
          const mainImg = document.querySelector('.home-hero__product-img');
          const floatValue = document.querySelector('.home-hero__float-value');
          const floatSub = document.querySelector('.home-hero__float-sub');
          
          const priceVal = document.querySelector('.home-hero__cta-row .home-hero__meta-price');
          const priceValMob = document.querySelector('.home-hero__meta--mobile .home-hero__meta-price');

          if (mainImg) {
            mainImg.src = activeProduct.imagePath;
            mainImg.alt = activeProduct.name;
            mainImg.parentElement.classList.remove('home-hero__product-circle--placeholder');
          }
          if (floatValue) {
            floatValue.textContent = activeProduct.name;
          }
          if (floatSub) {
            floatSub.textContent = activeProduct.description || 'Specialty artisanal blend';
          }
          if (priceVal) {
            priceVal.textContent = `€${activeProduct.price.toFixed(2)}`;
          }
          if (priceValMob) {
            priceValMob.textContent = `€${activeProduct.price.toFixed(2)}`;
          }
        }
      }
    }

    const _startAutoPlay = () => {
      _stopAutoPlay();
      _carouselInterval = setInterval(() => {
        if (!_carouselProducts.length || _isTransitioning) return;
        _isTransitioning = true;
        _carouselActiveIndex++;
        _updateCarouselState(true);
      }, 3000);
    };

    const _stopAutoPlay = () => {
      if (_carouselInterval) {
        clearInterval(_carouselInterval);
        _carouselInterval = null;
      }
    };

    const _onNextClick = (e) => {
      e?.preventDefault();
      if (!_carouselProducts.length || _isTransitioning) return;
      _isTransitioning = true;
      _carouselActiveIndex++;
      _updateCarouselState(true);
      _startAutoPlay(); // Reset autoplay timer
    };

    const _onPrevClick = (e) => {
      e?.preventDefault();
      if (!_carouselProducts.length || _isTransitioning) return;
      _isTransitioning = true;
      _carouselActiveIndex--;
      _updateCarouselState(true);
      _startAutoPlay(); // Reset autoplay timer
    };

    const _onTrackClick = (e) => {
      // If clicking the CTA button, let it navigate directly without e.preventDefault()
      if (e.target.closest('.home-hero__strip-cta')) {
        return;
      }

      const card = e.target.closest('.home-hero__strip-card');
      if (!card || _isTransitioning) return;

      const clickedDOMIdx = parseInt(card.getAttribute('data-dom-index'), 10);
      const clickedIdx = clickedDOMIdx - 5;

      if (clickedIdx !== _carouselActiveIndex) {
        // If clicking a non-active card, focus/center it first
        e.preventDefault();
        _isTransitioning = true;
        _carouselActiveIndex = clickedIdx;
        _updateCarouselState(true);
        _startAutoPlay(); // Reset autoplay timer
      }
    };

    const _onTransitionEnd = () => {
      _isTransitioning = false;
      const N = _carouselProducts.length;
      if (_carouselActiveIndex >= N) {
        _carouselActiveIndex = 0;
        _updateCarouselState(false); // Seamless instant shift to index 5
      } else if (_carouselActiveIndex < 0) {
        _carouselActiveIndex = N - 1;
        _updateCarouselState(false); // Seamless instant shift to index N + 4
      }
    };

    if (nextBtn) nextBtn.addEventListener('click', _onNextClick);
    if (prevBtn) prevBtn.addEventListener('click', _onPrevClick);
    track.addEventListener('click', _onTrackClick);
    track.addEventListener('transitionend', _onTransitionEnd);

    const _onResize = () => {
      _updateCarouselState(false);
    };
    window.addEventListener('resize', _onResize);

    _carouselCleanup = () => {
      _stopAutoPlay();
      if (nextBtn) nextBtn.removeEventListener('click', _onNextClick);
      if (prevBtn) prevBtn.removeEventListener('click', _onPrevClick);
      track.removeEventListener('click', _onTrackClick);
      track.removeEventListener('transitionend', _onTransitionEnd);
      window.removeEventListener('resize', _onResize);
    };
  }

  /* ══════════════════════════════════════════════════
     7. CATEGORY SHOWCASE — Dynamic Cards
  ═══════════════════════════════════════════════════ */
  function _initCategoryShowcase() {
    const container = document.getElementById('hmp-category-cards-container');
    if (!container) return;

    // Category → visual metadata map
    const CATEGORY_META = {
      'hot-coffee':  { label: 'Hot Coffee',              desc: 'Signature espresso and filter brews',        img: '/local/assets/products/drinks/hot-coffee/cappuccino.png',          icon: '<path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="1" x2="6" y2="4" stroke-linecap="round"/><line x1="10" y1="1" x2="10" y2="4" stroke-linecap="round"/><line x1="14" y1="1" x2="14" y2="4" stroke-linecap="round"/>' },
      'iced-coffee': { label: 'Iced Coffee & Cold Drinks', desc: 'Chilled refreshments for every season',       img: '/local/assets/products/drinks/iced-coffee/iced-punch-coco.jpg',      icon: '<path d="M5 8h14l-1.5 10H6.5L5 8zM3 8h18M10 4h4" stroke-linecap="round" stroke-linejoin="round"/>' },
      'signature':   { label: 'Signature Drinks',          desc: 'Unique house specialties & seasonal creates', img: '/local/assets/products/signature_category.jpg',                      icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-linecap="round" stroke-linejoin="round"/>' },
      'bakery':      { label: 'Bakery',                    desc: 'Fresh pastries baked every morning',          img: '/local/assets/products/bakery_category.jpg',                         icon: '<circle cx="12" cy="9" r="5" stroke-linecap="round"/><path d="M4.22 19.78a10 10 0 0115.56 0" stroke-linecap="round" stroke-linejoin="round"/>' },
      'desserts':    { label: 'Snacks & Desserts',          desc: 'Indulgent treats and seasonal delights',      img: '/local/assets/products/desserts/tiramisu-glace.jpg',                       icon: '<path d="M4 11c0-3.87 3.58-7 8-7s8 3.13 8 7H4zM2 11h20M12 11v10M6 21h12" stroke-linecap="round" stroke-linejoin="round"/>' },
      'retail':      { label: 'Coffee Beans & Retail',      desc: 'Micro-lot single-origin beans to brew at home', img: '/local/assets/products/retail/sachet-de-cafe.png',                          icon: '<ellipse cx="12" cy="12" rx="10" ry="6" stroke-linecap="round"/><path d="M12 6c-5.5 0-10 2.69-10 6s4.5 6 10 6 10-2.69 10-6-4.5-6-10-6z" stroke-linecap="round"/>' },
      'merchandise': { label: 'Gifts & Merchandise',        desc: 'Curated gift sets and branded lifestyle items', img: '/local/assets/products/merchandise/atelier-gift-pack.jpeg',          icon: '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke-linecap="round" stroke-linejoin="round"/>' },
    };

    let _products = [];
    let _expandedSlug = null;
    let _showcaseCleanupFns = [];

    // ── Fetch store categories from store.html + products from API ──
    Promise.all([
      fetch('/local/html/store.html?v=1.2').then(r => r.text()),
      fetch('/api/store/products').then(r => r.json())
    ]).then(([storeHtml, products]) => {
      _products = products;

      // Parse category buttons from store.html (excluding 'all')
      const parser = new DOMParser();
      const storeDoc = parser.parseFromString(storeHtml, 'text/html');
      const catBtns = [...storeDoc.querySelectorAll('.store-cat-btn[data-category]')]
        .filter(btn => btn.getAttribute('data-category') !== 'all');

      if (!catBtns.length) return;

      const categories = catBtns
        .map(btn => ({
          slug: btn.getAttribute('data-category'),
          label: btn.textContent.trim()
        }))
        .filter(cat => cat.slug !== 'bakery' && cat.slug !== 'signature');

      _renderCards(categories);
    }).catch(err => console.warn('[+33 Showcase] Category load failed:', err));

    function _getCountForSlug(slug) {
      return _products.filter(p => p.category && p.category.split(',').map(c => c.trim()).includes(slug)).length;
    }

    function _getFeaturedProduct(slug) {
      return _products.find(p => p.category && p.category.split(',').map(c => c.trim()).includes(slug));
    }

    function _renderCards(categories) {
      const isMobile = window.innerWidth < 768;

      container.innerHTML = categories.map((cat, idx) => {
        const meta = CATEGORY_META[cat.slug] || {
          label: cat.label,
          desc: 'Discover our curated selection',
          img: '/local/assets/products/bakery_category.jpg',
          icon: '<circle cx="12" cy="12" r="10"/>'
        };
        const count = _getCountForSlug(cat.slug);
        const featured = _getFeaturedProduct(cat.slug);
        const featuredName = featured ? featured.name : '';
        const featuredPrice = featured ? `€${featured.price.toFixed(2)}` : '';

        return `
          <div
            class="hmp-category-card"
            data-slug="${cat.slug}"
            data-index="${idx}"
            role="listitem"
            tabindex="0"
            aria-label="Explore ${meta.label}"
          >
            <!-- Background image -->
            <div class="hmp-category-card__bg" style="background-image:url('${meta.img}')"></div>
            <!-- Gradient overlay -->
            <div class="hmp-category-card__overlay"></div>

            <!-- Collapsed state content -->
            <div class="hmp-category-card__collapsed">
              <div class="hmp-category-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${meta.icon}</svg>
              </div>
              <h3 class="hmp-category-card__name">${meta.label}</h3>
              <span class="hmp-category-card__count">${count} Product${count !== 1 ? 's' : ''}</span>
              <div class="hmp-category-card__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <!-- Expanded state content (glassmorphism panel) -->
            <div class="hmp-category-card__expanded-panel">
              <div class="hmp-category-card__expanded-inner">
                <span class="hmp-category-card__expanded-count">${count} ${count !== 1 ? 'Items' : 'Item'}</span>
                <h3 class="hmp-category-card__expanded-title">${meta.label}</h3>
                <p class="hmp-category-card__expanded-desc">${meta.desc}</p>
                ${featuredName ? `
                  <div class="hmp-category-card__featured">
                    <span class="hmp-category-card__featured-label">Featured</span>
                    <span class="hmp-category-card__featured-name">${featuredName}</span>
                    <span class="hmp-category-card__featured-price">${featuredPrice}</span>
                  </div>
                ` : ''}
                <a href="/store?category=${cat.slug}" class="hmp-category-card__cta" aria-label="Explore ${meta.label}">
                  <span>Explore Collection</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');

      _setupInteractions();

      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }

    function _expandCard(slug) {
      if (_expandedSlug === slug) return;
      _expandedSlug = slug;
      const cards = container.querySelectorAll('.hmp-category-card');
      cards.forEach(card => {
        const isActive = card.getAttribute('data-slug') === slug;
        card.classList.toggle('hmp-category-card--expanded', isActive);
        card.classList.toggle('hmp-category-card--compressed', !isActive);
        card.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });
    }

    function _collapseAll() {
      _expandedSlug = null;
      container.querySelectorAll('.hmp-category-card').forEach(card => {
        card.classList.remove('hmp-category-card--expanded', 'hmp-category-card--compressed');
        card.setAttribute('aria-expanded', 'false');
      });
    }

    function _setupInteractions() {
      // Clean previous listeners
      _showcaseCleanupFns.forEach(fn => fn());
      _showcaseCleanupFns = [];

      const isMobile = () => window.innerWidth < 768;
      const cards = container.querySelectorAll('.hmp-category-card');

      cards.forEach(card => {
        const slug = card.getAttribute('data-slug');

        // Desktop: hover to expand
        const onMouseEnter = () => { if (!isMobile()) _expandCard(slug); };
        const onMouseLeave = () => { if (!isMobile()) _collapseAll(); };

        // Mobile: tap to toggle
        const onCardClick = (e) => {
          if (isMobile()) {
            // If clicking the CTA, navigate — don't interfere
            if (e.target.closest('.hmp-category-card__cta')) return;
            e.preventDefault();
            if (_expandedSlug === slug) {
              _collapseAll();
            } else {
              _expandCard(slug);
              // Center the expanded card in the horizontal scroll container
              setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }, 120);
            }
          }
        };

        // Keyboard: Enter/Space to toggle expand
        const onKeyDown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (_expandedSlug === slug) _collapseAll();
            else _expandCard(slug);
          }
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mouseleave', onMouseLeave);
        card.addEventListener('click', onCardClick);
        card.addEventListener('keydown', onKeyDown);

        _showcaseCleanupFns.push(() => {
          card.removeEventListener('mouseenter', onMouseEnter);
          card.removeEventListener('mouseleave', onMouseLeave);
          card.removeEventListener('click', onCardClick);
          card.removeEventListener('keydown', onKeyDown);
        });
      });

      // Collapse all when clicking outside the showcase
      const onOutsideClick = (e) => {
        if (!container.contains(e.target)) _collapseAll();
      };
      document.addEventListener('click', onOutsideClick);
      _showcaseCleanupFns.push(() => document.removeEventListener('click', onOutsideClick));
    }

    _categoryShowcaseCleanup = () => {
      _showcaseCleanupFns.forEach(fn => fn());
      _showcaseCleanupFns = [];
    };
  }

  function _prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function destroy() {
    if (_rewardsCleanup) {
      _rewardsCleanup();
      _rewardsCleanup = null;
    }

    if (_appCleanup) {
      _appCleanup();
      _appCleanup = null;
    }

    if (_bakeryShowcaseCleanup) {
      _bakeryShowcaseCleanup();
      _bakeryShowcaseCleanup = null;
    }

    if (_bestSellersShowcaseCleanup) {
      _bestSellersShowcaseCleanup();
      _bestSellersShowcaseCleanup = null;
    }

    if (_signatureCollectionCleanup) {
      _signatureCollectionCleanup();
      _signatureCollectionCleanup = null;
    }

    if (_categoryShowcaseCleanup) {
      _categoryShowcaseCleanup();
      _categoryShowcaseCleanup = null;
    }

    if (_sbxSliderCleanup) {
      _sbxSliderCleanup();
      _sbxSliderCleanup = null;
    }

    if (_carouselCleanup) {
      _carouselCleanup();
      _carouselCleanup = null;
    }

    if (_revealObserver) {
      _revealObserver.disconnect();
      _revealObserver = null;
    }

    if (_rafId !== null) {
      cancelAnimationFrame(_rafId);
      _rafId = null;
    }

    if (_craftTimeline) {
      if (_craftTimeline.scrollTrigger) {
        _craftTimeline.scrollTrigger.kill(true);
      }
      _craftTimeline.kill();
      _craftTimeline = null;
    }

    const sec = document.querySelector('.home-craft-journey');
    if (sec) {
      sec.style.removeProperty('overflow');
      sec.style.removeProperty('will-change');
    }

    const indicators = document.querySelectorAll('.home-craft-journey__indicator');
    indicators.forEach((indicator) => {
      if (indicator._clickHandler) {
        indicator.removeEventListener('click', indicator._clickHandler);
        indicator._clickHandler = null;
      }
    });

    const mobileStepNames = document.querySelectorAll('.home-craft-journey__step-name--mobile');
    mobileStepNames.forEach((stepName) => {
      if (stepName._clickHandler) {
        stepName.removeEventListener('click', stepName._clickHandler);
        stepName._clickHandler = null;
      }
    });

    if (_heroImg) {
      if (_heroImg._scrollHandler) {
        window.removeEventListener('scroll', _heroImg._scrollHandler);
        _heroImg._scrollHandler = null;
      }
      _heroImg.style.transform = '';
      _heroImg.style.opacity = '';
    }

    const content = document.querySelector('.home-hero__content');
    if (content) {
      content.style.transform = '';
      content.style.opacity = '';
    }

    const scrollEl = document.querySelector('.home-hero__scroll');
    if (scrollEl) {
      if (scrollEl._intersectionObs) {
        scrollEl._intersectionObs.disconnect();
        scrollEl._intersectionObs = null;
      }
      if (scrollEl._clickHandler) {
        scrollEl.removeEventListener('click', scrollEl._clickHandler);
        scrollEl._clickHandler = null;
      }
    }

    _heroImg = null;
    _ticking = false;
  }

  /* ══════════════════════════════════════════════════
     6. SBX HERO SLIDER — simple 3-card cycler
  ═══════════════════════════════════════════════════ */
  let _sbxSliderCleanup = null;

  function _initSbxSlider() {
    const track   = document.getElementById('sbx-slider-track');
    const prevBtn = document.getElementById('sbx-slider-prev');
    const nextBtn = document.getElementById('sbx-slider-next');
    if (!track || !prevBtn || !nextBtn) return;

    let products = [];
    let activeProductIndex = 0;

    fetch('/api/store/products')
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) return;
        
        // Filter: only display drinks (hot-coffee, iced-coffee)
        products = data.filter(p => p.category && (
          p.category.split(',').map(c => c.trim()).includes('hot-coffee') ||
          p.category.split(',').map(c => c.trim()).includes('iced-coffee')
        ));
        
        // Find a suitable starting product or default to the middle of the list
        const startIdx = products.findIndex(p => p.name === 'Pumpkin Latte');
        activeProductIndex = startIdx !== -1 ? startIdx : Math.floor(products.length / 2);
        
        _render();
      })
      .catch(err => console.error('Failed to load store products for SBX slider:', err));

    function _render() {
      if (products.length === 0) return;
      const N = products.length;
      
      const isDesktop = window.innerWidth >= 1024;
      let displayIndices = [];
      let colorClasses = ['rose', 'green', 'caramel', 'rose', 'green'];

      if (isDesktop) {
        const farLeftIdx  = (activeProductIndex - 2 + N) % N;
        const leftIdx     = (activeProductIndex - 1 + N) % N;
        const centerIdx   = activeProductIndex;
        const rightIdx    = (activeProductIndex + 1) % N;
        const farRightIdx = (activeProductIndex + 2) % N;
        displayIndices = [farLeftIdx, leftIdx, centerIdx, rightIdx, farRightIdx];
      } else {
        const leftIdx   = (activeProductIndex - 1 + N) % N;
        const centerIdx = activeProductIndex;
        const rightIdx  = (activeProductIndex + 1) % N;
        displayIndices = [leftIdx, centerIdx, rightIdx];
      }

      track.innerHTML = displayIndices.map((prodIdx, i) => {
        const product = products[prodIdx];
        const isFeatured = isDesktop ? (i === 2) : (i === 1);
        const featuredClass = isFeatured ? ' sbx-hero__slider-card--featured' : '';
        const colorClass = colorClasses[prodIdx % colorClasses.length];
        
        const badgeHTML = '';
        
        return `
          <div class="sbx-hero__slider-card${featuredClass}" id="sbx-card-${i + 1}">
            ${badgeHTML}
            <div class="sbx-hero__slider-thumb sbx-hero__slider-thumb--${colorClass}">
              <img
                src="${product.imagePath}"
                alt="${product.name}"
                onerror="this.style.display='none'"
              />
            </div>
            <span class="sbx-hero__slider-name">${product.name}</span>
            <a href="/product/${product.id}" class="sbx-hero__slider-cta">Add to order +</a>
          </div>
        `;
      }).join('');
    }

    const _onNext = (e) => {
      e?.preventDefault();
      if (products.length === 0) return;
      activeProductIndex = (activeProductIndex + 1) % products.length;
      _render();
    };

    const _onPrev = (e) => {
      e?.preventDefault();
      if (products.length === 0) return;
      activeProductIndex = (activeProductIndex - 1 + products.length) % products.length;
      _render();
    };

    const _onTrackClick = (e) => {
      if (e.target.closest('.sbx-hero__slider-cta')) {
        return;
      }
      const card = e.target.closest('.sbx-hero__slider-card');
      if (!card || products.length === 0) return;

      const cardId = card.id;
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        if (cardId === 'sbx-card-1' || cardId === 'sbx-card-2') {
          _onPrev(e);
        } else if (cardId === 'sbx-card-4' || cardId === 'sbx-card-5') {
          _onNext(e);
        }
      } else {
        if (cardId === 'sbx-card-1') {
          _onPrev(e);
        } else if (cardId === 'sbx-card-3') {
          _onNext(e);
        }
      }
    };

    nextBtn.addEventListener('click', _onNext);
    prevBtn.addEventListener('click', _onPrev);
    track.addEventListener('click', _onTrackClick);
    window.addEventListener('resize', _render);

    _sbxSliderCleanup = () => {
      if (nextBtn) nextBtn.removeEventListener('click', _onNext);
      if (prevBtn) prevBtn.removeEventListener('click', _onPrev);
      if (track) track.removeEventListener('click', _onTrackClick);
      window.removeEventListener('resize', _render);
    };
  }

  /* ══════════════════════════════════════════════════
     9. PREMIUM BAKERY SHOWCASE SECTION
     Dynamically renders dessert products from the existing
     /api/store/products endpoint (desserts category).
     Acts purely as a premium presentation layer — no duplicate data.
     ═════════════════════════════════════════════════ */
  function _initBakeryShowcase() {
    const section = document.getElementById('home-bakery-showcase');
    if (!section) return;

    // Flavor icons mapped per product name / fallback
    const BAKERY_ICONS = {
      'Croissant': `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30c4-8 10-14 20-18M8 30c6-2 14-2 20-18M8 30l20-18"/><path d="M28 12c2-2 4-2 4 0s-1 4-4 6c-2-2-2-4 0-6z"/></svg>`,
      'Pain au Chocolat': `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="12" width="24" height="16" rx="4"/><path d="M14 12v16M26 12v16M8 20h24"/></svg>`,
      'Almond Croissant': `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30c4-8 10-14 20-18M8 30l20-18"/><circle cx="22" cy="16" r="2"/><circle cx="16" cy="22" r="2"/><circle cx="28" cy="22" r="2"/></svg>`,
      'Donut': `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="13"/><circle cx="20" cy="20" r="4"/><path d="M13 14c1 2 4 3 7 3s6-1 7-3"/></svg>`,
      'Pretzel': `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8c-6 0-10 4-10 9 0 3 2 5 5 5 2 0 4-1 5-3 1 2 3 3 5 3 3 0 5-2 5-5 0-5-4-9-10-9z"/><path d="M14 26l-4 4M26 26l4 4"/></svg>`,
      'Tiramisu Glacé': `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="20" width="24" height="14" rx="3"/><path d="M8 26h24"/><path d="M14 20v-4a6 6 0 0 1 12 0v4"/><circle cx="20" cy="28" r="2"/></svg>`,
    };

    const _getIcon = (name) => {
      for (const key of Object.keys(BAKERY_ICONS)) {
        if (name && name.toLowerCase().includes(key.toLowerCase())) {
          return BAKERY_ICONS[key];
        }
      }
      // Default bakery icon
      return `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26c0-5 4-10 10-12 6 2 10 7 10 12H10z"/><rect x="8" y="26" width="24" height="6" rx="2"/></svg>`;
    };

    const _renderSection = (desserts) => {
      section.innerHTML = `
        <div class="bakery-showcase-outer bakery-showcase-reveal" style="--bk-delay: 0s;">

          <!-- ── HERO SPLIT ── -->
          <div class="bakery-showcase-hero">

            <!-- Left: Content -->
            <div class="bakery-showcase-hero__content">
              <span class="bakery-showcase-eyebrow">FRESH BAKERY DAILY</span>
              <h2 class="bakery-showcase-headline">
                Baked fresh<br>
                every <em>morning.</em>
              </h2>
              <p class="bakery-showcase-subtext">
                Made with real ingredients.<br>
                Baked with passion. Served with love.
              </p>
              <a href="/store?category=desserts" class="bakery-showcase-cta" id="bakery-showcase-cta-btn" aria-label="Explore Bakery collection">
                <span>EXPLORE BAKERY</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>

            <!-- Right: Hero Image -->
            <div class="bakery-showcase-hero__img-wrap">
              <img
                src="/local/assets/hero/dessert-section.jpg"
                alt="+33 Paris Fresh Bakery — Artisan pastries baked every morning"
                class="bakery-showcase-hero__img"
                loading="lazy"
              />
              <div class="bakery-showcase-hero__img-overlay" aria-hidden="true"></div>
            </div>

          </div>
          <!-- /bakery-showcase-hero -->

          <!-- ── DESSERT PRODUCTS ROW ── -->
          <div class="bakery-showcase-products-wrap bakery-showcase-reveal" style="--bk-delay: 0.1s;">
            <div class="bakery-showcase-products-grid" id="bakery-showcase-grid" role="list" aria-label="Fresh dessert products">
              ${desserts.map((p, i) => `
                <div
                  class="bakery-showcase-card"
                  role="listitem"
                  tabindex="0"
                  aria-label="${p.name}, ${p.price ? '€' + p.price.toFixed(2) : ''}"
                  data-product-id="${p.id}"
                  style="--bk-delay: ${0.12 + i * 0.06}s;"
                >
                  <div class="bakery-showcase-card__icon" aria-hidden="true">
                    ${_getIcon(p.name)}
                  </div>
                  <h3 class="bakery-showcase-card__title">${p.name}</h3>
                  <div class="bakery-showcase-card__img-wrap">
                    <img
                      src="${p.imagePath}"
                      alt="${p.name}"
                      class="bakery-showcase-card__img"
                      loading="lazy"
                      onerror="this.style.opacity='0'"
                    />
                  </div>
                  <p class="bakery-showcase-card__desc">${p.description || ''}</p>
                  <div class="bakery-showcase-card__bottom">
                    <span class="bakery-showcase-card__price">€${p.price ? p.price.toFixed(2) : '--'}</span>
                    <a
                      href="/store"
                      class="bakery-showcase-card__add"
                      aria-label="View ${p.name} in store"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <!-- /bakery-showcase-products-wrap -->

          <!-- ── SLIDER DOTS (visible on mobile horizontal scroll) ── -->
          <div class="bakery-showcase-dots" role="tablist" aria-label="Product page indicators">
            ${desserts.map((_, i) => `
              <button
                class="bakery-showcase-dot${i === 0 ? ' is-active' : ''}"
                role="tab"
                aria-selected="${i === 0}"
                aria-label="Product group ${i + 1}"
                data-dot-index="${i}"
              ></button>
            `).join('')}
          </div>

          <!-- ── FEATURES STRIP ── -->
          <div class="bakery-showcase-features bakery-showcase-reveal" style="--bk-delay: 0.2s;" aria-label="Bakery brand promises">
            <div class="bakery-showcase-feature">
              <div class="bakery-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="44" height="44">
                  <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 12h3m0 0h3m-3 0V9m0 3v3M14 3h7v7" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="19" cy="7" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <h4 class="bakery-showcase-feature__title">Crafted Daily</h4>
              <p class="bakery-showcase-feature__desc">Made fresh every morning in our own kitchen.</p>
            </div>
            <div class="bakery-showcase-feature">
              <div class="bakery-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="44" height="44">
                  <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 14c.5 1.5 1.5 2.5 3 2.5s2.5-1 3-2.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h4 class="bakery-showcase-feature__title">Quality Ingredients</h4>
              <p class="bakery-showcase-feature__desc">We use real butter, real chocolate and real ingredients.</p>
            </div>
            <div class="bakery-showcase-feature">
              <div class="bakery-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="44" height="44">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h4 class="bakery-showcase-feature__title">Made with Love</h4>
              <p class="bakery-showcase-feature__desc">Every bake is made with care by our passionate bakers.</p>
            </div>
            <div class="bakery-showcase-feature">
              <div class="bakery-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="44" height="44">
                  <circle cx="5" cy="18" r="2"/>
                  <circle cx="19" cy="18" r="2"/>
                  <path d="M2 18H1v-3l3-4 3 2 5-7 4 4 2-2 4 7H2z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5 18H19" stroke-linecap="round"/>
                </svg>
              </div>
              <h4 class="bakery-showcase-feature__title">Delivered Fresh</h4>
              <p class="bakery-showcase-feature__desc">Freshly packed and delivered to your door.</p>
            </div>
          </div>

        </div>
      `;

      // ── Scroll-reveal observer for bakery elements ──
      const revealEls = section.querySelectorAll('.bakery-showcase-reveal');
      if (_revealObserver) {
        revealEls.forEach(el => _revealObserver.observe(el));
      } else {
        // Fallback: just show them
        revealEls.forEach(el => el.classList.add('is-visible'));
      }

      // ── Card keyboard nav ──
      const cards = section.querySelectorAll('.bakery-showcase-card');
      const onCardKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = e.currentTarget.getAttribute('data-product-id');
          if (id) {
            if (window.plus33Router && typeof window.plus33Router.navigate === 'function') {
              window.plus33Router.navigate(`/product/${id}`);
            } else {
              window.location.href = `/product/${id}`;
            }
          }
        }
      };
      cards.forEach(card => card.addEventListener('keydown', onCardKeyDown));

      // ── Card link on click (navigate to product detail) ──
      const onCardClick = (e) => {
        if (e.target.closest('.bakery-showcase-card__add')) return;
        const id = e.currentTarget.getAttribute('data-product-id');
        if (id) {
          if (window.plus33Router && typeof window.plus33Router.navigate === 'function') {
            window.plus33Router.navigate(`/product/${id}`);
          } else {
            window.location.href = `/product/${id}`;
          }
        }
      };
      cards.forEach(card => card.addEventListener('click', onCardClick));

      // ── Mobile scroll → update dots ──
      const grid = section.querySelector('#bakery-showcase-grid');
      const dots = section.querySelectorAll('.bakery-showcase-dot');
      let _dotScrollRaf = null;
      const _onGridScroll = () => {
        if (_dotScrollRaf) return;
        _dotScrollRaf = requestAnimationFrame(() => {
          _dotScrollRaf = null;
          if (!grid || !dots.length) return;
          const cardWidth = grid.querySelector('.bakery-showcase-card')?.offsetWidth || 175;
          const activeIdx = Math.round(grid.scrollLeft / cardWidth);
          dots.forEach((dot, i) => {
            const isActive = i === activeIdx;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', String(isActive));
          });
        });
      };

      const _onDotClick = (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-dot-index'), 10);
        if (!grid) return;
        const cardWidth = grid.querySelector('.bakery-showcase-card')?.offsetWidth || 175;
        grid.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      };

      if (grid) grid.addEventListener('scroll', _onGridScroll, { passive: true });
      dots.forEach(dot => dot.addEventListener('click', _onDotClick));

      // Refresh ScrollTrigger if GSAP is available
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();

      // Expose cleanup
      _bakeryShowcaseCleanup = () => {
        addBtns.forEach(btn => btn.removeEventListener('click', onAddClick));
        cards.forEach(card => {
          card.removeEventListener('keydown', onCardKeyDown);
          card.removeEventListener('click', onCardClick);
        });
        if (grid) grid.removeEventListener('scroll', _onGridScroll);
        dots.forEach(dot => dot.removeEventListener('click', _onDotClick));
      };
    };

    // Fetch dessert products from the existing store API — no duplicate data
    fetch('/api/store/products')
      .then(r => r.json())
      .then(products => {
        const desserts = products.filter(p =>
          p.category && p.category.split(',').map(c => c.trim()).some(c =>
            c === 'desserts' || c === 'bakery'
          )
        );
        if (desserts.length > 0) {
          _renderSection(desserts);
        }
      })
      .catch(err => console.warn('[+33 Bakery Showcase] Products load failed:', err));
  }

  /* ══════════════════════════════════════════════════
     10. MOST LOVED AT PLUS33 (BEST SELLERS) SHOWCASE
     Dynamically renders 4 top-selling products (one from each key category)
     from the existing /api/store/products endpoint.
     ═════════════════════════════════════════════════ */
  function _initBestSellersShowcase() {
    const section = document.getElementById('home-best-sellers-showcase');
    if (!section) return;

    const _renderSection = (products) => {
      // Find one product for each of the four categories requested:
      // 1. Hot Coffee: category 'hot-coffee' -> Cappuccino preferred
      // 2. Iced Coffee & Cold Drinks: category 'iced-coffee' -> Iced Punch Coco preferred
      // 3. Snacks & Desserts: category 'desserts' -> Croissant preferred
      // 4. Coffee Beans & Retail: category 'retail' -> Sachet de Café preferred
      
      const hotCoffee = products.find(p => p.name === 'Cappuccino') || products.find(p => p.category?.split(',').map(c => c.trim()).includes('hot-coffee'));
      const icedCoffee = products.find(p => p.name === 'Iced Punch Coco') || products.find(p => p.category?.split(',').map(c => c.trim()).includes('iced-coffee'));
      const dessert = products.find(p => p.name === 'Croissant') || products.find(p => p.category?.split(',').map(c => c.trim()).includes('desserts'));
      const retail = products.find(p => p.name === 'Sachet de Café') || products.find(p => p.category?.split(',').map(c => c.trim()).includes('retail')) || products.find(p => p.category?.split(',').map(c => c.trim()).includes('merchandise'));

      const bestSellers = [
        {
          product: hotCoffee,
          badge: 'Best Seller',
          icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
        },
        {
          product: icedCoffee,
          badge: 'Popular',
          icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M17.557 9.111c0-3.667-2.444-6.111-5.5-9.167-.306.917-.764 1.956-1.375 3.056-1.5 2.667-.5 4.333-1 6.333-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5c0-2-1-3.5-1-6.5a6.002 6.002 0 0 1 5.375-5.917c.075 3.667 2.056 6.111 4.937 9.167.04-.326.063-.659.063-1.012z"/></svg>`
        },
        {
          product: dessert,
          badge: 'New',
          icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>`
        },
        {
          product: retail,
          badge: 'Premium',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`
        }
      ].filter(item => item.product != null);

      // visual price mapping in rupees to match the design almost exactly
      const rupeePriceMap = {
        'Cappuccino': 199,
        'Iced Punch Coco': 229,
        'Croissant': 129,
        'Sachet de Café': 249,
        'Almond Croissant': 149,
        'Pain au Chocolat': 149
      };

      const getRupeePriceText = (name, euroPrice) => {
        if (rupeePriceMap[name]) {
          return `₹${rupeePriceMap[name]}`;
        }
        return `₹${Math.round(euroPrice * 30)}`;
      };

      section.innerHTML = `
        <div class="best-sellers-showcase-outer best-sellers-showcase-reveal">
          
          <!-- ── HEADER LAYOUT ── -->
          <div class="best-sellers-showcase-header">
            <div class="best-sellers-showcase-header__left">
              <span class="best-sellers-showcase-eyebrow">BEST SELLERS</span>
              <h2 class="best-sellers-showcase-title">
                Most loved<br>at <span class="best-sellers-showcase-highlight">PLUS33</span>
              </h2>
              <p class="best-sellers-showcase-desc">
                Our customer favourites, crafted daily with passion.
              </p>
            </div>
            <div class="best-sellers-showcase-header__right">
              <a href="/store" class="best-sellers-showcase-viewall-btn" id="best-sellers-viewall" aria-label="View all best sellers in store">
                <span>View all</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- ── 2x2 PRODUCT GRID ── -->
          <div class="best-sellers-showcase-grid" role="list" aria-label="Best selling selections">
            ${bestSellers.map((item, idx) => {
              const p = item.product;
              return `
                <div
                  class="best-sellers-showcase-card best-sellers-showcase-reveal"
                  role="listitem"
                  tabindex="0"
                  aria-label="${p.name}, ${getRupeePriceText(p.name, p.price)}"
                  data-product-id="${p.id}"
                  style="transition-delay: ${idx * 0.1}s;"
                >
                  <div class="best-sellers-showcase-card__badge" aria-hidden="true">
                    ${item.icon}
                    <span>${item.badge}</span>
                  </div>
                  
                  <div class="best-sellers-showcase-card__img-wrap">
                    <img
                      src="${p.imagePath}"
                      alt="${p.name}"
                      class="best-sellers-showcase-card__img"
                      loading="lazy"
                      onerror="this.style.opacity='0'"
                    />
                  </div>

                  <div class="best-sellers-showcase-card__content">
                    <div class="best-sellers-showcase-card__info">
                      <h3 class="best-sellers-showcase-card__title">${p.name}</h3>
                      <span class="best-sellers-showcase-card__price">${getRupeePriceText(p.name, p.price)}</span>
                    </div>
                    <button
                      class="best-sellers-showcase-card__add"
                      aria-label="Add ${p.name} to order"
                      data-product-name="${p.name}"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- ── FEATURES STRIP ── -->
          <div class="best-sellers-showcase-features" aria-label="PLUS33 promises">
            
            <div class="best-sellers-showcase-feature">
              <div class="best-sellers-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="6" cy="18" r="2.5"></circle>
                  <circle cx="18" cy="18" r="2.5"></circle>
                  <path d="M6 15.5H8.5L12 9H15.5l2 3.5h1"></path>
                  <path d="M14.5 9l-1-4h1.5"></path>
                  <rect x="5" y="8" width="5" height="5" rx="1"></rect>
                  <path d="M6 18h12"></path>
                </svg>
              </div>
              <div class="best-sellers-showcase-feature__text">
                <h4 class="best-sellers-showcase-feature__title">Fast Delivery</h4>
                <p class="best-sellers-showcase-feature__desc">30 mins delivery</p>
              </div>
            </div>

            <div class="best-sellers-showcase-feature__divider" aria-hidden="true"></div>

            <div class="best-sellers-showcase-feature">
              <div class="best-sellers-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="9" r="5.5"></circle>
                  <path d="M9 13.5L7.5 21l4.5-2 4.5 2-1.5-7.5"></path>
                  <path d="M12 6.5l.8 1.6 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.2z" fill="currentColor"></path>
                </svg>
              </div>
              <div class="best-sellers-showcase-feature__text">
                <h4 class="best-sellers-showcase-feature__title">Top Quality</h4>
                <p class="best-sellers-showcase-feature__desc">Premium beans always</p>
              </div>
            </div>

            <div class="best-sellers-showcase-feature__divider" aria-hidden="true"></div>

            <div class="best-sellers-showcase-feature">
              <div class="best-sellers-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 22c0-8.3 6.7-15 15-15h5v5c0 8.3-6.7 15-15 15H2z"></path>
                  <path d="M2 22L17 7"></path>
                </svg>
              </div>
              <div class="best-sellers-showcase-feature__text">
                <h4 class="best-sellers-showcase-feature__title">Freshly Made</h4>
                <p class="best-sellers-showcase-feature__desc">Prepared to perfection</p>
              </div>
            </div>

            <div class="best-sellers-showcase-feature__divider" aria-hidden="true"></div>

            <div class="best-sellers-showcase-feature">
              <div class="best-sellers-showcase-feature__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                  <rect x="6" y="14" width="4" height="2" rx="0.5"></rect>
                  <circle cx="18" cy="14.5" r="1.5"></circle>
                  <path d="M18 13v-1.5a1 1 0 0 0-2 0V13"></path>
                </svg>
              </div>
              <div class="best-sellers-showcase-feature__text">
                <h4 class="best-sellers-showcase-feature__title">Secure Payments</h4>
                <p class="best-sellers-showcase-feature__desc">100% safe & protected</p>
              </div>
            </div>

          </div>

        </div>
      `;

      // ── Scroll-reveal observer ──
      const outerWrap = section.querySelector('.best-sellers-showcase-outer');
      const cardElements = section.querySelectorAll('.best-sellers-showcase-card');
      if (_revealObserver) {
        _revealObserver.observe(outerWrap);
        cardElements.forEach(el => _revealObserver.observe(el));
      } else {
        outerWrap.classList.add('is-visible');
        cardElements.forEach(el => el.classList.add('is-visible'));
      }

      // ── Keyboard accessibility for cards ──
      const cards = section.querySelectorAll('.best-sellers-showcase-card');
      const onCardKeyDown = (e) => {
        if (e.target.closest('.best-sellers-showcase-card__add')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = e.currentTarget.getAttribute('data-product-id');
          if (id) {
            if (window.plus33Router && typeof window.plus33Router.navigate === 'function') {
              window.plus33Router.navigate(`/product/${id}`);
            } else {
              window.location.href = `/product/${id}`;
            }
          }
        }
      };
      cards.forEach(card => card.addEventListener('keydown', onCardKeyDown));

      // ── Click to navigate to details (excluding add button) ──
      const onCardClick = (e) => {
        if (e.target.closest('.best-sellers-showcase-card__add')) return;
        const id = e.currentTarget.getAttribute('data-product-id');
        if (id) {
          if (window.plus33Router && typeof window.plus33Router.navigate === 'function') {
            window.plus33Router.navigate(`/product/${id}`);
          } else {
            window.location.href = `/product/${id}`;
          }
        }
      };
      cards.forEach(card => card.addEventListener('click', onCardClick));

      // ── Visual button feedback / optional toast notification ──
      const addBtns = section.querySelectorAll('.best-sellers-showcase-card__add');
      const onAddClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = e.currentTarget.getAttribute('data-product-name');
        
        // Show Toast Notification (reusing existing showToast or simple fallback)
        if (typeof showToast === 'function') {
          showToast(`${name} added`);
        }

        // Add a scale/press micro-animation to the button
        const btn = e.currentTarget;
        btn.style.transform = 'scale(0.85)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 150);
      };
      addBtns.forEach(btn => btn.addEventListener('click', onAddClick));

      // ── Expose cleanup ──
      _bestSellersShowcaseCleanup = () => {
        cards.forEach(card => {
          card.removeEventListener('keydown', onCardKeyDown);
          card.removeEventListener('click', onCardClick);
        });
        addBtns.forEach(btn => btn.removeEventListener('click', onAddClick));
      };

      // Refresh ScrollTrigger if GSAP is loaded
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    fetch('/api/store/products')
      .then(res => res.json())
      .then(products => {
        if (!document.getElementById('home-best-sellers-showcase')) return;
        if (products && products.length > 0) {
          _renderSection(products);
        }
      })
      .catch(err => console.warn('[+33 Best Sellers] Products fetch failed:', err));
  }

  /* ══════════════════════════════════════════════════
     8. SIGNATURE COLLECTION SHOWCASE
     ═══════════════════════════════════════════════════ */
  function _initSignatureCollection() {
    const section = document.getElementById('home-signature-collection');
    if (!section) return;

    const signatureProducts = [
      {
        id: 3,
        title: "Paris Vanilla Latte",
        price: "₹229",
        image: "/local/assets/products/signature/paris-vanilla-latte.jpg",
        webpImage: "/local/assets/products/signature/paris-vanilla-latte.jpg",
        description: "Smooth vanilla. Bold espresso. A timeless classic.",
        badge: `<svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="22" height="22"><path d="M12 12c2-3 4-4 4-4s-1 4-4 4c-3 0-4-1-4-1s4-1 4 1zm0 0c-2-3-4-4-4-4s1 4 4 4c3 0 4-1 4-1s-4-1-4 1z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.5" fill="#b18b56"/><path d="M12 14c-1 3-3 6-7 8M12 14c1 3 3 6 7 8" stroke-linecap="round"/></svg>`
      },
      {
        id: 2,
        title: "Louvre Mocha",
        price: "₹249",
        image: "/local/assets/products/signature/louvre-mocha.jpg",
        webpImage: "/local/assets/products/signature/louvre-mocha.jpg",
        description: "Rich chocolate. Bold espresso. Pure indulgence.",
        badge: `<svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="22" height="22"><path d="M6 3h12v7H6V3zM12 3v7M6 6.5h12" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10l2 1 2-1 2 1 2-1 2 1 2-1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V10z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13l6 6M6 15l5 5M13 13l3 3" stroke-linecap="round"/></svg>`
      },
      {
        id: 10,
        title: "Champs Élysées Cold Brew",
        price: "₹229",
        image: "/local/assets/products/signature/champs-elysees-cold-brew.jpg",
        webpImage: "/local/assets/products/signature/champs-elysees-cold-brew.jpg",
        description: "Smooth. Refreshing. 24-hour cold brewed perfection.",
        badge: `<svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="22" height="22"><path d="M6 3h12l-2 17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L6 3z" stroke-linecap="round" stroke-linejoin="round"/><line x1="14" y1="3" x2="16" y2="1" stroke-linecap="round"/><rect x="8" y="10" width="3" height="3" rx="0.5"/><rect x="12" y="14" width="3" height="3" rx="0.5"/><line x1="6.5" y1="7" x2="17.5" y2="7" stroke-linecap="round"/></svg>`
      },
      {
        id: 5,
        title: "Montmartre Caramel Latte",
        price: "₹239",
        image: "/local/assets/products/signature/montmartre-caramel-latte.png",
        webpImage: "/local/assets/products/signature/montmartre-caramel-latte.png",
        description: "Sea salt caramel. Silky smooth. Perfectly balanced.",
        badge: `<svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="22" height="22"><circle cx="12" cy="12" r="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 12L2 9v6l5-3zM17 12l5-3v6l-5-3z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9.5a2.5 2.5 0 0 1 2.5 2.5" stroke-linecap="round"/><path d="M12 14.5a2.5 2.5 0 0 1-2.5-2.5" stroke-linecap="round"/></svg>`
      },
      {
        id: 7,
        title: "Rose Pistachio Latte",
        price: "₹249",
        image: "/local/assets/products/signature/rose-pistachio-latte.jpg",
        webpImage: "/local/assets/products/signature/rose-pistachio-latte.jpg",
        description: "Delicate rose. Nutty pistachio. Elegance in every sip.",
        badge: `<svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="22" height="22"><path d="M12 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke-linecap="round"/><path d="M12 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke-linecap="round"/><path d="M7 13.5c-2 2-1 5.5 3 6.5 2-.8 2-2.5 1-4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 13.5c2 2 1 5.5-3 6.5-2-.8-2-2.5-1-4.2" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="12" cy="16" rx="2" ry="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      },
      {
        id: 4,
        title: "Biscoff Cream Latte",
        price: "₹239",
        image: "/local/assets/products/signature/biscoff-cream-latte.webp",
        webpImage: "/local/assets/products/signature/biscoff-cream-latte.webp",
        description: "Biscoff crunch. Creamy delight. Irresistibly good.",
        badge: `<svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="22" height="22"><rect x="4" y="6" width="16" height="12" rx="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke-linecap="round" stroke-dasharray="1 3"/><line x1="8" y1="12" x2="16" y2="12" stroke-linecap="round" stroke-dasharray="1 3"/><line x1="8" y1="15" x2="16" y2="15" stroke-linecap="round" stroke-dasharray="1 3"/><path d="M4 8c-1 0-1 2 0 2m0 2c-1 0-1 2 0 2M20 8c1 0 1 2 0 2m0 2c1 0 1 2 0 2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      }
    ];

    section.innerHTML = `
      <div class="signature-collection-grain"></div>
      <div class="signature-collection-container">
        
        <!-- Intro Wrapper -->
        <div class="signature-collection-intro">
          <div class="signature-collection-intro__left">
            <span class="signature-collection-eyebrow">SIGNATURE COLLECTION</span>
            <h2 class="signature-collection-headline">Uniquely ours.<br>Unforgettable for <span class="signature-collection-highlight">you.</span></h2>
            
            <!-- Luxury divider ornament (visible on mobile, hidden on desktop) -->
            <div class="signature-collection-divider-ornament">
              <div class="sig-line"></div>
              <svg class="sig-ornament" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2c-.3 2.5-1.5 4.5-4.5 5.5 3 1 4.2 3 4.5 5.5.3-2.5 1.5-4.5 4.5-5.5-3-1-4.2-3-4.5-5.5z"/>
              </svg>
              <div class="sig-line"></div>
            </div>

            <p class="signature-collection-desc">Thoughtfully crafted signature drinks,<br>inspired by Paris and made for every moment.</p>
          </div>
          <div class="signature-collection-intro__right">
            <a href="/store" class="signature-collection-cta-btn">
              <span>View full collection</span>
              <span class="signature-collection-cta-arrow">→</span>
            </a>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="signature-collection-grid">
          ${signatureProducts.map((p, idx) => `
            <a href="/product/${p.id}" class="signature-collection-card home-reveal" style="--reveal-delay: ${idx * 0.1}s;">
              <div class="signature-collection-img-wrap signature-card-skeleton">
                <picture class="signature-product-pic" style="opacity: 0; transition: opacity 0.5s ease;">
                  ${p.webpImage && p.webpImage.endsWith('.webp') ? `<source srcset="${p.webpImage}" type="image/webp">` : ''}
                  <img src="${p.image}" alt="${p.title}" class="signature-collection-img" loading="lazy" onload="this.closest('.signature-collection-img-wrap').classList.remove('signature-card-skeleton'); this.parentElement.style.opacity='1';">
                </picture>
                <div class="signature-collection-badge">
                  ${p.badge}
                </div>
                <div class="signature-collection-overlay-gradient"></div>
              </div>
              <div class="signature-collection-info">
                <h3 class="signature-collection-title">${p.title}</h3>
                <div class="signature-collection-title-divider"></div>
                <p class="signature-collection-card-desc">${p.description}</p>
                <div class="signature-collection-bottom">
                  <span class="signature-collection-price">${p.price}</span>
                  <button class="signature-collection-add" aria-label="Add ${p.title} to selection">+</button>
                </div>
              </div>
            </a>
          `).join('')}
        </div>

        <!-- Bottom Features Strip -->
        <div class="signature-collection-features">
          <!-- Feature 1 -->
          <div class="signature-collection-feature-item">
            <div class="signature-collection-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="24" height="24">
                <ellipse cx="12" cy="12" rx="5" ry="9" transform="rotate(-30, 12, 12)"/>
                <path d="M9.5 16.5c1-1 3-1 4.5.5"/>
              </svg>
            </div>
            <h4 class="signature-collection-feature-title">Premium Ingredients</h4>
            <p class="signature-collection-feature-desc">Sourced from the finest farms</p>
          </div>
          <!-- Feature 2 -->
          <div class="signature-collection-feature-item">
            <div class="signature-collection-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="24" height="24">
                <path d="M6 14h11l1-7H7l-1 7zm11-4h3a2 2 0 012 2v1a2 2 0 01-2 2h-3M6 14v4a2 2 0 002 2h8a2 2 0 002-2v-4M9 3v3M12 2v4M15 3v3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4 class="signature-collection-feature-title">Expertly Crafted</h4>
            <p class="signature-collection-feature-desc">Every drink made with precision</p>
          </div>
          <!-- Feature 3 -->
          <div class="signature-collection-feature-item">
            <div class="signature-collection-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="24" height="24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4 class="signature-collection-feature-title">Made with Passion</h4>
            <p class="signature-collection-feature-desc">Crafted by baristas who love what they do</p>
          </div>
          <!-- Feature 4 -->
          <div class="signature-collection-feature-item">
            <div class="signature-collection-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#b18b56" stroke-width="1.5" width="24" height="24">
                <path d="M12 3l1.91 4.38L18.5 9.5l-4.59 2.12L12 16l-1.91-4.38L5.5 9.5l4.59-2.12L12 3zm6 13l.96 2.19L21.25 19.25l-2.29 1.06L18 22.5l-.96-2.19-2.29-1.06 2.29-1.06L18 16z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4 class="signature-collection-feature-title">Uniquely PLUS33</h4>
            <p class="signature-collection-feature-desc">Signature recipes you won't find anywhere else</p>
          </div>
        </div>

      </div>
    `;

    // ── Intersection Observer re-init for newly loaded items ──
    const newReveals = section.querySelectorAll('.home-reveal');
    if (_revealObserver) {
      newReveals.forEach(el => _revealObserver.observe(el));
    }

    // ── Click Handlers for Add Buttons ──
    const addButtons = section.querySelectorAll('.signature-collection-add');
    const onAddClick = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent details page navigation
      if (window.innerWidth <= 768) {
        if (window.plus33Router) {
          window.plus33Router.navigate('/store');
        } else {
          window.location.href = '/store';
        }
        return;
      }
      const card = e.target.closest('.signature-collection-card');
      const title = card ? card.querySelector('.signature-collection-title').textContent : 'Signature drink';
      showToast(`${title} added to selection`);
    };

    addButtons.forEach(btn => btn.addEventListener('click', onAddClick));

    // Refresh GSAP ScrollTrigger to recalculate cached offsets for the showcase card stack height
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }

    // Expose cleanup
    _signatureCollectionCleanup = () => {
      addButtons.forEach(btn => btn.removeEventListener('click', onAddClick));
    };
  }

  function showToast(message) {
    let container = document.getElementById('signature-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'signature-toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'signature-toast-notification';
    toast.innerHTML = `
      <div class="signature-toast-content">
        <svg class="signature-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="signature-toast-msg">${message}</span>
      </div>
    `;
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.classList.add('is-leaving');
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, 3000);
  }

  /* ══════════════════════════════════════════════════
     11. PLUS33 REWARDS INTERACTION SYSTEM
     ═══════════════════════════════════════════════════ */
  function _initRewardsSystem() {
    const triggers = document.querySelectorAll('.plus33-rewards-trigger');
    if (!triggers.length) return null;

    const onTriggerClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      _showRewardsToast("This feature is not available now");
    };

    triggers.forEach(el => el.addEventListener('click', onTriggerClick));

    return () => {
      triggers.forEach(el => el.removeEventListener('click', onTriggerClick));
    };
  }

  function _showRewardsToast(message) {
    let container = document.getElementById('rewards-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'rewards-toast-container';
      container.className = 'rewards-toast-container';
      document.body.appendChild(container);
    }
    
    // Clear any previous toast in container to avoid piling up
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'rewards-toast';
    toast.innerHTML = `
      <div class="rewards-toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="18" height="18">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span class="rewards-toast-msg">${message}</span>
    `;
    container.appendChild(toast);
    
    // Trigger CSS animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });
    
    // Dismiss after 3s
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, 3000);
  }

  /* ──────────────────────────────────────────────────
     12. PLUS33 APP INTERACTION SYSTEM
     ────────────────────────────────────────────────── */
  function _initAppSystem() {
    const triggers = document.querySelectorAll('.plus33-app-trigger');
    if (!triggers.length) return null;

    const onTriggerClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      _showRewardsToast("The app is coming soon");
    };

    triggers.forEach(el => el.addEventListener('click', onTriggerClick));

    return () => {
      triggers.forEach(el => el.removeEventListener('click', onTriggerClick));
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initHome };
  } else {
    window.initHome = initHome;
  }

}());
