'use strict';

/* ============================================================
   CarVault — Customer Reviews Page JavaScript
   Features:
   - Mobile navigation drawer toggle
   - Initial 3 wireframe review cards (Ali 5★, Sara 4★, Oomar 5★)
   - Interactive 5-star selector with hover previews
   - Required field validation with inline error messaging
   - Live prepending of new reviews to the top of the feed
   - LocalStorage persistence across page reloads
   - Accessible ARIA status updates & toast confirmation
   ============================================================ */

/* ── 1. INITIAL WIREFRAME REVIEWS DATA ──────────────────────── */
const INITIAL_REVIEWS = [
  {
    id      : 'review-ali',
    name    : 'Ali',
    rating  : 5,
    subtitle: 'Executive Sedan Rental · Islamabad',
    date    : '2 days ago',
    comment : 'Rented the 2026 BMW 530i M Sport for an executive delegation in Islamabad. The booking was seamless, transparent PKR pricing with zero hidden insurance fees, and the car arrived in spotless showroom condition. Will definitely use CarVault again!'
  },
  {
    id      : 'review-sara',
    name    : 'Sara',
    rating  : 4,
    subtitle: 'Family Luxury SUV · Rawalpindi',
    date    : '5 days ago',
    comment : 'Booked an Audi Q7 Quattro for a weekend family trip up to Murree. The vehicle was immaculately clean, comfortable, and the handover at the showroom took under ten minutes. Outstanding customer service and clear communication throughout.'
  },
  {
    id      : 'review-oomar',
    name    : 'Oomar',
    rating  : 5,
    subtitle: 'Verified Vehicle Buyer · Islamabad',
    date    : '1 week ago',
    comment : 'Purchased my Porsche 911 Carrera through CarVault. The entire acquisition experience was top-tier—completely transparent pricing in Pakistani Rupees, verified import paperwork, and prompt white-glove delivery. True automotive luxury.'
  }
];

const LOCAL_STORAGE_KEY = 'carvault_customer_reviews';

/* ── 2. UTILITIES ───────────────────────────────────────────── */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function getRatingDescription(rating) {
  switch (rating) {
    case 5: return '5 of 5 Stars — Exceptional';
    case 4: return '4 of 5 Stars — Very Good';
    case 3: return '3 of 5 Stars — Good';
    case 2: return '2 of 5 Stars — Fair';
    case 1: return '1 of 5 Stars — Poor';
    default: return 'Select rating';
  }
}

function renderStarsHtml(rating) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHtml += '<span class="rv-star-filled" aria-hidden="true">★</span>';
    } else {
      starsHtml += '<span class="rv-star-empty" aria-hidden="true">★</span>';
    }
  }
  return starsHtml;
}

function getStoredReviews() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse reviews from localStorage', err);
    return [];
  }
}

function saveUserReview(newReview) {
  try {
    const stored = getStoredReviews();
    stored.unshift(newReview);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored));
  } catch (err) {
    console.warn('Failed to save review to localStorage', err);
  }
}

/* ── 3. BUILD REVIEW CARD HTML ──────────────────────────────── */
function buildReviewCardHtml(review, isNew = false) {
  const name     = review.name || 'Anonymous';
  const initial  = name.charAt(0).toUpperCase();
  const rating   = Math.min(5, Math.max(1, parseInt(review.rating, 10) || 5));
  const subtitle = review.subtitle || 'Verified Client · Pakistan';
  const date     = review.date || 'Just now';
  const comment  = review.comment || '';
  const newClass = isNew ? ' rv-card-new' : '';

  return `
    <article class="rv-card${newClass}" role="article" data-review-id="${escapeHtml(review.id)}">
      <div class="rv-card-head">
        <div class="rv-user-info">
          <div class="rv-avatar" aria-label="Avatar for ${escapeHtml(name)}">${escapeHtml(initial)}</div>
          <div class="rv-user-meta">
            <h3 class="rv-user-name">${escapeHtml(name)}</h3>
            <span class="rv-user-subtitle">${escapeHtml(subtitle)}</span>
          </div>
        </div>
        <div class="rv-stars-container" role="img" aria-label="${rating} out of 5 stars">
          ${renderStarsHtml(rating)}
        </div>
      </div>
      <div class="rv-card-body">
        <p class="rv-comment-text">${escapeHtml(comment)}</p>
      </div>
      <div class="rv-card-foot">
        <span class="rv-verified-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Verified Client Experience
        </span>
        <span class="rv-time-tag">${escapeHtml(date)}</span>
      </div>
    </article>
  `.trim();
}

/* ── 4. RENDER FEED ─────────────────────────────────────────── */
function renderReviewsList() {
  const container = document.getElementById('reviews-list');
  const countEl   = document.getElementById('reviews-count');
  if (!container) return;

  const storedReviews = getStoredReviews();
  const allReviews    = [...storedReviews, ...INITIAL_REVIEWS];

  container.innerHTML = allReviews.map((rev) => buildReviewCardHtml(rev, false)).join('');

  if (countEl) {
    countEl.textContent = String(allReviews.length);
  }
}

/* ── 5. MOBILE NAVIGATION TOGGLE ────────────────────────────── */
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks  = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ── 6. INTERACTIVE 5-STAR RATING SELECTOR ───────────────────── */
function initStarRating() {
  const picker        = document.getElementById('star-picker');
  const pickerBox     = document.getElementById('star-picker-container');
  const labelEl       = document.getElementById('star-label');
  const hiddenInput   = document.getElementById('review-rating');
  const ratingErrorEl = document.getElementById('rating-error');

  if (!picker || !hiddenInput) return;

  const starButtons = Array.from(picker.querySelectorAll('.rv-star-btn'));
  let currentRating = 0;

  function updateVisualStars(rating, isHover = false) {
    starButtons.forEach((btn) => {
      const starVal = parseInt(btn.getAttribute('data-rating'), 10);
      if (starVal <= rating) {
        btn.classList.add(isHover ? 'is-hovered' : 'is-active');
        if (!isHover) btn.classList.remove('is-hovered');
      } else {
        btn.classList.remove(isHover ? 'is-hovered' : 'is-active');
        if (!isHover) btn.classList.remove('is-hovered');
      }
    });

    if (labelEl) {
      labelEl.textContent = getRatingDescription(rating);
      if (rating > 0) {
        labelEl.classList.add('has-rating');
      } else {
        labelEl.classList.remove('has-rating');
      }
    }
  }

  starButtons.forEach((btn) => {
    const starVal = parseInt(btn.getAttribute('data-rating'), 10);

    // Hover effect
    btn.addEventListener('mouseenter', () => {
      updateVisualStars(starVal, true);
    });

    btn.addEventListener('focus', () => {
      updateVisualStars(starVal, true);
    });

    // Click to select rating
    btn.addEventListener('click', () => {
      currentRating = starVal;
      hiddenInput.value = String(starVal);

      starButtons.forEach((b) => {
        const val = parseInt(b.getAttribute('data-rating'), 10);
        b.setAttribute('aria-checked', String(val === currentRating));
      });

      updateVisualStars(currentRating, false);

      // Clear inline error if previously present
      if (pickerBox) pickerBox.classList.remove('is-invalid');
      if (ratingErrorEl) ratingErrorEl.textContent = '';
    });
  });

  // Restore on mouse leave
  picker.addEventListener('mouseleave', () => {
    updateVisualStars(currentRating, false);
  });

  // Reset helper
  window.__resetStarRating = function () {
    currentRating = 0;
    hiddenInput.value = '0';
    starButtons.forEach((b) => {
      b.classList.remove('is-active', 'is-hovered');
      b.setAttribute('aria-checked', 'false');
    });
    if (labelEl) {
      labelEl.textContent = 'Select rating';
      labelEl.classList.remove('has-rating');
    }
    if (pickerBox) pickerBox.classList.remove('is-invalid');
    if (ratingErrorEl) ratingErrorEl.textContent = '';
  };
}

/* ── 7. FORM VALIDATION & SUBMISSION ─────────────────────────── */
function initReviewForm() {
  const form           = document.getElementById('review-form');
  const nameInput      = document.getElementById('review-name');
  const ratingInput    = document.getElementById('review-rating');
  const commentInput   = document.getElementById('review-comment');
  const pickerBox      = document.getElementById('star-picker-container');
  const nameErrorEl    = document.getElementById('name-error');
  const ratingErrorEl  = document.getElementById('rating-error');
  const commentErrorEl = document.getElementById('comment-error');
  const successBanner  = document.getElementById('form-success-banner');
  const listContainer  = document.getElementById('reviews-list');
  const countEl        = document.getElementById('reviews-count');

  if (!form || !nameInput || !ratingInput || !commentInput) return;

  // Real-time clearance of errors on typing
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
      nameInput.classList.remove('is-invalid');
      nameErrorEl.textContent = '';
    }
  });

  commentInput.addEventListener('input', () => {
    if (commentInput.value.trim() !== '') {
      commentInput.classList.remove('is-invalid');
      commentErrorEl.textContent = '';
    }
  });

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let isValid = true;
    let firstInvalidField = null;

    const nameVal    = nameInput.value.trim();
    const ratingVal  = parseInt(ratingInput.value, 10) || 0;
    const commentVal = commentInput.value.trim();

    // 1. Validate Name
    if (!nameVal) {
      isValid = false;
      nameInput.classList.add('is-invalid');
      nameErrorEl.textContent = 'Please enter your name (Required field).';
      if (!firstInvalidField) firstInvalidField = nameInput;
    } else {
      nameInput.classList.remove('is-invalid');
      nameErrorEl.textContent = '';
    }

    // 2. Validate Rating
    if (ratingVal < 1 || ratingVal > 5) {
      isValid = false;
      if (pickerBox) pickerBox.classList.add('is-invalid');
      ratingErrorEl.textContent = 'Please select a star rating (Required field).';
      if (!firstInvalidField) firstInvalidField = pickerBox;
    } else {
      if (pickerBox) pickerBox.classList.remove('is-invalid');
      ratingErrorEl.textContent = '';
    }

    // 3. Validate Comment
    if (!commentVal) {
      isValid = false;
      commentInput.classList.add('is-invalid');
      commentErrorEl.textContent = 'Please enter your review comment (Required field).';
      if (!firstInvalidField) firstInvalidField = commentInput;
    } else {
      commentInput.classList.remove('is-invalid');
      commentErrorEl.textContent = '';
    }

    // If validation fails, focus the first error
    if (!isValid) {
      if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
        firstInvalidField.focus();
      }
      return;
    }

    // Create new review object
    const newReview = {
      id      : 'review-' + Date.now(),
      name    : nameVal,
      rating  : ratingVal,
      subtitle: 'Verified Client · Pakistan',
      date    : 'Just now',
      comment : commentVal
    };

    // Save to LocalStorage
    saveUserReview(newReview);

    // Prepend directly to top of left column reviews feed
    if (listContainer) {
      const cardHtml = buildReviewCardHtml(newReview, true);
      listContainer.insertAdjacentHTML('afterbegin', cardHtml);
    }

    // Update total count indicator
    if (countEl) {
      const currentCount = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = String(currentCount + 1);
    }

    // Clear form inputs
    nameInput.value = '';
    commentInput.value = '';
    if (typeof window.__resetStarRating === 'function') {
      window.__resetStarRating();
    }

    // Display confirmation message
    if (successBanner) {
      successBanner.classList.remove('hidden');
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Auto-hide banner after 6 seconds
      setTimeout(() => {
        successBanner.classList.add('hidden');
      }, 6000);
    }
  });
}

/* ── 8. INITIALIZE ON DOM READY ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStarRating();
  renderReviewsList();
  initReviewForm();
});
