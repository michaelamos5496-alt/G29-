/*
  Team — card grid on desktop, swipeable slider on mobile/tablet
  (max-width:1024px, matching style.css), using the same
  G29_initDraggableGallery helper as the other card rails on this page.
  Placeholder team members/photos — swap for real names, titles, and
  photography once provided (see /docs/project-requirements.md).
*/
(function () {
  const team = [
    { name: 'Kwame Owusu', title: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' },
    { name: 'Abena Mensah', title: 'Head of Real Estate Brokerage', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Daniel Asare', title: 'Lead Valuation Analyst', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop' },
    { name: 'Efua Boateng', title: 'Head of Property Management', image: 'https://images.unsplash.com/photo-1573497019236-61f323342eb4?q=80&w=800&auto=format&fit=crop' },
    { name: 'Samuel Tetteh', title: 'Advisory Services Lead', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800&auto=format&fit=crop' },
    { name: 'Joseph Amponsah', title: 'Client Relations Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Richard Boadi', title: 'Operations Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' }
  ];

  const grid = document.getElementById('teamGrid');
  const galleryEl = document.getElementById('teamGallery');
  const prevBtn = document.getElementById('teamPrev');
  const nextBtn = document.getElementById('teamNext');

  if (!grid) return;

  grid.innerHTML = team.map((member) => `
    <div class="team-card" data-reveal="glance" data-reveal-group="team-grid">
      <div class="team-card__frame">
        <div class="team-card__image" data-bg="${member.image}"></div>
      </div>
      <div class="team-card__caption">
        <h3 class="team-card__name">${member.name}</h3>
        <span class="team-card__title">${member.title}</span>
      </div>
    </div>
  `).join('');

  if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(grid);

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
