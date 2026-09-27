/*
  Services tiles — static markup in index.html, but on mobile/tablet
  (max-width:1024px, matching style.css) they become a swipeable slider
  using the same G29_initDraggableGallery helper as the other card rails
  on this page (Featured Properties, Browse by Category). Desktop keeps
  the 4-column grid untouched. A matchMedia listener enables/disables the
  slider as that breakpoint is crossed.
*/
(function () {
  const grid = document.getElementById('servicesGrid');
  const galleryEl = document.getElementById('servicesGallery');
  const prevBtn = document.getElementById('servicesPrev');
  const nextBtn = document.getElementById('servicesNext');
  if (!grid || !galleryEl || !prevBtn || !nextBtn || !window.G29_initDraggableGallery) return;

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
})();
