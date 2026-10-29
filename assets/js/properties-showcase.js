/*
  Discover — browse by location on the homepage. One photo card per
  neighbourhood (window.G29_LOCATIONS in assets/js/properties-data.js)
  with the details overlaid on a dark fade; each opens
  properties-category.html filtered to that location. Listing counts are
  computed from the shared listings data. Cards sit in a native
  scroll-snap slider at every width, with Prev/Next buttons stepping one
  card at a time.
*/
(function () {
  const locations = window.G29_LOCATIONS || [];
  const properties = window.G29_PROPERTIES || [];
  const cardsEl = document.getElementById('discoverCards');

  if (!cardsEl) return;

  function statsFor(subtitle) {
    const list = properties.filter((p) => p.subtitle === subtitle);
    return {
      count: list.length,
      forSale: list.filter((p) => p.status === 'For Sale').length
    };
  }

  cardsEl.innerHTML = locations.map((l) => {
    const stats = statsFor(l.subtitle);
    return `
      <li class="discover-card" data-bg="${l.image}">
        <a class="discover-card__link" href="properties-category.html?location=${encodeURIComponent(l.subtitle)}" aria-label="Explore ${l.name}"></a>
        <div class="discover-card__body">
          <h3 class="discover-card__title">${l.name}</h3>
          <div class="discover-card__row">
            <p class="discover-card__meta">${l.description}</p>
            <div class="discover-card__stats">
              <span class="discover-card__stat">${stats.count}<small>Listing${stats.count === 1 ? '' : 's'}</small></span>
              <span class="discover-card__stat">${stats.forSale}<small>For sale</small></span>
            </div>
          </div>
        </div>
      </li>
    `;
  }).join('');

  if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(cardsEl);

  // Cards in the scroll-snap row only enter the viewport sideways, which
  // the lazy-bg loader's window scroll listener never hears about.
  cardsEl.addEventListener('scroll', () => {
    if (window.G29_recheckLazyBg) window.G29_recheckLazyBg();
  }, { passive: true });

  const prevBtn = document.getElementById('discoverPrev');
  const nextBtn = document.getElementById('discoverNext');

  function step() {
    const first = cardsEl.firstElementChild;
    if (!first) return 0;
    return first.getBoundingClientRect().width + (parseFloat(getComputedStyle(cardsEl).columnGap) || 0);
  }

  function syncArrows() {
    const max = cardsEl.scrollWidth - cardsEl.clientWidth;
    prevBtn.disabled = cardsEl.scrollLeft <= 2;
    nextBtn.disabled = cardsEl.scrollLeft >= max - 2;
  }

  prevBtn.addEventListener('click', () => cardsEl.scrollBy({ left: -step(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => cardsEl.scrollBy({ left: step(), behavior: 'smooth' }));
  cardsEl.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows);

  requestAnimationFrame(syncArrows);
})();
