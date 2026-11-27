'use strict';

/* ============================================================
   CarVault — Offers Page JavaScript
   Features:
   - Full dark obsidian theme with PKR currency formatting
   - Studio white car card rendering & modal viewer
   - Working promo code validator with localStorage
   - Live real-time discount & savings calculator in PKR
   ============================================================ */

/* ── 1. STUDIO WHITE FALLBACK SVG BUILDER ──────────────────── */
function buildFallbackCarImage(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" role="img" aria-label="${label}">
      <defs>
        <radialGradient id="studioLight" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="65%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <radialGradient id="carShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Studio White Backdrop -->
      <rect width="900" height="540" fill="url(#studioLight)"/>
      <ellipse cx="450" cy="380" rx="360" ry="24" fill="url(#carShadow)"/>
      <!-- Studio Vehicle Silhouette -->
      <path d="M180 340 L240 250 Q285 200 375 198 L545 198 Q620 202 675 254 L760 272 Q780 286 774 340 Z"
            fill="#1f2125" stroke="#eab308" stroke-width="4"/>
      <circle cx="305" cy="342" r="44" fill="#141517" stroke="#eab308" stroke-width="5"/>
      <circle cx="620" cy="342" r="44" fill="#141517" stroke="#eab308" stroke-width="5"/>
      <circle cx="305" cy="342" r="16" fill="#eab308"/>
      <circle cx="620" cy="342" r="16" fill="#eab308"/>
      <text x="450" y="455" text-anchor="middle" fill="#0f172a" font-family="Manrope,sans-serif" font-size="28" font-weight="800">${label}</text>
      <text x="450" y="490" text-anchor="middle" fill="#64748b" font-family="DM Sans,sans-serif" font-size="16">CarVault Studio Collection · Islamabad, Pakistan</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/* ── 2. OFFER DATA (PAKISTANI RUPEES - PKR) ─────────────────── */
const OFFER_VEHICLES = [
  {
    id              : 'bmw-530i-offer',
    name            : '2026 BMW 530i M Sport',
    category        : 'Executive Sedan',
    originalPrice   : 22000000,
    discountPercent : 15,
    finalPrice      : 18700000,
    promoCode       : 'VAULT15',
    image           : 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85',
    alt             : '2026 BMW 530i M Sport executive sedan on studio display',
    specs           : ['Automatic Steptronic', '5 Executive Seats', 'Mild Hybrid Turbo', 'Unlimited Warranty'],
    summary         : 'Refined business-class comfort with adaptive M suspension, BMW curved display cockpit, and PKR 3,300,000 seasonal fleet savings.',
    inclusions      : [
      'Comprehensive CarVault bumper-to-bumper warranty in Pakistan',
      'Complimentary 3-year scheduled maintenance at authorized centers',
      'VIP Islamabad showroom delivery and personalized handover',
    ],
    terms           : 'Offer valid on direct orders or bookings placed via CarVault. Verified code VAULT15 required at final booking. Applicable across Islamabad, Lahore, and Karachi hubs.',
  },
  {
    id              : 'audi-q7-offer',
    name            : '2026 Audi Q7 Quattro',
    category        : 'Luxury SUV',
    originalPrice   : 28500000,
    discountPercent : 10,
    finalPrice      : 25650000,
    promoCode       : 'STUDENT10',
    image           : 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=85',
    alt             : '2026 Audi Q7 Quattro luxury SUV in studio lighting',
    specs           : ['Quattro All-Wheel Drive', '7 Luxury Seats', 'Panoramic Glass Roof', 'MMI Navigation Plus'],
    summary         : 'Prestige 3-row family SUV with adaptive air suspension, matrix LED lighting, and 10% instant promo savings saving PKR 2,850,000.',
    inclusions      : [
      'All-weather Quattro intelligent drivetrain & terrain management',
      'Complimentary tracking and telemetry integration across Pakistan',
      'CarVault 24/7 dedicated roadside concierge assistance',
    ],
    terms           : 'Code STUDENT10 applies on verified student credentials or family fleet packages. Base price PKR 28,500,000 reduced to PKR 25,650,000.',
  },
  {
    id              : 'porsche-911-offer',
    name            : '2026 Porsche 911 Carrera',
    category        : 'Performance Coupe',
    originalPrice   : 48000000,
    discountPercent : 20,
    finalPrice      : 38400000,
    promoCode       : 'WEEKEND20',
    image           : 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=85',
    alt             : '2026 Porsche 911 Carrera sports coupe in pure white studio lighting',
    specs           : ['8-Speed PDK Dual-Clutch', '2+2 Sport Seats', 'Twin-Turbo Flat-6 3.0L', 'Sport Chrono Package'],
    summary         : 'The definitive sports car benchmark delivering iconic performance, razor-sharp dynamics, and PKR 9,600,000 weekend privilege discount.',
    inclusions      : [
      'Sport Chrono package with mode switch and track precision app',
      'CarVault white-glove enclosed transporter delivery',
      'Exclusive membership to CarVault track and tour events',
    ],
    terms           : 'Weekend privilege rate available with code WEEKEND20. Minimum registration requirements apply. Reduced from PKR 48,000,000 to PKR 38,400,000.',
  },
];

const PROMO_CODES = {
  VAULT15  : { discount: 15, description: '15% off Executive Sedan & Fleet Orders'  },
  STUDENT10: { discount: 10, description: '10% off Student & Family Fleet Orders'   },
  WEEKEND20: { discount: 20, description: '20% off Performance & Weekend Bookings' },
};

const PROMO_STORAGE_KEY = 'carvault_active_promo';

/* ── 3. CURRENCY FORMATTER (PKR WITH COMMA SEPARATORS) ─────── */
function formatCurrency(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return 'PKR ' + rounded.toLocaleString('en-US');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function attachImageFallback(imgEl, fallbackSrc) {
  if (!imgEl || !fallbackSrc) return;
  imgEl.onerror = function () {
    this.onerror = null;
    this.src = fallbackSrc;
  };
}

/* ── 4. MOBILE NAVIGATION ─────────────────────────────────── */
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks  = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ── 5. OFFER CARDS RENDERING ─────────────────────────────── */
function renderOfferCards(onViewOffer) {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;

  grid.innerHTML = OFFER_VEHICLES.map((offer) => {
    const savings     = offer.originalPrice - offer.finalPrice;
    const fallbackSrc = buildFallbackCarImage(offer.name);

    return `
      <article class="ov-card" role="listitem" data-offer-id="${escapeHtml(offer.id)}">

        <!-- Studio White Car Image Box -->
        <div class="ov-card-img-wrap card-image">
          <img
            src="${escapeHtml(offer.image)}"
            alt="${escapeHtml(offer.alt)}"
            loading="lazy"
            data-fallback="${escapeHtml(fallbackSrc)}"
          />
          <span class="ov-badge" aria-label="${offer.discountPercent}% discount">
            &minus;${offer.discountPercent}%
          </span>
        </div>

        <div class="ov-card-body">
          <div class="ov-card-category">${escapeHtml(offer.category)}</div>
          <h3 class="ov-card-name">${escapeHtml(offer.name)}</h3>
          <p class="ov-card-summary">${escapeHtml(offer.summary)}</p>

          <div class="ov-card-code">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Code: <strong>${escapeHtml(offer.promoCode)}</strong>
          </div>

          <div class="ov-card-footer">
            <div class="ov-price-block">
              <span class="ov-price-original">${formatCurrency(offer.originalPrice)}</span>
              <span class="ov-price-sale">
                ${formatCurrency(offer.finalPrice)}
                <span>Save ${formatCurrency(savings)}</span>
              </span>
            </div>
            <button
              type="button"
              class="ov-view-btn js-view-offer"
              data-offer-id="${escapeHtml(offer.id)}"
              aria-label="View details for ${escapeHtml(offer.name)}"
            >
              View Details
            </button>
          </div>
        </div>

      </article>
    `;
  }).join('');

  /* Attach studio-white fallbacks */
  grid.querySelectorAll('img[data-fallback]').forEach((img) => {
    attachImageFallback(img, img.getAttribute('data-fallback'));
  });

  /* Delegated click handler */
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-view-offer');
    if (!btn) return;
    onViewOffer(btn.getAttribute('data-offer-id'));
  });
}

/* ── 6. VIEW DETAILS MODAL ────────────────────────────────── */
function createOfferModalHandler() {
  const modalEl         = document.getElementById('offerDetailsModal');
  const closeBtn        = document.getElementById('offerModalClose');
  const dismissBtn      = document.getElementById('offerModalDismiss');
  if (!modalEl) return () => {};

  const titleEl         = document.getElementById('offerModalTitle');
  const categoryEl      = document.getElementById('offerModalCategory');
  const badgeEl         = document.getElementById('offerModalBadge');
  const imgEl           = document.getElementById('offerModalImage');
  const summaryEl       = document.getElementById('offerModalSummary');
  const originalPriceEl = document.getElementById('offerModalOriginalPrice');
  const discountedPriceEl = document.getElementById('offerModalDiscountedPrice');
  const savingsEl       = document.getElementById('offerModalSavings');
  const codeEl          = document.getElementById('offerModalCode');
  const specsEl         = document.getElementById('offerModalSpecs');
  const inclusionsEl    = document.getElementById('offerModalInclusions');
  const termsEl         = document.getElementById('offerModalTerms');

  function closeModal() {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  dismissBtn?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) closeModal();
  });

  return function openOfferModal(offerId) {
    const offer = OFFER_VEHICLES.find((o) => o.id === offerId);
    if (!offer) return;

    const savings = offer.originalPrice - offer.finalPrice;

    titleEl.textContent          = offer.name;
    categoryEl.textContent       = offer.category;
    badgeEl.textContent          = `\u2212${offer.discountPercent}% OFF`;
    imgEl.src                    = offer.image;
    imgEl.alt                    = offer.alt;
    attachImageFallback(imgEl, buildFallbackCarImage(offer.name));
    summaryEl.textContent        = offer.summary;
    originalPriceEl.textContent  = `Was: ${formatCurrency(offer.originalPrice)}`;
    discountedPriceEl.innerHTML  = `${formatCurrency(offer.finalPrice)}<small> / special price</small>`;
    savingsEl.textContent        = `You save ${formatCurrency(savings)}`;
    codeEl.textContent           = offer.promoCode;
    specsEl.textContent          = offer.specs.join(' · ');
    termsEl.textContent          = offer.terms;
    inclusionsEl.innerHTML       = offer.inclusions
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');

    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };
}

/* ── 7. PROMO CODE BOX ────────────────────────────────────── */
function initPromoCodeBox() {
  const form       = document.getElementById('promo-code-form');
  const input      = document.getElementById('promo-code-input');
  const feedbackEl = document.getElementById('promo-feedback');
  if (!form || !input || !feedbackEl) return;

  function showFeedback(type, message, activeCode = '') {
    feedbackEl.className = `ov-notice ${type}`;

    if (type === 'success' && activeCode) {
      const removeId = 'ov-remove-promo';
      feedbackEl.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button type="button" class="ov-notice-remove" id="${removeId}">Remove</button>
      `;
      document.getElementById(removeId)?.addEventListener('click', () => {
        localStorage.removeItem(PROMO_STORAGE_KEY);
        input.value          = '';
        feedbackEl.className = 'hidden';
        feedbackEl.innerHTML = '';
        input.focus();
      });
    } else {
      feedbackEl.textContent = message;
    }
  }

  function applyPromoCode(rawCode) {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      showFeedback('error', 'Please enter a promo code before applying.');
      return;
    }
    const promo = PROMO_CODES[code];
    if (!promo) {
      showFeedback('error', `"${code}" is not a valid code. Try VAULT15, STUDENT10, or WEEKEND20.`);
      return;
    }
    localStorage.setItem(PROMO_STORAGE_KEY, code);
    input.value = code;
    showFeedback('success', `✓ Applied ${code}: ${promo.description} — saved for your session.`, code);
  }

  /* Restore saved code on page load */
  const savedCode = (localStorage.getItem(PROMO_STORAGE_KEY) || '').trim().toUpperCase();
  if (savedCode && PROMO_CODES[savedCode]) {
    input.value = savedCode;
    showFeedback(
      'success',
      `✓ Active code ${savedCode}: ${PROMO_CODES[savedCode].description} (restored from session).`,
      savedCode
    );
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    applyPromoCode(input.value);
  });
}

/* ── 8. LIVE DISCOUNT CALCULATOR IN PKR ────────────────────── */
function initDiscountCalculator() {
  const priceInput    = document.getElementById('calc-price');
  const discountInput = document.getElementById('calc-discount');
  const totalEl       = document.getElementById('calc-total');
  const savingsEl     = document.getElementById('calc-savings');
  const feedbackEl    = document.getElementById('calc-feedback');
  if (!priceInput || !discountInput || !totalEl || !savingsEl || !feedbackEl) return;

  // Set default values if empty
  if (!priceInput.value) {
    priceInput.value = '22000000';
  }
  if (!discountInput.value) {
    discountInput.value = '15';
  }

  function setError(msg) {
    feedbackEl.textContent = msg;
    totalEl.textContent    = formatCurrency(0);
    savingsEl.textContent  = 'Savings: ' + formatCurrency(0);
  }

  function recalculate() {
    const rawPrice    = priceInput.value.trim();
    const rawDiscount = discountInput.value.trim();

    if (priceInput.validity?.badInput) { setError('Price must be a valid non-negative number.'); return; }
    if (discountInput.validity?.badInput) { setError('Discount must be between 0 and 100.'); return; }

    if (rawPrice === '' && rawDiscount === '') {
      feedbackEl.textContent = 'Enter a price in PKR and discount percentage to see your live total.';
      totalEl.textContent    = formatCurrency(0);
      savingsEl.textContent  = 'Savings: ' + formatCurrency(0);
      return;
    }

    if (rawPrice === '') {
      feedbackEl.textContent = 'Enter a vehicle price to calculate your discounted PKR total.';
      totalEl.textContent    = formatCurrency(0);
      savingsEl.textContent  = 'Savings: ' + formatCurrency(0);
      return;
    }

    const price    = Number(rawPrice);
    const discount = rawDiscount === '' ? 0 : Number(rawDiscount);

    if (!Number.isFinite(price) || price < 0) { setError('Price must be a valid non-negative number.'); return; }
    if (rawDiscount !== '' && (!Number.isFinite(discount) || discount < 0 || discount > 100)) {
      setError('Discount percentage must be between 0% and 100%.');
      return;
    }

    const savings    = price * (discount / 100);
    const finalTotal = Math.max(0, price - savings);

    totalEl.textContent   = formatCurrency(finalTotal);
    savingsEl.textContent = `Savings: ${formatCurrency(savings)}`;
    feedbackEl.textContent = discount > 0
      ? `${discount}% discount applied to ${formatCurrency(price)}.`
      : 'Showing standard rate (0% discount).';
  }

  priceInput.addEventListener('input', recalculate);
  discountInput.addEventListener('input', recalculate);
  recalculate();
}

/* ── 9. INITIALIZE ON DOM READY ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  const openOfferModal = createOfferModalHandler();
  renderOfferCards(openOfferModal);
  initPromoCodeBox();
  initDiscountCalculator();
});
