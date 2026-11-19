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
      forSale: list.filter((p) => (p.purpose || []).includes('Buy')).length
    };
  }

  cardsEl.innerHTML = locations.map((l) => {
    const stats = statsFor(l.subtitle);
    return `
      <li class="discover-card">
        <div class="discover-card__media" data-bg="${l.image}">
          <span class="discover-card__badge" aria-hidden="true">Open</span>
        </div>
        <a class="discover-card__link" href="properties-category.html?location=${encodeURIComponent(l.subtitle)}" aria-label="Explore ${l.name}"></a>
        <div class="discover-card__caption">
          <span class="discover-card__title">${l.name}</span>
          <span class="discover-card__meta">${stats.count} listing${stats.count === 1 ? '' : 's'} &middot; ${stats.forSale} for sale</span>
        </div>
      </li>
    `;
  }).join('');

  const pillText = document.getElementById('discoverPillText');

  function markActive() {
    const mid = cardsEl.scrollLeft + cardsEl.clientWidth / 2;
    let best = null, bestD = Infinity, idx = 0;
    Array.from(cardsEl.children).forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD) { bestD = d; best = c; idx = i; }
    });
    Array.from(cardsEl.children).forEach((c) => c.classList.toggle('is-active', c === best));
    if (pillText && locations[idx]) pillText.textContent = locations[idx].subtitle;
  }

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
    return first.offsetWidth + (parseFloat(getComputedStyle(cardsEl).columnGap) || 0);
  }

  function syncArrows() {
    const max = cardsEl.scrollWidth - cardsEl.clientWidth;
    prevBtn.disabled = cardsEl.scrollLeft <= 2;
    nextBtn.disabled = cardsEl.scrollLeft >= max - 2;
  }

  prevBtn.addEventListener('click', () => cardsEl.scrollBy({ left: -step(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => cardsEl.scrollBy({ left: step(), behavior: 'smooth' }));
  function onScroll() { syncArrows(); markActive(); }
  cardsEl.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Start with the second card centred, as in the coverflow reference.
  requestAnimationFrame(() => {
    const c = cardsEl.children[Math.min(1, cardsEl.children.length - 1)];
    if (c) {
      cardsEl.style.scrollBehavior = 'auto';
      cardsEl.scrollLeft = c.offsetLeft + c.offsetWidth / 2 - cardsEl.clientWidth / 2;
      cardsEl.style.scrollBehavior = '';
    }
    onScroll();
  });
})();
