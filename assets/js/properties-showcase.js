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
    const tags = [
      stats.forSale ? `${stats.forSale} For Sale` : null,
      stats.forRent ? `${stats.forRent} For Rent` : null
    ].filter(Boolean);

    return `
      <li class="location-card" data-bg="${l.image}">
        <a class="location-card__link" href="properties-category.html?location=${encodeURIComponent(l.subtitle)}" aria-label="Explore ${l.name}"></a>
        <div class="location-card__gradient"></div>
        <div class="location-card__dots" aria-hidden="true">
          <span class="is-active"></span><span></span><span></span>
        </div>
        <div class="location-card__content">
          <div class="location-card__head">
            <h3 class="location-card__title">${l.name}</h3>
            <span class="location-card__badge">${stats.count} Listing${stats.count === 1 ? '' : 's'}</span>
          </div>
          <p class="location-card__desc">${l.description}</p>
          <div class="location-card__tags">
            ${tags.map((t) => `<span class="location-card__tag">${t}</span>`).join('')}
          </div>
        </div>
        <span class="location-card__cta">Explore ${l.name}</span>
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
