/**
 * CarVault — Page 4: Compare Cars
 * Handles vehicle selection, input validation, side-by-side specification rendering,
 * URL query pre-selection, and CarVaultShared saved-cars integration.
 */

(function () {
  "use strict";

  // Supplemental structured metadata for vehicles whose summary string omits 0-100 km/h time
  var SPEC_OVERRIDES = {
    "mercedes-s580-maybach": {
      accelerationSec: 4.8,
      accelerationLabel: "4.8 sec (0-100 km/h)"
    },
    "bmw-i7-xdrive60": {
      accelerationSec: 4.7,
      accelerationLabel: "4.7 sec (0-100 km/h)"
    },
    "range-rover-autobiography": {
      accelerationSec: 4.6,
      accelerationLabel: "4.6 sec (0-100 km/h)"
    }
  };

  var form = document.getElementById("compareForm");
  var selectA = document.getElementById("carSelectA");
  var selectB = document.getElementById("carSelectB");
  var swapBtn = document.getElementById("swapCarsBtn");
  var loadSavedBtn = document.getElementById("loadSavedBtn");
  var resetBtn = document.getElementById("resetCompareBtn");
  var errorBanner = document.getElementById("compareErrorBanner");
  var errorText = document.getElementById("compareErrorText");
  var emptyState = document.getElementById("compareEmptyState");
  var resultsWrap = document.getElementById("compareResults");
  var vehicleCardsGrid = document.getElementById("vehicleCardsGrid");
  var specHeadA = document.getElementById("specHeadA");
  var specHeadB = document.getElementById("specHeadB");
  var specRowsContainer = document.getElementById("specRowsContainer");

  var dataApi = window.CarVaultData;
  var sharedApi = window.CarVaultShared;

  if (!dataApi || !Array.isArray(dataApi.CARS) || !form || !selectA || !selectB) {
    return;
  }

  var cars = dataApi.CARS;

  function findCarById(carId) {
    return cars.find(function (car) {
      return car.id === carId;
    }) || null;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function extractSpecs(car) {
    var parts = String(car.specs || "").split("·").map(function (item) {
      return item.trim();
    });
    var engine = parts[0] || "N/A";

    var hpMatch = String(car.specs || "").match(/([\d,]+)\s*HP/i);
    var hpNum = hpMatch ? Number(hpMatch[1].replace(/,/g, "")) : null;
    var horsepower = hpMatch ? hpMatch[1] + " HP" : "N/A";

    var year = car.arrivalDate && /^\d{4}/.test(car.arrivalDate)
      ? car.arrivalDate.slice(0, 4)
      : "2026";

    var accelMatch = String(car.specs || "").match(/0-100\s+in\s+([\d.]+)\s*sec/i);
    var override = SPEC_OVERRIDES[car.id];
    var accelSec = accelMatch
      ? Number(accelMatch[1])
      : (override ? override.accelerationSec : null);
    var acceleration = accelMatch
      ? accelMatch[1] + " sec (0-100 km/h)"
      : (override ? override.accelerationLabel : "N/A");

    return {
      price: dataApi.formatPKR(car.pricePKR),
      priceNum: Number(car.pricePKR),
      engine: engine,
      horsepower: horsepower,
      hpNum: hpNum,
      year: year,
      yearNum: Number(year),
      acceleration: acceleration,
      accelSec: accelSec,
      category: car.category || "Luxury",
      status: car.status || "Available"
    };
  }

  function populateSelect(selectEl, placeholderText) {
    selectEl.innerHTML = "";
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = placeholderText;
    selectEl.appendChild(placeholder);

    cars.forEach(function (car) {
      var option = document.createElement("option");
      option.value = car.id;
      option.textContent = car.brandName + " " + car.name + " — " + dataApi.formatPKR(car.pricePKR);
      selectEl.appendChild(option);
    });
  }

  function showValidationError(message, invalidSelects) {
    clearValidationState();
    errorText.textContent = message;
    errorBanner.classList.add("is-visible");

    (invalidSelects || []).forEach(function (selectEl) {
      selectEl.classList.add("is-invalid");
      selectEl.setAttribute("aria-invalid", "true");
    });
  }

  function clearValidationState() {
    errorText.textContent = "";
    errorBanner.classList.remove("is-visible");
    [selectA, selectB].forEach(function (selectEl) {
      selectEl.classList.remove("is-invalid");
      selectEl.removeAttribute("aria-invalid");
    });
  }

  function validateSelection() {
    var idA = selectA.value.trim();
    var idB = selectB.value.trim();

    if (!idA && !idB) {
      showValidationError("Please select two vehicles to compare.", [selectA, selectB]);
      selectA.focus();
      return null;
    }

    if (!idA) {
      showValidationError("Please select the first vehicle before comparing.", [selectA]);
      selectA.focus();
      return null;
    }

    if (!idB) {
      showValidationError("Please select the second vehicle before comparing.", [selectB]);
      selectB.focus();
      return null;
    }

    if (idA === idB) {
      showValidationError(
        "Please choose two different vehicles. Identical models cannot be compared side by side.",
        [selectA, selectB]
      );
      selectB.focus();
      return null;
    }

    var carA = findCarById(idA);
    var carB = findCarById(idB);

    if (!carA || !carB) {
      showValidationError("One of the selected vehicles could not be found in the showroom catalog.", [selectA, selectB]);
      return null;
    }

    clearValidationState();
    return { carA: carA, carB: carB };
  }

  function buildVehicleCardHtml(car) {
    var isSaved = sharedApi ? sharedApi.isCarSaved(car.id) : false;
    var saveLabel = isSaved ? "Saved in Garage" : "Save Vehicle";
    var savedClass = isSaved ? "cv-save-btn is-saved" : "cv-save-btn";

    return (
      '<article class="cv-vehicle-card">' +
        '<div class="cv-vehicle-media">' +
          '<img src="' + escapeHtml(car.image) + '" alt="' + escapeHtml(car.brandName + " " + car.name) + '" loading="lazy" />' +
          '<span class="cv-status-badge">' + escapeHtml(car.status) + "</span>" +
        "</div>" +
        '<div class="cv-vehicle-body">' +
          '<div class="cv-vehicle-header">' +
            "<div>" +
              '<div class="cv-vehicle-brand">' + escapeHtml(car.brandName) + " &middot; " + escapeHtml(car.category) + "</div>" +
              '<h3 class="cv-vehicle-title">' + escapeHtml(car.name) + "</h3>" +
            "</div>" +
          "</div>" +
          '<p class="cv-vehicle-price">' + escapeHtml(dataApi.formatPKR(car.pricePKR)) + "</p>" +
          '<p class="cv-vehicle-desc">' + escapeHtml(car.description) + "</p>" +
          '<div class="cv-vehicle-actions">' +
            '<button type="button" class="' + savedClass + '" data-save-car="' + escapeHtml(car.id) + '" aria-pressed="' + String(isSaved) + '">' +
              saveLabel +
            "</button>" +
            '<a class="cv-card-link" href="finance.html?car=' + encodeURIComponent(car.id) + '">Estimate Finance</a>' +
            '<a class="cv-card-link" href="test-drive.html?car=' + encodeURIComponent(car.id) + '">Book Test Drive</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function resolveWinner(valA, valB, preferLower) {
    if (typeof valA !== "number" || typeof valB !== "number" || isNaN(valA) || isNaN(valB) || valA === valB) {
      return { a: false, b: false };
    }
    if (preferLower) {
      return { a: valA < valB, b: valB < valA };
    }
    return { a: valA > valB, b: valB > valA };
  }

  function buildSpecRowHtml(label, valA, valB, nameA, nameB, winner, winnerText) {
    var classA = winner.a ? "cv-spec-val is-leader" : "cv-spec-val";
    var classB = winner.b ? "cv-spec-val is-leader" : "cv-spec-val";
    var badgeHtml = winnerText ? '<span class="cv-leader-tag">' + escapeHtml(winnerText) + "</span>" : "";

    return (
      '<div class="cv-spec-row">' +
        '<div class="cv-spec-label">' + escapeHtml(label) + "</div>" +
        '<div class="' + classA + '">' +
          '<span class="cv-spec-mobile-name">' + escapeHtml(nameA) + "</span>" +
          "<span>" + escapeHtml(valA) + "</span>" +
          (winner.a ? badgeHtml : "") +
        "</div>" +
        '<div class="' + classB + '">' +
          '<span class="cv-spec-mobile-name">' + escapeHtml(nameB) + "</span>" +
          "<span>" + escapeHtml(valB) + "</span>" +
          (winner.b ? badgeHtml : "") +
        "</div>" +
      "</div>"
    );
  }

  function renderComparison(carA, carB) {
    var specsA = extractSpecs(carA);
    var specsB = extractSpecs(carB);

    vehicleCardsGrid.innerHTML = buildVehicleCardHtml(carA) + buildVehicleCardHtml(carB);

    specHeadA.textContent = carA.name;
    specHeadB.textContent = carB.name;

    var priceWinner = resolveWinner(specsA.priceNum, specsB.priceNum, true);
    var hpWinner = resolveWinner(specsA.hpNum, specsB.hpNum, false);
    var accelWinner = resolveWinner(specsA.accelSec, specsB.accelSec, true);
    var noWinner = { a: false, b: false };

    var rowsHtml = [
      buildSpecRowHtml("Price", specsA.price, specsB.price, carA.name, carB.name, priceWinner, "Lower Price"),
      buildSpecRowHtml("Engine", specsA.engine, specsB.engine, carA.name, carB.name, noWinner, ""),
      buildSpecRowHtml("Horsepower", specsA.horsepower, specsB.horsepower, carA.name, carB.name, hpWinner, "More Power"),
      buildSpecRowHtml("Year", specsA.year, specsB.year, carA.name, carB.name, noWinner, ""),
      buildSpecRowHtml("Acceleration", specsA.acceleration, specsB.acceleration, carA.name, carB.name, accelWinner, "Faster Sprint"),
      buildSpecRowHtml("Segment", specsA.category, specsB.category, carA.name, carB.name, noWinner, ""),
      buildSpecRowHtml("Availability", specsA.status, specsB.status, carA.name, carB.name, noWinner, "")
    ].join("");

    specRowsContainer.innerHTML = rowsHtml;

    emptyState.style.display = "none";
    resultsWrap.classList.add("is-visible");
  }

  function resetComparison() {
    selectA.value = "";
    selectB.value = "";
    clearValidationState();
    vehicleCardsGrid.innerHTML = "";
    specRowsContainer.innerHTML = "";
    resultsWrap.classList.remove("is-visible");
    emptyState.style.display = "";
    updateUrlQuery(null, null);
  }

  function updateUrlQuery(idA, idB) {
    if (!window.history || !window.history.replaceState) {
      return;
    }
    var url = new URL(window.location.href);
    if (idA && idB) {
      url.searchParams.set("cars", idA + "," + idB);
      url.searchParams.delete("car");
    } else {
      url.searchParams.delete("cars");
      url.searchParams.delete("car");
    }
    window.history.replaceState({}, "", url.toString());
  }

  function runComparison() {
    var valid = validateSelection();
    if (!valid) {
      return;
    }
    renderComparison(valid.carA, valid.carB);
    updateUrlQuery(valid.carA.id, valid.carB.id);
  }

  function initFromQueryParams() {
    var params = new URLSearchParams(window.location.search);
    var carsParam = params.get("cars");
    var singleCar = params.get("car");

    if (carsParam) {
      var ids = carsParam.split(",").map(function (s) {
        return s.trim();
      });
      if (ids[0] && findCarById(ids[0])) {
        selectA.value = ids[0];
      }
      if (ids[1] && findCarById(ids[1])) {
        selectB.value = ids[1];
      }
      if (ids[0] && ids[1]) {
        runComparison();
      }
      return;
    }

    if (singleCar && findCarById(singleCar)) {
      selectA.value = singleCar;
    }
  }

  // Populate vehicle dropdowns
  populateSelect(selectA, "Select first vehicle...");
  populateSelect(selectB, "Select second vehicle...");

  // Form submit -> Compare button
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runComparison();
  });

  // Clear inline validation state as user updates selections
  [selectA, selectB].forEach(function (selectEl) {
    selectEl.addEventListener("change", function () {
      if (errorBanner.classList.contains("is-visible")) {
        clearValidationState();
      }
    });
  });

  // Swap button
  if (swapBtn) {
    swapBtn.addEventListener("click", function () {
      var prevA = selectA.value;
      selectA.value = selectB.value;
      selectB.value = prevA;

      if (selectA.value && selectB.value && selectA.value !== selectB.value) {
        runComparison();
      } else {
        clearValidationState();
      }
    });
  }

  // Preset matchups
  document.querySelectorAll("[data-preset-a][data-preset-b]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idA = btn.getAttribute("data-preset-a");
      var idB = btn.getAttribute("data-preset-b");
      if (findCarById(idA) && findCarById(idB)) {
        selectA.value = idA;
        selectB.value = idB;
        runComparison();
      }
    });
  });

  // Load saved cars from CarVaultShared
  if (loadSavedBtn) {
    loadSavedBtn.addEventListener("click", function () {
      var saved = sharedApi ? sharedApi.getSavedCars() : [];
      var validSaved = saved.filter(function (id) {
        return Boolean(findCarById(id));
      });

      if (validSaved.length === 0) {
        showValidationError("You have no saved vehicles in your garage yet. Save two vehicles or select them above.", [selectA, selectB]);
        return;
      }

      if (validSaved.length === 1) {
        selectA.value = validSaved[0];
        selectB.value = "";
        showValidationError("Only 1 saved vehicle found (" + findCarById(validSaved[0]).name + "). Select a second vehicle to compare.", [selectB]);
        selectB.focus();
        return;
      }

      selectA.value = validSaved[0];
      selectB.value = validSaved[1];
      runComparison();
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener("click", resetComparison);
  }

  // Delegate save-to-garage button clicks on rendered cards
  vehicleCardsGrid.addEventListener("click", function (event) {
    var saveBtn = event.target.closest("[data-save-car]");
    if (!saveBtn || !sharedApi) {
      return;
    }

    var carId = saveBtn.getAttribute("data-save-car");
    var isNowSaved = sharedApi.toggleSavedCar(carId);
    saveBtn.textContent = isNowSaved ? "Saved in Garage" : "Save Vehicle";
    saveBtn.classList.toggle("is-saved", isNowSaved);
    saveBtn.setAttribute("aria-pressed", String(isNowSaved));
  });

  initFromQueryParams();
})();
