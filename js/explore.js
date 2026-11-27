/* ==========================================================================
   CAR VAULT — Explore Cars Page Logic (js/explore.js)
   Implements live search, brand/price/body-style filtering, sorting, and URL pre-filter.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const mobileFilterToggle = document.getElementById("mobileFilterToggle");
  const filtersSidebar = document.getElementById("filtersSidebar");

  // Pre-select brand or search term if passed via URL (e.g., explore-cars.html?brand=Porsche)
  const params = new URLSearchParams(window.location.search);
  const initialBrand = params.get("brand");
  const initialSearch = params.get("search");

  if (initialBrand) {
    const brandCheckbox = document.querySelector(`input[name="brand"][value="${CSS.escape(initialBrand)}"]`);
    if (brandCheckbox) {
      brandCheckbox.checked = true;
    }
  }

  if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
  }

  // Mobile collapsible filter drawer
  if (mobileFilterToggle && filtersSidebar) {
    mobileFilterToggle.addEventListener("click", () => {
      const isOpen = filtersSidebar.classList.toggle("open");
      mobileFilterToggle.setAttribute("aria-expanded", String(isOpen));
      mobileFilterToggle.textContent = isOpen ? "Hide Filters" : "Filter Cars";
    });
  }

  // Live search, sort & instant filter updates
  if (searchInput) {
    searchInput.addEventListener("input", applySearchFiltersAndSort);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", applySearchFiltersAndSort);
  }
  document.querySelectorAll('#filtersSidebar input[type="checkbox"]').forEach((box) => {
    box.addEventListener("change", applySearchFiltersAndSort);
  });

  // Apply button at bottom of Filter panel
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      applySearchFiltersAndSort();
      if (window.innerWidth <= 900 && filtersSidebar) {
        filtersSidebar.classList.remove("open");
        mobileFilterToggle.setAttribute("aria-expanded", "false");
        mobileFilterToggle.textContent = "Filter Cars";
      }
    });
  }

  // Reset all filters & search
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetAllFilters);
  }

  // Keep wishlist icons synced if updated from modal
  document.addEventListener("carvault:wishlist-updated", applySearchFiltersAndSort);

  applySearchFiltersAndSort();
});

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
}

function matchesPriceRange(price, selectedRanges) {
  if (selectedRanges.length === 0) return true;

  return selectedRanges.some((range) => {
    if (range === "under-5cr") return price < 50000000;
    if (range === "5cr-7cr") return price >= 50000000 && price <= 70000000;
    if (range === "7cr-plus") return price > 70000000;
    return false;
  });
}

function applySearchFiltersAndSort() {
  const searchQuery = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const sortOrder = document.getElementById("sortSelect")?.value || "default";
  const selectedBrands = getCheckedValues("brand");
  const selectedPrices = getCheckedValues("price");
  const selectedTypes = getCheckedValues("type");

  let filteredCars = CAR_VAULT_CARS.filter((car) => {
    const matchesSearch =
      !searchQuery ||
      car.model.toLowerCase().includes(searchQuery) ||
      car.brand.toLowerCase().includes(searchQuery) ||
      car.type.toLowerCase().includes(searchQuery) ||
      car.engine.toLowerCase().includes(searchQuery);

    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand);
    const matchesPrice = matchesPriceRange(car.price, selectedPrices);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.type);

    return matchesSearch && matchesBrand && matchesPrice && matchesType;
  });

  if (sortOrder === "price-low") {
    filteredCars = [...filteredCars].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-high") {
    filteredCars = [...filteredCars].sort((a, b) => b.price - a.price);
  } else if (sortOrder === "newest") {
    filteredCars = [...filteredCars].sort((a, b) => b.year - a.year || a.price - b.price);
  } else if (sortOrder === "name-az") {
    filteredCars = [...filteredCars].sort((a, b) => a.model.localeCompare(b.model));
  }

  renderExploreResults(filteredCars);
}

function renderExploreResults(carsList) {
  const grid = document.getElementById("exploreCarsGrid");
  const countLabel = document.getElementById("resultsCount");
  if (!grid || !countLabel) return;

  countLabel.textContent = `Showing ${carsList.length} of ${CAR_VAULT_CARS.length} exceptional vehicles`;

  if (carsList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No vehicles found</h3>
        <p>Try clearing some filters or searching for another make or model.</p>
        <button type="button" id="emptyResetBtn" class="btn btn-primary">Reset Filters</button>
      </div>
    `;
    document.getElementById("emptyResetBtn").addEventListener("click", resetAllFilters);
    return;
  }

  grid.innerHTML = carsList.map(buildCarCardHtml).join("");
  attachCardWishlistListeners(grid);
}

function resetAllFilters() {
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "default";

  document.querySelectorAll('#filtersSidebar input[type="checkbox"]').forEach((box) => {
    box.checked = false;
  });

  applySearchFiltersAndSort();
}
