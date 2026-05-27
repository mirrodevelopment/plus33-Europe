/**
 * FILE: home.js
 * PAGE: Homepage
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Homepage controller — manages all interactive
 * behaviors isolated to the PLUS33 homepage.
 *
 * RESPONSIBILITIES:
 * - Scroll-reveal animations via Intersection Observer
 * - Parallax depth effect on hero background image
 * - Hero section scroll indicator progress
 * - Marquee pause on hover
 * - Luxury page loader fade-out on first visit
 *
 * ARCHITECTURE NOTES:
 * - Called via initHome() exported function.
 * - Expects the home page DOM to be already mounted in #app.
 * - Cleans up all observers and listeners on destroy().
 * - Does NOT reference or modify navbar or footer DOM.
 *
 * DEPENDENCIES:
 * - home.css   (visual styles)
 * - home.html  (markup)
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────
     STATE & REFS
  ──────────────────────────────────────────────────── */
  let _revealObserver   = null;
  let _rafId            = null;
  let _ticking          = false;
  let _scrollY          = 0;
  let _heroImg          = null;

  /* ──────────────────────────────────────────────────
     CONSTANTS
  ──────────────────────────────────────────────────── */
  const PARALLAX_FACTOR   = 0.25;   // fraction of scroll offset for hero parallax
  const REVEAL_THRESHOLD  = 0.15;   // 15% of element must be visible to trigger


  /* ══════════════════════════════════════════════════
     PUBLIC API — initHome
  ═══════════════════════════════════════════════════ */
  /**
   * Initializes all homepage interactive behaviors.
   * Called once after home.html is mounted into #app.
   * @returns {{ destroy: function }} cleanup handle
   */
  function initHome() {
    _heroImg      = document.querySelector('.home-hero__bg-img');

    _initScrollReveal();
    _initParallax();
    _initScrollIndicator();

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
            /* Unobserve after reveal — one-shot animation */
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
      /* Move hero image up as we scroll down — creates depth illusion */
      const offset = _scrollY * PARALLAX_FACTOR;
      _heroImg.style.transform = `scale(1.04) translateY(${offset}px)`;

      /* Dynamic cinematic fade-out and slide-up transition of text & video */
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

    /* Store handler ref for cleanup */
    _heroImg._scrollHandler = _onScroll;
  }





  /* ══════════════════════════════════════════════════
     4. SCROLL INDICATOR — progress animation reset
  ═══════════════════════════════════════════════════ */
  function _initScrollIndicator() {
    const scrollEl = document.querySelector('.home-hero__scroll');
    if (!scrollEl) return;

    const _onScrollClick = (e) => {
      e.preventDefault();
      const target = document.getElementById('home-craft');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    scrollEl.addEventListener('click', _onScrollClick);
    scrollEl._clickHandler = _onScrollClick;

    /* Hide scroll indicator once hero is scrolled past */
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

    /* Store for cleanup */
    scrollEl._intersectionObs = obs;
  }


  /* ══════════════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════════════ */

  /**
   * Checks user's reduced-motion preference.
   * @returns {boolean}
   */
  function _prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }


  /* ══════════════════════════════════════════════════
     DESTROY — cleanup for SPA route changes
  ═══════════════════════════════════════════════════ */
  function destroy() {
    /* Disconnect Intersection Observer */
    if (_revealObserver) {
      _revealObserver.disconnect();
      _revealObserver = null;
    }

    /* Cancel pending rAF */
    if (_rafId !== null) {
      cancelAnimationFrame(_rafId);
      _rafId = null;
    }

    /* Remove scroll listener & reset styles */
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

    /* Disconnect scroll indicator observer & listener */
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

    /* Reset refs */
    _heroImg      = null;
    _ticking      = false;
  }


  /* ══════════════════════════════════════════════════
     EXPORT
  ═══════════════════════════════════════════════════ */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initHome };
  } else {
    window.initHome = initHome;
  }

}());
