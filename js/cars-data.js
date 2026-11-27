/* ==========================================================================
   CAR VAULT — Luxury Vehicle Catalog Data (js/cars-data.js)
   Synced with the demo website collection: 8 luxury vehicles across 6 marques.
   Prices are stored as numeric PKR for accurate filtering, sorting, and EMI math.
   ========================================================================== */

const CAR_VAULT_CARS = [
  {
    id: "porsche-911-carrera-gts",
    brand: "Porsche",
    model: "Porsche 911 Carrera GTS",
    year: 2025,
    condition: "Brand New",
    tag: "Featured",
    price: 69500000,
    priceLabel: "PKR 69,500,000",
    type: "Coupe",
    engine: "3.6L Flat-Six",
    power: "532 HP",
    speed: "3.0 sec",
    fuel: "Petrol",
    transmission: "PDK Automatic",
    featured: true,
    image: "images/cars/porsche-911.jpg",
    gallery: [
      "images/cars/porsche-911.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "An unmistakable icon of precision engineering, pairing a 3.6L flat-six powertrain with razor-sharp chassis balance and a 0–100 km/h sprint in 3.0 seconds."
  },
  {
    id: "mercedes-amg-gt",
    brand: "Mercedes-Benz",
    model: "Mercedes-Benz AMG GT",
    year: 2025,
    condition: "Brand New",
    tag: "New Arrival",
    price: 58200000,
    priceLabel: "PKR 58,200,000",
    type: "Coupe",
    engine: "4.0L V8",
    power: "577 HP",
    speed: "3.2 sec",
    fuel: "Petrol",
    transmission: "AMG Speedshift",
    featured: true,
    image: "images/cars/mercedes-amg-gt.jpg",
    gallery: [
      "images/cars/mercedes-amg-gt.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "Handcrafted 4.0L biturbo V8 grand tourer delivering 577 HP, dramatic long-hood proportions, and bespoke AMG cockpit refinement."
  },
  {
    id: "bmw-m4-competition",
    brand: "BMW",
    model: "BMW M4 Competition",
    year: 2025,
    condition: "Brand New",
    tag: "Popular",
    price: 41800000,
    priceLabel: "PKR 41,800,000",
    type: "Coupe",
    engine: "3.0L Twin Turbo",
    power: "503 HP",
    speed: "3.4 sec",
    fuel: "Petrol",
    transmission: "M Steptronic",
    featured: false,
    image: "images/cars/bmw-m4.jpg",
    gallery: [
      "images/cars/bmw-m4.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "Track-honed performance coupe propelled by a 503 HP twin-turbo inline-six with aggressive aerodynamic styling and driver-focused ergonomics."
  },
  {
    id: "audi-rs-etron-gt",
    brand: "Audi",
    model: "Audi RS e-tron GT",
    year: 2025,
    condition: "Brand New",
    tag: "Electric",
    price: 48700000,
    priceLabel: "PKR 48,700,000",
    type: "Electric",
    engine: "Dual Electric",
    power: "637 HP",
    speed: "3.1 sec",
    fuel: "Electric",
    transmission: "2-Speed Automatic",
    featured: false,
    image: "images/cars/audi-rs-etron.jpg",
    gallery: [
      "images/cars/audi-rs-etron.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "All-electric flagship gran turismo delivering instant 637 HP quattro acceleration, whisper-quiet cabin luxury, and futuristic sculpted bodywork."
  },
  {
    id: "lamborghini-huracan-evo",
    brand: "Lamborghini",
    model: "Lamborghini Huracán EVO",
    year: 2024,
    condition: "Brand New",
    tag: "Exclusive",
    price: 114000000,
    priceLabel: "PKR 114,000,000",
    type: "Supercar",
    engine: "5.2L V10",
    power: "631 HP",
    speed: "2.9 sec",
    fuel: "Petrol",
    transmission: "7-Speed LDF",
    featured: false,
    image: "images/cars/lamborghini-huracan.jpg",
    gallery: [
      "images/cars/lamborghini-huracan.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "Naturally aspirated 5.2L V10 Italian supercar built for pure adrenaline, predictive vehicle dynamics, and breathtaking 2.9-second launch performance."
  },
  {
    id: "range-rover-sport-autobiography",
    brand: "Range Rover",
    model: "Range Rover Sport Autobiography",
    year: 2025,
    condition: "Brand New",
    tag: "Luxury SUV",
    price: 56500000,
    priceLabel: "PKR 56,500,000",
    type: "SUV",
    engine: "3.0L Turbo",
    power: "395 HP",
    speed: "5.4 sec",
    fuel: "Hybrid Petrol",
    transmission: "8-Speed Automatic",
    featured: false,
    image: "images/cars/range-rover-sport.jpg",
    gallery: [
      "images/cars/range-rover-sport.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/suv-rear-view.svg"
    ],
    description:
      "Commanding British luxury SUV blending all-terrain capability with semi-aniline leather craftsmanship, air suspension, and refined 395 HP poise."
  },
  {
    id: "mercedes-s-class",
    brand: "Mercedes-Benz",
    model: "Mercedes-Benz S-Class",
    year: 2025,
    condition: "Brand New",
    tag: "Luxury",
    price: 62500000,
    priceLabel: "PKR 62,500,000",
    type: "Sedan",
    engine: "3.0L Hybrid",
    power: "442 HP",
    speed: "4.5 sec",
    fuel: "Hybrid",
    transmission: "9G-Tronic",
    featured: false,
    image: "images/cars/mercedes-s-class.jpg",
    gallery: [
      "images/cars/mercedes-s-class.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "The benchmark executive luxury sedan offering first-class rear lounge comfort, ambient cabin illumination, and effortless 442 HP hybrid composure."
  },
  {
    id: "bmw-i8-roadster",
    brand: "BMW",
    model: "BMW i8 Roadster",
    year: 2024,
    condition: "Brand New",
    tag: "Collector",
    price: 36900000,
    priceLabel: "PKR 36,900,000",
    type: "Roadster",
    engine: "Hybrid",
    power: "369 HP",
    speed: "4.4 sec",
    fuel: "Plug-in Hybrid",
    transmission: "6-Speed Automatic",
    featured: false,
    image: "images/cars/bmw-i8.jpg",
    gallery: [
      "images/cars/bmw-i8.jpg",
      "images/cars/interior-cabin.svg",
      "images/cars/sedan-rear-view.svg"
    ],
    description:
      "Futuristic open-top collector plug-in hybrid featuring dihedral doors, carbon-fiber architecture, and unmistakable progressive road presence."
  }
];
