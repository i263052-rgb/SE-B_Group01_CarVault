# CarVault

**Theme #54:** Car showroom and dealership (Community & Lifestyle)  
**Tagline:** Find Your Perfect Car — A modern brand-new car dealership web application built with HTML5, CSS3, and Vanilla JavaScript.

## Links
- **Live Website:** `[Add deployed GitHub Pages / Netlify link before submission]`
- **Google Form (User Feedback):** `[Add group Google Form link before submission]`

## Feature Table

| Feature | Category | Page | Member |
| :--- | :--- | :--- | :--- |
| Featured cars & popular brands rendered from `CAR_VAULT_CARS` array | Data & Display | Home (`index.html`) | Hamza Taqvim (26I-3054) |
| Dynamic car catalog grid with real-time search, brand/price/type filters & sorting | Data & Display | Explore Cars (`pages/explore-cars.html`) | Hamza Taqvim (26I-3054) |
| Dynamic Car Details view loaded via URL `?id=...` query parameter | Data & Display | Car Details (`pages/car-details.html`) | Hamza Taqvim (26I-3054) |
| 4-State Test Drive Booking Form (Empty, Filled, Success, Failed Validation) | Forms & Input | Car Details & Navbar Modal | Hamza Taqvim (26I-3054) |
| Search input & multi-criteria filter panel with Apply/Reset controls | Forms & Input | Explore Cars (`pages/explore-cars.html`) | Hamza Taqvim (26I-3054) |
| Persistent Wishlist (`Saved Cars`) & demo booking storage using `localStorage` | State & Memory | All Pages (`js/common.js`) | Hamza Taqvim (26I-3054) |
| Interactive 3-thumbnail gallery switcher (`other views`) | Interaction | Car Details (`pages/car-details.html`) | Hamza Taqvim (26I-3054) |
| Saved Cars modal viewer & Test Drive booking modal | Interaction | All Pages (`js/common.js`) | Hamza Taqvim (26I-3054) |
| PKR price-range bracket logic, sorting & Monthly Installment Estimator | Logic & Calculation | Explore Cars & Car Details | Hamza Taqvim (26I-3054) |
| Mobile hamburger navigation, collapsible mobile filters, semantic HTML & focus states | Responsive & Accessible | All 3 Pages | Hamza Taqvim (26I-3054) |

## Contribution Table

| Name | Roll Number | Pages Built | Features Built |
| :--- | :--- | :--- | :--- |
| Hamza Taqvim | 26I-3054 | Home (`index.html`), Explore Cars (`pages/explore-cars.html`), Car Details (`pages/car-details.html`) | Dynamic car catalog, search/filter/sort, image gallery, `localStorage` Wishlist, Monthly Installment Estimator, 4-state Test Drive booking flow |
| *[Teammate 2]* | *[Roll No]* | *[3 Assigned Pages]* | *[Features Built]* |
| *[Teammate 3]* | *[Roll No]* | *[3 Assigned Pages]* | *[Features Built]* |
| *[Teammate 4]* | *[Roll No]* | *[3 Assigned Pages]* | *[Features Built]* |
| *[Teammate 5]* | *[Roll No]* | *[3 Assigned Pages]* | *[Features Built]* |

## Project Structure
- `index.html` — Home Page
- `pages/explore-cars.html` — Explore Cars Page
- `pages/car-details.html` — Car Details Page
- `css/common.css` & `css/pages.css` — Shared theme (`#111827`, `#D9A441`, `#FFFFFF`, `#F3F4F6`) and responsive layouts
- `js/cars-data.js` — Shared JavaScript dataset of new vehicles
- `js/common.js` — Shared navbar, footer, `localStorage` wishlist, and 4-state Test Drive booking flow
- `js/home.js`, `js/explore.js`, `js/car-details.js` — Page-specific scripts
- `images/` — Website logo, hero banner, and vehicle images (AI image generation disclosed in site footer)
- `docs/` — Prototype photos, feedback photos, testing/documentation notes, and exported Antigravity CLI logs
