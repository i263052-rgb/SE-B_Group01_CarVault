
/**
 * CarVault — Dynamic Brand Page
 * Uses the Porsche page as a shared template for all six brands.
 */

(function () {
  "use strict";

  const DATA = window.CarVaultData;

  if (!DATA) {
    console.error("CarVaultData could not be loaded.");
    return;
  }

  const DEFAULT_BRAND = "porsche";
  const SAVED_CARS_KEY = "carvault_saved_cars";

  const params = new URLSearchParams(window.location.search);
  const requestedBrand = params.get("brand") || DEFAULT_BRAND;

  const brand = DATA.getBrandById(requestedBrand) ||
    DATA.getBrandById(DEFAULT_BRAND);

  const brandId = brand.id;
  const brandName = brand.name;

  const DRAFT_KEY = "carvault_" + brandId + "_inquiry_draft";
  const INQUIRIES_KEY = "carvault_" + brandId + "_inquiries";

  let brandCars = DATA.getCarsByBrand(brandId) || [];
  let activeIndex = 0;

  const porscheGallery = [
    {
      carId: "porsche-911-carrera-gts",
      image: "../assets/images/porsche/porsche-911-hero.jpg"
    },
    {
      carId: "porsche-911-carrera-gts",
      image: "../assets/images/porsche/porsche-911-interior.svg"
    },
    {
      carId: "porsche-911-carrera-gts",
      image: "../assets/images/porsche/porsche-911-rear.jpg"
    }
  ];

  function getElement(id) {
    return document.getElementById(id);
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[character];
      }
    );
  }

  function readStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      console.error("Could not read saved data:", error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save data:", error);
    }
  }

  function getCarImage(car) {
    return car.image ||
      car.imagePath ||
      car.imageUrl ||
      car.imageURL ||
      "";
  }

  function getCarPrice(car) {
    if (typeof DATA.formatPKR === "function") {
      return DATA.formatPKR(car.pricePKR);
    }

    return car.pricePKR
      ? "PKR " + Number(car.pricePKR).toLocaleString("en-PK")
      : "Price on request";
  }

  /* ---------- Brand Switcher ---------- */

  function renderBrandSwitcher() {
    const switcher = getElement("brandSwitcher");

    if (!switcher) return;

    const brands = DATA.getBrands();

    switcher.innerHTML = brands.map(function (item) {
      const url = "porsche.html?brand=" +
        encodeURIComponent(item.id);

      return `
        <a
          class="cv-brand-pill ${item.id === brandId ? "is-current" : ""}"
          href="${url}"
          ${item.id === brandId ? 'aria-current="page"' : ""}
        >
          ${escapeHTML(item.shortName || item.name)}
        </a>
      `;
    }).join("");
  }

  /* ---------- Brand Story ---------- */

  function populateBrandStory() {
    const heading = getElement("porsche-hero-heading");
    const tagline = getElement("porscheTagline");
    const story = getElement("porscheStoryCopy");
    const founded = getElement("statFounded");
    const country = getElement("statCountry");
    const modelCount = getElement("statModelCount");
    const modelLabel = getElement("statModelLabel");

    if (heading) {
      heading.textContent = brand.name + ".";
    }

    if (tagline) {
      tagline.textContent = brand.tagline || "";
    }

    if (story) {
      story.textContent = brand.story || "";
    }

    if (founded) {
      founded.textContent = brand.founded || "—";
    }

    if (country) {
      country.textContent = brand.country || "—";
    }

    if (modelCount) {
      modelCount.textContent = brandCars.length;
    }

    if (modelLabel) {
      modelLabel.textContent =
        brandCars.length === 1 ? "MODEL" : "MODELS";
    }

    const collectionHeading =
      getElement("porsche-collection-heading");

    if (collectionHeading) {
      collectionHeading.textContent =
        "The " + brand.name + " Collection";
    }

    const inquiryHeading = document.querySelector(
      "#porscheInquiryForm"
    );

    if (inquiryHeading) {
      const headingElement =
        inquiryHeading.querySelector("h2, h3");

      if (headingElement) {
        headingElement.textContent =
          "Ask about " + brand.name;
      }
    }

    document.title = brand.name + " | CARVAULT";

    const heroImage = document.querySelector(
      ".cv-story-media img"
    );

    if (heroImage) {
      const imagePath =
        brand.heroImage ||
        brand.image ||
        brand.imagePath ||
        "";

      if (imagePath) {
        heroImage.src = imagePath;
        heroImage.alt = brand.name + " vehicles";
        heroImage.hidden = false;
      } else if (brandId !== "porsche") {
        heroImage.hidden = true;
      }
    }
  }

  /* ---------- Vehicle Collection ---------- */

  function getGalleryItems() {
    if (brandId === "porsche") {
      return porscheGallery.map(function (galleryItem) {
        const car = brandCars.find(function (item) {
          return item.id === galleryItem.carId;
        });

        return car ? {
          car: car,
          image: galleryItem.image
        } : null;
      }).filter(Boolean);
    }

    return brandCars.map(function (car) {
      return {
        car: car,
        image: getCarImage(car)
      };
    });
  }

  function renderCarousel() {
    const track = getElement("porscheCarouselTrack");
    const dots = getElement("porscheCarouselDots");
    const status = getElement("carouselStatusText");

    if (!track) return;

    const gallery = getGalleryItems();

    if (gallery.length === 0) {
      track.innerHTML = `
        <p class="text-secondary">
          No vehicles are currently available for this brand.
        </p>
      `;

      if (dots) dots.innerHTML = "";
      if (status) status.textContent = "No vehicles available";

      return;
    }

    if (activeIndex >= gallery.length) {
      activeIndex = 0;
    }

    track.innerHTML = gallery.map(function (item, index) {
      const car = item.car;

      const imageHTML = item.image
        ? `
          <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(car.name)}"
            loading="lazy"
            onerror="this.style.display='none'"
          >
        `
        : "";

      return `
        <article class="cv-carousel-card
          ${index === activeIndex ? "is-highlighted" : ""}">

          <div class="cv-carousel-img-wrap">
            ${imageHTML}

            <span class="cv-carousel-badge">
              ${escapeHTML(car.status || brand.name)}
            </span>
          </div>

          <div class="cv-carousel-body">
            <h3 class="cv-carousel-title">
              ${escapeHTML(car.name)}
            </h3>

            <p class="cv-carousel-subtitle">
              ${escapeHTML(car.category || brand.name)}
            </p>

            <div class="cv-carousel-meta">
              <span class="cv-price-tag">
                ${escapeHTML(getCarPrice(car))}
              </span>

              <button
                class="cv-view-btn"
                type="button"
                data-car-id="${escapeHTML(car.id)}"
              >
                View Details
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    if (dots) {
      dots.innerHTML = gallery.map(function (_, index) {
        return `
          <button
            class="cv-carousel-dot
              ${index === activeIndex ? "is-active" : ""}"
            type="button"
            data-index="${index}"
            aria-label="Show vehicle ${index + 1}"
          ></button>
        `;
      }).join("");
    }

    if (status) {
      status.textContent =
        "Showing " + (activeIndex + 1) +
        " of " + gallery.length;
    }
  }

  function changeSlide(direction) {
    const gallery = getGalleryItems();

    if (!gallery.length) return;

    activeIndex =
      (activeIndex + direction + gallery.length) %
      gallery.length;

    renderCarousel();
  }

  function setSlide(index) {
    const gallery = getGalleryItems();

    if (index < 0 || index >= gallery.length) return;

    activeIndex = index;
    renderCarousel();
  }

  function initCarouselControls() {
    const previous = getElement("carouselPrevBtn");
    const next = getElement("carouselNextBtn");
    const track = getElement("porscheCarouselTrack");
    const dots = getElement("porscheCarouselDots");

    if (previous) {
      previous.addEventListener("click", function () {
        changeSlide(-1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        changeSlide(1);
      });
    }

    if (track) {
      track.addEventListener("click", function (event) {
        const button = event.target.closest("[data-car-id]");

        if (button) {
          openCarDetailModal(button.dataset.carId);
        }
      });
    }

    if (dots) {
      dots.addEventListener("click", function (event) {
        const button = event.target.closest("[data-index]");

        if (button) {
          setSlide(Number(button.dataset.index));
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        changeSlide(-1);
      }

      if (event.key === "ArrowRight") {
        changeSlide(1);
      }
    });
  }

  /* ---------- Vehicle Details Modal ---------- */

  function openCarDetailModal(carId) {
    const car = brandCars.find(function (item) {
      return item.id === carId;
    });

    if (!car) return;

    const title = getElement("porscheModalTitle");
    const body = getElement("porscheModalBody");
    const saveButton = getElement("porscheModalSaveBtn");

    if (title) {
      title.textContent = car.name;
    }

    if (body) {
      let specifications = "";

      if (car.specs && typeof car.specs === "object") {
        specifications = Object.entries(car.specs).map(
          function (entry) {
            return `
              <div class="d-flex justify-content-between
                border-bottom py-2">
                <strong>${escapeHTML(entry[0])}</strong>
                <span>${escapeHTML(entry[1])}</span>
              </div>
            `;
          }
        ).join("");
      }

      body.innerHTML = `
        <p class="text-secondary">
          ${escapeHTML(car.description || "")}
        </p>

        <h5 class="mt-4">Vehicle Specifications</h5>

        ${specifications}

        <p class="mt-4">
          <strong>Price:</strong>
          ${escapeHTML(getCarPrice(car))}
        </p>
      `;
    }

    if (saveButton) {
      saveButton.dataset.carId = car.id;
    }

    const modalElement = getElement("porscheDetailModal");

    if (modalElement && window.bootstrap &&
        window.bootstrap.Modal) {
      window.bootstrap.Modal
        .getOrCreateInstance(modalElement)
        .show();
    } else if (modalElement) {
      modalElement.style.display = "block";
      modalElement.classList.add("show");
    }
  }

  /* ---------- Save Vehicle ---------- */

  function saveCar(carId) {
    const car = brandCars.find(function (item) {
      return item.id === carId;
    });

    if (!car) return;

    const savedCars = readStorage(SAVED_CARS_KEY, []);

    const alreadySaved = savedCars.some(function (item) {
      return item.id === carId;
    });

    if (alreadySaved) {
      alert("This vehicle is already saved.");
      return;
    }

    savedCars.push({
      id: car.id,
      brandId: brandId,
      brandName: brand.name,
      name: car.name
    });

    writeStorage(SAVED_CARS_KEY, savedCars);

    alert(car.name + " has been saved.");
  }

  function initSaveButton() {
    const saveButton = getElement("porscheModalSaveBtn");

    if (!saveButton) return;

    saveButton.addEventListener("click", function () {
      const carId = saveButton.dataset.carId;

      if (carId) {
        saveCar(carId);
      }
    });
  }

  /* ---------- Inquiry Model Dropdown ---------- */

  function populateModelDropdown() {
    const dropdown = getElement("inquiryModel");

    if (!dropdown) return;

    dropdown.innerHTML = `
      <option value="">Select a model</option>
      ${brandCars.map(function (car) {
        return `
          <option value="${escapeHTML(car.id)}">
            ${escapeHTML(car.name)}
          </option>
        `;
      }).join("")}
      <option value="other">Other / Not sure</option>
    `;
  }

  /* ---------- Inquiry Form ---------- */

  function getFormField(form, names) {
    for (let i = 0; i < names.length; i++) {
      const field =
        form.elements.namedItem(names[i]) ||
        getElement(names[i]);

      if (field) return field;
    }

    return null;
  }

  function showFeedback(message, type) {
    const feedback = getElement("inquiryFeedback");

    if (!feedback) return;

    feedback.textContent = message;
    feedback.className =
      "cv-inquiry-feedback is-" + type;
    feedback.hidden = false;
  }

  function initInquiryForm() {
    const form = getElement("porscheInquiryForm");

    if (!form) return;

    const nameField = getFormField(form, [
      "inquiryName", "name"
    ]);

    const emailField = getFormField(form, [
      "inquiryEmail", "email"
    ]);

    const phoneField = getFormField(form, [
      "inquiryPhone", "phone"
    ]);

    const modelField = getElement("inquiryModel");

    const messageField = getFormField(form, [
      "inquiryMessage", "message"
    ]);

    const savedDraft = readStorage(DRAFT_KEY, null);

    if (savedDraft) {
      if (nameField) nameField.value = savedDraft.name || "";
      if (emailField) emailField.value = savedDraft.email || "";
      if (phoneField) phoneField.value = savedDraft.phone || "";
      if (modelField) modelField.value = savedDraft.model || "";
      if (messageField) {
        messageField.value = savedDraft.message || "";
      }
    }

    form.addEventListener("input", function () {
      writeStorage(DRAFT_KEY, {
        name: nameField ? nameField.value : "",
        email: emailField ? emailField.value : "",
        phone: phoneField ? phoneField.value : "",
        model: modelField ? modelField.value : "",
        message: messageField ? messageField.value : ""
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const phone = phoneField ? phoneField.value.trim() : "";
      const model = modelField ? modelField.value : "";
      const message = messageField
        ? messageField.value.trim()
        : "";

      if (!name || !email || !model || !message) {
        showFeedback(
          "Please complete all required fields.",
          "error"
        );
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showFeedback(
          "Please enter a valid email address.",
          "error"
        );
        return;
      }

      const inquiries = readStorage(INQUIRIES_KEY, []);

      const reference =
        "CV-" +
        brand.id.toUpperCase().replace(/-/g, "").slice(0, 3) +
        "-" +
        Date.now().toString().slice(-6);

      inquiries.push({
        reference: reference,
        brand: brand.name,
        name: name,
        email: email,
        phone: phone,
        model: model,
        message: message,
        date: new Date().toISOString()
      });

      writeStorage(INQUIRIES_KEY, inquiries);
      localStorage.removeItem(DRAFT_KEY);

      form.reset();

      showFeedback(
        "Thank you! Your inquiry about " +
        brand.name +
        " has been received. Reference: " +
        reference,
        "success"
      );
    });
  }

  /* ---------- Start Page ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderBrandSwitcher();
    populateBrandStory();
    populateModelDropdown();
    renderCarousel();

    initCarouselControls();
    initSaveButton();
    initInquiryForm();
  });

})();

