/*
  Nav — a compact top island (logo + menu button) that drops a rounded
  panel of numbered links directly below itself. Injected on every page
  that includes this script (mirrors floating-contact.js). This is the
  site's only navigation — there is no separate header nav bar.

  Each GSAP tween in the open timeline defines its own `easeReverse`, so
  the panel still opens with a bouncy back.out but closes with a smooth
  power2.out, independent of how it entered.
*/
(function () {
  const items = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'index.html#about' },
    { label: 'Services', href: 'index.html#services' },
    { label: 'Properties', href: 'index.html#properties' },
    { label: 'Insights', href: 'insights.html' },
    { label: 'Contact', href: 'index.html#contact' }
  ];

  const pad = (n) => String(n).padStart(2, '0');

  const markup = `
    <div class="island" id="island">
      <a href="index.html" class="island__logo" aria-label="G29 Property Consult — Home">
        <img src="assets/images/g29-icon.png" alt="" width="20" height="20">
        <span>G29</span>
      </a>
      <button type="button" class="menu-btn" id="menuToggle" aria-expanded="false" aria-controls="menu-panel" aria-label="Open navigation menu">
        <div class="button-cont">
          <svg id="menuIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line class="bar bar-top" x1="2" y1="5" x2="14" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <line class="bar bar-mid" x1="2" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <line class="bar bar-bot" x1="2" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      </button>
    </div>

    <div class="menu-panel" id="menu-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <nav>
        ${items.map((item, i) => `
          <a class="menu-link" href="${item.href}" data-key="${item.label.toLowerCase()}">
            <span>${item.label}</span><span class="link-num">${pad(i + 1)}</span>
          </a>
        `).join('')}
      </nav>
    </div>
  `;

  function currentActiveKey() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path.includes('property-detail') || path.includes('properties-category')) return 'properties';
    if (path.includes('service-detail')) return 'services';
    if (path.includes('insights') || path.includes('insight-detail')) return 'insights';
    if (hash === '#about') return 'about';
    if (hash === '#services') return 'services';
    if (hash === '#properties') return 'properties';
    if (hash === '#contact') return 'contact';
    return 'home';
  }

  function setActive(panel) {
    const activeKey = currentActiveKey();
    panel.querySelectorAll('.menu-link').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.key === activeKey);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', markup);

    const island = document.getElementById('island');
    const menuBtn = document.getElementById('menuToggle');
    const panel = document.getElementById('menu-panel');
    const links = panel.querySelectorAll('.menu-link');
    const bars = { top: '.bar-top', mid: '.bar-mid', bot: '.bar-bot' };

    setActive(panel);
    window.addEventListener('hashchange', () => setActive(panel));

    const hasGsap = typeof gsap !== 'undefined';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isOpen = false;

    if (hasGsap && !reducedMotion) {
      const tl = gsap.timeline({ paused: true });

      tl.set(panel, { display: 'block' })
        .to(bars.top, { attr: { y1: 8, y2: 8 }, rotate: 45, transformOrigin: '50% 50%', duration: 0.3, ease: 'power2.inOut', easeReverse: 'power2.inOut' }, 0)
        .to(bars.mid, { opacity: 0, duration: 0.2, ease: 'power1.out', easeReverse: 'power1.out' }, 0)
        .to(bars.bot, { attr: { y1: 8, y2: 8 }, rotate: -45, transformOrigin: '50% 50%', duration: 0.3, ease: 'power2.inOut', easeReverse: 'power2.inOut' }, 0)
        .fromTo(panel,
          { opacity: 0, y: -14, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)', easeReverse: 'power2.out', transformOrigin: 'top center' }, 0)
        .fromTo(links,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)', easeReverse: 'power2.out', stagger: 0.05 }, 0.1);

      function open() {
        isOpen = true;
        island.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        tl.play();
      }
      function close() {
        isOpen = false;
        island.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        tl.eventCallback('onReverseComplete', () => gsap.set(panel, { display: 'none' }));
        tl.reverse();
      }

      menuBtn.addEventListener('click', () => (isOpen ? close() : open()));
      links.forEach((link) => link.addEventListener('click', close));
      document.addEventListener('click', (e) => {
        if (isOpen && !island.contains(e.target) && !panel.contains(e.target)) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) close();
      });
    } else {
      // No GSAP / reduced motion: plain CSS class toggle, no morph/stagger.
      panel.classList.add('no-motion');
      function toggle() {
        isOpen = !isOpen;
        island.classList.toggle('is-open', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        panel.classList.toggle('is-open', isOpen);
      }
      menuBtn.addEventListener('click', toggle);
      links.forEach((link) => link.addEventListener('click', () => { if (isOpen) toggle(); }));
      document.addEventListener('click', (e) => {
        if (isOpen && !island.contains(e.target) && !panel.contains(e.target)) toggle();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) toggle();
      });
    }
  });
})();
