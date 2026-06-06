/**
 * FILE: rewards.js
 * PAGE: Rewards Showcase Page
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Interactive controls for the PLUS33 Rewards page.
 * Manages FAQ accordions, premium toast notifications,
 * scroll indicators, and navbar theme color active state class.
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the rewards page and registers all interactive listeners.
 * @returns {Function} Clean up function to be called on route destroy.
 */
export function mountRewardsPage() {
  // ── 1. Enable rewards theme active class on body for header style changes ──
  document.body.classList.add('rewards-theme-active');

  // Cache elements
  const pageRoot = document.getElementById('rewards-page-root');
  if (!pageRoot) return () => {};

  const cleanups = [];

  // ── 2. FAQ Accordion Toggle System ──
  const faqCards = pageRoot.querySelectorAll('.faq-card');
  faqCards.forEach((card) => {
    const header = card.querySelector('.faq-card__header');
    const content = card.querySelector('.faq-card__content');

    if (!header || !content) return;

    const onHeaderClick = (e) => {
      e.preventDefault();
      
      const isOpen = card.classList.contains('is-open');

      // Close all other accordion cards for a clean, calm reading rhythm
      faqCards.forEach((otherCard) => {
        if (otherCard !== card && otherCard.classList.contains('is-open')) {
          const otherContent = otherCard.querySelector('.faq-card__content');
          const otherHeader = otherCard.querySelector('.faq-card__header');
          otherCard.classList.remove('is-open');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      // Toggle current card
      if (isOpen) {
        card.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        card.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        // Set height to scrollHeight for a smooth transition
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    };

    header.addEventListener('click', onHeaderClick);
    cleanups.push(() => header.removeEventListener('click', onHeaderClick));
  });

  // ── 3. Smooth Scroll Triggers ──
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

  // ── 4. Toast Trigger Systems ──
  const toastTriggers = pageRoot.querySelectorAll('.rewards-toast-trigger');
  toastTriggers.forEach((trigger) => {
    const msg = trigger.getAttribute('data-toast-msg') || 'Feature coming soon';
    
    const onTriggerClick = (e) => {
      e.preventDefault();
      showPremiumToast(msg);
    };

    trigger.addEventListener('click', onTriggerClick);
    cleanups.push(() => trigger.removeEventListener('click', onTriggerClick));
  });

  // ── 5. Status Progression Interactivity ──
  const statusNodes = pageRoot.querySelectorAll('.status-node');
  const detailsPanelName = pageRoot.querySelector('.details-tier-name');
  const detailsPanelDesc = pageRoot.querySelector('.details-tier-desc');
  const perksList = pageRoot.querySelector('.details-perks-list');
  const desktopDetailsPanel = pageRoot.querySelector('#desktop-details-panel');

  const giftIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
  const starIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const tagIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
  const cupIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
  const userIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const mapIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`;

  const tierData = {
    bronze: {
      name: 'Bronze',
      desc: 'Welcome perks and entry-level luxury benefits.',
      perks: [
        { title: 'Welcome perks', desc: 'Enjoy exclusive welcome treats and offers.', icon: giftIcon },
        { title: 'Birthday rewards', desc: 'A special treat, just for you.', icon: cupIcon },
        { title: 'Early offers', desc: 'Be the first to know about select promotions.', icon: tagIcon },
        { title: 'Member support', desc: 'Dedicated support for a seamless experience.', icon: starIcon }
      ]
    },
    silver: {
      name: 'Silver',
      desc: 'Recognized guest and refined experiences.',
      perks: [
        { title: '1.2x points', desc: 'Accelerated earning on every purchase.', icon: starIcon },
        { title: 'Priority offers', desc: 'Get access to offers before anyone else.', icon: tagIcon },
        { title: 'Free upgrades', desc: 'Enjoy complimentary size upgrades.', icon: cupIcon },
        { title: 'Dedicated support', desc: 'Priority queue for member support.', icon: userIcon }
      ]
    },
    gold: {
      name: 'Gold',
      desc: 'Elite member signature experience.',
      perks: [
        { title: '1.5x points', desc: 'Elite earning multiplier on all orders.', icon: starIcon },
        { title: 'Monthly dessert', desc: 'A complimentary dessert every month.', icon: cupIcon },
        { title: 'Early launches', desc: 'Be the first to taste new menu items.', icon: tagIcon },
        { title: 'Private events', desc: 'Exclusive invitations to boutique events.', icon: mapIcon }
      ]
    },
    platinum: {
      name: 'Platinum',
      desc: 'Private reserve circle and ultra premium status.',
      perks: [
        { title: '2x points', desc: 'Maximum earning potential on purchases.', icon: starIcon },
        { title: 'VIP support', desc: '24/7 dedicated concierge service.', icon: userIcon },
        { title: 'Tasting experiences', desc: 'Private tastings with master roasters.', icon: cupIcon },
        { title: 'Surprise rewards', desc: 'Unannounced seasonal luxury gifts.', icon: giftIcon }
      ]
    }
  };

  const renderPerks = (perks) => {
    return perks.map(perk => `
      <li class="perk-item">
        <div class="perk-icon perk-icon-desktop">
          ${perk.icon}
        </div>
        <div class="perk-icon perk-icon-mobile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="checkmark"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="perk-text">
          <h5>${perk.title}</h5>
          <p>${perk.desc}</p>
        </div>
      </li>
    `).join('');
  };

  // Dynamically generate mobile accordion details for each node
  statusNodes.forEach(node => {
    const tierId = node.getAttribute('data-tier');
    const data = tierData[tierId];
    if (data) {
      const mobileDetails = document.createElement('div');
      mobileDetails.className = 'status-mobile-details';
      mobileDetails.innerHTML = `
        <div class="status-mobile-details__inner">
          <p class="details-tier-desc" style="color: var(--rw-muted); font-size: 14px; margin-bottom: 0; text-align: left;">${data.desc}</p>
          <div class="details-divider-mobile-only" style="display: flex;">
            <div class="divider-line"></div>
            <svg viewBox="0 0 24 24" class="divider-icon" fill="currentColor"><path d="M12 2L15 10L22 12L15 14L12 22L9 14L2 12L9 10L12 2Z"/></svg>
            <div class="divider-line"></div>
          </div>
          <ul class="details-perks-list">
            ${renderPerks(data.perks)}
          </ul>
        </div>
      `;
      node.appendChild(mobileDetails);
    }
  });

  statusNodes.forEach(node => {
    const onNodeClick = () => {
      const tierId = node.getAttribute('data-tier');
      if (!tierId || !tierData[tierId]) return;

      const isActive = node.classList.contains('active');

      if (isActive) {
        // Allow collapsing the accordion on mobile
        if (window.innerWidth <= 991) {
          node.classList.remove('active');
        }
        // On desktop, clicking active node does nothing (keeps it selected)
        return;
      }

      // Update active classes
      statusNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      // Update panel content with a fade effect
      if (desktopDetailsPanel) {
        desktopDetailsPanel.classList.add('fade-out');
        
        setTimeout(() => {
          const data = tierData[tierId];
          if(detailsPanelName) detailsPanelName.textContent = data.name;
          if(detailsPanelDesc) detailsPanelDesc.textContent = data.desc;
          if(perksList) perksList.innerHTML = renderPerks(data.perks);
          
          desktopDetailsPanel.classList.remove('fade-out');
        }, 250); // Matches CSS transition duration
      }
    };

    node.addEventListener('click', onNodeClick);
    cleanups.push(() => node.removeEventListener('click', onNodeClick));
  });

  // ── 6. Standard cleanup returned to router ──
  return () => {
    // Remove class from body
    document.body.classList.remove('rewards-theme-active');

    // Run custom cleanups
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

  // Clear existing toasts in container to prevent pileups and layout shifts
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

  // Trigger entering animation
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  // Auto dismiss after 3 seconds
  setTimeout(() => {
    toast.classList.remove('is-visible');
    // Wait for fade transition, then remove element
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 500);
  }, 3000);
}
