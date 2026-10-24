/*
  Browse by Location — draggable card gallery (see
  assets/js/motion/draggable-gallery.js). Each card represents a
  neighborhood; clicking one opens properties-category.html filtered to
  that location. Listing counts are computed from the shared listings
  data (see assets/js/properties-data.js).
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

  function countFor(subtitle) {
    return properties.filter((p) => p.subtitle === subtitle).length;
  }

  cardsEl.innerHTML = locations.map((l, i) => {
    const count = countFor(l.subtitle);
    return `
      <li class="gallery-card" data-bg="${l.image}">
        <a class="gallery-card__link" href="properties-category.html?location=${encodeURIComponent(l.subtitle)}" aria-label="${l.name}"></a>
        <span class="gallery-card__status">${pad(i + 1)}</span>
        <div class="gallery-card__caption">
          <h3 class="gallery-card__title">${l.name}</h3>
          <span class="gallery-card__location">${l.description}</span>
          <span class="gallery-card__price">${count} listing${count === 1 ? '' : 's'}</span>
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
