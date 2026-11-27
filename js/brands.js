
/**
 * CarVault - Explore Our Brands
 * Displays brand cards and opens the selected brand profile page.
 */

(function () {
  "use strict";

  function saveLastBrand(brand) {
    if (window.CarVaultShared) {
      window.CarVaultShared.setLastExploredBrand(brand);
    }
  }

  function getBrandPageUrl(brand) {
    return "porsche.html?brand=" + encodeURIComponent(brand.id);
  }

  function renderLastExploredBanner(brands) {
    var banner = document.getElementById("lastExploredBanner");

    if (!banner || !window.CarVaultShared) return;

    var lastBrand = window.CarVaultShared.getLastExploredBrand();

    if (!lastBrand || !lastBrand.id) return;

    var matched = brands.find(function (brand) {
      return brand.id === lastBrand.id;
    });

    if (!matched) return;

    banner.innerHTML = "";

    var text = document.createElement("span");
    text.textContent =
      "Recently explored marque: " + matched.name +
      " (" + matched.country + ")";

    var link = document.createElement("a");
    link.className = "cv-resume-link";
    link.href = getBrandPageUrl(matched);
    link.textContent = "Return to " + matched.name + " ↗";

    link.addEventListener("click", function () {
      saveLastBrand(matched);
    });

    banner.appendChild(text);
    banner.appendChild(link);
    banner.classList.remove("d-none");
  }

  function createBrandCard(brand, modelCount, lastBrandId) {
    var col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    var card = document.createElement("a");
    card.className = "cv-brand-card";
    card.href = getBrandPageUrl(brand);

    if (lastBrandId === brand.id) {
      card.classList.add("is-last-visited");
    }

    card.setAttribute("data-brand-id", brand.id);

    card.setAttribute(
      "aria-label",
      "Explore " + brand.name + " - " +
      window.CarVaultData.formatModelCountLabel(modelCount)
    );

    var eyebrow = document.createElement("span");
    eyebrow.className = "cv-card-eyebrow";
    eyebrow.textContent = "THE COLLECTION";

    var title = document.createElement("h3");
    title.className = "cv-brand-name";
    title.textContent = brand.name;

    var count = document.createElement("p");
    count.className = "cv-brand-count";
    count.textContent =
      window.CarVaultData.formatModelCountLabel(modelCount);

    var action = document.createElement("span");
    action.className = "cv-card-action";
    action.textContent = "EXPLORE BRAND ↗";

    card.appendChild(eyebrow);
    card.appendChild(title);
    card.appendChild(count);
    card.appendChild(action);

    card.addEventListener("click", function () {
      saveLastBrand(brand);
    });

    col.appendChild(card);

    return col;
  }

  function renderBrandsGrid() {
    var grid = document.getElementById("brandsGrid");

    if (!grid || !window.CarVaultData) return;

    var brands = window.CarVaultData.getBrands();

    var lastVisited = window.CarVaultShared
      ? window.CarVaultShared.getLastExploredBrand()
      : null;

    var lastBrandId = lastVisited ? lastVisited.id : null;

    renderLastExploredBanner(brands);

    var fragment = document.createDocumentFragment();

    brands.forEach(function (brand) {
      var modelCount =
        window.CarVaultData.getBrandModelCount(brand.id);

      fragment.appendChild(
        createBrandCard(brand, modelCount, lastBrandId)
      );
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  document.addEventListener("DOMContentLoaded", renderBrandsGrid);
})();
