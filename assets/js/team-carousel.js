/*
  Team — "spotlight" section. One member is shown large (portrait, name,
  role, bio, focus areas, contact CTA); the avatar strip switches between
  them. While the section is on screen it auto-advances every AUTOPLAY_MS,
  with a progress ring filling around the active avatar; any tap, swipe or
  keyboard use stops autoplay for good. Reduced motion never autoplays.
  Placeholder team members, bios and photos — swap for real names, titles,
  and photography once provided (see /docs/project-requirements.md).
*/
(function () {
  const team = [
    { name: 'Kwame Owusu', title: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      bio: 'Kwame founded G29 to bring clarity and straight answers to Accra property. He leads strategy and oversees every major client relationship.',
      tags: ['Strategy', 'Investment', 'Client partnerships'] },
    { name: 'Abena Mensah', title: 'Head of Real Estate Brokerage', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
      bio: 'Abena runs our sales and leasing desk, matching buyers and tenants with the right homes across East Legon, Cantonments and beyond.',
      tags: ['Sales', 'Leasing', 'Negotiation'] },
    { name: 'Daniel Asare', title: 'Lead Valuation Analyst', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      bio: 'Daniel produces the independent valuations owners and lenders rely on, backed by current transaction data from across Greater Accra.',
      tags: ['Valuation', 'Market data', 'Due diligence'] },
    { name: 'Efua Boateng', title: 'Head of Property Management', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
      bio: 'Efua keeps managed properties running smoothly, from tenant care and maintenance to rent collection and owner reporting.',
      tags: ['Tenant care', 'Maintenance', 'Reporting'] },
    { name: 'Samuel Tetteh', title: 'Advisory Services Lead', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800&auto=format&fit=crop',
      bio: 'Samuel advises investors and diaspora clients on where, when and how to buy, with a clear view of risk and long-term returns.',
      tags: ['Advisory', 'Diaspora clients', 'Portfolio planning'] },
    { name: 'Joseph Amponsah', title: 'Client Relations Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      bio: 'Joseph is often your first call at G29. He makes sure every enquiry reaches the right specialist and nothing falls through the cracks.',
      tags: ['Client care', 'Onboarding', 'Viewings'] },
    { name: 'Richard Boadi', title: 'Operations Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
      bio: 'Richard runs the systems, contracts and compliance behind every deal, so transactions close on time and by the book.',
      tags: ['Operations', 'Compliance', 'Contracts'] }
  ];

  const AUTOPLAY_MS = 6000;

  const sectionEl = document.getElementById('team');
  const stageEl = document.getElementById('teamStage');
  const portraitEl = document.getElementById('teamPortrait');
  const stripEl = document.getElementById('teamStrip');
  const textEl = document.getElementById('teamText');
  const ctaEl = document.getElementById('teamCta');

  if (!stageEl) return;

  const pad = (n) => String(n).padStart(2, '0');
  const firstName = (m) => m.name.split(' ')[0];

  portraitEl.insertAdjacentHTML('afterbegin', team.map((m, i) =>
    `<div class="team-spot__photo${i === 0 ? ' is-active' : ''}" data-bg="${m.image}" role="img" aria-label="${m.name}"></div>`
  ).join(''));

  // Progress ring: r=30 → circumference ≈ 188.5, matched by
  // stroke-dasharray in style.css.
  stripEl.innerHTML = team.map((m, i) => `
    <button type="button" class="team-spot__avatar" role="tab" aria-selected="false" aria-label="${m.name}, ${m.title}" data-index="${i}">
      <span class="team-spot__avatar-img" data-bg="${m.image}"></span>
      <svg class="team-spot__ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30"/></svg>
    </button>
  `).join('');

  if (window.G29_lazyLoadBg) {
    window.G29_lazyLoadBg(portraitEl);
    window.G29_lazyLoadBg(stripEl);
  }

  const photoEls = Array.from(portraitEl.querySelectorAll('.team-spot__photo'));
  const avatarEls = Array.from(stripEl.querySelectorAll('.team-spot__avatar'));
  let current = -1;

  function select(i) {
    i = (i + team.length) % team.length;
    if (i === current) return;
    current = i;
    const m = team[i];

    photoEls.forEach((el, n) => el.classList.toggle('is-active', n === i));
    avatarEls.forEach((el, n) => {
      el.classList.toggle('is-active', n === i);
      el.setAttribute('aria-selected', String(n === i));
    });

    // Keep the active avatar centred when the strip scrolls (mobile).
    if (stripEl.scrollWidth > stripEl.clientWidth) {
      const offset = avatarEls[i].getBoundingClientRect().left - stripEl.getBoundingClientRect().left;
      stripEl.scrollTo({ left: stripEl.scrollLeft + offset - (stripEl.clientWidth - avatarEls[i].offsetWidth) / 2, behavior: 'smooth' });
    }

    document.getElementById('teamNum').textContent = pad(i + 1);
    document.getElementById('teamCount').textContent = `${pad(i + 1)} / ${pad(team.length)}`;
    document.getElementById('teamName').textContent = m.name;
    document.getElementById('teamRole').textContent = m.title;
    document.getElementById('teamBio').textContent = m.bio;
    document.getElementById('teamTags').innerHTML = m.tags.map((t) => `<li>${t}</li>`).join('');
    ctaEl.innerHTML = `Speak with ${firstName(m)} <span aria-hidden="true">&#8594;</span>`;
    ctaEl.dataset.contactMessage = `I'd like to speak with ${m.name} (${m.title}).`;

    // Restart the text fade-up and the active avatar's progress ring.
    textEl.classList.remove('is-changing');
    void textEl.offsetWidth;
    textEl.classList.add('is-changing');
  }

  // ---- Autoplay ----
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  let stopped = reducedMotion;
  let inView = false;

  function schedule() {
    clearTimeout(timer);
    sectionEl.classList.toggle('is-playing', !stopped && inView);
    if (stopped || !inView) return;
    timer = setTimeout(() => {
      select(current + 1);
      // Re-trigger the ring animation on the newly active avatar.
      sectionEl.classList.remove('is-playing');
      void sectionEl.offsetWidth;
      schedule();
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    stopped = true;
    schedule();
  }

  // Plain scroll/rect check rather than IntersectionObserver — see
  // lazy-bg.js for why IO is unreliable inside ScrollSmoother's wrapper.
  function checkInView() {
    const r = sectionEl.getBoundingClientRect();
    const visible = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25;
    if (visible !== inView) {
      inView = visible;
      schedule();
    }
  }
  window.addEventListener('scroll', checkInView, { passive: true });
  window.addEventListener('resize', checkInView);

  stripEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.team-spot__avatar');
    if (!btn) return;
    stopAutoplay();
    select(Number(btn.dataset.index));
  });

  // Arrow keys move between avatars (tablist pattern).
  stripEl.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    stopAutoplay();
    select(current + (e.key === 'ArrowRight' ? 1 : -1));
    avatarEls[current].focus();
  });

  // Horizontal swipe on the portrait steps through members.
  let touchX = null;
  let touchY = null;
  portraitEl.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  portraitEl.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      stopAutoplay();
      select(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  select(0);
  checkInView();
})();
