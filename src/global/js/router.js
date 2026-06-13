/**
 * FILE: router.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Lightweight client-side SPA router for PLUS33.
 * Fetches HTML page fragments and swaps them into
 * the #app container without full-page reloads.
 *
 * RESPONSIBILITIES:
 * - Maps URL paths to HTML fragment files
 * - Fetches and injects page content into #app
 * - Manages browser history (pushState / popstate)
 * - Marks active nav links
 * - Loads and unloads page-specific CSS
 * - Calls init/destroy functions for page-specific JS
 * - Supports dynamic routing (e.g. /product/:id)
 *
 * ARCHITECTURE NOTES:
 * - The home route ('/') is baked into index.html for
 *   instant first paint — router recognises this and
 *   skips the fetch on the initial load.
 * - All other pages are fetched as HTML fragments.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     ROUTE MAP
     Maps URL path → { fragment, css, init, destroy }
  ────────────────────────────────────────────────── */
  const ROUTES = {
    '/': {
      fragment: null,                           // baked into index.html — no fetch
      css:      '/local/css/home.css?v=8.6',
      title:    '+33 Paris — Parisian Specialty Coffee House',
      init:     () => { window._homeController = window.initHome?.(); },
      destroy:  () => window._homeController?.destroy?.()
    },
    '/franchise': {
      fragment: '/global/franchise/html/franchise.html',
      css:      '/global/franchise/css/franchise.css',
      title:    'Franchise — +33 Paris',
      init:     async () => {
        const mod = await import('/global/franchise/js/franchise.js');
        window._franchiseCleanup = mod.mountFranchisePage();
      },
      destroy:  () => {
        if (typeof window._franchiseCleanup === 'function') {
          window._franchiseCleanup();
          window._franchiseCleanup = null;
        }
      }
    },
    '/find-us': {
      fragment: '/global/find-us/html/find-us.html',
      css:      '/global/find-us/css/find-us.css',
      title:    'Find Us — +33 Paris',
      init:     async () => {
        const mod = await import('/global/find-us/js/find-us.js');
        window._findUsCleanup = mod.mountFindUsPage();
      },
      destroy:  () => {
        if (typeof window._findUsCleanup === 'function') {
          window._findUsCleanup();
          window._findUsCleanup = null;
        }
      }
    },
    '/journal': {
      fragment: '/global/journal/html/journal.html',
      css:      '/global/journal/css/journal.css',
      title:    'Journal — +33 Paris',
      init:     async () => {
        const mod = await import('/global/journal/js/journal.js');
        window._journalCleanup = mod.mountJournalPage();
      },
      destroy:  () => {
        if (typeof window._journalCleanup === 'function') {
          window._journalCleanup();
          window._journalCleanup = null;
        }
      }
    },
    '/store': {
      fragment: '/local/html/store.html?v=2.4',
      css:      '/local/css/store.css?v=2.4',
      title:    'Store — +33 Paris',
      init:     async () => {
        const mod = await import('/local/js/store.js?v=2.4');
        window._storeCleanup = mod.mountStorePage();
      },
      destroy:  () => {
        if (typeof window._storeCleanup === 'function') {
          window._storeCleanup();
          window._storeCleanup = null;
        }
      }
    },
    '/about': {
      fragment: '/global/about/html/about.html',
      css:      '/global/about/css/about.css',
      title:    'About — +33 Paris',
      init:     async () => {
        const mod = await import('/global/about/js/about.js');
        window._aboutCleanup = mod.mountAboutPage();
      },
      destroy:  () => {
        if (typeof window._aboutCleanup === 'function') {
          window._aboutCleanup();
          window._aboutCleanup = null;
        }
      }
    },
    '/rewards': {
      fragment: '/global/rewards/html/rewards.html',
      css:      '/global/rewards/css/rewards.css',
      title:    'Rewards — +33 Paris',
      init:     async () => {
        const mod = await import('/global/rewards/js/rewards.js');
        window._rewardsCleanup = mod.mountRewardsPage();
      },
      destroy:  () => {
        if (typeof window._rewardsCleanup === 'function') {
          window._rewardsCleanup();
          window._rewardsCleanup = null;
        }
      }
    },
    '/product/:id': {
      fragment: '/local/html/product-details.html',
      css:      '/local/css/product-details.css',
      title:    'Reserve Details — +33 Paris',
      init:     async (params) => {
        const mod = await import('/local/js/product-details.js?v=1.1');
        window._productCleanup = mod.mountProductDetailsPage(params.id);
      },
      destroy:  () => {
        if (typeof window._productCleanup === 'function') {
          window._productCleanup();
          window._productCleanup = null;
        }
      }
    }
  };

  /* ─────────────────────────────────────────────────
     STATE
  ────────────────────────────────────────────────── */
  let _currentPath    = null;
  let _currentDestroy = null;
  let _loadedCss      = new Set();
  const _appEl        = document.getElementById('app');

  /* ─────────────────────────────────────────────────
     ROUTE MATCHING ENGINE
  ────────────────────────────────────────────────── */
  function matchRoute(path) {
    // Strip query string and hash
    const cleanPath = path.split('?')[0].split('#')[0];
    
    // 1. Exact match
    if (ROUTES[cleanPath]) {
      return { route: ROUTES[cleanPath], params: {} };
    }

    // 2. Dynamic segments match (e.g., /product/:id)
    for (const routePath in ROUTES) {
      if (routePath.includes(':')) {
        const routeParts = routePath.split('/');
        const pathParts = cleanPath.split('/');
        if (routeParts.length === pathParts.length) {
          const params = {};
          let matches = true;
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              const paramName = routeParts[i].slice(1);
              params[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              matches = false;
              break;
            }
          }
          if (matches) {
            return { route: ROUTES[routePath], params };
          }
        }
      }
    }
    return null;
  }

  /* ─────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────── */
  function init() {
    /* Handle browser back/forward */
    window.addEventListener('popstate', () => navigate(location.pathname, false));

    /* Intercept all internal link clicks */
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');

      /* Only handle internal relative routes */
      if (!href || href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto') || href.startsWith('tel')) return;

      /* Only handle known routes */
      if (!matchRoute(href)) return;

      e.preventDefault();
      navigate(href);
    });

    /* Boot the current route (homepage is already rendered) */
    const path = location.pathname;
    
    const matched = matchRoute(path) || { route: ROUTES['/'], params: {} };
    _ensureCss(matched.route);
    _markActiveLinks(path);

    /* Init home page JS (content already in DOM) */
    if (path === '/' || path === '') {
      _currentPath = path;
      const route = ROUTES['/'];
      _currentDestroy = route.destroy;
      requestAnimationFrame(() => route.init?.());
    } else {
      /* On deep-link, fetch the right page */
      navigate(path, false);
    }
  }

  /* ─────────────────────────────────────────────────
     NAVIGATE
  ────────────────────────────────────────────────── */
  /**
   * Navigates to a given path.
   * @param {string}  path       - The URL path to navigate to
   * @param {boolean} pushState  - Whether to push to browser history
   */
  async function navigate(path, pushState = true) {
    /* Normalize path */
    path = path || '/';
    if (path === _currentPath) return;

    const matched = matchRoute(path) || { route: ROUTES['/'], params: {} };
    const route = matched.route;
    const params = matched.params;

    /* ── 1. Destroy current page ── */
    try { _currentDestroy?.(); } catch (e) { /* silent */ }
    _currentDestroy = null;

    /* ── 2. Transition out ── */
    _appEl.classList.add('page-transitioning');
    await _wait(280);

    /* ── 3. Push history state ── */
    if (pushState) {
      history.pushState({ path }, '', path);
    }

    /* ── 4. Fetch & inject fragment (or use baked home) ── */
    if (!route.fragment) {
      /* Home: restore baked content if navigating back */
      _appEl.innerHTML = _homeSnapshot;
    } else {
      try {
        const res = await fetch(route.fragment);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        _appEl.innerHTML = await res.text();
      } catch (err) {
        _appEl.innerHTML = _errorTemplate(path);
      }
    }

    /* ── 5. Load page CSS ── */
    _ensureCss(route);

    /* ── 6. Update document title ── */
    document.title = route.title || '+33 Paris';

    /* ── 7. Mark active nav links ── */
    _markActiveLinks(path);

    /* ── 8. Scroll to top ── */
    window.scrollTo({ top: 0, behavior: 'instant' });

    /* ── 9. Transition in ── */
    _appEl.classList.remove('page-transitioning');
    _appEl.classList.add('page-entering');
    setTimeout(() => _appEl.classList.remove('page-entering'), 500);

    /* ── 10. Init page JS ── */
    _currentPath    = path;
    _currentDestroy = route.destroy;
    requestAnimationFrame(() => route.init?.(params));
  }

  /* ─────────────────────────────────────────────────
     CSS LOADER — inject <link> once per stylesheet
  ────────────────────────────────────────────────── */
  function _ensureCss(route) {
    if (!route?.css || _loadedCss.has(route.css)) return;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = route.css;
    document.head.appendChild(link);
    _loadedCss.add(route.css);
  }

  /* ─────────────────────────────────────────────────
     ACTIVE LINK MARKING
  ────────────────────────────────────────────────── */
  function _markActiveLinks(path) {
    document.querySelectorAll('.plus33-nav__link, .plus33-nav__panel-link').forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === path);
    });
  }

  /* ─────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────── */
  function _wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function _errorTemplate(path) {
    return `
      <div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;color:#F5F1EA;font-family:'Manrope',sans-serif;">
        <p style="font-size:0.6rem;letter-spacing:0.3em;text-transform:uppercase;color:#C8A46B;margin-bottom:16px;">Navigation</p>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;margin-bottom:16px;">Page not found</h1>
        <p style="opacity:0.5;font-size:0.9rem;margin-bottom:40px;">${path} could not be loaded.</p>
        <a href="/" style="font-size:0.62rem;letter-spacing:0.24em;text-transform:uppercase;color:#B87333;border-bottom:1px solid rgba(184,115,51,0.3);padding-bottom:4px;">Return Home</a>
      </div>`;
  }

  /* Snapshot the baked home HTML so we can restore it on back-navigation */
  const _homeSnapshot = _appEl?.innerHTML || '';

  /* ─────────────────────────────────────────────────
     BOOT
  ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose for debugging */
  window.plus33Router = { navigate };

}());
