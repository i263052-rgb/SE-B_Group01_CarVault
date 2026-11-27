'use strict';

/**
 * Generates an inline SVG fallback data URI if an external photo fails to load.
 */
function buildFallbackCarImage(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="cvbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#091715"/>
          <stop offset="100%" stop-color="#20352f"/>
        </linearGradient>
      </defs>
      <rect width="900" height="540" fill="url(#cvbg)"/>
      <circle cx="720" cy="110" r="160" fill="#c9a66b" opacity="0.12"/>
      <path d="M180 340 L240 250 Q285 200 375 198 L545 198 Q620 202 675 254 L760 272 Q780 286 774 340 Z" fill="#102521" stroke="#c9a66b" stroke-width="4"/>
      <circle cx="305" cy="342" r="44" fill="#091715" stroke="#c9a66b" stroke-width="6"/>
      <circle cx="620" cy="342" r="44" fill="#091715" stroke="#c9a66b" stroke-width="6"/>
      <text x="56" y="455" fill="#f3eee5" font-family="Manrope, sans-serif" font-size="30" font-weight="800">${label}</text>
      <text x="56" y="490" fill="#b5bdb7" font-family="DM Sans, sans-serif" font-size="18">CarVault Royal Emerald Collection</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Special vehicle offers data array with curated Unsplash car photography.
 */
const OFFER_VEHICLES = [
  {
    id: 'bmw-530i-offer',
    name: '2026 BMW 530i M Sport',
    category: 'Executive Sedan',
    dailyPrice: 140,
    discountPercent: 15,
    promoCode: 'VAULT15',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85',
    fallbackImage: buildFallbackCarImage('2026 BMW 530i M Sport'),
    alt: '2026 BMW 530i M Sport executive sedan on open road',
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
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=85',
    fallbackImage: buildFallbackCarImage('2026 Audi Q7 Quattro'),
    alt: '2026 Audi Q7 Quattro luxury SUV in studio lighting',
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
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
    fallbackImage: buildFallbackCarImage('2026 Porsche 911 Carrera'),
    alt: '2026 Porsche 911 Carrera sports coupe parked outdoors',
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

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateDiscountedPrice(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * Attaches a safe one-time fallback image handler when an external URL fails.
 */
function attachImageFallback(imgElement, fallbackSrc) {
  if (!imgElement || !fallbackSrc) return;
  imgElement.onerror = function handleImgError() {
    this.onerror = null;
    this.src = fallbackSrc;
  };
}

/**
 * Mobile menu toggle using .navlinks.open and .menu-toggle.
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/**
 * Renders the 3 Special Vehicle Offer cards into #offers-grid using .card structure.
 */
function renderOfferCards(onViewOffer) {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;

  grid.innerHTML = OFFER_VEHICLES.map((offer) => {
    const discountedPrice = calculateDiscountedPrice(offer.dailyPrice, offer.discountPercent);
    const specsLine = offer.specs.join(' · ');

    return `
      <article class="card" data-offer-id="${escapeHtml(offer.id)}">
        <div class="card-image">
          <img
            src="${escapeHtml(offer.image)}"
            alt="${escapeHtml(offer.alt)}"
            loading="lazy"
            data-fallback="${escapeHtml(offer.fallbackImage)}"
          />
          <span class="pill" aria-label="${offer.discountPercent}% discount">-${offer.discountPercent}%</span>
        </div>
        <div class="card-body">
          <div class="meta">${escapeHtml(offer.category)} · ${escapeHtml(specsLine)}</div>
          <h3>${escapeHtml(offer.name)}</h3>
          <p>${escapeHtml(offer.summary)}</p>
          <div class="card-bottom">
            <div>
              <span class="muted" style="text-decoration: line-through; margin-right: 8px; font-size: 13px;">${formatCurrency(offer.dailyPrice)}</span>
              <span class="price">${formatCurrency(discountedPrice)}</span>
              <span class="meta">/ day</span>
            </div>
            <button
              type="button"
              class="btn small js-view-offer"
              data-offer-id="${escapeHtml(offer.id)}"
            >
              View
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('img[data-fallback]').forEach((img) => {
    attachImageFallback(img, img.getAttribute('data-fallback'));
  });

  grid.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('.js-view-offer');
    if (!viewBtn) return;
    const offerId = viewBtn.getAttribute('data-offer-id');
    onViewOffer(offerId);
  });
}

/**
 * Sets up the offer details modal using .panel and .hidden classes.
 */
function createOfferModalHandler() {
  const modalEl = document.getElementById('offerDetailsModal');
  const closeBtn = document.getElementById('offerModalClose');
  const dismissBtn = document.getElementById('offerModalDismiss');
  if (!modalEl) return () => {};

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

  function closeModal() {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  dismissBtn?.addEventListener('click', closeModal);

  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalEl.classList.contains('hidden')) {
      closeModal();
    }
  });

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
    attachImageFallback(imgEl, offer.fallbackImage);
    summaryEl.textContent = offer.summary;
    originalPriceEl.textContent = `${formatCurrency(offer.dailyPrice)} / day`;
    discountedPriceEl.textContent = `${formatCurrency(discountedPrice)} / day`;
    savingsEl.textContent = `Save ${formatCurrency(dailySavings)} per day`;
    codeEl.textContent = offer.promoCode;
    specsEl.textContent = offer.specs.join(' · ');
    termsEl.textContent = offer.terms;

    inclusionsEl.innerHTML = offer.inclusions
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');

    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
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
    feedbackEl.className = type === 'success' ? 'notice row' : 'notice error';
    if (type === 'success' && activeCode) {
      feedbackEl.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button type="button" class="btn ghost small" id="clear-promo-btn">Remove</button>
      `;
      const clearBtn = document.getElementById('clear-promo-btn');
      clearBtn?.addEventListener('click', () => {
        localStorage.removeItem(PROMO_STORAGE_KEY);
        input.value = '';
        feedbackEl.className = 'notice hidden';
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

  function setError(message) {
    feedbackEl.className = 'notice error';
    feedbackEl.textContent = message;
    totalEl.textContent = formatCurrency(0);
    savingsEl.textContent = `Savings: ${formatCurrency(0)}`;
  }

  function updateCalculation() {
    const rawPrice = priceInput.value.trim();
    const rawDiscount = discountInput.value.trim();

    if (priceInput.validity?.badInput) {
      setError('Price must be a valid non-negative amount.');
      return;
    }

    if (discountInput.validity?.badInput) {
      setError('Discount percentage must be between 0% and 100%.');
      return;
    }

    if (rawPrice === '' && rawDiscount === '') {
      feedbackEl.className = 'meta';
      feedbackEl.style.marginTop = '12px';
      feedbackEl.textContent =
        'Enter a rental price and discount percentage to see your live total.';
      totalEl.textContent = formatCurrency(0);
      savingsEl.textContent = `Savings: ${formatCurrency(0)}`;
      return;
    }

    const price = rawPrice === '' ? NaN : Number(rawPrice);
    const discount = rawDiscount === '' ? 0 : Number(rawDiscount);

    if (rawPrice === '') {
      feedbackEl.className = 'meta';
      feedbackEl.style.marginTop = '12px';
      feedbackEl.textContent = 'Enter a rental price to calculate your discounted total.';
      totalEl.textContent = formatCurrency(0);
      savingsEl.textContent = `Savings: ${formatCurrency(0)}`;
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid non-negative amount.');
      return;
    }

    if (rawDiscount !== '' && (!Number.isFinite(discount) || discount < 0 || discount > 100)) {
      setError('Discount percentage must be between 0% and 100%.');
      return;
    }

    const savings = price * (discount / 100);
    const finalTotal = Math.max(0, price - savings);

    totalEl.textContent = formatCurrency(finalTotal);
    savingsEl.textContent = `Savings: ${formatCurrency(savings)}`;
    feedbackEl.className = 'meta';
    feedbackEl.style.marginTop = '12px';
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
  initMobileNav();
  const openOfferModal = createOfferModalHandler();
  renderOfferCards(openOfferModal);
  initPromoCodeBox();
  initDiscountCalculator();
});
