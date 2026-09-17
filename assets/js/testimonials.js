document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const progressBar = document.getElementById('testimonialsProgress');

  if (!track || !prevBtn || !nextBtn) return;

  function cardStep() {
    const card = track.querySelector('.testimonial-card');
    if (!card) return 280;
    const style = getComputedStyle(track);
    return card.getBoundingClientRect().width + parseFloat(style.gap || 24);
  }

  function updateProgress() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    const visibleRatio = track.clientWidth / track.scrollWidth;
    const width = Math.max(visibleRatio * 100, 15);
    progressBar.style.width = width + '%';
    progressBar.style.marginLeft = ratio * (100 - width) + '%';
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();
});
