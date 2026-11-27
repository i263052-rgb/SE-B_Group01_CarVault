/**
 * CarVault — Central Vehicle & Brand Data Store
 * Pure vanilla JS arrays and objects shared across showroom pages.
 */

window.CarVaultData = (function () {
  "use strict";

  const BRANDS = [
    {
      id: "porsche",
      name: "Porsche",
      shortName: "Porsche",
      country: "Germany",
      founded: 1931,
      headquarters: "Stuttgart, Germany",
      tagline: "Engineering born on the road",
      story:
        "Founded in Stuttgart in 1931, Porsche has built its name on precision and everyday usable performance. The 911 remains the heart of the brand.",
      url: "porsche.html"
    },
    {
      id: "mercedes-benz",
      name: "Mercedes-Benz",
      shortName: "Mercedes-Benz",
      country: "Germany",
      founded: 1926,
      headquarters: "Stuttgart, Germany",
      tagline: "The best or nothing",
      story:
        "Pioneering luxury and hand-crafted AMG performance since 1926, uniting effortless refinement with track-bred V8 authority.",
      url: "explore-cars.html?brand=mercedes-benz"
    },
    {
      id: "bmw",
      name: "BMW",
      shortName: "BMW",
      country: "Germany",
      founded: 1916,
      headquarters: "Munich, Germany",
      tagline: "Sheer driving pleasure",
      story:
        "From precision inline-six dynamics to M Motorsport engineering, BMW builds driver-focused machines tuned for balance and poise.",
      url: "explore-cars.html?brand=bmw"
    },
    {
      id: "audi",
      name: "Audi",
      shortName: "Audi",
      country: "Germany",
      founded: 1909,
      headquarters: "Ingolstadt, Germany",
      tagline: "Vorsprung durch Technik",
      story:
        "Combining quattro all-wheel traction, progressive electric architecture, and minimalist German cabin craft.",
      url: "explore-cars.html?brand=audi"
    },
    {
      id: "lamborghini",
      name: "Lamborghini",
      shortName: "Lamborghini",
      country: "Italy",
      founded: 1963,
      headquarters: "Sant'Agata Bolognese, Italy",
      tagline: "Expect the unexpected",
      story:
        "Razor-sharp Italian wedge silhouettes paired with naturally aspirated and hybrid V12 theatre built to command attention.",
      url: "explore-cars.html?brand=lamborghini"
    },
    {
      id: "range-rover",
      name: "Range Rover",
      shortName: "Range Rover",
      country: "United Kingdom",
      founded: 1970,
      headquarters: "Solihull, United Kingdom",
      tagline: "Peerless luxury across any terrain",
      story:
        "Defined the modern luxury SUV with serene cabin isolation, commanding posture, and effortless all-weather capability.",
      url: "explore-cars.html?brand=range-rover"
    }
  ];

  // Inventory counts align directly with the CarVault showcase:
  // Porsche (1), Mercedes-Benz (2), BMW (2), Audi (1), Lamborghini (1), Range Rover (1).
  const CARS = [
    {
      id: "porsche-911-carrera-gts",
      brandId: "porsche",
      brandName: "Porsche",
      name: "911 Carrera GTS",
      pricePKR: 69500000,
      category: "Performance",
      status: "Coming Soon",
      arrivalDate: "2026-12-10",
      arrivalLabel: "10 DEC, 2026",
      specs: "3.6L T-Hybrid Flat-6 · 532 HP · 0-100 in 3.0 sec",
      description:
        "Rear-engine balance sharpened with T-Hybrid responsiveness for pure analog engagement.",
      isFeaturedArrival: false
    },
    {
      id: "mercedes-amg-gt",
      brandId: "mercedes-benz",
      brandName: "Mercedes-Benz",
      name: "Mercedes-AMG GT",
      pricePKR: 78500000,
      category: "Performance",
      status: "Just Arrived",
      arrivalDate: "2026-11-12",
      arrivalLabel: "12 NOV, 2026",
      specs: "4.0L V8 · 577 HP · 0-100 in 3.2 sec",
      description: "Hand-built power wrapped in a long sculpted silhouette.",
      isFeaturedArrival: true
    },
    {
      id: "mercedes-s580-maybach",
      brandId: "mercedes-benz",
      brandName: "Mercedes-Benz",
      name: "Mercedes-Maybach S 580",
      pricePKR: 92000000,
      category: "Luxury & Comfort",
      status: "Available",
      arrivalDate: "2026-10-05",
      arrivalLabel: "05 OCT, 2026",
      specs: "4.0L V8 Biturbo · 496 HP · Executive Lounge Rear",
      description:
        "Whisper-quiet flagship sanctuary engineered for effortless chauffeur-driven comfort.",
      isFeaturedArrival: false
    },
    {
      id: "bmw-m4-competition",
      brandId: "bmw",
      brandName: "BMW",
      name: "BMW M4 Competition",
      pricePKR: 48700000,
      category: "Performance",
      status: "Just Arrived",
      arrivalDate: "2026-11-08",
      arrivalLabel: "08 NOV, 2026",
      specs: "3.0L Twin-Turbo I6 · 523 HP · 0-100 in 3.5 sec",
      description:
        "Aggressive M xDrive chassis precision tailored for fast canyon roads and track days.",
      isFeaturedArrival: false
    },
    {
      id: "bmw-i7-xdrive60",
      brandId: "bmw",
      brandName: "BMW",
      name: "BMW i7 xDrive60",
      pricePKR: 64500000,
      category: "Electric Tech",
      status: "Available",
      arrivalDate: "2026-09-22",
      arrivalLabel: "22 SEP, 2026",
      specs: "Dual-Motor EV · 536 HP · 625 km WLTP Range",
      description:
        "All-electric flagship sedan with theatre-screen serenity and instant silent torque.",
      isFeaturedArrival: false
    },
    {
      id: "audi-rs-etron-gt",
      brandId: "audi",
      brandName: "Audi",
      name: "Audi RS e-tron GT",
      pricePKR: 54900000,
      category: "Electric Tech",
      status: "Just Arrived",
      arrivalDate: "2026-11-10",
      arrivalLabel: "10 NOV, 2026",
      specs: "Dual-Motor quattro · 637 HP · 0-100 in 3.3 sec",
      description:
        "Sculpted electric grand tourer uniting 800-volt rapid charging with RS acceleration.",
      isFeaturedArrival: false
    },
    {
      id: "lamborghini-revuelto",
      brandId: "lamborghini",
      brandName: "Lamborghini",
      name: "Lamborghini Revuelto",
      pricePKR: 185000000,
      category: "Performance",
      status: "Available",
      arrivalDate: "2026-10-18",
      arrivalLabel: "18 OCT, 2026",
      specs: "6.5L V12 Plug-In Hybrid · 1,001 HP · 0-100 in 2.5 sec",
      description:
        "Mid-engine V12 flagship supercar combining tri-motor electrification with unmistakable drama.",
      isFeaturedArrival: false
    },
    {
      id: "range-rover-autobiography",
      brandId: "range-rover",
      brandName: "Range Rover",
      name: "Range Rover Autobiography",
      pricePKR: 84000000,
      category: "Space (SUV)",
      status: "Available",
      arrivalDate: "2026-10-01",
      arrivalLabel: "01 OCT, 2026",
      specs: "4.4L Twin-Turbo V8 · 523 HP · All-Wheel Steering",
      description:
        "Commanding British flagship SUV crafted with semi-aniline leather and serene air suspension.",
      isFeaturedArrival: false
    }
  ];

  function getBrands() {
    return BRANDS.slice();
  }

  function getBrandById(brandId) {
    return BRANDS.find(function (brand) {
      return brand.id === brandId;
    }) || null;
  }

  function getCarsByBrand(brandId) {
    return CARS.filter(function (car) {
      return car.brandId === brandId;
    });
  }

  function getBrandModelCount(brandId) {
    return getCarsByBrand(brandId).length;
  }

  function formatModelCountLabel(count) {
    return count === 1 ? "1 exceptional model" : count + " exceptional models";
  }

  function formatPKR(amount) {
    return "PKR " + Number(amount).toLocaleString("en-US");
  }

  return {
    BRANDS: BRANDS,
    CARS: CARS,
    getBrands: getBrands,
    getBrandById: getBrandById,
    getCarsByBrand: getCarsByBrand,
    getBrandModelCount: getBrandModelCount,
    formatModelCountLabel: formatModelCountLabel,
    formatPKR: formatPKR
  };
})();
