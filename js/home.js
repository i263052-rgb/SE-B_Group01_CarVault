/* ==========================================================================
   CAR VAULT — Home Page Logic (js/home.js)
   Renders the curated featured cars and the 6 luxury marques from the demo catalog.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedCars();
  renderPopularBrands();

  // Keep card wishlist buttons synced if changed inside the Saved Cars modal
  document.addEventListener("carvault:wishlist-updated", () => {
    renderFeaturedCars();
  });
});

function renderFeaturedCars() {
  const grid = document.getElementById("featuredCarsGrid");
  if (!grid) return;

  const featuredCars = CAR_VAULT_CARS.filter((car) => car.featured);
  grid.innerHTML = featuredCars.map(buildCarCardHtml).join("");
  attachCardWishlistListeners(grid);
}

function renderPopularBrands() {
  const strip = document.getElementById("popularBrandsStrip");
  if (!strip) return;

  const brands = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Lamborghini", "Range Rover"];
  strip.innerHTML = brands
    .map(
      (brand) => `
      <a href="pages/explore-cars.html?brand=${encodeURIComponent(brand)}" class="brand-pill-card">
        <span>${brand}</span>
        <small>EXPLORE &#8599;</small>
      </a>
    `
    )
    .join("");
}
