/*
  Featured Properties — editorial grid of hand-picked listings for the
  homepage (distinct from the category browse grid). Reads window.G29_PROPERTIES
  and renders only entries flagged featured: true (see properties-data.js).

  Mobile/tablet only (max-width:1024px, matching style.css): becomes a
  swipeable slider using the same G29_initDraggableGallery helper as the
  "Browse by Category" rail further down the page, instead of the
  desktop grid. A matchMedia listener enables/disables it as that
  breakpoint is crossed (e.g. rotating a tablet, resizing a window).
*/
(function () {
  const properties = window.G29_PROPERTIES || [];
  const grid = document.getElementById('featuredGrid');
  const galleryEl = document.getElementById('featuredGallery');
  const prevBtn = document.getElementById('featuredPrev');
  const nextBtn = document.getElementById('featuredNext');
  if (!grid) return;

  const featured = properties.filter((p) => p.featured);

  if (!featured.length) {
    grid.closest('.featured-properties').style.display = 'none';
    return;
  }

  grid.innerHTML = featured.map((p) => `
    <a class="featured-card" data-reveal="glance" data-reveal-group="featured-grid" href="${window.G29_propertyDetailUrl(p.slug)}">
      <div class="featured-card__frame">
        <div class="featured-card__image" style="background-image: url('${p.image}');"></div>
        <span class="featured-card__status">${p.status}</span>
        <div class="featured-card__hover">
          <span class="featured-card__spec">${p.beds} Bed</span>
          <span class="featured-card__spec">${p.baths} Bath</span>
          <span class="featured-card__spec">${p.floorArea}</span>
        </div>
      </div>
      <div class="featured-card__caption">
        <div class="featured-card__title-row">
          <h3 class="featured-card__title">${p.title}</h3>
          <span class="featured-card__price">${p.priceLabel}</span>
        </div>
        <span class="featured-card__location">&#128205; ${p.location}</span>
      </div>
    </a>
  `).join('');

  if (galleryEl && prevBtn && nextBtn && window.G29_initDraggableGallery) {
    const sliderQuery = window.matchMedia('(max-width: 1024px)');

    const sync = () => {
      if (sliderQuery.matches) {
        window.G29_initDraggableGallery(grid, galleryEl, prevBtn, nextBtn);
      } else if (window.G29_destroyDraggableGallery) {
        window.G29_destroyDraggableGallery(grid);
      }
    };

    requestAnimationFrame(sync);
    sliderQuery.addEventListener('change', sync);
  }
})();
