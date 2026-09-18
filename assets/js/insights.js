/*
  Insights listing — renders the article grid on insights.html from
  window.G29_INSIGHTS, newest first, with a lightweight category filter.
*/
(function () {
  const insights = (window.G29_INSIGHTS || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const grid = document.getElementById('insightsGrid');
  if (!grid) return;

  const filterBar = document.getElementById('insightsFilters');
  const countEl = document.getElementById('insightsCount');
  const categories = ['All'].concat(Array.from(new Set(insights.map((a) => a.category))));

  const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  function render(activeCategory) {
    const filtered = activeCategory === 'All' ? insights : insights.filter((a) => a.category === activeCategory);

    if (countEl) countEl.textContent = filtered.length + (filtered.length === 1 ? ' article' : ' articles');

    grid.innerHTML = filtered.map((a) => `
      <a class="insight-card" data-reveal="glance" data-reveal-group="insights-grid" href="${window.G29_insightDetailUrl(a.slug)}">
        <div class="insight-card__frame">
          <div class="insight-card__image" style="background-image: url('${a.heroImage}');"></div>
          <span class="insight-card__category">${a.category}</span>
        </div>
        <div class="insight-card__caption">
          <h3 class="insight-card__title">${a.title}</h3>
          <p class="insight-card__excerpt">${a.excerpt}</p>
          <span class="insight-card__meta">${dateFormatter.format(new Date(a.date))} &middot; ${a.readTime}</span>
        </div>
      </a>
    `).join('');
  }

  if (filterBar) {
    filterBar.innerHTML = categories.map((c, i) => `
      <button type="button" class="insight-filter${i === 0 ? ' is-active' : ''}" data-category="${c}">${c}</button>
    `).join('');

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.insight-filter');
      if (!btn) return;
      filterBar.querySelectorAll('.insight-filter').forEach((b) => b.classList.toggle('is-active', b === btn));
      render(btn.dataset.category);
    });
  }

  render('All');
})();
