/**
 * CarVault — What's Next / New Arrivals Page (pages/new-arrivals.html)
 * Handles featured AMG GT save/details, filter & sort controls,
 * data-driven arrival cards, and the 3-step Find Your Match questionnaire.
 */

(function () {
  "use strict";

  var ARRIVAL_IMAGE_MAP = {
    "mercedes-amg-gt": {
      image: "../assets/images/arrivals/mercedes-amg-gt.jpg",
      alt: "Obsidian black Mercedes-AMG GT coupe in CarVault luxury showroom"
    },
    "audi-rs-etron-gt": {
      image: "../assets/images/arrivals/audi-rs-etron-gt.jpg",
      alt: "Dark graphite Audi RS e-tron GT electric grand tourer in dark showroom"
    },
    "bmw-m4-competition": {
      image: "../assets/images/arrivals/bmw-m4-competition.svg",
      alt: "Metallic emerald-black BMW M4 Competition coupe in dark showroom"
    },
    "porsche-911-carrera-gts": {
      image: "../assets/images/arrivals/porsche-911-gts.jpg",
      alt: "Chalk grey Porsche 911 Carrera GTS coupe in CarVault showroom"
    },
    "range-rover-autobiography": {
      image: "../assets/images/arrivals/range-rover-autobiography.jpg",
      alt: "Obsidian Range Rover Autobiography luxury SUV in architectural showroom"
    }
  };

  var ARRIVAL_CARD_IDS = [
    "audi-rs-etron-gt",
    "bmw-m4-competition",
    "porsche-911-carrera-gts"
  ];

  var QUIZ_QUESTIONS = [
    {
      id: "priority",
      prompt: "Question 1 of 3: What matters most?",
      options: [
        { label: "Performance", value: "performance" },
        { label: "Luxury & Comfort", value: "luxury" },
        { label: "Electric Tech", value: "electric" },
        { label: "Space (SUV)", value: "suv" }
      ]
    },
    {
      id: "setting",
      prompt: "Question 2 of 3: Where will you drive most often?",
      options: [
        { label: "Track & Winding Roads", value: "performance" },
        { label: "Grand Touring Highways", value: "luxury" },
        { label: "Silent City Commuting", value: "electric" },
        { label: "All-Weather & Family Travel", value: "suv" }
      ]
    },
    {
      id: "signature",
      prompt: "Question 3 of 3: Which signature defines your taste?",
      options: [
        { label: "Twin-Turbo / Flat-6 Thrill", value: "performance" },
        { label: "Hand-Built V8 Presence", value: "luxury" },
        { label: "800V Instant Torque", value: "electric" },
        { label: "Commanding Elevated Cabin", value: "suv" }
      ]
    }
  ];

  var MATCH_TARGETS = {
    performance: {
      carId: "bmw-m4-competition",
      title: "BMW M4 Competition",
      reason: "523 HP twin-turbo precision engineered for pure cornering response."
    },
    luxury: {
      carId: "mercedes-amg-gt",
      title: "Mercedes-AMG GT",
      reason: "577 HP hand-built V8 power blended with sculpted grand-touring poise."
    },
    electric: {
      carId: "audi-rs-etron-gt",
      title: "Audi RS e-tron GT",
      reason: "637 HP dual-motor quattro performance with cutting-edge EV architecture."
    },
    suv: {
      carId: "range-rover-autobiography",
      title: "Range Rover Autobiography",
      reason: "Commanding V8 composure and serene luxury space for every journey."
    }
  };

  var state = {
    filter: "all",
    sort: "newest",
    quizStep: 0,
    answers: {},
    matchedCategory: null
  };

  function getArrivalVehicles() {
    if (!window.CarVaultData) {
      return [];
    }
    return window.CarVaultData.CARS.filter(function (car) {
      return ARRIVAL_CARD_IDS.indexOf(car.id) !== -1;
    });
  }

  function openDetailModal(car) {
    var modalTitle = document.getElementById("arrivalModalTitle");
    var modalBody = document.getElementById("arrivalModalBody");
    var saveBtn = document.getElementById("arrivalModalSaveBtn");
    if (!modalTitle || !modalBody || !saveBtn || !car) {
      return;
    }

    var media = ARRIVAL_IMAGE_MAP[car.id] || ARRIVAL_IMAGE_MAP["mercedes-amg-gt"];
    var priceText = window.CarVaultData
      ? window.CarVaultData.formatPKR(car.pricePKR)
      : "PKR " + car.pricePKR;

    modalTitle.textContent = car.name;
    modalBody.innerHTML =
      '<div class="row g-3 align-items-center">' +
      '  <div class="col-12 col-md-6">' +
      '    <img src="' + media.image + '" alt="' + media.alt + '" class="img-fluid rounded-1 border border-secondary-subtle" />' +
      "  </div>" +
      '  <div class="col-12 col-md-6">' +
      '    <span class="cv-eyebrow mb-2">' + car.status + " &middot; " + car.arrivalLabel + "</span>" +
      '    <h4 class="h5 fw-bold text-white mb-2">' + priceText + "</h4>" +
      '    <p class="small text-warning mb-2">' + car.specs + "</p>" +
      '    <p class="small text-secondary mb-0">' + car.description + "</p>" +
      "  </div>" +
      "</div>";

    function syncModalSave() {
      var saved = window.CarVaultShared && window.CarVaultShared.isCarSaved(car.id);
      saveBtn.innerHTML = saved ? "&#9829; Saved" : "&#9825; Save Car";
    }

    syncModalSave();
    saveBtn.onclick = function () {
      if (window.CarVaultShared) {
        window.CarVaultShared.toggleSavedCar(car.id);
        syncModalSave();
        syncFeaturedSaveButton();
        renderArrivalsGrid();
      }
    };

    var modalEl = document.getElementById("arrivalDetailModal");
    if (window.bootstrap && window.bootstrap.Modal && modalEl) {
      window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  function syncFeaturedSaveButton() {
    var saveBtn = document.getElementById("featuredSaveBtn");
    if (!saveBtn || !window.CarVaultShared) {
      return;
    }
    var saved = window.CarVaultShared.isCarSaved("mercedes-amg-gt");
    saveBtn.setAttribute("aria-pressed", String(saved));
    saveBtn.classList.toggle("is-saved", saved);
    saveBtn.innerHTML = saved
      ? '<span aria-hidden="true">&#9829;</span> Saved'
      : '<span aria-hidden="true">&#9825;</span> Save';
  }

  function initFeaturedSection() {
    var detailsBtn = document.getElementById("featuredDetailsBtn");
    var saveBtn = document.getElementById("featuredSaveBtn");

    if (detailsBtn && window.CarVaultData) {
      detailsBtn.addEventListener("click", function () {
        var amg = window.CarVaultData.CARS.find(function (c) {
          return c.id === "mercedes-amg-gt";
        });
        if (amg) {
          openDetailModal(amg);
        }
      });
    }

    if (saveBtn) {
      syncFeaturedSaveButton();
      saveBtn.addEventListener("click", function () {
        if (window.CarVaultShared) {
          window.CarVaultShared.toggleSavedCar("mercedes-amg-gt");
          syncFeaturedSaveButton();
        }
      });
    }
  }

  function saveArrivalsPrefs() {
    if (!window.CarVaultShared) {
      return;
    }
    window.CarVaultShared.safeSetStorage(
      window.CarVaultShared.STORAGE_KEYS.ARRIVALS_PREFS,
      { filter: state.filter, sort: state.sort }
    );
  }

  function renderArrivalsGrid() {
    var grid = document.getElementById("arrivalsGrid");
    var countText = document.getElementById("arrivalsCountText");
    if (!grid) {
      return;
    }

    var list = getArrivalVehicles().filter(function (car) {
      if (state.filter === "all") {
        return true;
      }
      return car.status === state.filter;
    });

    list.sort(function (a, b) {
      if (state.sort === "price-asc") {
        return a.pricePKR - b.pricePKR;
      }
      if (state.sort === "price-desc") {
        return b.pricePKR - a.pricePKR;
      }
      return new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime();
    });

    if (countText) {
      countText.textContent =
        "Showing " + list.length + (list.length === 1 ? " arrival" : " arrivals") +
        (state.filter !== "all" ? " (" + state.filter + ")" : "");
    }

    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML =
        '<div class="col-12"><p class="cv-subtitle">No arrivals match the selected filter.</p></div>';
      return;
    }

    var fragment = document.createDocumentFragment();
    list.forEach(function (car) {
      var col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      var card = document.createElement("article");
      card.className = "cv-arrival-card";

      var mediaInfo = ARRIVAL_IMAGE_MAP[car.id] || ARRIVAL_IMAGE_MAP["mercedes-amg-gt"];
      var isComingSoon = car.status === "Coming Soon";

      var imgWrap = document.createElement("div");
      imgWrap.className = "cv-arrival-img-wrap";

      var badge = document.createElement("span");
      badge.className = "cv-status-pill" + (isComingSoon ? " is-coming-soon" : "");
      badge.textContent = isComingSoon ? "Coming Soon" : "NEW";

      var img = document.createElement("img");
      img.src = mediaInfo.image;
      img.alt = mediaInfo.alt;

      imgWrap.appendChild(badge);
      imgWrap.appendChild(img);

      var body = document.createElement("div");
      body.className = "cv-arrival-body";

      var title = document.createElement("h3");
      title.className = "cv-arrival-name";
      title.textContent = car.name === "911 Carrera GTS" ? "Porsche 911 GTS" : car.name;

      var specs = document.createElement("p");
      specs.className = "cv-arrival-specs";
      specs.textContent = car.specs;

      var footer = document.createElement("div");
      footer.className = "cv-arrival-footer";

      var price = document.createElement("span");
      price.className = "cv-arrival-price";
      price.textContent = window.CarVaultData.formatPKR(car.pricePKR);

      var actions = document.createElement("div");
      actions.className = "cv-arrival-actions";

      var isSaved = window.CarVaultShared && window.CarVaultShared.isCarSaved(car.id);
      var saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "cv-icon-save" + (isSaved ? " is-saved" : "");
      saveBtn.setAttribute("aria-label", (isSaved ? "Remove " : "Save ") + title.textContent);
      saveBtn.setAttribute("aria-pressed", String(Boolean(isSaved)));
      saveBtn.innerHTML = isSaved ? "&#9829;" : "&#9825;";
      saveBtn.addEventListener("click", function () {
        if (window.CarVaultShared) {
          window.CarVaultShared.toggleSavedCar(car.id);
          renderArrivalsGrid();
        }
      });

      var viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.className = "cv-view-link-btn";
      viewBtn.innerHTML = 'View <span aria-hidden="true">&rarr;</span>';
      viewBtn.addEventListener("click", function () {
        openDetailModal(car);
      });

      actions.appendChild(saveBtn);
      actions.appendChild(viewBtn);
      footer.appendChild(price);
      footer.appendChild(actions);

      body.appendChild(title);
      body.appendChild(specs);
      body.appendChild(footer);

      card.appendChild(imgWrap);
      card.appendChild(body);
      col.appendChild(card);
      fragment.appendChild(col);
    });

    grid.appendChild(fragment);
  }

  function initFilterAndSort() {
    if (window.CarVaultShared) {
      var savedPrefs = window.CarVaultShared.safeGetStorage(
        window.CarVaultShared.STORAGE_KEYS.ARRIVALS_PREFS,
        null
      );
      if (savedPrefs) {
        if (savedPrefs.filter) state.filter = savedPrefs.filter;
        if (savedPrefs.sort) state.sort = savedPrefs.sort;
      }
    }

    var filterBtns = document.querySelectorAll("#arrivalFilterGroup .cv-filter-btn");
    filterBtns.forEach(function (btn) {
      var btnFilter = btn.getAttribute("data-filter");
      var active = btnFilter === state.filter;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));

      btn.addEventListener("click", function () {
        state.filter = btnFilter;
        filterBtns.forEach(function (other) {
          var isMatch = other === btn;
          other.classList.toggle("is-active", isMatch);
          other.setAttribute("aria-pressed", String(isMatch));
        });
        saveArrivalsPrefs();
        renderArrivalsGrid();
      });
    });

    var sortSelect = document.getElementById("arrivalSortSelect");
    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        saveArrivalsPrefs();
        renderArrivalsGrid();
      });
    }

    renderArrivalsGrid();
  }

  function updateQuizPreview(categoryKey) {
    var previewImg = document.getElementById("matchPreviewImage");
    var previewCap = document.getElementById("matchPreviewCaption");
    if (!previewImg || !previewCap) {
      return;
    }

    if (!categoryKey || !MATCH_TARGETS[categoryKey]) {
      previewImg.src = ARRIVAL_IMAGE_MAP["mercedes-amg-gt"].image;
      previewImg.alt = ARRIVAL_IMAGE_MAP["mercedes-amg-gt"].alt;
      previewCap.textContent = "Select your driving priorities to reveal your ideal CarVault arrival.";
      return;
    }

    var match = MATCH_TARGETS[categoryKey];
    var media = ARRIVAL_IMAGE_MAP[match.carId] || ARRIVAL_IMAGE_MAP["mercedes-amg-gt"];
    previewImg.src = media.image;
    previewImg.alt = media.alt;
    previewCap.textContent = match.title + " — " + match.reason;
  }

  function computeBestCategory(answers) {
    var tally = { performance: 0, luxury: 0, electric: 0, suv: 0 };
    Object.keys(answers).forEach(function (k) {
      var val = answers[k];
      if (Object.prototype.hasOwnProperty.call(tally, val)) {
        tally[val] += 1;
      }
    });

    // Weight question 1 slightly higher to break ties deterministically
    if (answers.priority && Object.prototype.hasOwnProperty.call(tally, answers.priority)) {
      tally[answers.priority] += 0.5;
    }

    var bestKey = "performance";
    var bestScore = -1;
    Object.keys(tally).forEach(function (key) {
      if (tally[key] > bestScore) {
        bestScore = tally[key];
        bestKey = key;
      }
    });
    return bestKey;
  }

  function renderQuiz(validationMsg) {
    var container = document.getElementById("quizContainer");
    var progressFill = document.getElementById("quizProgressFill");
    if (!container || !progressFill) {
      return;
    }

    container.innerHTML = "";

    if (state.matchedCategory && MATCH_TARGETS[state.matchedCategory]) {
      progressFill.style.width = "100%";
      var result = MATCH_TARGETS[state.matchedCategory];
      var carObj = window.CarVaultData
        ? window.CarVaultData.CARS.find(function (c) {
            return c.id === result.carId;
          })
        : null;

      updateQuizPreview(state.matchedCategory);

      var badge = document.createElement("span");
      badge.className = "cv-status-pill mb-3";
      badge.textContent = "Your CarVault Match";

      var title = document.createElement("h3");
      title.className = "h4 fw-bold text-white mb-2";
      title.textContent = result.title;

      var desc = document.createElement("p");
      desc.className = "cv-subtitle mb-3";
      desc.textContent = result.reason;

      var btnRow = document.createElement("div");
      btnRow.className = "d-flex flex-wrap gap-2";

      var viewMatchBtn = document.createElement("button");
      viewMatchBtn.type = "button";
      viewMatchBtn.className = "cv-btn-primary";
      viewMatchBtn.textContent = "View Match Specs";
      viewMatchBtn.addEventListener("click", function () {
        if (carObj) {
          openDetailModal(carObj);
        }
      });

      var retakeBtn = document.createElement("button");
      retakeBtn.type = "button";
      retakeBtn.className = "cv-btn-outline";
      retakeBtn.textContent = "Retake Quiz";
      retakeBtn.addEventListener("click", function () {
        state.quizStep = 0;
        state.answers = {};
        state.matchedCategory = null;
        if (window.CarVaultShared) {
          window.CarVaultShared.safeSetStorage(
            window.CarVaultShared.STORAGE_KEYS.MATCH_RESULT,
            null
          );
        }
        updateQuizPreview(null);
        renderQuiz("");
      });

      btnRow.appendChild(viewMatchBtn);
      btnRow.appendChild(retakeBtn);

      container.appendChild(badge);
      container.appendChild(title);
      container.appendChild(desc);
      container.appendChild(btnRow);
      return;
    }

    var currentQ = QUIZ_QUESTIONS[state.quizStep];
    var pct = Math.round(((state.quizStep + 1) / QUIZ_QUESTIONS.length) * 100);
    progressFill.style.width = pct + "%";

    var qText = document.createElement("p");
    qText.className = "cv-quiz-question";
    qText.textContent = currentQ.prompt;

    var optionsGrid = document.createElement("div");
    optionsGrid.className = "cv-quiz-options";

    var selectedVal = state.answers[currentQ.id] || null;
    updateQuizPreview(selectedVal);

    currentQ.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cv-quiz-option" + (selectedVal === opt.value ? " is-selected" : "");
      btn.setAttribute("aria-pressed", String(selectedVal === opt.value));
      btn.textContent = opt.label;
      btn.addEventListener("click", function () {
        state.answers[currentQ.id] = opt.value;
        updateQuizPreview(opt.value);
        renderQuiz("");
      });
      optionsGrid.appendChild(btn);
    });

    container.appendChild(qText);
    container.appendChild(optionsGrid);

    if (validationMsg) {
      var err = document.createElement("p");
      err.className = "cv-quiz-error";
      err.setAttribute("role", "alert");
      err.textContent = validationMsg;
      container.appendChild(err);
    }

    var navRow = document.createElement("div");
    navRow.className = "d-flex flex-wrap gap-2";

    if (state.quizStep > 0) {
      var backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "cv-btn-outline";
      backBtn.textContent = "Back";
      backBtn.addEventListener("click", function () {
        state.quizStep -= 1;
        renderQuiz("");
      });
      navRow.appendChild(backBtn);
    }

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "cv-btn-primary";
    nextBtn.id = "quizNextBtn";
    nextBtn.textContent = state.quizStep === QUIZ_QUESTIONS.length - 1 ? "See My Match" : "Next";
    nextBtn.addEventListener("click", function () {
      if (!state.answers[currentQ.id]) {
        renderQuiz("Please select an option to continue.");
        return;
      }

      if (state.quizStep < QUIZ_QUESTIONS.length - 1) {
        state.quizStep += 1;
        renderQuiz("");
      } else {
        state.matchedCategory = computeBestCategory(state.answers);
        if (window.CarVaultShared) {
          window.CarVaultShared.safeSetStorage(
            window.CarVaultShared.STORAGE_KEYS.MATCH_RESULT,
            {
              category: state.matchedCategory,
              answers: state.answers,
              savedAt: new Date().toISOString()
            }
          );
        }
        renderQuiz("");
      }
    });

    navRow.appendChild(nextBtn);
    container.appendChild(navRow);
  }

  function initQuiz() {
    if (window.CarVaultShared) {
      var savedResult = window.CarVaultShared.safeGetStorage(
        window.CarVaultShared.STORAGE_KEYS.MATCH_RESULT,
        null
      );
      if (savedResult && savedResult.category && MATCH_TARGETS[savedResult.category]) {
        state.matchedCategory = savedResult.category;
        state.answers = savedResult.answers || {};
      }
    }
    renderQuiz("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFeaturedSection();
    initFilterAndSort();
    initQuiz();
  });
})();
