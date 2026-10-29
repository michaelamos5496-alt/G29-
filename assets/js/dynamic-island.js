/*
  Nav — injected on every page that includes this script (mirrors
  floating-contact.js). This is the site's only navigation.

  Desktop (>1024px): a wide glass bar — logo, inline links with the
  current one highlighted, a call button and a "Book a Viewing" CTA.
  Mobile/tablet: the same bar slimmed to logo + call + menu button; the
  menu opens full-screen with large numbered links and one-tap contact.

  The bar hides while scrolling down and slides back on any scroll up.
  On the homepage the active link follows the section in view
  (scroll-spy); on other pages it's set from the URL.
*/
(function () {
  const PHONE = '+233246381172';
  const PHONE_LABEL = '+233 24 638 1172';
  const WHATSAPP = '233246381172';
  const EMAIL = 'info@g29propertyconsult.com';

  const items = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'about', label: 'About', href: 'index.html#about' },
    { key: 'services', label: 'Services', href: 'index.html#services' },
    { key: 'properties', label: 'Properties', href: 'index.html#properties' },
    { key: 'insights', label: 'Insights', href: 'insights.html' },
    { key: 'contact', label: 'Contact', href: 'index.html#contact' }
  ];

  const pad = (n) => String(n).padStart(2, '0');

  const icons = {
    phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  const markup = `
    <header class="nav" id="siteNav">
      <div class="nav__bar">
        <a href="index.html" class="nav__logo" aria-label="G29 Property Consult — Home">
          <img src="assets/images/g29-icon.png" alt="" width="26" height="26">
          <span class="nav__brand"><strong>G29</strong><small>Property Consult</small></span>
        </a>

        <nav class="nav__links" aria-label="Main">
          ${items.map((item) => `<a class="nav__link" href="${item.href}" data-key="${item.key}">${item.label}</a>`).join('')}
        </nav>

        <div class="nav__actions">
          <a class="nav__icon-btn" href="tel:${PHONE}" aria-label="Call G29 on ${PHONE_LABEL}">${icons.phone}</a>
          <a class="nav__cta" href="index.html#contact">Book a Viewing ${icons.arrow}</a>
          <button type="button" class="nav__menu-btn" id="menuToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">
            <span class="nav__menu-lines" aria-hidden="true"><span></span><span></span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="nav-menu" id="navMenu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
      <nav class="nav-menu__links" aria-label="Main">
        ${items.map((item, i) => `
          <a class="nav-menu__link" href="${item.href}" data-key="${item.key}" style="--i:${i}">
            <span class="nav-menu__num">${pad(i + 1)}</span>
            <span class="nav-menu__label">${item.label}</span>
          </a>
        `).join('')}
      </nav>

      <div class="nav-menu__foot">
        <a class="nav-menu__cta" href="index.html#contact">Book a Viewing ${icons.arrow}</a>
        <div class="nav-menu__quick">
          <a href="tel:${PHONE}">${icons.phone}<span>Call</span></a>
          <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${icons.whatsapp}<span>WhatsApp</span></a>
          <a href="mailto:${EMAIL}">${icons.mail}<span>Email</span></a>
        </div>
        <p class="nav-menu__meta">Acacia Court, Osu, Accra &middot; Mon&ndash;Fri, 9am&ndash;5pm</p>
      </div>
    </div>
  `;

  const isHome = () => {
    const path = window.location.pathname;
    return path.endsWith('/') || path.endsWith('index.html');
  };

  function keyFromUrl() {
    const path = window.location.pathname;
    if (path.includes('property-detail') || path.includes('properties-category')) return 'properties';
    if (path.includes('service-detail')) return 'services';
    if (path.includes('insights') || path.includes('insight-detail')) return 'insights';
    if (path.includes('team')) return 'about';
    if (path.includes('privacy-policy') || path.includes('terms-of-use')) return null;
    const hash = window.location.hash.replace('#', '');
    return items.some((i) => i.key === hash) ? hash : 'home';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', markup);

    const nav = document.getElementById('siteNav');
    const menu = document.getElementById('navMenu');
    const menuBtn = document.getElementById('menuToggle');
    const allLinks = document.querySelectorAll('.nav__link, .nav-menu__link');

    function setActive(key) {
      allLinks.forEach((el) => {
        const on = el.dataset.key === key;
        el.classList.toggle('is-active', on);
        if (on) el.setAttribute('aria-current', 'page');
        else el.removeAttribute('aria-current');
      });
    }
    setActive(keyFromUrl());

    // ---- Scroll: compact/hide on the way down, show on the way up ----
    let lastY = window.scrollY;
    let ticking = false;
    let menuOpen = false;

    // Home-page sections the scroll-spy watches (any order).
    const spy = isHome()
      ? ['about', 'services', 'properties', 'contact']
          .map((key) => ({ key, el: document.getElementById(key) }))
          .filter((s) => s.el)
      : [];

    function onScroll() {
      ticking = false;
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      if (!menuOpen) {
        const goingDown = y > lastY + 4;
        const goingUp = y < lastY - 4;
        if (goingDown && y > 160) nav.classList.add('is-hidden');
        else if (goingUp || y < 160) nav.classList.remove('is-hidden');
      }
      lastY = y;

      if (spy.length) {
        // The section whose top most recently crossed the line wins.
        const line = window.innerHeight * 0.35;
        let current = 'home';
        let best = -Infinity;
        spy.forEach((s) => {
          const top = s.el.getBoundingClientRect().top;
          if (top <= line && top > best) { best = top; current = s.key; }
        });
        setActive(current);
      }
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    // Keyboard users tabbing into a hidden bar get it back.
    nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

    // ---- Full-screen menu (mobile/tablet) ----
    let closeTimer = null;

    function openMenu() {
      clearTimeout(closeTimer);
      menuOpen = true;
      menu.hidden = false;
      nav.classList.remove('is-hidden');
      nav.classList.add('is-menu-open');
      document.documentElement.classList.add('nav-menu-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      requestAnimationFrame(() => menu.classList.add('is-open'));
    }

    function closeMenu() {
      if (!menuOpen) return;
      menuOpen = false;
      menu.classList.remove('is-open');
      nav.classList.remove('is-menu-open');
      document.documentElement.classList.remove('nav-menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      closeTimer = setTimeout(() => { menu.hidden = true; }, 450);
    }

    menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) closeMenu(); });

    window.addEventListener('hashchange', () => setActive(keyFromUrl()));
  });
})();
