/**
 * FILE: rewards.js
 * PAGE: Rewards Showcase Page
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Premium interactive script for the PLUS33 Rewards page.
 * Coordinates inline status medal drawer expansions, smooth scrolls,
 * custom luxury toasts, and page navigation themes.
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the rewards page and registers all interactive listeners.
 * @returns {Function} Clean up function to be called on route destroy.
 */
export function mountRewardsPage() {
  document.body.classList.add('rewards-theme-active');

  const pageRoot = document.getElementById('rewards-page-root');
  if (!pageRoot) return () => {};

  const cleanups = [];

  // ── 1. FAQ Accordion Toggle System ──
  const faqCards = pageRoot.querySelectorAll('.faq-card');
  faqCards.forEach((card) => {
    const header = card.querySelector('.faq-card__header');
    const content = card.querySelector('.faq-card__content');

    if (!header || !content) return;

    const onHeaderClick = (e) => {
      e.preventDefault();
      const isOpen = card.classList.contains('is-open');

      faqCards.forEach((otherCard) => {
        if (otherCard !== card && otherCard.classList.contains('is-open')) {
          const otherContent = otherCard.querySelector('.faq-card__content');
          const otherHeader = otherCard.querySelector('.faq-card__header');
          otherCard.classList.remove('is-open');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        card.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        card.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    };

    header.addEventListener('click', onHeaderClick);
    cleanups.push(() => header.removeEventListener('click', onHeaderClick));
  });

  // ── 2. Smooth Scroll Triggers ──
  const scrollTriggers = pageRoot.querySelectorAll('.rewards-scroll-trigger');
  scrollTriggers.forEach((trigger) => {
    const targetSelector = trigger.getAttribute('data-target');
    if (!targetSelector) return;

    const onTriggerClick = (e) => {
      e.preventDefault();
      const targetEl = pageRoot.querySelector(targetSelector);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    trigger.addEventListener('click', onTriggerClick);
    cleanups.push(() => trigger.removeEventListener('click', onTriggerClick));
  });

  // ── 3. Toast Trigger System ──
  const toastTriggers = pageRoot.querySelectorAll('.rewards-toast-trigger');
  toastTriggers.forEach((trigger) => {
    const onTriggerClick = (e) => {
      e.preventDefault();
      showPremiumToast('Rewards system coming soon');
    };

    trigger.addEventListener('click', onTriggerClick);
    cleanups.push(() => trigger.removeEventListener('click', onTriggerClick));
  });

  // ── 4. Clickable Horizontal Status Tiers Grid ──
  const USER_POINTS = 1200; // Mock current points
  const TIER_THRESHOLDS = {
    bronze: 0,
    silver: 3000,
    gold: 8000,
    platinum: 15000
  };

  const TIER_DETAILS = {
    bronze: {
      title: "Bronze",
      desc: "Welcome perks and entry-level luxury benefits.",
      benefits: [
        {
          title: "Welcome perks",
          desc: "Enjoy exclusive welcome treats and offers.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>`
        },
        {
          title: "Birthday rewards",
          desc: "A special treat, just for you.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v2M7 14c0-2.5 2-4 5-4s5 1.5 5 4H7z"></path>
            <path d="M8 14l1.5 7h5l1.5-7"></path>
            <path d="M10 14l-.5 7M12 14v7M14 14l.5 7"></path>
          </svg>`
        },
        {
          title: "Early offers",
          desc: "Be the first to know about select promotions.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
            <path d="M9.5 14.5l5-5"></path>
            <circle cx="10.5" cy="10.5" r="0.5" fill="currentColor"></circle>
            <circle cx="13.5" cy="13.5" r="0.5" fill="currentColor"></circle>
          </svg>`
        },
        {
          title: "Member support",
          desc: "Dedicated support for a seamless experience.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>`
        }
      ]
    },
    silver: {
      title: "Silver",
      desc: "Refined lounge comfort and sizing upgrades.",
      benefits: [
        {
          title: "Points multiplier",
          desc: "Earn 1.2x points on every order.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>`
        },
        {
          title: "Size upgrades",
          desc: "Complimentary size upgrades on select drinks.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <polyline points="7 14 10 11 13 14"></polyline>
            <line x1="10" y1="11" x2="10" y2="17"></line>
          </svg>`
        },
        {
          title: "Priority helpline",
          desc: "Priority helpline for faster assistance.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>`
        },
        {
          title: "Birthday rewards",
          desc: "Elevated birthday treats and custom offers.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <polygon points="12 12 13 14 15.5 14.5 13.5 16 14 18.5 12 17 10 18.5 10.5 16 8.5 14.5 11 14"></polygon>
          </svg>`
        }
      ]
    },
    gold: {
      title: "Gold",
      desc: "Elite Atelier privileges and curated patisserie.",
      benefits: [
        {
          title: "Elite multiplier",
          desc: "Earn 1.5x points on all boutique orders.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
            <polyline points="23 11 18 16 13.5 11.5 6 19"></polyline>
          </svg>`
        },
        {
          title: "Free patisserie",
          desc: "One complimentary dessert every calendar month.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 14c2.5-3 5.5-5 9-5s6.5 2 9 5c-1-2.5-3.5-4-6.5-4h-5c-3 0-5.5 1.5-6.5 4z"></path>
            <path d="M6.5 11.5C8 9.5 10 8.5 12 8.5s4 1 5.5 3"></path>
            <path d="M2 16c4-1 6-2 10-2s6 1 10 2c-3.5-3-7.5-4.5-10-4.5S5.5 13 2 16z"></path>
          </svg>`
        },
        {
          title: "Priority queue",
          desc: "Skip the wait with priority ordering.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>`
        },
        {
          title: "Private events",
          desc: "Exclusive invites to boutique social salons.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M2 12a3 3 0 0 1 3-3V5h14v4a3 3 0 0 1 0 6v4H5v-4a3 3 0 0 1-3-3z"></path>
          </svg>`
        }
      ]
    },
    platinum: {
      title: "Platinum",
      desc: "Ultimate Private Reserve circle and rare micro-lots.",
      benefits: [
        {
          title: "Reserve multiplier",
          desc: "Earn 2.0x points on all purchases.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path>
            <path d="M3 20h18"></path>
          </svg>`
        },
        {
          title: "Private concierge",
          desc: "24/7 dedicated boutique reservation concierge.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l2.5-2.5"></path>
          </svg>`
        },
        {
          title: "Master tastings",
          desc: "Complimentary salon tastings with master roasters.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="12" cy="12" rx="5" ry="9" transform="rotate(-45 12 12)"></ellipse>
            <path d="M8.5 15.5c2-1 3.5-3.5 5-7"></path>
          </svg>`
        },
        {
          title: "Rare reserves",
          desc: "Priority access to ultra-rare micro-lot coffees.",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 3h12l4 6-10 12L2 9z"></path>
            <path d="M11 3l-4 6 5 12"></path>
            <path d="M13 3l4 6-5 12"></path>
            <path d="M2 9h20"></path>
          </svg>`
        }
      ]
    }
  };

  // 1. Calculate active user tier
  let activeTier = 'bronze';
  if (USER_POINTS >= TIER_THRESHOLDS.platinum) {
    activeTier = 'platinum';
  } else if (USER_POINTS >= TIER_THRESHOLDS.gold) {
    activeTier = 'gold';
  } else if (USER_POINTS >= TIER_THRESHOLDS.silver) {
    activeTier = 'silver';
  }

  const tierCards = pageRoot.querySelectorAll('.tier-card-new');
  
  // Mark user tier card
  const activeCard = pageRoot.querySelector(`.tier-card-new[data-tier="${activeTier}"]`);
  if (activeCard) {
    activeCard.classList.add('is-user-tier');
  }

  // Update progress fills
  const bronzeFill = pageRoot.querySelector('.tier-card-new[data-tier="bronze"] .tier-card-progress-fill');
  const silverFill = pageRoot.querySelector('.tier-card-new[data-tier="silver"] .tier-card-progress-fill');
  const goldFill = pageRoot.querySelector('.tier-card-new[data-tier="gold"] .tier-card-progress-fill');
  const platinumFill = pageRoot.querySelector('.tier-card-new[data-tier="platinum"] .tier-card-progress-fill');

  if (bronzeFill) bronzeFill.style.width = '100%';
  if (silverFill) silverFill.style.width = `${Math.min(100, Math.max(0, (USER_POINTS / 3000) * 100))}%`;
  if (goldFill) goldFill.style.width = `${Math.min(100, Math.max(0, ((USER_POINTS - 3000) / 5000) * 100))}%`;
  if (platinumFill) platinumFill.style.width = `${Math.min(100, Math.max(0, ((USER_POINTS - 8000) / 7000) * 100))}%`;

  // Dynamic details panel update function
  const updateDetailsPanel = (tierKey) => {
    const titleEl = pageRoot.querySelector('#selected-tier-title');
    const descEl = pageRoot.querySelector('#selected-tier-desc');
    const quadrantEl = pageRoot.querySelector('#tier-benefits-quadrant');
    const detailsData = TIER_DETAILS[tierKey];

    if (!titleEl || !descEl || !quadrantEl || !detailsData) return;

    // Highlight selected card
    tierCards.forEach(c => c.classList.toggle('selected', c.getAttribute('data-tier') === tierKey));

    // Transitions
    titleEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    descEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    quadrantEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    titleEl.style.opacity = '0';
    titleEl.style.transform = 'translateY(-4px)';
    descEl.style.opacity = '0';
    descEl.style.transform = 'translateY(-4px)';
    quadrantEl.style.opacity = '0';
    quadrantEl.style.transform = 'translateY(4px)';

    setTimeout(() => {
      titleEl.textContent = detailsData.title;
      descEl.textContent = detailsData.desc;

      let quadrantHtml = '';
      detailsData.benefits.forEach(b => {
        quadrantHtml += `
          <div class="benefit-quad-item">
            <div class="benefit-icon-circle">
              ${b.icon}
            </div>
            <div class="benefit-quad-text">
              <h4 class="benefit-quad-title">${b.title}</h4>
              <p class="benefit-quad-desc">${b.desc}</p>
            </div>
          </div>
        `;
      });
      quadrantEl.innerHTML = quadrantHtml;

      requestAnimationFrame(() => {
        titleEl.style.opacity = '1';
        titleEl.style.transform = 'translateY(0)';
        descEl.style.opacity = '1';
        descEl.style.transform = 'translateY(0)';
        quadrantEl.style.opacity = '1';
        quadrantEl.style.transform = 'translateY(0)';
      });
    }, 200);
  };

  // Add click listeners to cards
  tierCards.forEach(card => {
    const tierKey = card.getAttribute('data-tier');
    const onCardClick = (e) => {
      e.preventDefault();
      updateDetailsPanel(tierKey);
    };
    card.addEventListener('click', onCardClick);
    cleanups.push(() => card.removeEventListener('click', onCardClick));
  });

  // Select the active user tier by default
  updateDetailsPanel(activeTier);

  // ── 5. Recent Transactions Filtering System ──
  const filterTabs = pageRoot.querySelectorAll('.filter-tab-btn');
  const txRows = pageRoot.querySelectorAll('.transaction-row-new');

  filterTabs.forEach(tab => {
    const onTabClick = (e) => {
      e.preventDefault();
      const filterVal = tab.getAttribute('data-filter');

      // Update active class
      filterTabs.forEach(t => t.classList.toggle('active', t === tab));

      // Filter rows
      txRows.forEach(row => {
        const category = row.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          row.style.display = 'flex';
          row.style.opacity = '0';
          row.style.transform = 'translateY(4px)';
          requestAnimationFrame(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          });
        } else {
          row.style.display = 'none';
        }
      });
    };

    tab.addEventListener('click', onTabClick);
    cleanups.push(() => tab.removeEventListener('click', onTabClick));
  });

  // ── 6. Filter & Dropdown Toast Alerts ──
  const toastTriggerBtns = pageRoot.querySelectorAll('.toast-trigger-btn');
  toastTriggerBtns.forEach(btn => {
    const onBtnClick = (e) => {
      e.preventDefault();
      showPremiumToast('Filter option coming soon');
    };
    btn.addEventListener('click', onBtnClick);
    cleanups.push(() => btn.removeEventListener('click', onBtnClick));
  });

  // ── 7. Clickable Transaction Row details ──
  txRows.forEach(row => {
    const onRowClick = (e) => {
      e.preventDefault();
      const title = row.querySelector('.tx-title')?.textContent || 'Transaction';
      const points = row.querySelector('.tx-col-points span')?.textContent || '';
      showPremiumToast(`${title}: ${points} Points`);
    };
    row.addEventListener('click', onRowClick);
    cleanups.push(() => row.removeEventListener('click', onRowClick));
  });

  // Cleanup handler
  return () => {
    document.body.classList.remove('rewards-theme-active');
    cleanups.forEach((fn) => {
      try { fn(); } catch (err) { /* silent */ }
    });
  };
}

/**
 * Renders an Apple-like glassmorphic toast notification.
 * @param {string} message - Message text to display.
 */
function showPremiumToast(message) {
  let container = document.getElementById('rewards-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'rewards-toast-container';
    container.className = 'rewards-toast-container';
    document.body.appendChild(container);
  }

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

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 500);
  }, 3000);
}
