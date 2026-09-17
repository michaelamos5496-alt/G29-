/*
  GSAP ScrollSmoother — wraps #smooth-content and eases native scroll into
  a smoothed, interpolated scroll. Fixed-position elements (the dynamic
  island nav, the floating contact button, the progress rail, the contact
  modal) are direct children of <body> (or injected there by their own
  scripts), i.e. outside #smooth-wrapper, so they stay truly fixed to the
  viewport and are unaffected by the smoothing.

  Desktop (mouse/trackpad) only. Real-device testing showed ScrollSmoother's
  `normalizeScroll` badly interferes with touch-drag scrolling (measured
  ~1px of movement across 25 real swipe gestures, vs. working fine with
  wheel input) — a known rough edge with that option on touch devices.
  Native mobile scroll is already smooth on its own, so touch devices skip
  ScrollSmoother entirely rather than fight it; ScrollTrigger (used by the
  walkthrough pin and the reveal system) works identically with or without
  ScrollSmoother present, so nothing else depends on this running on mobile.

  Must run before reveal.js/scroll-video.js register their ScrollTriggers
  (see script order in index.html) — ScrollTrigger auto-detects an active
  ScrollSmoother, but creating the smoother first avoids any recalculation
  churn on load.
*/
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof ScrollSmoother === 'undefined') return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; // native scroll, no smoothing — respects the OS preference directly

  var isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isDesktopPointer) return; // touch devices: native scroll, see note above

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // Gates the #smooth-wrapper/#smooth-content CSS (position:fixed +
  // overflow:hidden — see style.css) so it only applies once the smoother
  // is actually running. Without this, those styles would lock scroll
  // entirely on the devices this script already bails out on above.
  document.documentElement.classList.add('has-smooth-scroll');

  window.G29_SMOOTHER = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.1,
    normalizeScroll: true
  });

  // ---- Anchor links vs. ScrollSmoother -----------------------------------
  // With the smoother active, scroll position is virtualized (a transform
  // on #smooth-content), so the browser's native hash-jump lands wherever
  // the page happened to be BEFORE the smoother/pins finished laying out —
  // it looks like it scrolled to a half-finished/wrong spot. Every
  // same-page "#section" link (nav menu, footer, in-page CTAs) needs to go
  // through smoother.scrollTo() instead of native anchor navigation.
  function sameDocumentHash(href) {
    if (!href) return null;
    var url;
    try { url = new URL(href, window.location.href); } catch (e) { return null; }
    if (url.pathname !== window.location.pathname || url.hash.length < 2) return null;
    return url.hash;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="#"]');
    if (!link) return;
    var hash = sameDocumentHash(link.getAttribute('href'));
    var target = hash && document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    window.G29_SMOOTHER.scrollTo(target, true, 'top top');
    history.pushState(null, '', hash);
  });

  // A page can also arrive with a hash already in the URL (e.g. a footer
  // link from another page lands on index.html#contact) — the browser's
  // own hash-jump on load races the smoother's setup, so redo it once
  // everything has settled. Critically, this has to wait for `load` (not
  // just DOMContentLoaded) — other scripts still to come (scroll-video.js
  // in particular) create the walkthrough's pinned spacer once the hero
  // video's metadata arrives, which changes total document height
  // substantially. Correcting the scroll position before that pin exists
  // computes the target's offset against the wrong (shorter) page.
  if (window.location.hash) {
    var initialHash = window.location.hash;
    window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        ScrollTrigger.refresh();
        var initialTarget = document.querySelector(initialHash);
        if (initialTarget) window.G29_SMOOTHER.scrollTo(initialTarget, false, 'top top');
      });
    });
  }
})();
