/*
  Discover — featured listings on the homepage. Renders the featured
  properties (see assets/js/properties-data.js) as photo cards with the
  details overlaid on a dark fade, plus All / For Sale / For Rent tabs.
  Cards sit in a native scroll-snap slider at every width, with Prev/Next
  buttons stepping one card at a time.
*/
(function () {
  const properties = window.G29_PROPERTIES || [];
  const cardsEl = document.getElementById('discoverCards');
  const tabsEl = document.getElementById('discoverTabs');

  if (!cardsEl) return;

  // Featured listings first, then the rest, so each tab still fills up to
  // LIMIT cards even when few featured listings match it.
  const pool = properties.filter((p) => p.featured).concat(properties.filter((p) => !p.featured));
  const LIMIT = 6;

  function card(p) {
    const roomLabel = p.category === 'Commercial' ? 'Rooms' : 'Beds';
    return `
      <li class="discover-card" data-bg="${p.image}">
        <a class="discover-card__link" href="${window.G29_propertyDetailUrl(p.slug)}" aria-label="${p.title}"></a>
        <div class="discover-card__body">
          <h3 class="discover-card__title">${p.title}</h3>
          <div class="discover-card__row">
            <div class="discover-card__meta">
              <span>${p.status} &middot; ${p.category}</span>
              <span>${p.subtitle}</span>
            </div>
            <div class="discover-card__stats">
              <span class="discover-card__stat">${p.floorArea}<small>Living</small></span>
              <span class="discover-card__stat">${p.beds}<small>${roomLabel}</small></span>
            </div>
          </div>
        </div>
      </li>
    `;
  }

  function render(status) {
    const list = pool.filter((p) => !status || p.status === status).slice(0, LIMIT);
    cardsEl.innerHTML = list.map(card).join('');
    cardsEl.scrollLeft = 0;
    if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(cardsEl);
    requestAnimationFrame(syncArrows);
  }

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.discover__tab');
    if (!tab) return;
    tabsEl.querySelectorAll('.discover__tab').forEach((el) => {
      el.classList.toggle('is-active', el === tab);
      el.setAttribute('aria-pressed', String(el === tab));
    });
    render(tab.dataset.status);
  });

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

  render('');
})();
