/**
 * FILE: find-us.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Interactive controller for the PLUS33 Destination Discovery Experience.
 *
 * RESPONSIBILITIES:
 * - Maintains registry of 8 premier European café destinations.
 * - Initialises Leaflet.js map with custom desaturated Dark Matter tiles.
 * - Renders and updates custom gold pulse markers and active highlight states.
 * - Performs user geolocation calculations via Haversine distance formula.
 * - Runs real-time fuzzy search queries and tag filters (Quiet Workspace, etc.).
 * - Executes dynamic local-time checks to toggle Morning, Evening, and Night modes.
 * - Orchestrates GSAP ScrollTriggers and handles cleanup routines on unmount.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the Destination Discovery locator page.
 * Returns a teardown function to clean up Leaflet map resources, event listeners, and ScrollTriggers.
 * 
 * @returns {Function} Teardown cleanup function.
 */
export function mountFindUsPage() {
  document.body.classList.add('find-us-theme-active');
  const cleanups = [];
  let mapInstance = null;
  let activeTileLayer = null;
  let userGeoMarker = null;
  let userCoords = null;
  let selectedStoreId = null;

  // ═════════ DESTINATION REGISTRY ═════════
  /**
   * Database of premier European cafe destinations.
   * @type {Array.<{id: number, name: string, city: string, address: string, lat: number, lng: number, phone: string, openHours: string, narrative: string, pairings: {selection: string, bite: string}, features: string[], img: string}>}
   */
  const STORES = window.CHATBOT_STORES || [];


  // Map Marker Storage
  let markers = {};
  let isWorldwideActive = false;

  function isRegionRevealed(region, zoom) {
    if (region === 'Europe') return true;
    if (region === 'Middle East') return zoom <= 3.2;
    if (region === 'Asia') return zoom <= 2.7;
    if (region === 'North America' || region === 'South America') return zoom <= 2.2;
    if (region === 'Oceania') return zoom <= 1.7;
    return false;
  }

  function updateMarkerStates() {
    if (!mapInstance) return;
    const currentZoom = mapInstance.getZoom();
    const currentBounds = mapInstance.getBounds();
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Check if any filters are active
    const checkedCheckboxes = document.querySelectorAll('.filters-grid input:checked');
    const activeFilters = Array.from(checkedCheckboxes).map(cb => cb.value);
    const hasSearchOrFilters = query || activeFilters.length > 0;

    STORES.forEach(store => {
      const marker = markers[store.id];
      if (!marker) return;

      const element = marker.getElement();
      if (!element) return;

      let isVisible = false;

      if (hasSearchOrFilters) {
        // If there's search/filter active, check query & filters match
        const matchesQuery = !query ||
          store.name.toLowerCase().includes(query) ||
          store.city.toLowerCase().includes(query) ||
          (store.address && store.address.toLowerCase().includes(query));
        const matchesFilters = activeFilters.every(f => store.features.includes(f));
        isVisible = matchesQuery && matchesFilters;
      } else {
        // No search/filter active:
        // 1. Featured stores are always visible
        if (store.isFeatured) {
          isVisible = true;
        }
        // 2. Selected store is always visible
        else if (selectedStoreId === store.id) {
          isVisible = true;
        }
        // 3. Zoom level matches region or Worldwide mode is active
        else if (isWorldwideActive || isRegionRevealed(store.region, currentZoom)) {
          isVisible = true;
        }
        // 4. Pin is inside the current visible map viewport (user panned to it)
        else if (currentBounds.contains(L.latLng(store.lat, store.lng))) {
          isVisible = true;
        }
      }

      if (isVisible) {
        element.classList.remove('gold-custom-marker--hidden');
      } else {
        element.classList.add('gold-custom-marker--hidden');
        if (marker.isPopupOpen()) {
          marker.closePopup();
        }
      }
    });
  }

  // ═════════ INITIALIZATION ═════════
  const pageContainer = document.querySelector('.locations-page');
  const searchInput = document.getElementById('hero-search-input');
  const geoBtn = document.getElementById('hero-geo-btn');
  const cityQuickLinks = document.querySelectorAll('.city-quick-link');
  const resultsCounter = document.getElementById('results-counter');
  const journalContainer = document.getElementById('journal-listings-container');
  const googleMapsBtn = document.getElementById('google-maps-btn');
  const resetBtn = document.getElementById('map-reset-btn');

  // Premium map controls references
  const zoomInBtn = document.getElementById('map-zoom-in');
  const zoomOutBtn = document.getElementById('map-zoom-out');

  // Dynamic Time-of-Day Atmosphere Mode Selector (Forced Light Mode)
  (function setAtmosphereMode() {
    if (!pageContainer) return;
    // Forcing luxury light mode atmosphere per user request
    pageContainer.classList.remove('locations-page--evening', 'locations-page--night');
    console.log('+33 | Ambient Mode: Light Morning (Forced)');
  })();

  // Bind zoom controls
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (mapInstance) mapInstance.zoomIn(0.5);
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (mapInstance) mapInstance.zoomOut(0.5);
    });
  }

  // Initialize Map
  (function initMap() {
    const mapNode = document.getElementById('find-us-map');
    if (!mapNode || !window.L) return;

    // Center map initially over Europe [Lat, Lng], Zoom level 4.0 per implementation plan.
    mapInstance = L.map('find-us-map', {
      center: [47.5, 10.0],
      zoom: 4.0,
      zoomSnap: 0.1,
      minZoom: 1,
      scrollWheelZoom: false,
      fadeAnimation: true,
      zoomAnimation: true,
      worldCopyJump: true   // Enables seamless infinite world looping
    });

    // CartoDB Voyager tiles for a clean, bright, and detailed modern aesthetic
    activeTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstance);

    // Draw custom matte gold pins for all destinations
    STORES.forEach(store => {
      const customIcon = L.divIcon({
        className: 'gold-custom-marker',
        html: `
          <div class="marker-pin-wrapper">
            <img src="/global/find-us/assets/map-pin.png" class="marker-pin-img" alt="${store.name}" />
            <div class="marker-pulse-ring"></div>
            <span class="marker-city-label">${store.city}</span>
          </div>
        `,
        iconSize: [36, 58],
        iconAnchor: [18, 42]
      });

      const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(mapInstance);

      // Luxury Popup Layout
      const popupHtml = `
        <div class="popup-card">
          <img src="${store.img}" alt="${store.name}" class="popup-img" />
          <div class="popup-body">
            <span class="popup-eyebrow">${store.city}</span>
            <h4 class="popup-title">${store.name}</h4>
            <p style="font-size:0.75rem; line-height:1.4; opacity:0.8;">${store.narrative}</p>
            <div class="popup-meta-row">
              <span>Pairing:</span>
              <span style="color:var(--gold); font-weight:300;">${store.pairings.selection}</span>
            </div>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}" target="_blank" rel="noopener" class="popup-btn">Get Directions</a>
        </div>
      `;
      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -36]
      });

      // Bind click triggers
      marker.on('click', () => {
        selectStore(store.id);
      });

      markers[store.id] = marker;
    });

    // Listen to zoom transitions and manual panning — re-evaluate all pin visibility
    mapInstance.on('zoomend moveend', () => {
      updateMarkerStates();
    });

    // Fade loader once map tiles finish rendering (guaranteeing beautiful loading experience)
    mapInstance.whenReady(() => {
      updateMarkerStates();
      setTimeout(() => {
        const loader = document.getElementById('locations-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.visibility = 'hidden';
          }, 1200);
        }
      }, 1000);
    });
  })();

  // ═════════ LISTING RENDERING ═════════
  function showPlaceholderListing() {
    if (!journalContainer) return;
    journalContainer.innerHTML = `
      <div class="select-destination-placeholder" style="padding: 100px 24px; text-align: center; border: 1px dashed rgba(184, 115, 51, 0.2); border-radius: var(--r-md); background: rgba(245, 241, 234, 0.4); margin-top: 40px;">
        <span class="t-label" style="letter-spacing: 0.3em; color: var(--copper);">Discover +33 Paris</span>
        <h3 class="display-sm text-navy" style="font-family: var(--font-display); font-weight: 300; margin-top: 12.5px; font-size: 1.8rem; letter-spacing: -0.015em;">Select a Destination</h3>
        <p class="t-body" style="margin-top: 16px; color: var(--text-secondary); max-width: 340px; margin-left: auto; margin-right: auto; line-height: 1.8; font-size: 0.9rem;">
          Choose an atelier from the map markers or prominent list above to reveal its details, specialty coffee pairings, and directions.
        </p>
      </div>
    `;
  }

  function selectStore(id) {
    selectedStoreId = id;
    const store = STORES.find(s => s.id === id);
    if (!store) return;

    arriveAtDestination(store.id, store.lat, store.lng);
    renderListings([store]);
  }

  /**
   * Calculations for distance sorting.
   * Uses the Haversine formula to compute km distance between coordinates.
   * @param {number} lat1 - Latitude point A.
   * @param {number} lon1 - Longitude point A.
   * @param {number} lat2 - Latitude point B.
   * @param {number} lon2 - Longitude point B.
   * @returns {number} Distance in kilometers.
   */
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Formats and appends filtered store cards to the left panel listing.
   * @param {Array.<Object>} items - The list of stores to render.
   */
  function renderListings(items) {
    if (!journalContainer) return;
    journalContainer.innerHTML = '';

    if (items.length === 0) {
      journalContainer.innerHTML = `
        <div style="padding: 100px 0; text-align: center;">
          <span class="t-label">NO SANCTUARY FOUND</span>
          <p class="t-body" style="margin-top: 16px;">Try adjusting your keywords or clearing the active filters.</p>
        </div>
      `;
      return;
    }

    items.forEach((store, idx) => {
      const isAlt = idx % 2 === 1;
      const block = document.createElement('div');
      block.className = 'journal-dest-block reveal';
      block.id = `dest-block-${store.id}`;

      const distanceBadge = store.distance
        ? `<div class="dest-distance">${store.distance.toFixed(1)} KM AWAY</div>`
        : '';

      const tagsHtml = store.features.map(f => `<span class="atmosphere-tag">${f}</span>`).join('');

      block.innerHTML = `
        <div class="dest-content-wrap">
          <div class="dest-headline-group">
            <div>
              <span class="t-label">${store.city} · ESTABLISHED 2024</span>
              <h3 class="text-navy">${store.name}</h3>
            </div>
            ${distanceBadge}
          </div>

          <div class="dest-atmosphere-tags">
            ${tagsHtml}
          </div>

          <!-- Asymmetric image positioning based on index -->
          <div class="dest-image-composer" style="margin-left:${isAlt ? 'var(--s2)' : '0'}; margin-right:${isAlt ? '0' : 'var(--s2)'};">
            <img src="${store.img}" alt="${store.name} interior style" />
          </div>

          <p class="t-body dest-story-copy">${store.narrative}</p>

          <!-- Signature Pairings -->
          <div class="dest-pairings">
            <span class="pairings-title">Curated Pairings</span>
            <div class="pairings-list">
              <div class="pairing-item">
                <span class="pairing-key">Evening Selection</span>
                <span class="pairing-val">${store.pairings.selection}</span>
              </div>
              <div class="pairing-item">
                <span class="pairing-key">Signature Pairing</span>
                <span class="pairing-val">${store.pairings.bite}</span>
              </div>
            </div>
          </div>

          <!-- Meta Address Details -->
          <div class="dest-meta-details">
            <div class="meta-detail-item">
              <span class="meta-detail-label">Address</span>
              <span class="meta-detail-val">${store.address}</span>
            </div>
            <div class="meta-detail-item">
              <span class="meta-detail-label">Working Hours</span>
              <span class="meta-detail-val">${store.openHours}</span>
            </div>
          </div>

          <!-- Interactions -->
          <div class="dest-interactions">
            <button class="btn-luxury-pill btn-luxury-pill--primary btn-arrive" data-id="${store.id}">Arrive at Destination</button>
            <a href="https://wa.me/33142610033" target="_blank" rel="noopener" class="btn-luxury-pill btn-luxury-pill--secondary">WhatsApp Atelier</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}" target="_blank" rel="noopener" class="btn-luxury-pill btn-luxury-pill--secondary">Get Directions</a>
          </div>
        </div>
      `;

      // Click callback on card arrive button
      block.querySelector('.btn-arrive').addEventListener('click', () => {
        arriveAtDestination(store.id, store.lat, store.lng);
      });

      journalContainer.appendChild(block);
    });

    // Re-trigger GSAP scroll staggers for newly rendered listings
    gsap.from('.journal-dest-block', {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // ═════════ SEARCH & FILTER HANDLING ═════════
  const suggestionsOverlay = document.getElementById('search-suggestions-overlay');

  function renderSuggestions(query) {
    if (!suggestionsOverlay) return;
    if (!query) {
      suggestionsOverlay.innerHTML = '';
      suggestionsOverlay.classList.remove('search-suggestions-overlay--active');
      return;
    }

    const matches = STORES.filter(store =>
      store.name.toLowerCase().includes(query) ||
      store.city.toLowerCase().includes(query) ||
      (store.address && store.address.toLowerCase().includes(query))
    );

    if (matches.length === 0) {
      suggestionsOverlay.innerHTML = `
        <div class="suggestion-no-results">
          No destinations found
        </div>
      `;
      suggestionsOverlay.classList.add('search-suggestions-overlay--active');
      return;
    }

    suggestionsOverlay.innerHTML = '';
    matches.forEach(store => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';

      const typeBadge = store.isFeatured
        ? `<span class="suggestion-badge">Featured</span>`
        : `<span class="suggestion-badge suggestion-badge--hidden">Hidden</span>`;

      item.innerHTML = `
        <div class="suggestion-info">
          <span class="suggestion-city">${store.city}</span>
          <span class="suggestion-name">${store.name}</span>
        </div>
        <div class="suggestion-meta">
          <span class="suggestion-region">${store.region}</span>
          ${typeBadge}
        </div>
      `;

      item.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = store.city;
        }
        selectStore(store.id);
        suggestionsOverlay.innerHTML = '';
        suggestionsOverlay.classList.remove('search-suggestions-overlay--active');
      });

      suggestionsOverlay.appendChild(item);
    });

    suggestionsOverlay.classList.add('search-suggestions-overlay--active');
  }

  /**
   * Filters the master store list based on query text and checklist criteria.
   */
  function filterDestinations() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Get checked tags
    const checkedCheckboxes = document.querySelectorAll('.filters-grid input:checked');
    const activeFilters = Array.from(checkedCheckboxes).map(cb => cb.value);

    let filtered = STORES.filter(store => {
      // Name, city, address, or features check
      const matchesQuery = !query ||
        store.name.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query) ||
        (store.address && store.address.toLowerCase().includes(query));

      const matchesFilters = activeFilters.every(f => store.features.includes(f));

      return matchesQuery && matchesFilters;
    });

    // Calculate distance if coordinates exist
    if (userCoords) {
      filtered.forEach(store => {
        store.distance = haversineDistance(userCoords.lat, userCoords.lng, store.lat, store.lng);
      });
      // Sort closest first
      filtered.sort((a, b) => a.distance - b.distance);
    }

    // Toggle markers visibility on map via state helper
    updateMarkerStates();

    // Update Counter text
    if (resultsCounter) {
      resultsCounter.textContent = `Displaying ${filtered.length} curated destinations`;
    }

    if (selectedStoreId && filtered.some(s => s.id === selectedStoreId)) {
      const activeStore = STORES.find(s => s.id === selectedStoreId);
      renderListings([activeStore]);
    } else {
      showPlaceholderListing();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      renderSuggestions(searchInput.value.toLowerCase().trim());
    });
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderSuggestions(q);
      filterDestinations();
    });
  }

  // Click outside listener for suggestions overlay
  const onDocumentClick = (e) => {
    if (suggestionsOverlay && !suggestionsOverlay.contains(e.target) && e.target !== searchInput) {
      suggestionsOverlay.classList.remove('search-suggestions-overlay--active');
    }
  };
  document.addEventListener('click', onDocumentClick);
  cleanups.push(() => document.removeEventListener('click', onDocumentClick));

  // Checkbox triggers
  const checkboxes = document.querySelectorAll('.filters-grid input');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', filterDestinations);
  });

  // ═════════ MAP INTERACTIVITY ═════════
  /**
   * Centers the map, triggers markers highlight states, and simulates destination arrivals.
   * @param {number} id - Target store ID.
   * @param {number} lat - Latitude.
   * @param {number} lng - Longitude.
   */
  function arriveAtDestination(id, lat, lng) {
    if (!mapInstance) return;

    // Cinematic pan and zoom transition
    mapInstance.flyTo([lat, lng], 13.5, {
      animate: true,
      duration: 3,
      ease: L.Ease ? L.Ease.cubic : null
    });

    highlightDestination(id);

    // Open Leaflet popup
    const marker = markers[id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 2500);
    }
  }

  /**
   * Toggles custom marker classes to highlight selected destination pins.
   * @param {number} id - Target store ID.
   */
  function highlightDestination(id) {
    updateMarkerStates();
    const store = STORES.find(s => s.id === id);
    if (store && googleMapsBtn) {
      googleMapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
    }

    Object.keys(markers).forEach(key => {
      const m = markers[key];
      const iconElement = m.getElement();
      if (iconElement) {
        if (parseInt(key) === id) {
          iconElement.classList.add('gold-custom-marker--active');
        } else {
          iconElement.classList.remove('gold-custom-marker--active');
        }
      }
    });
  }

  // ═════════ GEOLOCATION HANDLING ═════════
  /**
   * Prompts user coordinates, calculates distances, and centers map.
   */
  function handleGeolocation() {
    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation details.");
      return;
    }

    if (geoBtn) {
      geoBtn.querySelector('span').textContent = "LOCATING ATELIER...";
      geoBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        userCoords = { lat, lng };

        if (googleMapsBtn) {
          googleMapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        }

        // Place user home marker
        if (mapInstance) {
          if (userGeoMarker) mapInstance.removeLayer(userGeoMarker);

          const userIcon = L.divIcon({
            className: 'gold-custom-marker user-custom-marker',
            html: `
              <div class="marker-pin-dot"></div>
              <div class="marker-pulse-ring"></div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          userGeoMarker = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance);
          userGeoMarker.bindPopup('<div class="popup-body" style="padding:10px;"><p style="margin:0;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);">You are here</p></div>');

          // Fly map to user location
          mapInstance.flyTo([lat, lng], 8, {
            animate: true,
            duration: 2.5
          });
        }

        // Re-run filter and sort listings
        filterDestinations();

        if (geoBtn) {
          geoBtn.querySelector('span').textContent = "LOCATING...";
          geoBtn.disabled = false;
        }

        // Reverse geocode coordinates → city name via OSM Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              data.address?.state ||
              'YOUR LOCATION';
            if (geoBtn) {
              geoBtn.querySelector('span').textContent = city.toUpperCase();
            }
          })
          .catch(() => {
            if (geoBtn) {
              geoBtn.querySelector('span').textContent = 'YOUR LOCATION';
            }
          });
      },
      (err) => {
        console.error("Geolocation Error:", err);
        alert("Unable to fetch location. Showing default listings.");
        if (geoBtn) {
          geoBtn.querySelector('span').textContent = "USE CURRENT LOCATION";
          geoBtn.disabled = false;
        }
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }

  if (geoBtn) {
    geoBtn.addEventListener('click', handleGeolocation);
  }

  // Quick link handles
  cityQuickLinks.forEach(link => {
    link.addEventListener('click', () => {
      const city = link.getAttribute('data-city');
      const storesInCity = STORES.filter(s => s.city === city);

      if (storesInCity.length > 0) {
        const store = storesInCity[0];
        selectStore(store.id);
      }
    });
  });

  // ═════════ GSAP ENTRANCES ═════════
  // Hero staggers
  gsap.from('.hero-content-wrapper .reveal', {
    opacity: 0,
    y: 50,
    duration: 1.5,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Panoramic city showcases
  const panoramicItems = document.querySelectorAll('.panoramic-row');
  panoramicItems.forEach(row => {
    const visual = row.querySelector('.panoramic-visual');
    const text = row.querySelector('.panoramic-text');

    gsap.from(visual, {
      scrollTrigger: { trigger: row, start: 'top 85%' },
      opacity: 0,
      scale: 0.95,
      duration: 1.6,
      ease: 'power2.out'
    });

    gsap.from(text, {
      scrollTrigger: { trigger: row, start: 'top 85%' },
      opacity: 0,
      y: 45,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.2
    });
  });

  // Flagships magazine staggers
  const magazineBlocks = document.querySelectorAll('.flagship-magazine-block');
  magazineBlocks.forEach(block => {
    gsap.from(block, {
      scrollTrigger: { trigger: block, start: 'top 85%' },
      opacity: 0,
      y: 60,
      duration: 1.5,
      ease: 'power3.out'
    });
  });

  // Floating stats
  const statElements = document.querySelectorAll('.stat-element');
  statElements.forEach((stat, i) => {
    gsap.from(stat, {
      scrollTrigger: { trigger: '.floating-stats-section', start: 'top 90%' },
      opacity: 0,
      y: 35,
      duration: 1.2,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // FAQ Accordion toggles
  const faqQuestions = document.querySelectorAll('.faq-editorial-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const otherItems = document.querySelectorAll('.faq-editorial-item');

      otherItems.forEach(ot => {
        if (ot !== item) {
          ot.classList.remove('active');
          ot.querySelector('.faq-editorial-question').setAttribute('aria-expanded', 'false');
        }
      });

      const isActive = item.classList.toggle('active');
      btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  });

  // Reset Map View & Filters Click Callback
  function resetMapToDefault() {
    if (!mapInstance) return;

    // 0. Reset worldwide exploration flag
    isWorldwideActive = false;

    // 1. Reset map view to Europe center
    mapInstance.flyTo([47.5, 10.0], 4.0, {
      animate: true,
      duration: 2.5
    });

    // 2. Clear user geolocation marker
    if (userGeoMarker) {
      mapInstance.removeLayer(userGeoMarker);
      userGeoMarker = null;
    }
    userCoords = null;

    // 3. Reset geolocation button state
    if (geoBtn) {
      geoBtn.querySelector('span').textContent = "USE CURRENT LOCATION";
      geoBtn.disabled = false;
    }

    // 4. Clear search query input
    if (searchInput) {
      searchInput.value = '';
    }

    // 5. Reset Google Maps URL
    if (googleMapsBtn) {
      googleMapsBtn.href = "https://www.google.com/maps/search/?api=1&query=48.8584,2.3262";
    }

    // 6. Reset all store highlights
    Object.keys(markers).forEach(key => {
      const m = markers[key];
      const iconElement = m.getElement();
      if (iconElement) {
        iconElement.classList.remove('gold-custom-marker--active');
      }
    });

    // 7. Refresh list / filters
    selectedStoreId = null;
    filterDestinations();
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetMapToDefault);
  }

  const worldwideBtn = document.getElementById('btn-worldwide-trigger');
  if (worldwideBtn) {
    worldwideBtn.addEventListener('click', () => {
      isWorldwideActive = true;
      if (mapInstance) {
        mapInstance.flyTo([20, 10], 1.8, {
          animate: true,
          duration: 3
        });
      }
      updateMarkerStates();
    });
  }

  // Initial listing render
  showPlaceholderListing();

  // ═════════ TEARDOWN CLEANUP Lifecycle Hook ═════════
  return () => {
    document.body.classList.remove('find-us-theme-active');
    // 1. Remove map instance completely to release DOM memory leaks
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      console.log('+33 Destinations | Leaflet Map Destroyed');
    }

    // 2. Clear all triggers
    const allTriggers = ScrollTrigger.getAll();
    allTriggers.forEach(t => t.kill());

    console.log('+33 Destinations | Page Teardown Complete');
  };
}
