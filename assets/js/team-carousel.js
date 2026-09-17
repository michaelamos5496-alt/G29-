/*
  Team carousel — filmstrip of narrow slices, one expanded/active at a time.
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

  let activeIndex = 2;

  const strip = document.getElementById('teamStrip');
  const prevBtn = document.getElementById('teamPrev');
  const nextBtn = document.getElementById('teamNext');

  if (!strip) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function render() {
    strip.innerHTML = team.map((member, i) => `
      <button type="button" class="team-slice${i === activeIndex ? ' is-active' : ''}"
        data-reveal="fade-up" data-reveal-group="team-strip"
        style="background-image: url('${member.image}');" data-index="${i}"
        aria-label="${member.name}, ${member.title}">
        <span class="team-slice__overlay"></span>
        <span class="team-slice__info">
          <span class="team-slice__title">${member.title}</span>
          <span class="team-slice__name">${member.name}</span>
        </span>
      </button>
    `).join('');

    strip.querySelectorAll('.team-slice').forEach((el) => {
      el.addEventListener('click', () => {
        activeIndex = Number(el.dataset.index);
        render();
      });

      // Desktop: expand on hover instead of requiring a click.
      // Touch devices keep tap-to-open via the click handler above.
      if (canHover) {
        el.addEventListener('mouseenter', () => {
          activeIndex = Number(el.dataset.index);
          render();
        });
      }
    });

    // On mobile the strip scrolls horizontally (see the max-width:768px
    // rule in style.css) — activating a slice near either edge would
    // otherwise expand it partly out of view since re-rendering doesn't
    // move the scroll position on its own.
    var activeEl = strip.querySelector('.team-slice.is-active');
    if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  prevBtn.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + team.length) % team.length;
    render();
  });

  nextBtn.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % team.length;
    render();
  });

  render();
})();
