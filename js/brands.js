/**
 * CarVault — Explore Our Brands (pages/brands.html)
 * Renders the 6 luxury marque cards dynamically from CarVaultData
 * and persists the last-explored brand in localStorage.
 */

(function () {
  "use strict";

  function renderLastExploredBanner(brands) {
    var banner = document.getElementById("lastExploredBanner");
    if (!banner || !window.CarVaultShared) {
      return;
    }

    var lastBrand = window.CarVaultShared.getLastExploredBrand();
    if (!lastBrand || !lastBrand.id) {
      return;
    }

    var matched = brands.find(function (b) {
      return b.id === lastBrand.id;
    });

    if (!matched) {
      return;
    }

    banner.innerHTML = "";

    var textSpan = document.createElement("span");
    textSpan.textContent = "Recently explored marque: " + matched.name + " (" + matched.country + ")";

    var link = document.createElement("a");
    link.className = "cv-resume-link";
    link.href = matched.url;
    link.textContent = "Return to " + matched.name + " \u2197";

    banner.appendChild(textSpan);
    banner.appendChild(link);
    banner.classList.remove("d-none");
  }

  function createBrandCard(brand, modelCount, lastBrandId) {
    var col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    var card = document.createElement("a");
    card.className = "cv-brand-card";
    if (lastBrandId && lastBrandId === brand.id) {
      card.classList.add("is-last-visited");
    }
    card.href = brand.url;
    card.setAttribute("data-brand-id", brand.id);
    card.setAttribute(
      "aria-label",
      "Explore " + brand.name + " — " + window.CarVaultData.formatModelCountLabel(modelCount)
    );

    var eyebrow = document.createElement("span");
    eyebrow.className = "cv-card-eyebrow";
    eyebrow.textContent = "THE COLLECTION";

    var title = document.createElement("h3");
    title.className = "cv-brand-name";
    title.textContent = brand.name;

    var countText = document.createElement("p");
    countText.className = "cv-brand-count";
    countText.textContent = window.CarVaultData.formatModelCountLabel(modelCount);

    var action = document.createElement("span");
    action.className = "cv-card-action";
    action.innerHTML = 'EXPLORE BRAND <span aria-hidden="true">&#8599;</span>';

    card.appendChild(eyebrow);
    card.appendChild(title);
    card.appendChild(countText);
    card.appendChild(action);

    card.addEventListener("click", function () {
      if (window.CarVaultShared) {
        window.CarVaultShared.setLastExploredBrand(brand);
      }
    });

    col.appendChild(card);
    return col;
  }

  function renderBrandsGrid() {
    var grid = document.getElementById("brandsGrid");
    if (!grid) {
      return;
    }

    if (!window.CarVaultData) {
      grid.innerHTML =
        '<div class="col-12"><p class="cv-subtitle">Unable to load marque directory at the moment.</p></div>';
      return;
    }

    var brands = window.CarVaultData.getBrands();
    if (!Array.isArray(brands) || brands.length === 0) {
      grid.innerHTML =
        '<div class="col-12"><p class="cv-subtitle">No automotive marques are currently listed.</p></div>';
      return;
    }

    var lastVisited = window.CarVaultShared
      ? window.CarVaultShared.getLastExploredBrand()
      : null;
    var lastBrandId = lastVisited && lastVisited.id ? lastVisited.id : null;

    renderLastExploredBanner(brands);

    var fragment = document.createDocumentFragment();
    brands.forEach(function (brand) {
      var modelCount = window.CarVaultData.getBrandModelCount(brand.id);
      var cardCol = createBrandCard(brand, modelCount, lastBrandId);
      fragment.appendChild(cardCol);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  document.addEventListener("DOMContentLoaded", renderBrandsGrid);
})();
