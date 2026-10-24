/*
  Browse by Location — draggable card gallery (see
  assets/js/motion/draggable-gallery.js). Each card represents a
  neighborhood; clicking one opens properties-category.html filtered to
  that location. Listing counts are computed from the shared listings
  data (see assets/js/properties-data.js).

  .location-card__dots is decorative only (matches the reference card
  design's pagination dots) — each location has a single photo, not an
  in-card carousel, so there's nothing for them to actually page through.
*/
(function () {
  const locations = window.G29_LOCATIONS || [];
  const properties = window.G29_PROPERTIES || [];

  const galleryEl = document.getElementById('categoryTileGallery');
  const cardsEl = document.getElementById('propertyGrid');
  const prevBtn = document.getElementById('categoryTilePrev');
  const nextBtn = document.getElementById('categoryTileNext');
  const startEl = document.getElementById('propGridStart');
  const endEl = document.getElementById('propGridEnd');

  if (!cardsEl) return;

  const pad = (n) => String(n).padStart(2, '0');

  function statsFor(subtitle) {
    const list = properties.filter((p) => p.subtitle === subtitle);
    const forSale = list.filter((p) => p.status === 'For Sale').length;
    const forRent = list.filter((p) => p.status === 'For Rent').length;
    return { count: list.length, forSale, forRent };
  }

  cardsEl.innerHTML = locations.map((l) => {
    const stats = statsFor(l.subtitle);

    return `
      <li class="location-card">
        <a class="location-card__link" href="properties-category.html?location=${encodeURIComponent(l.subtitle)}" aria-label="Explore ${l.name}"></a>
        <div class="location-card__photo" data-bg="${l.image}"></div>
        <div class="location-card__body">
          <div class="location-card__row1">
            <h3 class="location-card__title">${l.name}</h3>
            <svg class="location-card__verified" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#34c759"/>
              <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="location-card__desc">${l.description}</p>
          <div class="location-card__footer">
            <div class="location-card__stats">
              <span class="location-card__stat">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
                ${stats.count}
              </span>
              <span class="location-card__stat">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>
                ${stats.forSale}
              </span>
            </div>
            <span class="location-card__cta">Explore <span aria-hidden="true">+</span></span>
          </div>
        </div>
      </li>
    `;
  }).join('');

  endEl.textContent = pad(locations.length) + '.';

  if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(cardsEl);

  // Scrubber dot tracks actual drag/swipe progress through the cards, not
  // scroll position — it used to be driven by vertical scroll (see the
  // now-removed block in cinematic.js), completely decoupled from which
  // card was actually in view.
  const dot = document.querySelector('.property-grid__dot');

  requestAnimationFrame(() => {
    if (window.G29_initDraggableGallery) {
      window.G29_initDraggableGallery(cardsEl, galleryEl, prevBtn, nextBtn, dot
        ? (progress) => { dot.style.left = (progress * 100) + '%'; }
        : null);
    }
  });
})();
