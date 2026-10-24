/*
  About section — two small pieces of behavior:
  1. "Where We Work" neighborhood strip: a draggable card rail (same
     G29_initDraggableGallery pattern as Discover/Featured/Services/
     Insights/Team), reusing property images already in
     properties-data.js rather than introducing new ones.
  2. "Why G29" numbered tabs: click swaps the copy next to the photo.
*/
(function () {
  const areas = [
    { name: 'East Legon', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop' },
    { name: 'Cantonments', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop' },
    { name: 'Airport Residential', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop' },
    { name: 'Osu', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop' }
  ];

  const grid = document.getElementById('aboutAreasGrid');
  const galleryEl = document.getElementById('aboutAreasGallery');
  const prevBtn = document.getElementById('aboutAreasPrev');
  const nextBtn = document.getElementById('aboutAreasNext');

  if (grid) {
    grid.innerHTML = areas.map((area) => `
      <a class="about__area" href="properties-category.html" data-bg="${area.image}">
        <span class="about__area-label">${area.name}</span>
      </a>
    `).join('');

    if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(grid);

    if (galleryEl && prevBtn && nextBtn && window.G29_initDraggableGallery) {
      requestAnimationFrame(() => {
        window.G29_initDraggableGallery(grid, galleryEl, prevBtn, nextBtn);
      });
    }
  }

  const whyContent = [
    'Local Expertise &mdash; our advisors live and work in the neighborhoods we list, not just on paper.',
    'End-to-End Service &mdash; from first viewing to signed lease or sale, one team sees it through.',
    'Trusted Results &mdash; clear reporting and honest advice, even when it&rsquo;s not what you want to hear.'
  ];

  const whyTabs = document.querySelectorAll('.about__why-tab');
  const whyCopyEl = document.getElementById('aboutWhyCopy');

  whyTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      whyTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      if (whyCopyEl) whyCopyEl.innerHTML = whyContent[Number(tab.dataset.index)] || whyContent[0];
    });
  });
})();
