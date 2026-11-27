/* ==========================================================================
   CAR VAULT — Car Details Page Logic (js/car-details.js)
   Loads the selected car from URL ?id=..., manages gallery thumbnails,
   wishlist toggle, monthly installment estimator, and the booking button.
   ========================================================================== */

let activeCar = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get("id") || "porsche-911-carrera-gts";
  activeCar = getCarById(carId);

  renderCarDetails(activeCar);
  setupInstallmentEstimator();

  document.getElementById("bookTestDriveBtn").addEventListener("click", () => {
    openBookingModal(activeCar.id);
  });

  document.getElementById("wishlistToggleBtn").addEventListener("click", () => {
    toggleWishlistItem(activeCar.id);
    updateWishlistButtonState();
  });

  document.addEventListener("carvault:wishlist-updated", (event) => {
    if (!event.detail || event.detail.carId === activeCar.id) {
      updateWishlistButtonState();
    }
  });
});

function renderCarDetails(car) {
  document.title = `${car.model} | CAR VAULT`;
  document.getElementById("breadcrumbCarName").textContent = car.model;
  document.getElementById("carTitle").textContent = car.model;
  document.getElementById("carConditionBadge").textContent = `${car.tag || car.condition} \u00B7 ${car.year}`;
  document.getElementById("carPrice").textContent = car.priceLabel;
  document.getElementById("specEngine").textContent = car.engine;
  document.getElementById("specPower").textContent = car.power || "—";
  document.getElementById("specSpeed").textContent = car.speed || "—";
  document.getElementById("specFuel").textContent = car.fuel;
  document.getElementById("specTransmission").textContent = car.transmission;
  document.getElementById("specType").textContent = car.type;
  document.getElementById("carDescription").textContent = car.description;

  const mainImage = document.getElementById("mainCarImage");
  mainImage.src = `../${car.image}`;
  mainImage.alt = `${car.year} ${car.model} main view`;

  const thumbsWrap = document.getElementById("galleryThumbs");
  const views = car.gallery && car.gallery.length ? car.gallery : [car.image];

  thumbsWrap.innerHTML = views
    .map(
      (imgPath, index) => `
      <button
        type="button"
        class="thumb-btn ${index === 0 ? "active" : ""}"
        data-img="../${imgPath}"
        aria-label="View angle ${index + 1} of ${car.model}"
      >
        <img src="../${imgPath}" alt="${car.model} view ${index + 1}">
      </button>
    `
    )
    .join("");

  thumbsWrap.querySelectorAll(".thumb-btn").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.dataset.img;
      thumbsWrap.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  updateWishlistButtonState();
}

function updateWishlistButtonState() {
  const btn = document.getElementById("wishlistToggleBtn");
  if (!btn || !activeCar) return;

  const saved = isInWishlist(activeCar.id);
  btn.classList.toggle("is-active", saved);
  btn.innerHTML = saved ? "&#9829; Saved in Wishlist" : "&#9825; Wishlist";
}

function setupInstallmentEstimator() {
  const downSelect = document.getElementById("downPaymentSelect");
  const tenureSelect = document.getElementById("tenureSelect");
  const resultEl = document.getElementById("estimatedMonthly");

  function calculateMonthly() {
    const downRatio = Number(downSelect.value);
    const months = Number(tenureSelect.value) * 12;
    const financedAmount = activeCar.price * (1 - downRatio);
    const monthly = financedAmount / months;

    resultEl.textContent = formatShortPkr(monthly) + " / mo";
  }

  downSelect.addEventListener("change", calculateMonthly);
  tenureSelect.addEventListener("change", calculateMonthly);
  calculateMonthly();
}

function formatShortPkr(amount) {
  return `PKR ${Math.round(amount).toLocaleString("en-PK")}`;
}
