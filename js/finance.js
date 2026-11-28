/**
 * CarVault — Page 5: Finance Calculator
 * Handles vehicle selection, input validation, standard amortizing loan calculation
 * (including zero-interest handling), live summary rendering, and annual breakdown.
 */

(function () {
  "use strict";

  var DEFAULT_DOWN_PCT = 20;
  var DEFAULT_RATE = 12;
  var DEFAULT_MONTHS = 60;
  var MAX_VEHICLE_PRICE = 10000000000;
  var MAX_INTEREST_RATE = 100;
  var MAX_MONTHS = 120;

  var form = document.getElementById("financeForm");
  var carSelect = document.getElementById("carSelect");
  var priceInput = document.getElementById("vehiclePrice");
  var downPaymentInput = document.getElementById("downPayment");
  var rateInput = document.getElementById("interestRate");
  var durationInput = document.getElementById("loanDuration");
  var resetBtn = document.getElementById("resetFinanceBtn");

  var errorBanner = document.getElementById("financeErrorBanner");
  var errorText = document.getElementById("financeErrorText");

  var carSelectMeta = document.getElementById("carSelectMeta");
  var priceFormattedMeta = document.getElementById("vehiclePriceFormatted");
  var downPctMeta = document.getElementById("downPaymentPercentMeta");
  var rateMeta = document.getElementById("interestRateMeta");
  var durationYearsMeta = document.getElementById("loanDurationYearsMeta");

  var monthlyPaymentOutput = document.getElementById("monthlyPaymentOutput");
  var monthlyPaymentSub = document.getElementById("monthlyPaymentSub");
  var zeroInterestBadge = document.getElementById("zeroInterestBadge");
  var loanAmountOutput = document.getElementById("loanAmountOutput");
  var monthlyMetricOutput = document.getElementById("monthlyMetricOutput");
  var totalInterestOutput = document.getElementById("totalInterestOutput");
  var totalRepaymentOutput = document.getElementById("totalRepaymentOutput");

  var principalBar = document.getElementById("principalBar");
  var interestBar = document.getElementById("interestBar");
  var principalLegend = document.getElementById("principalLegend");
  var interestLegend = document.getElementById("interestLegend");

  var selectedCarCard = document.getElementById("selectedCarCard");
  var selectedCarImg = document.getElementById("selectedCarImg");
  var selectedCarBrand = document.getElementById("selectedCarBrand");
  var selectedCarName = document.getElementById("selectedCarName");
  var selectedCarSpecs = document.getElementById("selectedCarSpecs");
  var bookTestDriveLink = document.getElementById("bookTestDriveLink");
  var compareVehicleLink = document.getElementById("compareVehicleLink");
  var scheduleTableBody = document.getElementById("scheduleTableBody");

  var dataApi = window.CarVaultData;

  if (!form || !carSelect || !priceInput || !downPaymentInput || !rateInput || !durationInput) {
    return;
  }

  var cars = dataApi && Array.isArray(dataApi.CARS) ? dataApi.CARS : [];

  var fieldConfigs = {
    vehiclePrice: {
      input: priceInput,
      errorEl: document.getElementById("vehiclePriceError")
    },
    downPayment: {
      input: downPaymentInput,
      errorEl: document.getElementById("downPaymentError")
    },
    interestRate: {
      input: rateInput,
      errorEl: document.getElementById("interestRateError")
    },
    loanDuration: {
      input: durationInput,
      errorEl: document.getElementById("loanDurationError")
    }
  };

  function formatCurrency(amount) {
    var rounded = Math.round(Number(amount) || 0);
    if (dataApi && typeof dataApi.formatPKR === "function") {
      return dataApi.formatPKR(rounded);
    }
    return "PKR " + rounded.toLocaleString("en-US");
  }

  function findCarById(carId) {
    for (var i = 0; i < cars.length; i += 1) {
      if (cars[i].id === carId) {
        return cars[i];
      }
    }
    return null;
  }

  function getDefaultCar() {
    for (var i = 0; i < cars.length; i += 1) {
      if (cars[i].isFeaturedArrival) {
        return cars[i];
      }
    }
    return cars.length > 0 ? cars[0] : null;
  }

  function populateCarOptions() {
    carSelect.innerHTML = "";

    var customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = "Custom Vehicle Valuation";
    carSelect.appendChild(customOption);

    cars.forEach(function (car) {
      var option = document.createElement("option");
      option.value = car.id;
      option.textContent = car.brandName + " " + car.name + " — " + formatCurrency(car.pricePKR);
      carSelect.appendChild(option);
    });
  }

  function updateSelectedCarPreview(car) {
    if (!car) {
      selectedCarCard.classList.add("is-hidden");
      carSelectMeta.textContent = "Custom Entry";
      bookTestDriveLink.href = "test-drive.html";
      compareVehicleLink.href = "compare.html";
      return;
    }

    selectedCarImg.src = car.image;
    selectedCarImg.alt = car.brandName + " " + car.name;
    selectedCarBrand.textContent = car.brandName + " · " + car.status;
    selectedCarName.textContent = car.name;
    selectedCarSpecs.textContent = car.specs;
    selectedCarCard.classList.remove("is-hidden");

    carSelectMeta.textContent = car.brandName;
    bookTestDriveLink.href = "test-drive.html?car=" + encodeURIComponent(car.id);
    compareVehicleLink.href = "compare.html?car=" + encodeURIComponent(car.id);
  }

  function clearFieldErrors() {
    Object.keys(fieldConfigs).forEach(function (key) {
      var cfg = fieldConfigs[key];
      cfg.input.classList.remove("is-invalid");
      cfg.input.removeAttribute("aria-invalid");
      if (cfg.errorEl) {
        cfg.errorEl.textContent = "";
        cfg.errorEl.classList.remove("is-visible");
      }
    });
    errorText.textContent = "";
    errorBanner.classList.remove("is-visible");
  }

  function setFieldError(key, message) {
    var cfg = fieldConfigs[key];
    if (!cfg) {
      return;
    }
    cfg.input.classList.add("is-invalid");
    cfg.input.setAttribute("aria-invalid", "true");
    if (cfg.errorEl) {
      cfg.errorEl.textContent = message;
      cfg.errorEl.classList.add("is-visible");
    }
  }

  function parseNumericInput(rawValue) {
    var trimmed = String(rawValue).trim();
    if (trimmed === "") {
      return { empty: true, value: NaN };
    }
    var num = Number(trimmed);
    return { empty: false, value: num };
  }

  function validateInputs() {
    var errors = {};

    var parsedPrice = parseNumericInput(priceInput.value);
    var parsedDown = parseNumericInput(downPaymentInput.value);
    var parsedRate = parseNumericInput(rateInput.value);
    var parsedMonths = parseNumericInput(durationInput.value);

    if (parsedPrice.empty) {
      errors.vehiclePrice = "Please enter the vehicle price.";
    } else if (!Number.isFinite(parsedPrice.value) || parsedPrice.value <= 0) {
      errors.vehiclePrice = "Vehicle price must be greater than PKR 0.";
    } else if (parsedPrice.value > MAX_VEHICLE_PRICE) {
      errors.vehiclePrice = "Vehicle price cannot exceed PKR 10,000,000,000.";
    }

    if (parsedDown.empty) {
      errors.downPayment = "Please enter a down payment (enter 0 for no down payment).";
    } else if (!Number.isFinite(parsedDown.value) || parsedDown.value < 0) {
      errors.downPayment = "Down payment cannot be negative.";
    } else if (Number.isFinite(parsedPrice.value) && parsedPrice.value > 0) {
      if (parsedDown.value > parsedPrice.value) {
        errors.downPayment = "Down payment cannot exceed the vehicle price.";
      } else if (parsedDown.value === parsedPrice.value) {
        errors.downPayment = "Down payment equals the vehicle price. Lower it below the vehicle price to finance a loan.";
      }
    }

    if (parsedRate.empty) {
      errors.interestRate = "Please enter an annual interest rate (0 or higher).";
    } else if (!Number.isFinite(parsedRate.value) || parsedRate.value < 0) {
      errors.interestRate = "Annual interest rate cannot be negative.";
    } else if (parsedRate.value > MAX_INTEREST_RATE) {
      errors.interestRate = "Annual interest rate cannot exceed " + MAX_INTEREST_RATE + "%.";
    }

    if (parsedMonths.empty) {
      errors.loanDuration = "Please enter the loan duration in months.";
    } else if (!Number.isFinite(parsedMonths.value) || parsedMonths.value < 1) {
      errors.loanDuration = "Loan duration must be at least 1 month.";
    } else if (Math.floor(parsedMonths.value) !== parsedMonths.value) {
      errors.loanDuration = "Loan duration must be a whole number of months.";
    } else if (parsedMonths.value > MAX_MONTHS) {
      errors.loanDuration = "Loan duration cannot exceed " + MAX_MONTHS + " months (10 years).";
    }

    var errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      return {
        valid: false,
        errors: errors,
        firstErrorKey: errorKeys[0]
      };
    }

    return {
      valid: true,
      values: {
        vehiclePrice: parsedPrice.value,
        downPayment: parsedDown.value,
        annualRate: parsedRate.value,
        months: parsedMonths.value
      }
    };
  }

  /**
   * Standard amortizing loan calculation with explicit zero-interest handling.
   * Formula:
   *   If annualRate === 0: M = P / n
   *   Else: M = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ], where r = annualRate / 100 / 12
   */
  function calculateLoan(vehiclePrice, downPayment, annualRate, months) {
    var principal = vehiclePrice - downPayment;
    var monthlyPayment = 0;
    var totalRepayment = 0;
    var totalInterest = 0;

    if (annualRate === 0) {
      monthlyPayment = principal / months;
      totalRepayment = principal;
      totalInterest = 0;
    } else {
      var monthlyRate = annualRate / 100 / 12;
      var growthFactor = Math.pow(1 + monthlyRate, months);
      monthlyPayment = (principal * (monthlyRate * growthFactor)) / (growthFactor - 1);
      totalRepayment = monthlyPayment * months;
      totalInterest = Math.max(0, totalRepayment - principal);
    }

    return {
      principal: principal,
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalRepayment: totalRepayment,
      annualRate: annualRate,
      months: months
    };
  }

  function buildAnnualSchedule(principal, annualRate, months, monthlyPayment) {
    var rows = [];
    var balance = principal;
    var monthlyRate = annualRate / 100 / 12;
    var totalYears = Math.ceil(months / 12);

    for (var year = 1; year <= totalYears; year += 1) {
      var monthsInYear = Math.min(12, months - (year - 1) * 12);
      var yearPrincipal = 0;
      var yearInterest = 0;

      for (var m = 0; m < monthsInYear; m += 1) {
        var interestForMonth = annualRate === 0 ? 0 : balance * monthlyRate;
        var principalForMonth = monthlyPayment - interestForMonth;
        if (principalForMonth > balance) {
          principalForMonth = balance;
        }
        yearInterest += interestForMonth;
        yearPrincipal += principalForMonth;
        balance = Math.max(0, balance - principalForMonth);
      }

      if (year === totalYears && balance < 1) {
        balance = 0;
      }

      rows.push({
        year: year,
        payments: monthsInYear,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        endingBalance: balance
      });
    }

    return rows;
  }

  function renderSchedule(result) {
    var schedule = buildAnnualSchedule(
      result.principal,
      result.annualRate,
      result.months,
      result.monthlyPayment
    );

    scheduleTableBody.innerHTML = schedule
      .map(function (row) {
        return (
          "<tr>" +
            "<td>Year " + row.year + "</td>" +
            "<td>" + row.payments + " mo</td>" +
            "<td>" + formatCurrency(row.principalPaid) + "</td>" +
            "<td>" + formatCurrency(row.interestPaid) + "</td>" +
            "<td>" + formatCurrency(row.endingBalance) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function updateFieldMetaLabels() {
    var priceVal = Number(priceInput.value);
    var downVal = Number(downPaymentInput.value);
    var rateVal = Number(rateInput.value);
    var monthsVal = Number(durationInput.value);

    priceFormattedMeta.textContent =
      Number.isFinite(priceVal) && priceVal > 0 ? formatCurrency(priceVal) : "";

    if (Number.isFinite(priceVal) && priceVal > 0 && Number.isFinite(downVal) && downVal >= 0) {
      var pct = (downVal / priceVal) * 100;
      downPctMeta.textContent = pct.toFixed(1).replace(/\.0$/, "") + "% of price";
    } else {
      downPctMeta.textContent = "—";
    }

    if (String(rateInput.value).trim() !== "" && Number.isFinite(rateVal) && rateVal >= 0) {
      rateMeta.textContent = rateVal === 0 ? "0% Interest" : rateVal + "% APR";
    } else {
      rateMeta.textContent = "APR";
    }

    if (Number.isFinite(monthsVal) && monthsVal >= 1) {
      var years = monthsVal / 12;
      durationYearsMeta.textContent = years.toFixed(1).replace(/\.0$/, "") + (years === 1 ? " yr" : " yrs");
    } else {
      durationYearsMeta.textContent = "—";
    }

    syncPresetButtonStates();
  }

  function syncPresetButtonStates() {
    var priceVal = Number(priceInput.value);
    var downVal = Number(downPaymentInput.value);
    var rateVal = Number(rateInput.value);
    var monthsVal = Number(durationInput.value);

    document.querySelectorAll("[data-down-pct]").forEach(function (btn) {
      var targetPct = Number(btn.getAttribute("data-down-pct"));
      var isMatch =
        Number.isFinite(priceVal) &&
        priceVal > 0 &&
        Number.isFinite(downVal) &&
        Math.abs(downVal - Math.round((priceVal * targetPct) / 100)) <= 1;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    document.querySelectorAll("[data-rate]").forEach(function (btn) {
      var targetRate = Number(btn.getAttribute("data-rate"));
      var isMatch = String(rateInput.value).trim() !== "" && rateVal === targetRate;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    document.querySelectorAll("[data-months]").forEach(function (btn) {
      var targetMonths = Number(btn.getAttribute("data-months"));
      var isMatch = monthsVal === targetMonths;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });
  }

  function renderInvalidSummary() {
    monthlyPaymentOutput.textContent = "—";
    monthlyPaymentSub.textContent = "Correct the highlighted fields to view your installment estimate.";
    zeroInterestBadge.classList.remove("is-visible");
    loanAmountOutput.textContent = "—";
    monthlyMetricOutput.textContent = "—";
    totalInterestOutput.textContent = "—";
    totalRepaymentOutput.textContent = "—";
    principalBar.style.width = "0%";
    interestBar.style.width = "0%";
    principalLegend.textContent = "Principal: —";
    interestLegend.textContent = "Interest: —";
    scheduleTableBody.innerHTML =
      '<tr><td colspan="5" class="cv-schedule-empty">Enter valid loan terms above to view the annual schedule.</td></tr>';
  }

  function renderResults(result) {
    var formattedMonthly = formatCurrency(result.monthlyPayment);
    var formattedLoan = formatCurrency(result.principal);
    var formattedInterest = formatCurrency(result.totalInterest);
    var formattedTotal = formatCurrency(result.totalRepayment);

    monthlyPaymentOutput.textContent = formattedMonthly;
    monthlyMetricOutput.textContent = formattedMonthly;
    loanAmountOutput.textContent = formattedLoan;
    totalInterestOutput.textContent = formattedInterest;
    totalRepaymentOutput.textContent = formattedTotal;

    var monthLabel = result.months === 1 ? "1 month" : result.months + " months";
    if (result.annualRate === 0) {
      zeroInterestBadge.classList.add("is-visible");
      monthlyPaymentSub.textContent = "Per month for " + monthLabel + " at 0% annual interest";
    } else {
      zeroInterestBadge.classList.remove("is-visible");
      monthlyPaymentSub.textContent = "Per month for " + monthLabel + " at " + result.annualRate + "% APR";
    }

    var principalShare = result.totalRepayment > 0 ? (result.principal / result.totalRepayment) * 100 : 100;
    var interestShare = Math.max(0, 100 - principalShare);

    principalBar.style.width = principalShare.toFixed(2) + "%";
    interestBar.style.width = interestShare.toFixed(2) + "%";
    principalLegend.textContent = "Principal: " + principalShare.toFixed(1) + "%";
    interestLegend.textContent = "Interest: " + interestShare.toFixed(1) + "%";

    renderSchedule(result);
  }

  function evaluateAndRender(focusOnFirstError) {
    clearFieldErrors();
    updateFieldMetaLabels();

    var validation = validateInputs();
    if (!validation.valid) {
      Object.keys(validation.errors).forEach(function (key) {
        setFieldError(key, validation.errors[key]);
      });

      var errorCount = Object.keys(validation.errors).length;
      errorText.textContent =
        errorCount === 1
          ? validation.errors[validation.firstErrorKey]
          : "Please fix the " + errorCount + " highlighted fields below to calculate your financing.";
      errorBanner.classList.add("is-visible");

      renderInvalidSummary();

      if (focusOnFirstError && fieldConfigs[validation.firstErrorKey]) {
        fieldConfigs[validation.firstErrorKey].input.focus();
      }
      return false;
    }

    var vals = validation.values;
    var result = calculateLoan(
      vals.vehiclePrice,
      vals.downPayment,
      vals.annualRate,
      vals.months
    );
    renderResults(result);
    return true;
  }

  function applyCarSelection(carId) {
    var car = findCarById(carId);
    if (!car) {
      updateSelectedCarPreview(null);
      return;
    }

    carSelect.value = car.id;
    priceInput.value = String(car.pricePKR);
    downPaymentInput.value = String(Math.round((car.pricePKR * DEFAULT_DOWN_PCT) / 100));
    updateSelectedCarPreview(car);
    evaluateAndRender(false);
  }

  function resetToDefaults() {
    var defaultCar = getDefaultCar();
    rateInput.value = String(DEFAULT_RATE);
    durationInput.value = String(DEFAULT_MONTHS);

    if (defaultCar) {
      applyCarSelection(defaultCar.id);
    } else {
      carSelect.value = "custom";
      priceInput.value = "50000000";
      downPaymentInput.value = "10000000";
      updateSelectedCarPreview(null);
      evaluateAndRender(false);
    }
  }

  function initCalculator() {
    populateCarOptions();

    var params = new URLSearchParams(window.location.search);
    var requestedCarId = params.get("car");
    var initialCar = requestedCarId ? findCarById(requestedCarId) : getDefaultCar();

    rateInput.value = String(DEFAULT_RATE);
    durationInput.value = String(DEFAULT_MONTHS);

    if (initialCar) {
      applyCarSelection(initialCar.id);
    } else {
      resetToDefaults();
    }
  }

  // Event Listeners
  carSelect.addEventListener("change", function () {
    if (carSelect.value === "custom") {
      updateSelectedCarPreview(null);
      evaluateAndRender(false);
      return;
    }
    applyCarSelection(carSelect.value);
  });

  priceInput.addEventListener("input", function () {
    var selectedCar = findCarById(carSelect.value);
    if (selectedCar && Number(priceInput.value) !== selectedCar.pricePKR) {
      carSelect.value = "custom";
      updateSelectedCarPreview(null);
    }
    evaluateAndRender(false);
  });

  [downPaymentInput, rateInput, durationInput].forEach(function (inputEl) {
    inputEl.addEventListener("input", function () {
      evaluateAndRender(false);
    });
  });

  document.querySelectorAll("[data-down-pct]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var priceVal = Number(priceInput.value);
      if (!Number.isFinite(priceVal) || priceVal <= 0) {
        evaluateAndRender(true);
        return;
      }
      var pct = Number(btn.getAttribute("data-down-pct"));
      downPaymentInput.value = String(Math.round((priceVal * pct) / 100));
      evaluateAndRender(false);
    });
  });

  document.querySelectorAll("[data-rate]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      rateInput.value = btn.getAttribute("data-rate");
      evaluateAndRender(false);
    });
  });

  document.querySelectorAll("[data-months]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      durationInput.value = btn.getAttribute("data-months");
      evaluateAndRender(false);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    evaluateAndRender(true);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      resetToDefaults();
    });
  }

  initCalculator();
})();
