/**
 * CarVault — Shared Navigation, State & localStorage Helpers
 * Vanilla JavaScript only. Safe for integration across all member pages.
 */

window.CarVaultShared = (function () {
  "use strict";

  var STORAGE_KEYS = {
    SAVED_CARS: "carvault_saved_cars",
    LAST_BRAND: "carvault_last_brand",
    INQUIRIES: "carvault_porsche_inquiries",
    MATCH_RESULT: "carvault_match_result",
    ARRIVALS_PREFS: "carvault_arrivals_prefs"
  };

  function safeGetStorage(key, fallbackValue) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null) {
        return fallbackValue;
      }
      return JSON.parse(raw);
    } catch (err) {
      return fallbackValue;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function getSavedCars() {
    var list = safeGetStorage(STORAGE_KEYS.SAVED_CARS, []);
    return Array.isArray(list) ? list : [];
  }

  function isCarSaved(carId) {
    return getSavedCars().indexOf(carId) !== -1;
  }

  function toggleSavedCar(carId) {
    var saved = getSavedCars();
    var idx = saved.indexOf(carId);
    var added = false;

    if (idx === -1) {
      saved.push(carId);
      added = true;
    } else {
      saved.splice(idx, 1);
      added = false;
    }

    safeSetStorage(STORAGE_KEYS.SAVED_CARS, saved);
    updateSavedCarsBadge();
    return added;
  }

  function updateSavedCarsBadge() {
    var count = getSavedCars().length;
    var badges = document.querySelectorAll("[data-saved-count]");
    badges.forEach(function (badge) {
      badge.textContent = String(count);
      if (count > 0) {
        badge.classList.remove("is-empty");
        badge.setAttribute("aria-label", count + " saved cars");
      } else {
        badge.classList.add("is-empty");
        badge.removeAttribute("aria-label");
      }
    });
  }

  function getLastExploredBrand() {
    return safeGetStorage(STORAGE_KEYS.LAST_BRAND, null);
  }

  function setLastExploredBrand(brandObj) {
    if (!brandObj || !brandObj.id) {
      return;
    }
    safeSetStorage(STORAGE_KEYS.LAST_BRAND, {
      id: brandObj.id,
      name: brandObj.name,
      url: brandObj.url,
      visitedAt: new Date().toISOString()
    });
  }

  function initMobileNavFallback() {
    var toggler = document.querySelector(".cv-toggler");
    var navCollapse = document.getElementById("cvPrimaryNav");
    if (!toggler || !navCollapse) {
      return;
    }

    // Fallback toggle in case Bootstrap JS CDN is unavailable offline
    toggler.addEventListener("click", function () {
      if (window.bootstrap && window.bootstrap.Collapse) {
        return;
      }
      var isOpen = navCollapse.classList.toggle("show");
      toggler.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateSavedCarsBadge();
    initMobileNavFallback();
  });

  return {
    STORAGE_KEYS: STORAGE_KEYS,
    safeGetStorage: safeGetStorage,
    safeSetStorage: safeSetStorage,
    getSavedCars: getSavedCars,
    isCarSaved: isCarSaved,
    toggleSavedCar: toggleSavedCar,
    updateSavedCarsBadge: updateSavedCarsBadge,
    getLastExploredBrand: getLastExploredBrand,
    setLastExploredBrand: setLastExploredBrand
  };
})();
