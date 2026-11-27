/* ==========================================================================
   CAR VAULT — Shared UI, Navigation, Wishlist & 4-State Booking Flow (js/common.js)
   ========================================================================== */

const PATH_PREFIX = document.body.dataset.prefix || "";
const CURRENT_PAGE = document.body.dataset.page || "home";
const WISHLIST_STORAGE_KEY = "carvault_wishlist";
const BOOKINGS_STORAGE_KEY = "carvault_bookings";

/* ---------- Helper Functions ---------- */
function getCarById(carId) {
  return CAR_VAULT_CARS.find((car) => car.id === carId) || CAR_VAULT_CARS.find((car) => car.id === "porsche-911-carrera-gts") || CAR_VAULT_CARS[0];
}

function getWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
}

function isInWishlist(carId) {
  return getWishlist().includes(carId);
}

function toggleWishlistItem(carId) {
  const list = getWishlist();
  const exists = list.includes(carId);
  const updated = exists ? list.filter((id) => id !== carId) : [...list, carId];
  saveWishlist(updated);
  updateSavedBadges();
  showToast(exists ? "Removed from Wishlist" : "Saved to Wishlist");
  return !exists;
}

function getBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) {
    existing.remove();
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2600);
}

/* ---------- Shared Car Card Renderer ---------- */
function buildCarCardHtml(car) {
  const detailsUrl = `${PATH_PREFIX}pages/car-details.html?id=${encodeURIComponent(car.id)}`;
  const saved = isInWishlist(car.id);

  return `
    <article class="car-card">
      <a href="${detailsUrl}" class="car-card-link">
        <div class="car-card-image-wrap">
          <img src="${PATH_PREFIX}${car.image}" alt="${car.year} ${car.model}" loading="lazy">
          <span class="car-badge">${car.tag || car.condition}</span>
        </div>
        <div class="car-card-body">
          <div class="car-card-meta">${car.brand} &middot; ${car.year} &middot; ${car.type}</div>
          <h3 class="car-card-title">${car.model}</h3>
          <div class="car-card-specs">${car.engine} &middot; ${car.power}</div>
          <div class="car-card-price">${car.priceLabel}</div>
        </div>
      </a>
      <div class="car-card-footer">
        <a href="${detailsUrl}" class="card-details-cta">View Details &#8599;</a>
        <button
          type="button"
          class="icon-wish-btn ${saved ? "saved" : ""}"
          data-wish-id="${car.id}"
          aria-label="Toggle wishlist for ${car.model}"
        >
          ${saved ? "&#9829; Saved" : "&#9825; Save"}
        </button>
      </div>
    </article>
  `;
}

function attachCardWishlistListeners(container) {
  if (!container) return;
  container.querySelectorAll("[data-wish-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const carId = btn.dataset.wishId;
      const nowSaved = toggleWishlistItem(carId);
      btn.classList.toggle("saved", nowSaved);
      btn.innerHTML = nowSaved ? "&#9829; Saved" : "&#9825; Save";

      // Notify page-specific listeners if needed (e.g. Car Details button)
      document.dispatchEvent(new CustomEvent("carvault:wishlist-updated", { detail: { carId } }));
    });
  });
}

/* ---------- Shared Header & Footer ---------- */
const BRAND_STAR_SVG = `
  <svg class="brand-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z"/>
  </svg>
`;

function buildBrandLogoHtml(homeUrl) {
  return `
    <a href="${homeUrl}" class="brand-logo" aria-label="CAR VAULT Home">
      <span>CAR</span>
      ${BRAND_STAR_SVG}
      <span>VAULT</span>
    </a>
  `;
}

function openCurrentTestDriveBooking() {
  const urlCarId = new URLSearchParams(window.location.search).get("id");
  openBookingModal(urlCarId || "porsche-911-carrera-gts");
}

function renderHeader() {
  const headerMount = document.getElementById("siteHeader");
  if (!headerMount) return;

  const homeUrl = `${PATH_PREFIX}index.html`;
  const exploreUrl = `${PATH_PREFIX}pages/explore-cars.html`;

  headerMount.innerHTML = `
    <header class="site-header">
      <div class="top-utility-bar">
        THE ART OF AUTOMOTIVE EXCELLENCE &middot; ISLAMABAD, PAKISTAN
      </div>

      <div class="navbar">
        ${buildBrandLogoHtml(homeUrl)}

        <div class="mobile-controls">
          <button type="button" id="mobileSavedBtn" class="icon-wish-btn" aria-label="Open Saved Cars">
            &#9825; <span class="saved-badge js-saved-count">0</span>
          </button>
          <button
            type="button"
            id="menuToggleBtn"
            class="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            aria-controls="mainNavLinks"
          >
            &#9776;
          </button>
        </div>

        <ul id="mainNavLinks" class="nav-links">
          <li><a href="${homeUrl}" class="${CURRENT_PAGE === "home" ? "active" : ""}">HOME</a></li>
          <li><a href="${exploreUrl}" class="${CURRENT_PAGE === "explore" ? "active" : ""}">EXPLORE CARS</a></li>
          <li><a href="${PATH_PREFIX}pages/brands.html" class="${CURRENT_PAGE === "brands" ? "active" : ""}" title="Teammate page (coming when merged)">BRANDS</a></li>
          <li><a href="${PATH_PREFIX}pages/new-arrivals.html" title="Teammate page (coming when merged)">NEW ARRIVALS</a></li>
          <li><a href="${PATH_PREFIX}pages/offers.html" title="Teammate page (coming when merged)">OFFERS</a></li>
          <li><a href="${PATH_PREFIX}pages/about.html" title="Teammate page (coming when merged)">ABOUT</a></li>
          <li><a href="${PATH_PREFIX}pages/contact.html" title="Teammate page (coming when merged)">CONTACT</a></li>
          <li><a href="${PATH_PREFIX}pages/compare-cars.html" title="Teammate page (coming when merged)">COMPARE</a></li>
          <li><a href="${PATH_PREFIX}pages/finance.html" title="Teammate page (coming when merged)">FINANCE</a></li>
          <li>
            <button type="button" id="navTestDriveBtn" class="nav-action-link">TEST DRIVE</button>
          </li>
          <li>
            <button type="button" id="navSavedCarsBtn" class="nav-action-link">
              SAVED CARS <span class="nav-heart-icon">&#9825;</span> <span class="saved-badge js-saved-count">0</span>
            </button>
          </li>
          <li><a href="${PATH_PREFIX}pages/admin.html" title="Teammate page (coming when merged)">ADMIN</a></li>
          <li class="nav-links-mobile-cta">
            <button type="button" id="mobileBookDriveBtn" class="nav-cta-btn">BOOK A TEST DRIVE &#8599;</button>
          </li>
        </ul>

        <div class="nav-right-actions">
          <button type="button" id="navBookDriveCtaBtn" class="nav-cta-btn">
            BOOK A TEST DRIVE <span aria-hidden="true">&#8599;</span>
          </button>
        </div>
      </div>
    </header>
  `;

  // Mobile hamburger toggle
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const mainNavLinks = document.getElementById("mainNavLinks");
  menuToggleBtn.addEventListener("click", () => {
    const isOpen = mainNavLinks.classList.toggle("open");
    menuToggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Saved Cars modal triggers
  document.getElementById("navSavedCarsBtn").addEventListener("click", openWishlistModal);
  document.getElementById("mobileSavedBtn").addEventListener("click", openWishlistModal);

  // Test Drive modal triggers (defaults to current car if on Car Details, else Honda Civic)
  document.getElementById("navTestDriveBtn").addEventListener("click", openCurrentTestDriveBooking);
  document.getElementById("navBookDriveCtaBtn").addEventListener("click", openCurrentTestDriveBooking);
  document.getElementById("mobileBookDriveBtn").addEventListener("click", () => {
    mainNavLinks.classList.remove("open");
    menuToggleBtn.setAttribute("aria-expanded", "false");
    openCurrentTestDriveBooking();
  });

  updateSavedBadges();
}

function renderFooter() {
  const footerMount = document.getElementById("siteFooter");
  if (!footerMount) return;

  const homeUrl = `${PATH_PREFIX}index.html`;

  footerMount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col footer-brand-col">
            ${buildBrandLogoHtml(homeUrl)}
            <p class="footer-brand-desc">
              An elevated way to discover, compare and experience the world's most extraordinary automobiles.
            </p>
            <div class="footer-tagline">DRIVE THE EXTRAORDINARY.</div>
          </div>

          <div class="footer-col">
            <h4>Discover</h4>
            <ul>
              <li><a href="${PATH_PREFIX}pages/explore-cars.html">Our Collection</a></li>
              <li><a href="${PATH_PREFIX}pages/brands.html">Our Brands</a></li>
              <li><a href="${PATH_PREFIX}pages/new-arrivals.html">New Arrivals</a></li>
              <li><a href="${PATH_PREFIX}pages/offers.html">Special Offers</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="${PATH_PREFIX}pages/compare-cars.html">Compare Cars</a></li>
              <li><a href="${PATH_PREFIX}pages/finance.html">Finance</a></li>
              <li><button type="button" id="footerTestDriveBtn" class="footer-link-btn">Test Drive</button></li>
              <li><button type="button" id="footerWishlistBtn" class="footer-link-btn">Wishlist</button></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="${PATH_PREFIX}pages/about.html">About Us</a></li>
              <li><a href="${PATH_PREFIX}pages/contact.html">Contact</a></li>
              <li><a href="${PATH_PREFIX}pages/faq.html">Help &amp; FAQ</a></li>
              <li><a href="${PATH_PREFIX}pages/admin.html">Admin Portal</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; 2026 CARVAULT. A luxury showroom concept website. Vehicle prices and availability are illustrative.</span>
          <span class="footer-craft-tag">CRAFTED FOR THE EXTRAORDINARY</span>
        </div>
      </div>
    </footer>
  `;

  document.getElementById("footerTestDriveBtn").addEventListener("click", openCurrentTestDriveBooking);
  document.getElementById("footerWishlistBtn").addEventListener("click", openWishlistModal);
}

function updateSavedBadges() {
  const count = getWishlist().length;
  document.querySelectorAll(".js-saved-count").forEach((badge) => {
    badge.textContent = count;
  });
}

/* ---------- Wishlist Modal (Saved Cars Viewer) ---------- */
function ensureSharedModals() {
  if (document.getElementById("wishlistModal")) return;

  const modalWrapper = document.createElement("div");
  modalWrapper.innerHTML = `
    <!-- Saved Cars / Wishlist Modal -->
    <div id="wishlistModal" class="modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="wishlistModalTitle">
      <div class="modal-box">
        <div class="modal-header">
          <h2 id="wishlistModalTitle">Saved Cars (Wishlist)</h2>
          <button type="button" id="closeWishlistModal" class="modal-close" aria-label="Close Saved Cars">&times;</button>
        </div>
        <div id="wishlistModalBody"></div>
      </div>
    </div>

    <!-- 4-State Test Drive Booking Modal -->
    <div id="bookingModal" class="modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="bookingModalTitle">
      <div class="modal-box">
        <div class="modal-header">
          <h2 id="bookingModalTitle">Test Drive Booking Request</h2>
          <button type="button" id="closeBookingModal" class="modal-close" aria-label="Close Booking Modal">&times;</button>
        </div>
        <div id="bookingModalBody"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modalWrapper);

  document.getElementById("closeWishlistModal").addEventListener("click", () => {
    document.getElementById("wishlistModal").classList.add("hidden");
  });

  document.getElementById("closeBookingModal").addEventListener("click", () => {
    document.getElementById("bookingModal").classList.add("hidden");
  });

  // Close modals when clicking dark backdrop
  document.getElementById("wishlistModal").addEventListener("click", (event) => {
    if (event.target.id === "wishlistModal") {
      event.target.classList.add("hidden");
    }
  });

  document.getElementById("bookingModal").addEventListener("click", (event) => {
    if (event.target.id === "bookingModal") {
      event.target.classList.add("hidden");
    }
  });
}

function openWishlistModal() {
  ensureSharedModals();
  renderWishlistModalBody();
  document.getElementById("wishlistModal").classList.remove("hidden");
}

function renderWishlistModalBody() {
  const body = document.getElementById("wishlistModalBody");
  const savedIds = getWishlist();
  const savedCars = CAR_VAULT_CARS.filter((car) => savedIds.includes(car.id));

  if (savedCars.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <h3>No saved cars yet</h3>
        <p>Click the Wishlist button on any car to save it here for quick comparison.</p>
        <a href="${PATH_PREFIX}pages/explore-cars.html" class="btn btn-primary">Explore Cars</a>
      </div>
    `;
    return;
  }

  body.innerHTML = `
    <div class="wishlist-list">
      ${savedCars
        .map(
          (car) => `
          <div class="wishlist-item">
            <div class="wishlist-item-info">
              <img src="${PATH_PREFIX}${car.image}" alt="${car.model}">
              <div>
                <strong>${car.model}</strong>
                <div class="wishlist-item-price">${car.priceLabel}</div>
              </div>
            </div>
            <div class="wishlist-actions">
              <a href="${PATH_PREFIX}pages/car-details.html?id=${encodeURIComponent(car.id)}" class="btn btn-navy" style="padding: 7px 12px; font-size: 0.8rem;">View</a>
              <button type="button" class="btn btn-outline js-remove-wish" data-id="${car.id}" style="padding: 7px 12px; font-size: 0.8rem;">Remove</button>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  body.querySelectorAll(".js-remove-wish").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleWishlistItem(btn.dataset.id);
      renderWishlistModalBody();
      document.dispatchEvent(new CustomEvent("carvault:wishlist-updated", { detail: { carId: btn.dataset.id } }));
    });
  });
}

/* ==========================================================================
   4-STATE TEST DRIVE BOOKING FLOW (Vertical Prototype Implementation)
   State 1: Empty Form | State 2: Filled Form | State 3: Success | State 4: Failed Validation
   ========================================================================== */
let currentBookingDraft = {
  carId: "porsche-911-carrera-gts",
  name: "",
  phone: "",
  email: "",
  date: "",
  time: ""
};

function openBookingModal(carId) {
  ensureSharedModals();
  const selectedCar = getCarById(carId);
  // Reset to State 1 (Empty Form) whenever opened fresh
  currentBookingDraft = {
    carId: selectedCar.id,
    name: "",
    phone: "",
    email: "",
    date: "",
    time: ""
  };
  renderBookingFormState();
  document.getElementById("bookingModal").classList.remove("hidden");
}

function renderBookingFormState() {
  const body = document.getElementById("bookingModalBody");
  const todayStr = new Date().toISOString().split("T")[0];

  body.innerHTML = `
    <p class="demo-note">
      Demo Request: Submit your preferred date and time to request a showroom test drive. No real dealership appointment is sent.
    </p>

    <form id="testDriveBookingForm" novalidate>
      <div class="form-group">
        <label for="bookingCarSelect">Selected Car</label>
        <select id="bookingCarSelect" name="carId">
          ${CAR_VAULT_CARS.map(
            (c) => `<option value="${c.id}" ${c.id === currentBookingDraft.carId ? "selected" : ""}>${c.model} (${c.priceLabel})</option>`
          ).join("")}
        </select>
      </div>

      <div class="form-group">
        <label for="bookingName">Name</label>
        <input type="text" id="bookingName" name="name" placeholder="Enter your full name" value="${escapeHtmlAttr(currentBookingDraft.name)}" required>
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label for="bookingPhone">Phone number</label>
          <input type="tel" id="bookingPhone" name="phone" placeholder="e.g. 03001234567" value="${escapeHtmlAttr(currentBookingDraft.phone)}" required>
        </div>

        <div class="form-group">
          <label for="bookingEmail">Email</label>
          <input type="email" id="bookingEmail" name="email" placeholder="e.g. hamza@example.com" value="${escapeHtmlAttr(currentBookingDraft.email)}" required>
        </div>
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label for="bookingDate">Date</label>
          <input type="date" id="bookingDate" name="date" min="${todayStr}" value="${escapeHtmlAttr(currentBookingDraft.date)}" required>
        </div>

        <div class="form-group">
          <label for="bookingTime">Time</label>
          <select id="bookingTime" name="time" required>
            <option value="">Select time</option>
            ${["10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM", "05:00 PM"]
              .map((t) => `<option value="${t}" ${currentBookingDraft.time === t ? "selected" : ""}>${t}</option>`)
              .join("")}
          </select>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 6px;">Submit</button>
    </form>
  `;

  document.getElementById("testDriveBookingForm").addEventListener("submit", handleBookingSubmit);
}

function validatePhoneAndEmail(phone, email) {
  const digitsOnly = phone.replace(/[\s\-()+]/g, "");
  const isPhoneValid = /^\d{10,13}$/.test(digitsOnly);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  return isPhoneValid && isEmailValid;
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const form = event.target;

  // Save State 2 (Filled Form) values so "Try Again" keeps what the user typed
  currentBookingDraft = {
    carId: form.carId.value,
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    date: form.date.value,
    time: form.time.value
  };

  const hasRequiredBasics =
    currentBookingDraft.name.length >= 2 &&
    Boolean(currentBookingDraft.date) &&
    Boolean(currentBookingDraft.time);

  // State 4: Failed Validation (matching paper prototype State 4)
  if (!hasRequiredBasics || !validatePhoneAndEmail(currentBookingDraft.phone, currentBookingDraft.email)) {
    renderBookingFailedState();
    return;
  }

  // State 3: Success
  const selectedCar = getCarById(currentBookingDraft.carId);
  const savedBookings = getBookings();
  savedBookings.push({
    ...currentBookingDraft,
    carModel: selectedCar.model,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(savedBookings));

  renderBookingSuccessState(selectedCar, currentBookingDraft);
}

function renderBookingSuccessState(selectedCar, booking) {
  const body = document.getElementById("bookingModalBody");
  body.innerHTML = `
    <div class="state-box success">
      <h3>Booking Confirmed!</h3>
      <p>Your test drive booking request has been submitted.</p>

      <div class="state-details">
        <div><strong>Selected Car:</strong> ${selectedCar.model}</div>
        <div><strong>Applicant:</strong> ${escapeHtmlText(booking.name)}</div>
        <div><strong>Date:</strong> ${escapeHtmlText(booking.date)}</div>
        <div><strong>Time:</strong> ${escapeHtmlText(booking.time)}</div>
      </div>

      <p style="font-size: 0.82rem; margin-bottom: 14px;">
        Note: This is a frontend demo booking request saved locally in your browser.
      </p>

      <button type="button" id="backToCarBtn" class="btn btn-navy" style="width: 100%;">
        Back to Car
      </button>
    </div>
  `;

  document.getElementById("backToCarBtn").addEventListener("click", () => {
    document.getElementById("bookingModal").classList.add("hidden");
  });
}

function renderBookingFailedState() {
  const body = document.getElementById("bookingModalBody");
  body.innerHTML = `
    <div class="state-box failed">
      <h3>Validation Failed</h3>
      <p style="font-weight: 600; margin-bottom: 18px;">
        Incorrect phone number or email. Please enter again.
      </p>
      <button type="button" id="tryAgainBookingBtn" class="btn btn-primary" style="min-width: 160px;">
        Try Again
      </button>
    </div>
  `;

  document.getElementById("tryAgainBookingBtn").addEventListener("click", renderBookingFormState);
}

function escapeHtmlText(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function escapeHtmlAttr(str) {
  return escapeHtmlText(str);
}

/* Initialize shared header & footer once DOM is ready */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
