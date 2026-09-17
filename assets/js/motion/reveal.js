/*
  Scroll-reveal system — GSAP + ScrollTrigger.

  Usage: add data-reveal="fade-up|fade-in|scale|mask|left|right" to any
  element. Elements with data-reveal-group share one ScrollTrigger batch
  and stagger together (use data-reveal-group="services-grid" etc.).

  Respects prefers-reduced-motion (elements just appear, no motion) and
  scales distances/duration down on mobile rather than reusing desktop
  values verbatim.
*/
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var M = window.G29_MOTION || {
    duration: { standard: 0.4, cinematic: 0.8 },
    ease: { standard: 'power2.out', cinematic: 'power3.out' },
    reducedMotion: false,
    mobileScale: 1
  };

  var DIST = 28 * M.mobileScale;

  var FROM_VARS = {
    'fade-up': { opacity: 0, y: DIST },
    // Slightly longer travel than fade-up — for card grids that come in as
    // a staggered set (service tiles, testimonials) rather than one element.
    'glance': { opacity: 0, y: 36 * M.mobileScale },
    'fade-in': { opacity: 0 },
    'scale': { opacity: 0, scale: 0.92 },
    'mask': { opacity: 0, clipPath: 'inset(12% 0 12% 0)' },
    'left': { opacity: 0, x: -DIST * 1.4 },
    'right': { opacity: 0, x: DIST * 1.4 }
  };

  var TO_BASE = { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)' };

  function reveal(el) {
    var type = el.dataset.reveal || 'fade-up';
    var from = FROM_VARS[type] || FROM_VARS['fade-up'];

    if (M.reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'none' });
      return;
    }

    gsap.set(el, from);
    gsap.to(el, Object.assign({}, TO_BASE, {
      duration: M.duration.cinematic,
      ease: M.ease.cinematic,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }));
  }

  function revealGroup(groupName, els) {
    var stagger = 0.08 * M.mobileScale;

    if (M.reducedMotion) {
      els.forEach(function (el) { gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'none' }); });
      return;
    }

    els.forEach(function (el) {
      var type = el.dataset.reveal || 'fade-up';
      gsap.set(el, FROM_VARS[type] || FROM_VARS['fade-up']);
    });

    ScrollTrigger.create({
      trigger: els[0].closest('[data-reveal-container]') || els[0].parentElement,
      start: 'top 80%',
      once: true,
      onEnter: function () {
        gsap.to(els, Object.assign({}, TO_BASE, {
          duration: M.duration.cinematic,
          ease: M.ease.cinematic,
          stagger: stagger
        }));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grouped = {};
    var solo = [];

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var group = el.dataset.revealGroup;
      if (group) {
        (grouped[group] = grouped[group] || []).push(el);
      } else {
        solo.push(el);
      }
    });

    solo.forEach(reveal);
    Object.keys(grouped).forEach(function (key) {
      revealGroup(key, grouped[key]);
    });

    ScrollTrigger.refresh();
  });
})();
