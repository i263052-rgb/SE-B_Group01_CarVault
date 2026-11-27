'use strict';

/**
 * Generates a clean SVG placeholder car image data URI.
 * Replace the `image` property in OFFER_VEHICLES with local `../images/...` paths when ready.
 */
function buildPlaceholderCarImage({ label, accentColor, bodyColor, type }) {
  let silhouette = '';

  if (type === 'suv') {
    silhouette = `
      <path d="M92 178 L112 126 Q122 108 148 106 L278 106 Q306 106 326 130 L388 138 Q412 142 416 164 L416 182 L92 182 Z" fill="${bodyColor}" stroke="#e2e8f0" stroke-width="2.5"/>
      <path d="M138 116 L206 116 L206 142 L118 142 Z" fill="#1e293b"/>
      <path d="M218 116 L284 116 L312 142 L218 142 Z" fill="#1e293b"/>
    `;
  } else if (type === 'coupe') {
    silhouette = `
      <path d="M84 180 L114 146 Q160 110 226 110 L272 110 Q320 112 356 140 L414 150 Q426 156 422 180 Z" fill="${bodyColor}" stroke="#e2e8f0" stroke-width="2.5"/>
      <path d="M168 120 L258 120 Q296 122 324 142 L154 142 Z" fill="#1e293b"/>
    `;
  } else {
    silhouette = `
      <path d="M84 180 L106 142 Q132 112 182 110 L276 110 Q314 112 344 138 L412 146 Q424 154 420 180 Z" fill="${bodyColor}" stroke="#e2e8f0" stroke-width="2.5"/>
      <path d="M148 120 L214 120 L214 142 L126 142 Z" fill="#1e293b"/>
      <path d="M226 120 L282 120 L318 142 L226 142 Z" fill="#1e293b"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="500" height="300" fill="url(#bg)"/>
      <circle cx="390" cy="60" r="110" fill="${accentColor}" opacity="0.14"/>
      <ellipse cx="252" cy="196" rx="176" ry="12" fill="#020617" opacity="0.7"/>
      ${silhouette}
      <circle cx="152" cy="182" r="24" fill="#0f172a" stroke="#cbd5e1" stroke-width="5"/>
      <circle cx="152" cy="182" r="9" fill="${accentColor}"/>
      <circle cx="356" cy="182" r="24" fill="#0f172a" stroke="#cbd5e1" stroke-width="5"/>
      <circle cx="356" cy="182" r="9" fill="${accentColor}"/>
      <text x="28" y="256" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="18" font-weight="700">${label}</text>
      <text x="28" y="276" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">CarVault Fleet Sample Image (Replace with local images/ file)</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Special vehicle offers data array.
 * Each offer can later point `image` to a local file such as `../images/bmw-530i.jpg`.
 */
const OFFER_VEHICLES = [
  {
    id: 'bmw-530i-offer',
    name: '2026 BMW 530i M Sport',
    category: 'Executive Sedan',
    dailyPrice: 140,
    discountPercent: 15,
    promoCode: 'VAULT15',
    image: buildPlaceholderCarImage({
      label: '2026 BMW 530i M Sport',
      accentColor: '#3b82f6',
      bodyColor: '#334155',
      type: 'sedan',
    }),
    alt: '2026 BMW 530i M Sport executive sedan parked in studio lighting',
    specs: ['Automatic', '5 Seats', 'Hybrid Petrol', 'Unlimited Mileage'],
    summary:
      'Refined business-class comfort with adaptive suspension, wireless cockpit integration, and 15% seasonal fleet savings.',
    inclusions: [
      'Comprehensive collision damage waiver included',
      'Unlimited daily mileage across city and highway routes',
      'Complimentary second driver registration',
    ],
    terms:
      'Valid on rentals of 2 days or longer booked through CarVault. Standard security deposit applies at pickup. Cannot be combined with additional percentage vouchers.',
  },
  {
    id: 'audi-q7-offer',
    name: '2026 Audi Q7 Quattro',
    category: 'Luxury SUV',
    dailyPrice: 160,
    discountPercent: 10,
    promoCode: 'STUDENT10',
    image: buildPlaceholderCarImage({
      label: '2026 Audi Q7 Quattro',
      accentColor: '#10b981',
      bodyColor: '#475569',
      type: 'suv',
    }),
    alt: '2026 Audi Q7 Quattro seven-seat luxury SUV side profile',
    specs: ['All-Wheel Drive', '7 Seats', 'Panoramic Roof', 'GPS Included'],
    summary:
      'Spacious three-row luxury SUV built for family road trips and campus travel, offered at 10% off the standard daily rate.',
    inclusions: [
      'All-weather Quattro drivetrain and built-in navigation',
      'Flexible 24-hour free cancellation prior to pickup',
      'Roadside assistance included 24/7',
    ],
    terms:
      'Available for drivers aged 21+ with valid driver license and booking confirmation. Discount applies to base daily rental rate; optional child seats and toll passes billed separately.',
  },
  {
    id: 'porsche-911-offer',
    name: '2026 Porsche 911 Carrera',
    category: 'Performance Coupe',
    dailyPrice: 250,
    discountPercent: 20,
    promoCode: 'WEEKEND20',
    image: buildPlaceholderCarImage({
      label: '2026 Porsche 911 Carrera',
      accentColor: '#f59e0b',
      bodyColor: '#1e293b',
      type: 'coupe',
    }),
    alt: '2026 Porsche 911 Carrera performance coupe in obsidian finish',
    specs: ['8-Speed PDK', '2+2 Seats', 'Twin-Turbo Flat-6', 'Sport Chrono'],
    summary:
      'Signature grand touring performance with crisp handling and 20% weekend escape savings on multi-day bookings.',
    inclusions: [
      '250 daily miles included with discounted extra-mile tier',
      'Dedicated concierge handover at CarVault flagship hubs',
      'Full tank departure policy with transparent refueling',
    ],
    terms:
      'Minimum driver age of 25 required for performance tier vehicles. Weekend 20% discount applies automatically to Friday-through-Monday reservations or with code WEEKEND20.',
  },
];

/**
 * Valid promo codes supported by the Discount Code Box.
 */
const PROMO_CODES = {
  VAULT15: {
    discount: 15,
    description: '15% off Executive Sedan & Fleet Rentals',
  },
  STUDENT10: {
    discount: 10,
    description: '10% off Student & Campus Verified Rentals',
  },
  WEEKEND20: {
    discount: 20,
    description: '20% off Weekend & Performance Rentals',
  },
};

const PROMO_STORAGE_KEY = 'carvault_active_promo';

/**
 * Formats a numeric value as USD currency.
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Computes discounted daily price from base price and discount percentage.
 */
function calculateDiscountedPrice(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}

/**
 * Escapes HTML special characters before inserting dynamic text into templates.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * Renders the 3 Special Vehicle Offer cards into #offers-grid.
 */
function renderOfferCards(onViewOffer) {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;

  grid.innerHTML = OFFER_VEHICLES.map((offer) => {
    const discountedPrice = calculateDiscountedPrice(offer.dailyPrice, offer.discountPercent);
    const specsMarkup = offer.specs
      .map((spec) => `<span class="offer-spec-chip">${escapeHtml(spec)}</span>`)
      .join('');

    return `
      <div class="col-12 col-lg-4">
        <article class="offer-card" data-offer-id="${escapeHtml(offer.id)}">
          <div class="offer-card-media">
            <img
              src="${offer.image}"
              alt="${escapeHtml(offer.alt)}"
              class="offer-card-img"
              loading="lazy"
            />
            <span class="offer-discount-badge" aria-label="${offer.discountPercent}% discount">
              -${offer.discountPercent}%
            </span>
          </div>
          <div class="p-4 d-flex flex-column flex-grow-1">
            <span class="offer-category-tag">${escapeHtml(offer.category)}</span>
            <h3 class="offer-card-title">${escapeHtml(offer.name)}</h3>
            <p class="text-secondary small mb-3">${escapeHtml(offer.summary)}</p>
            <div class="offer-specs-list">${specsMarkup}</div>
            <div class="offer-price-row">
              <div>
                <span class="offer-price-original">${formatCurrency(offer.dailyPrice)}</span>
                <span class="offer-price-discounted">${formatCurrency(discountedPrice)}</span>
                <span class="offer-price-unit">/ day</span>
              </div>
              <button
                type="button"
                class="btn btn-carvault btn-sm px-3 js-view-offer"
                data-offer-id="${escapeHtml(offer.id)}"
              >
                View
              </button>
            </div>
          </div>
        </article>
      </div>
    `;
  }).join('');

  grid.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('.js-view-offer');
    if (!viewBtn) return;
    const offerId = viewBtn.getAttribute('data-offer-id');
    onViewOffer(offerId);
  });
}

/**
 * Sets up and populates the Bootstrap 5 Offer Details modal.
 */
function createOfferModalHandler() {
  const modalElement = document.getElementById('offerDetailsModal');
  if (!modalElement || typeof bootstrap === 'undefined') {
    return () => {};
  }

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  const titleEl = document.getElementById('offerModalTitle');
  const categoryEl = document.getElementById('offerModalCategory');
  const badgeEl = document.getElementById('offerModalBadge');
  const imgEl = document.getElementById('offerModalImage');
  const summaryEl = document.getElementById('offerModalSummary');
  const originalPriceEl = document.getElementById('offerModalOriginalPrice');
  const discountedPriceEl = document.getElementById('offerModalDiscountedPrice');
  const savingsEl = document.getElementById('offerModalSavings');
  const codeEl = document.getElementById('offerModalCode');
  const specsEl = document.getElementById('offerModalSpecs');
  const inclusionsEl = document.getElementById('offerModalInclusions');
  const termsEl = document.getElementById('offerModalTerms');

  return function openOfferModal(offerId) {
    const offer = OFFER_VEHICLES.find((item) => item.id === offerId);
    if (!offer) return;

    const discountedPrice = calculateDiscountedPrice(offer.dailyPrice, offer.discountPercent);
    const dailySavings = offer.dailyPrice - discountedPrice;

    titleEl.textContent = offer.name;
    categoryEl.textContent = offer.category;
    badgeEl.textContent = `-${offer.discountPercent}% OFF`;
    imgEl.src = offer.image;
    imgEl.alt = offer.alt;
    summaryEl.textContent = offer.summary;
    originalPriceEl.textContent = `${formatCurrency(offer.dailyPrice)} / day`;
    discountedPriceEl.textContent = `${formatCurrency(discountedPrice)} / day`;
    savingsEl.textContent = `Save ${formatCurrency(dailySavings)} per day`;
    codeEl.textContent = offer.promoCode;
    termsEl.textContent = offer.terms;

    specsEl.innerHTML = offer.specs
      .map((spec) => `<span class="offer-spec-chip">${escapeHtml(spec)}</span>`)
      .join('');

    inclusionsEl.innerHTML = offer.inclusions
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');

    modalInstance.show();
  };
}

/**
 * Initializes the Discount Code Box with validation and localStorage persistence.
 */
function initPromoCodeBox() {
  const form = document.getElementById('promo-code-form');
  const input = document.getElementById('promo-code-input');
  const feedbackEl = document.getElementById('promo-feedback');
  if (!form || !input || !feedbackEl) return;

  function renderFeedback(type, message, activeCode = '') {
    feedbackEl.className = `promo-feedback is-visible ${type === 'success' ? 'is-success' : 'is-error'}`;
    if (type === 'success' && activeCode) {
      feedbackEl.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button type="button" class="btn btn-sm btn-outline-success py-0 px-2" id="clear-promo-btn">
          Remove
        </button>
      `;
      const clearBtn = document.getElementById('clear-promo-btn');
      clearBtn?.addEventListener('click', () => {
        localStorage.removeItem(PROMO_STORAGE_KEY);
        input.value = '';
        feedbackEl.className = 'promo-feedback';
        feedbackEl.innerHTML = '';
        input.focus();
      });
    } else {
      feedbackEl.textContent = message;
    }
  }

  function applyPromoCode(rawCode) {
    const normalizedCode = rawCode.trim().toUpperCase();

    if (!normalizedCode) {
      renderFeedback('error', 'Please enter a promo code before applying.');
      return;
    }

    const promo = PROMO_CODES[normalizedCode];
    if (!promo) {
      renderFeedback(
        'error',
        `Promo code "${normalizedCode}" is invalid. Try VAULT15, STUDENT10, or WEEKEND20.`
      );
      return;
    }

    localStorage.setItem(PROMO_STORAGE_KEY, normalizedCode);
    input.value = normalizedCode;
    renderFeedback(
      'success',
      `Applied ${normalizedCode}: ${promo.description} (saved for your session).`,
      normalizedCode
    );
  }

  // Restore saved promo code from localStorage if valid
  const savedCode = (localStorage.getItem(PROMO_STORAGE_KEY) || '').trim().toUpperCase();
  if (savedCode && PROMO_CODES[savedCode]) {
    const promo = PROMO_CODES[savedCode];
    input.value = savedCode;
    renderFeedback(
      'success',
      `Active code ${savedCode}: ${promo.description} (restored from saved session).`,
      savedCode
    );
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyPromoCode(input.value);
  });
}

/**
 * Initializes the real-time Discount Calculator Box.
 */
function initDiscountCalculator() {
  const priceInput = document.getElementById('calc-price');
  const discountInput = document.getElementById('calc-discount');
  const totalEl = document.getElementById('calc-total');
  const savingsEl = document.getElementById('calc-savings');
  const feedbackEl = document.getElementById('calc-feedback');
  if (!priceInput || !discountInput || !totalEl || !savingsEl || !feedbackEl) return;

  function setError(message, invalidField) {
    feedbackEl.textContent = message;
    feedbackEl.classList.add('is-error');
    priceInput.classList.toggle('is-invalid', invalidField === 'price' || invalidField === 'both');
    discountInput.classList.toggle('is-invalid', invalidField === 'discount' || invalidField === 'both');
    totalEl.textContent = formatCurrency(0);
    savingsEl.textContent = `Savings: ${formatCurrency(0)}`;
  }

  function updateCalculation() {
    const rawPrice = priceInput.value.trim();
    const rawDiscount = discountInput.value.trim();

    priceInput.classList.remove('is-invalid');
    discountInput.classList.remove('is-invalid');
    feedbackEl.classList.remove('is-error');

    if (priceInput.validity?.badInput) {
      setError('Price must be a valid non-negative amount.', 'price');
      return;
    }

    if (discountInput.validity?.badInput) {
      setError('Discount percentage must be between 0% and 100%.', 'discount');
      return;
    }

    if (rawPrice === '' && rawDiscount === '') {
      feedbackEl.textContent = 'Enter a rental price and discount percentage to see your live total.';
      totalEl.textContent = formatCurrency(0);
      savingsEl.textContent = `Savings: ${formatCurrency(0)}`;
      return;
    }

    const price = rawPrice === '' ? NaN : Number(rawPrice);
    const discount = rawDiscount === '' ? 0 : Number(rawDiscount);

    if (rawPrice === '') {
      feedbackEl.textContent = 'Enter a rental price to calculate your discounted total.';
      totalEl.textContent = formatCurrency(0);
      savingsEl.textContent = `Savings: ${formatCurrency(0)}`;
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid non-negative amount.', 'price');
      return;
    }

    if (rawDiscount !== '' && (!Number.isFinite(discount) || discount < 0 || discount > 100)) {
      setError('Discount percentage must be between 0% and 100%.', 'discount');
      return;
    }

    const savings = price * (discount / 100);
    const finalTotal = Math.max(0, price - savings);

    totalEl.textContent = formatCurrency(finalTotal);
    savingsEl.textContent = `Savings: ${formatCurrency(savings)}`;
    feedbackEl.textContent =
      discount > 0
        ? `${discount}% discount applied to ${formatCurrency(price)}.`
        : 'Showing standard rate (0% discount).';
  }

  priceInput.addEventListener('input', updateCalculation);
  discountInput.addEventListener('input', updateCalculation);
  updateCalculation();
}

document.addEventListener('DOMContentLoaded', () => {
  const openOfferModal = createOfferModalHandler();
  renderOfferCards(openOfferModal);
  initPromoCodeBox();
  initDiscountCalculator();
});
