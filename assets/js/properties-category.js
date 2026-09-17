(function () {
  const properties = window.G29_PROPERTIES || [];
  const categories = window.G29_CATEGORIES || [];

  const params = new URLSearchParams(window.location.search);

  const galleryEl = document.getElementById('categoryGallery');
  const cardsEl = document.getElementById('categoryCards');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const locationSelect = document.getElementById('filterLocation');
  const typeSelect = document.getElementById('filterType');
  const purposeSelect = document.getElementById('filterPurpose');
  const bedsSelect = document.getElementById('filterBeds');
  const resetBtn = document.getElementById('filterReset');

  if (!cardsEl) return;

  // Filter option lists are derived from the actual data, not hardcoded,
  // so the UI never offers a choice that returns zero results.
  const locations = [...new Set(properties.map((p) => p.subtitle))].sort();
  const types = [...new Set(properties.map((p) => p.category))].sort();
  const bedCounts = [...new Set(properties.map((p) => p.beds))].sort((a, b) => a - b);

  locationSelect.insertAdjacentHTML('beforeend', locations.map((l) => `<option value="${l}">${l}</option>`).join(''));
  typeSelect.insertAdjacentHTML('beforeend', types.map((t) => `<option value="${t}">${t}</option>`).join(''));
  bedsSelect.insertAdjacentHTML('beforeend', bedCounts.map((b) => `<option value="${b}">${b}+ bed${b === 1 ? '' : 's'}</option>`).join(''));

  // ?type= (from the homepage category tiles) seeds the type filter.
  const initialType = params.get('type') || '';
  if (initialType) typeSelect.value = initialType;

  function currentLabel() {
    const category = categories.find((c) => c.type === typeSelect.value);
    return category ? category.name : 'All Properties';
  }

  function render() {
    const loc = locationSelect.value;
    const type = typeSelect.value;
    const purpose = purposeSelect.value;
    const minBeds = bedsSelect.value ? Number(bedsSelect.value) : 0;

    const matches = properties.filter((p) => {
      if (loc && p.subtitle !== loc) return false;
      if (type && p.category !== type) return false;
      if (purpose && !(p.purpose || []).includes(purpose)) return false;
      if (minBeds && p.beds < minBeds) return false;
      return true;
    });

    const label = currentLabel();
    document.title = `${label} | G29 Property Consult`;
    document.getElementById('categoryBreadcrumb').textContent = label;
    document.getElementById('category-heading').textContent = label;
    document.getElementById('categoryCount').textContent =
      `${matches.length} listing${matches.length === 1 ? '' : 's'}`;

    if (matches.length === 0) {
      window.G29_destroyDraggableGallery(cardsEl);
      galleryEl.classList.add('gallery--empty');
      cardsEl.innerHTML = `<li class="gallery__empty">No listings match those filters yet. <a href="index.html#contact">Contact us</a> and we'll help you find one.</li>`;
      return;
    }
    galleryEl.classList.remove('gallery--empty');

    cardsEl.innerHTML = matches.map((p) => `
      <li class="gallery-card" data-bg="${p.image}">
        <a class="gallery-card__link" href="${window.G29_propertyDetailUrl(p.slug)}" aria-label="${p.title}"></a>
        <span class="gallery-card__status">${p.status}</span>
        <div class="gallery-card__caption">
          <h3 class="gallery-card__title">${p.title}</h3>
          <span class="gallery-card__location">&#128205; ${p.subtitle}</span>
          <span class="gallery-card__price">${p.priceLabel}</span>
        </div>
      </li>
    `).join('');

    if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(cardsEl);
    requestAnimationFrame(() => window.G29_initDraggableGallery(cardsEl, galleryEl, prevBtn, nextBtn));
  }

  [locationSelect, typeSelect, purposeSelect, bedsSelect].forEach((el) => {
    el.addEventListener('change', render);
  });

  resetBtn.addEventListener('click', () => {
    locationSelect.value = '';
    typeSelect.value = '';
    purposeSelect.value = '';
    bedsSelect.value = '';
    render();
  });

  render();
})();
