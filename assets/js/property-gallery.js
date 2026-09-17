document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('galleryMain');
  const thumbs = Array.from(document.querySelectorAll('.property-gallery__thumb'));

  if (!main || !thumbs.length) return;

  function activate(index) {
    const wrapped = ((index % thumbs.length) + thumbs.length) % thumbs.length;
    const thumb = thumbs[wrapped];
    main.style.backgroundImage = `url('${thumb.dataset.image}')`;
    thumbs.forEach((t) => t.classList.remove('is-active'));
    thumb.classList.add('is-active');
    thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function activeIndex() {
    const found = thumbs.findIndex((t) => t.classList.contains('is-active'));
    return found === -1 ? 0 : found;
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => activate(i));
  });

  // Swipe left/right on the main photo to move through the gallery —
  // thumbnails alone meant mobile visitors had no way to browse photos
  // by touch on the image itself.
  const SWIPE_THRESHOLD = 40;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  main.addEventListener('touchstart', (e) => {
    dragging = true;
    startX = e.touches[0].clientX;
    deltaX = 0;
  }, { passive: true });

  main.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });

  main.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      activate(activeIndex() + (deltaX < 0 ? 1 : -1));
    }
  });
});
