/*
  Property categories — draggable card gallery (see
  assets/js/motion/draggable-gallery.js). Each card represents a property
  type; clicking one opens properties-category.html filtered to that type.
  Category counts are computed from the shared listings data (see
  assets/js/properties-data.js).
*/
(function () {
  const categories = window.G29_CATEGORIES || [];
  const properties = window.G29_PROPERTIES || [];

  const galleryEl = document.getElementById('categoryTileGallery');
  const cardsEl = document.getElementById('propertyGrid');
  const prevBtn = document.getElementById('categoryTilePrev');
  const nextBtn = document.getElementById('categoryTileNext');
  const startEl = document.getElementById('propGridStart');
  const endEl = document.getElementById('propGridEnd');

  if (!cardsEl) return;

  const pad = (n) => String(n).padStart(2, '0');

  function countFor(type) {
    return properties.filter((p) => p.category === type).length;
  }

  cardsEl.innerHTML = categories.map((c, i) => {
    const count = countFor(c.type);
    return `
      <li class="gallery-card" data-bg="${c.image}">
        <a class="gallery-card__link" href="properties-category.html?type=${encodeURIComponent(c.type)}" aria-label="${c.name}"></a>
        <span class="gallery-card__status">${pad(i + 1)}</span>
        <div class="gallery-card__caption">
          <h3 class="gallery-card__title">${c.name}</h3>
          <span class="gallery-card__location">${c.description}</span>
          <span class="gallery-card__price">${count} listing${count === 1 ? '' : 's'}</span>
        </div>
      </li>
    `;
  }).join('');

  endEl.textContent = pad(categories.length) + '.';

  if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(cardsEl);

  requestAnimationFrame(() => {
    if (window.G29_initDraggableGallery) window.G29_initDraggableGallery(cardsEl, galleryEl, prevBtn, nextBtn);
  });
})();
