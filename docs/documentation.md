# CAR VAULT — Code Explanation & Documentation (Hamza Taqvim, 26I-3054)

This guide explains how your 3 pages work in simple English so you can confidently present the project and answer viva questions.

## 1. File Organization
- **`index.html` (Home Page):** Shows the `CAR VAULT` header, *"Find Your Perfect Car"* heading, hero image, 4 stat boxes (`80+ Vehicles`, `06 Luxury Brands`, `100% Passion`, `24/7 Support`), **Explore Cars** button, **Featured Cars** (`BMW M5`, `Mercedes C400`), **Popular Brands** links, and footer.
- **`pages/explore-cars.html` (Explore Cars Page):** Shows the *"Explore Our Cars"* heading, search bar, sort dropdown, left **FILTERS** sidebar (Brand, Price, Type + **Apply** / **Reset** buttons), and responsive car grid.
- **`pages/car-details.html` (Car Details Page):** Shows breadcrumbs (`Home / Explore Cars / [Car Name]`), main photo + 3 clickable thumbnails, car specs (`Brand New · 2026`, Price, Engine, Fuel, Transmission, Type), **BOOK** button, **Wishlist** button, Description, and Monthly Installment Estimator.

## 2. How the CSS Works
- **`css/common.css`:** Defines CSS variables in `:root` for the theme (`--navy: #111827`, `--gold: #d9a441`, `--white: #ffffff`, `--light-grey: #f3f4f6`), shared buttons, navbar, car cards, footer, and modal dialogs.
- **`css/pages.css`:** Styles page-specific layouts (like the 2-column Featured grid, Explore sidebar + grid, Details split view) and uses `@media` queries for mobile responsiveness.

## 3. How the JavaScript Connects Everything
1. **`js/cars-data.js`:** Holds `CAR_VAULT_CARS`, an array of 10 brand-new 2026 car objects. Each object stores `id`, `brand`, `model`, `price` (numeric PKR), `priceLabel`, `type`, `engine`, `fuel`, `transmission`, `image`, `gallery`, and `description`.
2. **`js/common.js`:**
   - Injects the shared navbar and footer using `PATH_PREFIX` (`""` on root, `"../"` inside `pages/`).
   - Manages the **Wishlist** using `localStorage.getItem("carvault_wishlist")` and `localStorage.setItem(...)` so saved cars stay saved after refreshing or switching pages.
   - Runs the **4-State Test Drive Booking Flow** inside a modal:
     - **State 1 (Empty Form):** Opens with empty inputs and the chosen car selected.
     - **State 2 (Filled Form):** Saves user input on submit (`currentBookingDraft`).
     - **State 3 (Success):** If name, date, time, 10–13 digit phone, and valid email pass, saves a demo record to `localStorage` and shows `"Booking Confirmed! Your test drive booking request has been submitted."` with a **Back to Car** button.
     - **State 4 (Failed Validation):** If phone or email is invalid, shows `"Incorrect phone number or email. Please enter again."` with a **Try Again** button that restores State 2 with the user's input preserved.
3. **`js/home.js`:** Filters `CAR_VAULT_CARS` for `car.featured === true` and renders the 2 featured cards, plus links each Popular Brand to `pages/explore-cars.html?brand=...`.
4. **`js/explore.js`:** Reads `?brand=` or `?search=` from `window.location.search`, filters `CAR_VAULT_CARS` by search text, selected brand checkboxes, PKR price brackets (`10-50`, `50-100`, `100-plus`), and body type checkboxes, then sorts and updates the grid and result count.
5. **`js/car-details.js`:** Reads `?id=` from the URL, calls `getCarById(carId)`, populates the specs, switches the main image when gallery thumbnails are clicked, syncs the Wishlist button, and calculates estimated monthly installments (`financedAmount / months`).
