/**
 * FILE: chatbot.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Paris Pony — Coffee Assistant widget controller.
 * Manages all chatbot UI, state, SPA page detection,
 * keyword matching, localStorage persistence, and
 * accessibility features.
 *
 * DEPENDENCIES:
 * - store-data.js    (window.CHATBOT_STORES must be loaded first)
 * - chatbot-data.js  (CHATBOT_DATA must be loaded second)
 * - chatbot.css      (styles loaded via index.html)
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     CONSTANTS
  ────────────────────────────────────────────────── */
  const SS_KEY_HISTORY = 'pp_chat_history';   // sessionStorage key for messages
  const SS_KEY_WINDOW_OPEN = 'pp_chat_window_open'; // sessionStorage key for window open state
  const LS_KEY_OPENED = 'pp_chat_opened';    // localStorage key: has user ever opened
  const MAX_MESSAGES = 20;                  // Max messages stored in sessionStorage
  const TYPING_DELAY = 820;                 // ms bot "types" before responding
  const DEBOUNCE_DELAY = 900;                 // ms quick-action cooldown

  /* ─────────────────────────────────────────────────
     WELCOME MESSAGE (shown only on first open)
  ────────────────────────────────────────────────── */
  const WELCOME_MESSAGE = {
    html: `<strong>Hi. Welcome to Paris Pony.</strong>Every cup is a call to Paris.`,
    text: 'Hi. Welcome to Paris Pony. Every cup is a call to Paris.'
  };

  /* ─────────────────────────────────────────────────
     FALLBACK ANSWER
  ────────────────────────────────────────────────── */
  const FALLBACK_ANSWER =
    "I'm still learning. Try asking about:\n• **drinks**\n• **cafés**\n• **menu**\n• **locations**\n• **franchise**";

  /* ─────────────────────────────────────────────────
     PREMIUM CONVERSATIONAL RESPONSES
  ────────────────────────────────────────────────── */
  const CHAT_RESPONSES = {
    hot: [
      "Need a warm break? **Cappuccino** is perfect for that.",
      "Hot coffee and calm vibes. Try **Café Filtre**.",
      "Take a cozy coffee pause. **Vanilla Latte** fits perfectly.",
      "Warm moments begin with **Chai Latte**."
    ],
    cold: [
      "Let’s enjoy some chill drinks. Our **Caramel Cold Brew** is a customer favorite.",
      "Cool down with **Thé Glacé d’Hiver**.",
      "Need something icy? **Tiramisu Glacé** is calling.",
      "Cold coffee and calm vibes. Try **Iced Punch Coco**."
    ],
    snack: [
      "Pair our **Butter Croissant** with **Cappuccino**.",
      "**Coffee and pastries** always belong together. Try our fresh **croissants**.",
      "Snack break? **Café pastries** are waiting.",
      "Fresh pastries and smooth coffee. **Simple happiness**."
    ],
    combo: [
      "Perfect combo: **Cappuccino** + **Butter Croissant**",
      "**Cold Brew** and **café desserts** — made for each other.",
      "**Vanilla Latte** and **warm pastries** never fail.",
      "**Mocha Espresso** with **signature bites**. Perfect pairing."
    ],
    morning: [
      "Good mornings begin with **strong coffee**. Try **Double Espresso**.",
      "Morning mood? **Café Filtre** is waiting.",
      "Fresh coffee and peaceful mornings. **Cappuccino** fits perfectly.",
      "Wake up slowly with our smooth **Flat White**."
    ],
    evening: [
      "Slow evenings deserve **smooth coffee**. Try **Vanilla Latte**.",
      "Evening vibes feel softer with **Mocha Espresso**.",
      "Coffee, calm music, and night vibes. **Cappuccino** fits perfectly.",
      "Relax tonight with **Café Filtre**."
    ],
    sweet: [
      "Sweet coffee lovers should try **Vanilla Latte**.",
      "Craving sweetness? **Hazelnut Mocha** never disappoints.",
      "**Caramel Cappuccino** feels like comfort in a cup.",
      "Sweet café vibes start with **Pumpkin Latte**."
    ],
    strong: [
      "Need a stronger kick? **Double Espresso** is ready.",
      "Bold coffee moments begin with **Espresso**.",
      "Strong coffee. Slow moments. **Café Filtre** fits perfectly.",
      "Coffee lovers love our **Mocha Espresso**."
    ],
    matcha: [
      "Soft **Matcha** energy. Try **Matcha Vanille**.",
      "Need calm café vibes? **Matcha** fits perfectly.",
      "**Iced Matcha** lovers — your next favorite drink is here.",
      "Smooth matcha moments start with **Matcha Vanille**."
    ],
    rain: [
      "Rainy days and **hot coffee** are the perfect combination. Try **Cappuccino**.",
      "Cloudy skies call for **Café Filtre**.",
      "Take a rainy-day coffee break. **Vanilla Latte** fits perfectly.",
      "**Rain and coffee** just belong together. **Chai Latte** feels perfect."
    ],
    work: [
      "Focused work sessions begin with **Espresso**.",
      "Coffee, calm music, and focus mode. **Café Filtre** fits perfectly.",
      "Need productivity energy? **Double Espresso** is ready.",
      "Bring your laptop — we’ll handle the **Cappuccino**."
    ],
    weekend: [
      "Weekends deserve **slow coffee moments**. Try **Caramel Cold Brew**.",
      "**Cold brews** and café conversations. **Thé Glacé d’Hiver** fits perfectly.",
      "**Weekend coffee** hits differently. **Vanilla Latte** is waiting.",
      "Take it slow this weekend with **Cappuccino**."
    ],
    romantic: [
      "Every cup is a **call to Paris**. Try **Vanilla Latte**.",
      "Coffee dates feel better at **Paris Pony**. **Cappuccino** fits perfectly.",
      "Soft café lights and warm coffee. **Mocha Espresso** feels magical.",
      "Romantic café vibes served daily. Try **Flat White**."
    ],
    chill: [
      "Coffee tastes better with **good company**. Try **Caramel Cold Brew**.",
      "Bring your friends and enjoy the **Paris Pony vibe**. **Thé Glacé d’Hiver** fits perfectly.",
      "**Cold brews** and calm conversations. **Tiramisu Glacé** is waiting.",
      "Perfect café mood unlocked. **Iced Punch Coco** feels refreshing."
    ],
    bestseller: [
      "Paris Pony favorites. **Caramel Cold Brew** & **Cappuccino**",
      "Our guests love **Vanilla Latte**.",
      "Most-loved drinks this season. **Matcha Vanille** & **Espresso**",
      "Signature drinks made for slow moments. Try **Café Filtre**."
    ],
    recommend: [
      "Need a recommendation? Try **Signature Hazelnut Latte**.",
      "For something refreshing, go with **Caramel Cold Brew**.",
      "If you love smooth flavors, **Vanilla Latte** is perfect.",
      "Looking for comfort in a cup? **Cappuccino** never fails."
    ],
    menu: [
      "Explore coffee crafted for slow moments. Try **Café Filtre**.",
      "From **Espresso** to **Cold Brew** — there’s a drink for every mood.",
      "Fresh brews and café classics. **Cappuccino** fits perfectly.",
      "Discover your next favorite drink. Try **Matcha Vanille**."
    ],
    location: [
      "Your next coffee stop might be closer than you think.",
      "Let’s find your nearest **Paris Pony café**.",
      "Coffee is always nearby. **Cappuccino** is waiting.",
      "Find your perfect café corner. Try **Café Filtre**."
    ],
    franchise: [
      "Bring the **Paris Pony experience** to your city.",
      "Build premium café moments with **Paris Pony**.",
      "Turn coffee passion into a café experience. **Café Filtre** style.",
      "Interested in opening a **Paris Pony café**? Let’s talk."
    ],
    hello: [
      "**Bonjour** What can I get brewing for you today.",
      "Welcome back to **Paris Pony**. Try our **Cappuccino**",
      "Ready for your next **coffee break**? **Vanilla Latte** is waiting.",
      "**Coffee mood** activated. **Café Filtre** fits perfectly."
    ],
    night: [
      "Late-night coffee vibes. Try **Mocha Espresso**.",
      "Night cafés and slow conversations. **Cappuccino** fits perfectly.",
      "Coffee under city lights feels different. **Vanilla Latte** is waiting.",
      "End your day with smooth coffee moments. Try **Café Filtre**."
    ]
  };

  /* ══════════════════════════════════════════════════
     CLASS: ParisPonyChatbot
  ═════════════════════════════════════════════════ */
  class ParisPonyChatbot {

    constructor() {
      /* ── State ── */
      this.isOpen = false;
      this.isTyping = false;
      this.currentPage = 'home';
      this.history = [];   // { role: 'user'|'bot', text, time, isHtml }
      this.quickDebounce = false;

      /* ── DOM Refs (populated after inject) ── */
      this.rootEl = null;
      this.triggerBtn = null;
      this.windowEl = null;
      this.messagesEl = null;
      this.inputEl = null;
      this.sendBtn = null;
      this.closeBtn = null;
      this.quickArea = null;
      this.welcomeEl = null;
      this.typingRow = null;

      /* ── Bound event handlers (for removeEventListener cleanup) ── */
      this._onKeydown = this._handleKeydown.bind(this);
      this._onOutsideClick = this._handleOutsideClick.bind(this);

      /* ── Boot ── */
      this._inject();
      this._bindEvents();
      this._setupSPADetection();
      this._loadHistory();

      /* Update page context after a tick (router may not be done yet) */
      requestAnimationFrame(() => {
        this.currentPage = this._detectPage();
        this._renderQuickActions(this.currentPage);
      });
    }


    /* ══════════════════════════════════════════════
       INJECT — build and mount widget HTML
     ══════════════════════════════════════════════ */
    _inject() {
      /* Guard: don't double-mount */
      if (document.getElementById('pp-chatbot')) return;

      const markup = `
        <!-- ═════════ PARIS PONY CHATBOT WIDGET ═════════ -->
        <div id="pp-chatbot" role="complementary" aria-label="Paris Pony Coffee Assistant">
 
          <!-- ── Floating Trigger Button ── -->
          <button
            id="pp-trigger"
            aria-label="Open Paris Pony Coffee Assistant"
            aria-expanded="false"
            aria-controls="pp-window">
            <span class="pp-icon" aria-hidden="true">
              <img src="/global/assets/brand/plus33-logo.png" alt="+33 Logo" style="width: 32px; height: 32px; object-fit: contain; filter: brightness(0) invert(1);" />
            </span>
            <span class="pp-pulse-ring" aria-hidden="true"></span>
          </button>
 
          <!-- ── Chat Window ── -->
          <div
            id="pp-window"
            role="dialog"
            aria-modal="true"
            aria-label="Paris Pony Coffee Assistant"
            aria-hidden="true">
 
            <!-- Header -->
            <div class="pp-header">
              <div class="pp-header-avatar" aria-hidden="true">
                <img src="/global/assets/brand/plus33-logo.png" alt="+33 Logo" style="width: 24px; height: 24px; object-fit: contain; filter: brightness(0) invert(1);" />
              </div>
              <div class="pp-header-text">
                <div class="pp-header-name">Hi. Welcome to Paris Pony.</div>
                <div class="pp-header-sub">Every cup is a call to Paris.</div>
              </div>
              <button
                class="pp-close-btn"
                id="pp-close-btn"
                aria-label="Close coffee assistant">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6"  y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>



            <!-- Quick Action Buttons -->
            <div class="pp-quick-actions" id="pp-quick-actions" role="group" aria-label="Quick questions"></div>

            <!-- Messages Area -->
            <div
              class="pp-messages"
              id="pp-messages"
              role="log"
              aria-live="polite"
              aria-label="Chat messages">
            </div>

            <!-- Menu Popup for Predefined Questions -->
            <div id="pp-menu-popup" class="pp-menu-popup" aria-hidden="true"></div>

            <!-- Input Area -->
            <div class="pp-input-area">
              <button
                id="pp-menu-btn"
                aria-label="Toggle predefined questions menu"
                aria-expanded="false"
                aria-controls="pp-menu-popup">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
              </button>
              <input
                type="text"
                id="pp-input"
                placeholder="Ask me anything..."
                autocomplete="off"
                autocorrect="off"
                spellcheck="false"
                maxlength="200"
                aria-label="Type your message"/>
              <button
                id="pp-send-btn"
                aria-label="Send message">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

            <!-- Powered by -->
            <p class="pp-powered" aria-hidden="true">Paris Pony · Coffee Assistant</p>

          </div><!-- /pp-window -->
        </div><!-- /pp-chatbot -->
      `;

      /* Mount into body */
      const wrapper = document.createElement('div');
      wrapper.innerHTML = markup.trim();
      document.body.appendChild(wrapper.firstElementChild);

      /* Cache DOM refs */
      this.rootEl = document.getElementById('pp-chatbot');
      this.triggerBtn = document.getElementById('pp-trigger');
      this.windowEl = document.getElementById('pp-window');
      this.messagesEl = document.getElementById('pp-messages');
      this.inputEl = document.getElementById('pp-input');
      this.sendBtn = document.getElementById('pp-send-btn');
      this.closeBtn = document.getElementById('pp-close-btn');
      this.quickArea = document.getElementById('pp-quick-actions');
      this.welcomeEl = document.getElementById('pp-welcome');
      this.menuBtn = document.getElementById('pp-menu-btn');
      this.menuPopup = document.getElementById('pp-menu-popup');
    }


    /* ══════════════════════════════════════════════
       EVENTS — bind all interactive events
    ══════════════════════════════════════════════ */
    _bindEvents() {
      /* Trigger button */
      this.triggerBtn.addEventListener('click', () => this.open());

      /* Close button */
      this.closeBtn.addEventListener('click', () => this.close());

      /* Send button */
      this.sendBtn.addEventListener('click', () => this._submitInput());

      /* Menu toggle button */
      if (this.menuBtn) {
        this.menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMenu();
        });
      }

      /* Enter key in input */
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this._submitInput();
        }
      });

      /* Global keydown (Escape closes, focus trap) */
      document.addEventListener('keydown', this._onKeydown);

      /* Click outside to close */
      document.addEventListener('click', this._onOutsideClick, true);

      /* Close chatbot window on page redirection links */
      this.windowEl.addEventListener('click', (e) => {
        const link = e.target.closest('.pp-btn-link');
        if (link && link.getAttribute('href')?.startsWith('/')) {
          this.close();
        }
      });
    }

    /* Handle global keyboard events */
    _handleKeydown(e) {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close();
        this.triggerBtn.focus();
        return;
      }

      /* ── Focus Trap ── */
      if (e.key === 'Tab') {
        const focusable = Array.from(
          this.windowEl.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.closest('.pp-quick-btn.pp-disabled'));

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    /* Close on click outside the widget */
    _handleOutsideClick(e) {
      if (!this.isOpen) return;
      if (!this.rootEl.contains(e.target)) {
        this.close();
      } else if (this.menuPopup && this.menuPopup.classList.contains('pp-show') && !this.menuPopup.contains(e.target) && e.target !== this.menuBtn && !this.menuBtn.contains(e.target)) {
        this.toggleMenu(true);
      }
    }

    toggleMenu(forceClose = false) {
      if (!this.menuPopup) return;
      const isVisible = this.menuPopup.classList.contains('pp-show') && !forceClose;
      if (isVisible || forceClose) {
        this.menuPopup.classList.remove('pp-show');
        this.menuPopup.setAttribute('aria-hidden', 'true');
        this.menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        this._renderMenuQuestions();
        this.menuPopup.classList.add('pp-show');
        this.menuPopup.setAttribute('aria-hidden', 'false');
        this.menuBtn.setAttribute('aria-expanded', 'true');
      }
    }

    _renderMenuQuestions() {
      if (!this.menuPopup) return;
      const pageData = CHATBOT_DATA[this.currentPage];
      const questions = (pageData && pageData.quickActions) || [
        "Best Drinks",
        "Cold Coffee",
        "Find Café",
        "Franchise",
        "Popular Picks"
      ];

      this.menuPopup.innerHTML = questions
        .map((label) => `<button class="pp-menu-item" data-question="${this._esc(label)}">${this._esc(label)}</button>`)
        .join('');

      /* Bind click handlers on menu item buttons */
      this.menuPopup.querySelectorAll('.pp-menu-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-question');
          if (q) {
            this.sendMessage(q);
            this.toggleMenu(true);
          }
        });
      });
    }


    /* ══════════════════════════════════════════════
       SPA PAGE DETECTION
       Watches #app DOM changes and popstate events
       to re-detect current page on route changes.
    ══════════════════════════════════════════════ */
    _setupSPADetection() {
      /* popstate: browser back/forward */
      window.addEventListener('popstate', () => this._onPageChange());

      /* MutationObserver: catches router pushState view swaps */
      const appEl = document.getElementById('app');
      if (appEl) {
        const observer = new MutationObserver(() => {
          /* Small debounce — router animations finish before we re-detect */
          clearTimeout(this._pageChangeTimer);
          this._pageChangeTimer = setTimeout(() => this._onPageChange(), 120);
        });
        observer.observe(appEl, { childList: true, subtree: false });
      }

      /* Also patch history.pushState for routers that don't fire popstate */
      const origPush = history.pushState.bind(history);
      history.pushState = (...args) => {
        origPush(...args);
        clearTimeout(this._pageChangeTimer);
        this._pageChangeTimer = setTimeout(() => this._onPageChange(), 120);
      };
    }

    /* Called whenever the SPA route changes */
    _onPageChange() {
      const newPage = this._detectPage();
      if (newPage !== this.currentPage) {
        this.currentPage = newPage;
        this._renderQuickActions(newPage);
      }
    }

    /**
     * Maps window.location.pathname to a CHATBOT_DATA key.
     * @returns {string} page context key
     */
    _detectPage() {
      const path = window.location.pathname;
      if (path === '/' || path === '') return 'home';
      if (path.includes('store')) return 'store';
      if (path.includes('franchise')) return 'franchise';
      if (path.includes('find-us') || path.includes('findus')) return 'findus';
      if (path.includes('journal')) return 'journal';
      return 'home'; // safe default
    }


    /* ══════════════════════════════════════════════
       OPEN / CLOSE
    ══════════════════════════════════════════════ */
    open() {
      if (this.isOpen) return;
      this.isOpen = true;

      /* Mark as opened (removes pulse ring) */
      this.rootEl.classList.add('pp-opened');
      localStorage.setItem(LS_KEY_OPENED, '1');

      /* Show window */
      this.windowEl.classList.add('pp-open');
      this.windowEl.setAttribute('aria-hidden', 'false');
      this.triggerBtn.setAttribute('aria-expanded', 'true');

      /* Lock body scroll on mobile */
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }

      /* Focus input after animation */
      setTimeout(() => {
        this.inputEl?.focus();
      }, 380);

      /* Persist open window state */
      sessionStorage.setItem(SS_KEY_WINDOW_OPEN, '1');
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;

      /* Hide window */
      this.windowEl.classList.remove('pp-open');
      this.windowEl.setAttribute('aria-hidden', 'true');
      this.triggerBtn.setAttribute('aria-expanded', 'false');

      /* Restore body scroll */
      document.body.style.overflow = '';

      /* Hide menu if open */
      this.toggleMenu(true);

      /* Persist closed window state */
      sessionStorage.removeItem(SS_KEY_WINDOW_OPEN);
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }


    /* ══════════════════════════════════════════════
       QUICK ACTIONS
    ══════════════════════════════════════════════ */
    /**
     * Renders page-specific quick action buttons.
     * @param {string} page - CHATBOT_DATA key
     */
    _renderQuickActions(page) {
      if (!this.quickArea) return;

      const pageData = CHATBOT_DATA[page];
      if (!pageData || !pageData.quickActions) {
        this.quickArea.innerHTML = '';
        return;
      }

      this.quickArea.innerHTML = pageData.quickActions
        .map((label) => {
          return `<button class="pp-quick-btn" data-question="${this._esc(label)}">${this._esc(label)}</button>`;
        })
        .join('');

      /* Bind click handlers on new buttons */
      this.quickArea.querySelectorAll('.pp-quick-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-question');
          if (q) this._onQuickAction(q);
        });
      });
    }

    /**
     * Handles quick action button click.
     * Debounced to prevent spam.
     * @param {string} text - The question label text
     */
    _onQuickAction(text) {
      if (this.quickDebounce || this.isTyping) return;

      /* Apply debounce */
      this.quickDebounce = true;
      this.quickArea.querySelectorAll('.pp-quick-btn').forEach(b => b.classList.add('pp-disabled'));

      setTimeout(() => {
        this.quickDebounce = false;
        this.quickArea.querySelectorAll('.pp-quick-btn').forEach(b => b.classList.remove('pp-disabled'));
      }, DEBOUNCE_DELAY);

      /* Auto-send the question */
      this.sendMessage(text);
    }


    /* ══════════════════════════════════════════════
       SEND MESSAGE
    ══════════════════════════════════════════════ */
    /**
     * Process and send a user message.
     * @param {string} text - The message text
     */
    sendMessage(text) {
      text = text.trim();
      if (!text || this.isTyping) return;

      // ── TYPO NORMALIZATION ──
      let normalized = text.toLowerCase().trim();
      const typoMap = {
        "sugust": "suggest",
        "stroe": "store",
        "streo": "store",
        "cofee": "coffee",
        "locaton": "location"
      };
      Object.keys(typoMap).forEach(key => {
        normalized = normalized.replaceAll(key, typoMap[key]);
      });

      /* ─────────────────────────────────────────────────
         PRIORITY INTENT ROUTING
      ────────────────────────────────────────────────── */

      // 1. CASUAL GREETING INTENT (Micro UX Improvement)
      // Respond casually if user types only a standard greeting word
      const isGreeting = ['hi', 'hello', 'hey', 'yo', 'bonjour'].some(kw => normalized === kw || normalized.startsWith(kw + ' '));
      if (isGreeting) {
        this._addMessage('user', text);
        if (this.inputEl.value.trim() === text) this.inputEl.value = '';
        this.isTyping = true;
        this._showTyping();
        setTimeout(() => {
          this._hideTyping();
          this.isTyping = false;
          const chosen = this._getRandomResponse('hello');
          this._addMessage('bot', chosen);
        }, TYPING_DELAY);
        return;
      }

      // 2. CITY MATCHING INTENT (Location intent priority)
      // Check if normalized contains any known City name in our shared STORES registry as a standalone word
      if (window.CHATBOT_STORES) {
        const matchedStore = window.CHATBOT_STORES.find(store => {
          const cityLower = store.city.toLowerCase();
          const regex = new RegExp(`\\b${cityLower}\\b`, 'i');
          return regex.test(normalized) && !normalized.includes('paris pony');
        });

        if (matchedStore) {
          this._addMessage('user', text);
          if (this.inputEl.value.trim() === text) {
            this.inputEl.value = '';
          }

          this.isTyping = true;
          this._showTyping();

          setTimeout(() => {
            this._hideTyping();
            this.isTyping = false;

            const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${matchedStore.lat},${matchedStore.lng}`;

            // Compact, premium, coffee house brand consistent design
            const replyHtml = `
              <strong>Plus33 Café — ${this._esc(matchedStore.city)}</strong><br>
              <small style="opacity:0.85;">${this._esc(matchedStore.address)}</small><br><br>
              Open:<br>
              ${this._esc(matchedStore.openHours)}<br><br>
              <a href="${mapUrl}" target="_blank" class="pp-btn-link" rel="noopener">Get Directions</a>
            `;
            this._addMessage('bot', replyHtml, true);
          }, TYPING_DELAY);
          return;
        }
      }

      // 3. GEOLOCATION / LOCATION SEARCH INTENT
      const locationKeywords = [
        'nearest', 'closest', 'near me', 'find café', 'find cafe', 'find a café', 'find a cafe',
        'where is', 'locate', 'nearby', 'store', 'location', 'cafe', 'café', 'branch', 'shop',
        'use my location', 'find a café', 'find a cafe', 'locations'
      ];
      const isLocRequest = locationKeywords.some(kw => normalized.includes(kw));

      if (isLocRequest) {
        this._addMessage('user', text);
        if (this.inputEl.value.trim() === text) this.inputEl.value = '';
        this._handleNearMeRequest();
        return;
      }

      /* 4. Regular conversation / Server-side backend API matching */
      this._addMessage('user', text);

      if (this.inputEl.value.trim() === text) {
        this.inputEl.value = '';
      }

      this.isTyping = true;
      this._showTyping();

      fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      })
      .then(res => res.json())
      .then(data => {
        this._hideTyping();
        this.isTyping = false;
        
        // Parse markdown style links like [Link Text](/url) into visual HTML links for SPA routing
        let formatted = data.reply;
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        formatted = formatted.replace(linkRegex, '<a href="$2" class="pp-btn-link">$1</a>');
        
        this._addMessage('bot', formatted, true); // Rich HTML response
      })
      .catch(err => {
        this._hideTyping();
        this.isTyping = false;
        console.warn('Concierge Assistant Backend offline, executing local fallback matching:', err);
        const fallback = this._findAnswer(normalized);
        this._addMessage('bot', fallback);
      });
    }

    /* Handle input field submission */
    _submitInput() {
      const text = this.inputEl.value.trim();
      if (text) {
        this.inputEl.value = '';
        this.sendMessage(text);
      }
    }


    /* ══════════════════════════════════════════════
       GEOLOCATION ANALYZER FOR NEARBY STORE
    ══════════════════════════════════════════════ */
    _handleNearMeRequest() {
      // 1. First prompt the user in the chat view to allow location permission
      this._addMessage('bot', "Allow location access to find your nearest Paris Pony café.", false);

      this.isTyping = true;
      this._showTyping();

      if (!navigator.geolocation) {
        setTimeout(() => {
          this._hideTyping();
          this.isTyping = false;
          this._addMessage('bot', "Location access is blocked. Tell me your city instead.");
        }, TYPING_DELAY);
        return;
      }

      // Small delay to allow the message to render before browser permission prompt displays
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this._hideTyping();
            this.isTyping = false;

            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            let closestStore = null;
            let minDistance = Infinity;

            if (window.CHATBOT_STORES) {
              window.CHATBOT_STORES.forEach(store => {
                const dist = this._haversineDistance(lat, lng, store.lat, store.lng);
                if (dist < minDistance) {
                  minDistance = dist;
                  closestStore = store;
                }
              });
            }

            if (closestStore) {
              const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${closestStore.lat},${closestStore.lng}`;
              const distStr = minDistance.toFixed(1);

              // Compact, premium store card design
              const replyHtml = `
                <strong>Plus33 Café — ${this._esc(closestStore.city)}</strong><br>
                <small style="opacity:0.85;">${this._esc(closestStore.address)}</small><br><br>
                ${distStr} km away<br><br>
                Open:<br>
                ${this._esc(closestStore.openHours)}<br><br>
                <a href="${mapUrl}" target="_blank" class="pp-btn-link" rel="noopener">Get Directions</a>
              `;
              this._addMessage('bot', replyHtml, true);
            } else {
              this._addMessage('bot', "Location access is blocked. Tell me your city instead.");
            }
          },
          (err) => {
            this._hideTyping();
            this.isTyping = false;
            console.warn("Chatbot Geolocation Error:", err);
            this._addMessage('bot', "Location access is blocked. Tell me your city instead.");
          },
          { timeout: 6000, enableHighAccuracy: true }
        );
      }, 700);
    }

    _haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }


    /* ══════════════════════════════════════════════
       ANSWER MATCHING
    ══════════════════════════════════════════════ */
    /**
     * Finds a matching answer using simple keyword includes() with priority intents.
     * @param {string} lower - Normalized user message
     * @returns {string} Answer string
     */
    /**
     * Retrieve a randomized response from our curated categories.
     * @param {string} category
     * @returns {string} Slogan response
     */
    _getRandomResponse(category) {
      const items = CHAT_RESPONSES[category];
      if (!items || !items.length) {
        return "Sorry, I couldn't find the perfect coffee moment right now.";
      }
      let response = items[Math.floor(Math.random() * items.length)];

      /* Append redirection buttons to related text */
      const menuCategories = ['hot', 'cold', 'snack', 'combo', 'morning', 'evening', 'night', 'sweet', 'strong', 'matcha', 'rain', 'work', 'weekend', 'romantic', 'chill', 'bestseller', 'recommend', 'menu'];
      if (menuCategories.includes(category)) {
        response += '\n\n[Explore Menu](/store)';
      } else if (category === 'location') {
        response += '\n\n[Find a Café](/find-us)';
      } else if (category === 'franchise') {
        response += '\n\n[Franchise Info](/franchise)';
      }
      return response;
    }

    _findAnswer(lower) {
      // 1. Franchise intent (priority 1)
      const franchiseKeywords = ['franchise', 'partner', 'business', 'own a', 'open a'];
      if (franchiseKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('franchise');
      }

      // 2. COMBINATION / PAIRING
      const comboKeywords = ["combo", "combination", "pairing", "mix", "best combo"];
      if (comboKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('combo');
      }

      // 3. MATCHA
      const matchaKeywords = ["matcha", "green tea"];
      if (matchaKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('matcha');
      }

      // 4. RAIN / WEATHER
      const weatherKeywords = ["rain", "rainy", "weather", "cloud", "cold weather"];
      if (weatherKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('rain');
      }

      // 5. WORK / STUDY
      const studyKeywords = ["study", "work", "office", "laptop", "focus", "coding"];
      if (studyKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('work');
      }

      // 6. WEEKEND
      const weekendKeywords = ["weekend", "holiday", "sunday", "saturday", "vacation"];
      if (weekendKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('weekend');
      }

      // 7. ROMANTIC / PARIS VIBES
      const parisKeywords = ["paris", "romantic", "love", "cute"];
      if (parisKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('romantic');
      }

      // 8. CHILL / HANGOUT
      const chillKeywords = ["hangout", "friends", "meet", "date", "chill", "vibe"];
      if (chillKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('chill');
      }

      // 9. MORNING COFFEE
      const morningKeywords = ["morning", "breakfast", "wake", "awake", "early"];
      if (morningKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('morning');
      }

      // 10. EVENING VIBES
      const eveningKeywords = ["evening", "relax", "calm"];
      if (eveningKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('evening');
      }

      // 10b. NIGHT VIBES
      const nightKeywords = ["night", "late", "dark"];
      if (nightKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('night');
      }

      // 11. SWEET DRINKS
      const sweetKeywords = ["sweet", "sugar", "dessert drink", "flavor", "vanilla", "caramel"];
      if (sweetKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('sweet');
      }

      // 12. STRONG COFFEE
      const strongKeywords = ["strong", "espresso", "bold", "hard", "kick", "energy"];
      if (strongKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('strong');
      }

      // 13. SNACKS & PASTRIES
      const snackKeywords = ["snack", "food", "eat", "bite", "pastry", "pastries", "croissant", "cake", "brownie", "dessert"];
      if (snackKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('snack');
      }

      // 14. HOT DRINKS
      const hotKeywords = ["hot", "warm"];
      if (hotKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('hot');
      }

      // 15. COLD DRINKS
      const coldKeywords = ["cold", "iced", "cool", "refreshing", "summer"];
      if (coldKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('cold');
      }

      // 16. BEST SELLERS
      const bestKeywords = ["best", "popular", "favorite", "signature", "top"];
      if (bestKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('bestseller');
      }

      // 17. SUGGESTIONS
      const suggestKeywords = ["suggest", "sugust", "recommend", "choice", "pick"];
      if (suggestKeywords.some(kw => lower.includes(kw))) {
        return this._getRandomResponse('recommend');
      }

      // 18. General fallback QA matching (any keyword)
      const pageData = CHATBOT_DATA[this.currentPage];
      if (pageData && pageData.qa) {
        for (const entry of pageData.qa) {
          if (entry.keywords.some(kw => lower.includes(kw))) {
            return entry.answer;
          }
        }
      }

      if (CHATBOT_DATA.global && CHATBOT_DATA.global.qa) {
        for (const entry of CHATBOT_DATA.global.qa) {
          if (entry.keywords.some(kw => lower.includes(kw))) {
            return entry.answer;
          }
        }
      }

      // 19. Static fallback (priority 5)
      return FALLBACK_ANSWER;
    }

    /**
     * Finds a QA entry mapping to a specific intent.
     */
    _getAnswerForIntent(lower, intent) {
      let intentKeywords = [];
      if (intent === 'franchise') {
        intentKeywords = ['franchise', 'partner', 'business', 'own a', 'open a'];
      } else if (intent === 'recommend') {
        intentKeywords = ['suggest', 'recommend', 'choice', 'pick', 'best', 'popular', 'favorite', 'top', 'good', 'signature', 'picks'];
      } else if (intent === 'drink') {
        intentKeywords = [
          'drink', 'coffee', 'beverage', 'menu', 'latte', 'espresso', 'snack', 'food', 'dessert',
          'croissant', 'eat', 'bite', 'hot coffee', 'cold brew', 'iced coffee', 'sachet', 'chilled',
          'pumpkin', 'matcha', 'coco', 'café filtre', 'cappuccino', 'flat white', 'chai'
        ];
      }

      // Check current page QA first
      const pageData = CHATBOT_DATA[this.currentPage];
      if (pageData && pageData.qa) {
        for (const entry of pageData.qa) {
          const isIntentQA = entry.keywords.some(kw => intentKeywords.includes(kw));
          if (isIntentQA && entry.keywords.some(kw => lower.includes(kw))) {
            return entry.answer;
          }
        }
      }

      // Check global fallback QA
      if (CHATBOT_DATA.global && CHATBOT_DATA.global.qa) {
        for (const entry of CHATBOT_DATA.global.qa) {
          const isIntentQA = entry.keywords.some(kw => intentKeywords.includes(kw));
          if (isIntentQA && entry.keywords.some(kw => lower.includes(kw))) {
            return entry.answer;
          }
        }
      }

      return null;
    }


    /* ══════════════════════════════════════════════
       MESSAGE BUBBLES
    ══════════════════════════════════════════════ */
    /**
     * Creates and appends a message bubble to the messages area.
     * @param {'user'|'bot'} role
     * @param {string} text
     * @param {boolean} isHtml - Whether the text contains HTML content
     */
    _addMessage(role, text, isHtml = false) {
      const time = this._formatTime();

      const row = document.createElement('div');
      row.className = `pp-msg-row pp-${role}`;
      row.setAttribute('role', 'listitem');

      // Security: Only inject validated, bot-generated templates. User text is ALWAYS escaped.
      const bubbleContent = isHtml ? text : this._esc(text);

      row.innerHTML = `
        <div class="pp-bubble">${bubbleContent}</div>
        <span class="pp-timestamp">${time}</span>
      `;

      this.messagesEl.appendChild(row);
      this._scrollToBottom();

      /* Toggle welcome/quick actions visibility */
      if (this.windowEl) {
        this.windowEl.classList.add('pp-has-messages');
      }

      /* Persist to history */
      this._pushHistory({ role, text, time, isHtml });
    }

    /* ── Typing Indicator ── */
    _showTyping() {
      const row = document.createElement('div');
      row.className = 'pp-msg-row pp-bot pp-typing-row';
      row.id = 'pp-typing';
      row.setAttribute('aria-label', 'Paris Pony is typing');
      row.innerHTML = `
        <div class="pp-typing-bubble" aria-hidden="true">
          <span class="pp-typing-dot"></span>
          <span class="pp-typing-dot"></span>
          <span class="pp-typing-dot"></span>
        </div>
      `;
      this.messagesEl.appendChild(row);
      this._scrollToBottom();
    }

    _hideTyping() {
      const row = document.getElementById('pp-typing');
      if (row) row.remove();
    }

    /* Smooth scroll to latest message */
    _scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }


    /* ══════════════════════════════════════════════
       LOCAL STORAGE  —  message history
    ══════════════════════════════════════════════ */
    /**
     * Add a message to in-memory history and persist to localStorage.
     * Enforces MAX_MESSAGES limit.
     * @param {{ role: string, text: string, time: string, isHtml: boolean }} msg
     */
    _pushHistory(msg) {
      this.history.push(msg);

      /* Enforce max limit */
      if (this.history.length > MAX_MESSAGES) {
        this.history = this.history.slice(-MAX_MESSAGES);
      }

      try {
        sessionStorage.setItem(SS_KEY_HISTORY, JSON.stringify(this.history));
      } catch (e) {
        /* sessionStorage quota exceeded — silently skip */
      }
    }

    /**
     * Load and replay message history from sessionStorage.
     * Called once on widget init.
     */
    _loadHistory() {
      /* Restore "opened before" state */
      if (localStorage.getItem(LS_KEY_OPENED)) {
        this.rootEl.classList.add('pp-opened');
      }

      /* Check if the page was refreshed (reloaded) */
      let isReload = false;
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry) {
          isReload = navigationEntry.type === 'reload';
        } else if (performance.navigation) {
          isReload = performance.navigation.type === 1; // TYPE_RELOAD
        }
      } catch (e) {
        // Fallback
      }

      if (isReload) {
        this.clearHistory();
        sessionStorage.removeItem(SS_KEY_WINDOW_OPEN);
      } else {
        this._restoreHistory();
        if (sessionStorage.getItem(SS_KEY_WINDOW_OPEN) === '1') {
          setTimeout(() => {
            this.open();
          }, 150);
        }
      }
    }

    /**
     * Replay and restore chat messages from sessionStorage.
     */
    _restoreHistory() {
      try {
        const stored = sessionStorage.getItem(SS_KEY_HISTORY);
        if (stored) {
          this.history = JSON.parse(stored) || [];
          this.history.forEach(msg => {
            const row = document.createElement('div');
            row.className = `pp-msg-row pp-${msg.role}`;
            row.setAttribute('role', 'listitem');

            const bubbleContent = msg.isHtml ? msg.text : this._esc(msg.text);

            row.innerHTML = `
              <div class="pp-bubble">${bubbleContent}</div>
              <span class="pp-timestamp">${msg.time}</span>
            `;

            this.messagesEl.appendChild(row);
          });

          if (this.history.length > 0) {
            if (this.windowEl) {
              this.windowEl.classList.add('pp-has-messages');
            }
            this._scrollToBottom();
          }
        }
      } catch (e) {
        console.error('[Paris Pony] Failed to restore chat history:', e);
      }
    }

    /**
     * Clear all chat history (available for external calls if needed).
     */
    clearHistory() {
      this.history = [];
      this.messagesEl.innerHTML = '';
      if (this.windowEl) {
        this.windowEl.classList.remove('pp-has-messages');
      }
      sessionStorage.removeItem(SS_KEY_HISTORY);
    }


    /* ══════════════════════════════════════════════
       UTILITIES
    ══════════════════════════════════════════════ */
    /**
     * Returns current time as "HH:MM" string.
     * @returns {string}
     */
    _formatTime() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }

    /**
     * Escapes HTML special characters to prevent XSS.
     * @param {string} str
     * @returns {string}
     */
    _esc(str) {
      const escaped = String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
      const withBold = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return withBold.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="pp-btn-link">$1</a>');
    }

  } /* END CLASS ParisPonyChatbot */


  /* ══════════════════════════════════════════════
     BOOT — initialize when DOM is ready
  ═════════════════════════════════════════════ */
  function boot() {
    /* Ensure CHATBOT_DATA is available */
    if (typeof CHATBOT_DATA === 'undefined') {
      console.warn('[Paris Pony] chatbot-data.js not loaded. Chatbot aborted.');
      return;
    }

    /* Mount the widget */
    window.ParisPonyChat = new ParisPonyChatbot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    /* DOM already ready (script loaded defer/async or after DOMContentLoaded) */
    boot();
  }

})(); /* END IIFE */
