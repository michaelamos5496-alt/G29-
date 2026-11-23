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

  // Which card is in the middle of the row? Measured from real on-screen
  // geometry (getBoundingClientRect): offsetLeft is relative to a different
  // container than the scrolling row, which skewed the answer, and a scaled
  // card's rect stays centred on its own middle so the maths is unaffected
  // by the zoom animation.
  function centredIndex() {
    const rr = cardsEl.getBoundingClientRect();
    const mid = rr.left + rr.width / 2;
    let best = 0, bestD = Infinity;
    Array.from(cardsEl.children).forEach((c, i) => {
      const b = c.getBoundingClientRect();
      const d = Math.abs(b.left + b.width / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function markActive() {
    const idx = centredIndex();
    Array.from(cardsEl.children).forEach((c, i) => c.classList.toggle('is-active', i === idx));
    if (pillText && locations[idx]) pillText.textContent = locations[idx].subtitle;
  }

  // Scroll card `i` exactly into the middle (smooth or instant).
  function centreCard(i, smooth) {
    const c = cardsEl.children[Math.max(0, Math.min(cardsEl.children.length - 1, i))];
    if (!c) return;
    const rr = cardsEl.getBoundingClientRect(), b = c.getBoundingClientRect();
    const delta = (b.left + b.width / 2) - (rr.left + rr.width / 2);
    if (smooth) { cardsEl.scrollBy({ left: delta, behavior: 'smooth' }); }
    else { cardsEl.style.scrollBehavior = 'auto'; cardsEl.scrollLeft += delta; cardsEl.style.scrollBehavior = ''; }
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

  prevBtn.addEventListener('click', () => centreCard(centredIndex() - 1, true));
  nextBtn.addEventListener('click', () => centreCard(centredIndex() + 1, true));
  function onScroll() { syncArrows(); markActive(); }
  let settleTimer = null;
  function settle() { clearTimeout(settleTimer); settleTimer = setTimeout(onScroll, 140); }
  cardsEl.addEventListener('scroll', () => { onScroll(); settle(); }, { passive: true });
  // 'scrollend' fires when the snap has fully finished (Chrome/Firefox); the timer covers the rest.
  cardsEl.addEventListener('scrollend', onScroll);
  ['touchend', 'pointerup', 'mouseup'].forEach((ev) => cardsEl.addEventListener(ev, () => { settle(); setTimeout(onScroll, 450); }, { passive: true }));
  window.addEventListener('resize', onScroll);

  // Start with the second card centred, as in the coverflow reference.
  requestAnimationFrame(() => {
    centreCard(Math.min(1, cardsEl.children.length - 1), false);
    onScroll();
  });
})();
