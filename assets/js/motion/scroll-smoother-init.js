/*
  GSAP ScrollSmoother (desktop pointer devices only — see below) + a
  device-agnostic hash-anchor correction that every page needs regardless
  of whether a smoother is running.

  ScrollSmoother wraps #smooth-content and eases native scroll into a
  smoothed, interpolated scroll. Fixed-position elements (the dynamic
  island nav, the floating contact button, the progress rail, the contact
  modal) are direct children of <body> (or injected there by their own
  scripts), i.e. outside #smooth-wrapper, so they stay truly fixed to the
  viewport and are unaffected by the smoothing.

  ScrollSmoother itself is desktop (mouse/trackpad) only. Real-device
  testing showed its `normalizeScroll` badly interferes with touch-drag
  scrolling (measured ~1px of movement across 25 real swipe gestures, vs.
  working fine with wheel input) — a known rough edge with that option on
  touch devices. Native mobile scroll is already smooth on its own, so
  touch devices never get a smoother instance; ScrollTrigger (used by the
  walkthrough pin and the reveal system) works identically with or without
  ScrollSmoother present, so nothing else depends on it running on mobile.

  The hash-anchor correction below, though, applies on every device: the
  walkthrough's ScrollTrigger pin-spacer (scroll-video.js) is created
  asynchronously once the hero video's metadata arrives, which can race
  the browser's native hash-jump on both a same-page nav click and a
  cross-page arrival with a hash already in the URL — with or without a
  smoother running, that jump gets computed against a page that's
  temporarily shorter than its final layout and lands short of the real
  target. See scrollToTarget() below.

  Must run before reveal.js/scroll-video.js register their ScrollTriggers
  (see script order in index.html) — ScrollTrigger auto-detects an active
  ScrollSmoother, but creating the smoother first avoids any recalculation
  churn on load.
*/
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Under reduced motion, scroll-video.js never creates the walkthrough's
  // ScrollTrigger pin (see its own M.reducedMotion check), so there's no
  // async pin-spacer insertion race below — native scroll position is
  // already correct and stable, and a corrective jump would just be
  // unwanted extra motion for a user who asked for less of it.
  if (reducedMotion) return;

  var isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasScrollSmoother = false;

  if (isDesktopPointer && typeof ScrollSmoother !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Gates the #smooth-wrapper/#smooth-content CSS (position:fixed +
    // overflow:hidden — see style.css) so it only applies once the smoother
    // is actually running. Without this, those styles would lock scroll
    // entirely on the devices this script skips below.
    document.documentElement.classList.add('has-smooth-scroll');

    window.G29_SMOOTHER = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      normalizeScroll: true
    });
    hasScrollSmoother = true;
  } else {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Real-device testing showed ScrollSmoother's `normalizeScroll` badly
  // interferes with touch-drag scrolling (measured ~1px of movement across
  // 25 real swipe gestures, vs. working fine with wheel input) — a known
  // rough edge with that option on touch devices. Native mobile scroll is
  // already smooth on its own, so touch devices never get a ScrollSmoother
  // instance; `hasScrollSmoother` is false for them and every scrollTo below
  // falls back to plain scrollIntoView.
  function scrollToTarget(target, smooth) {
    if (hasScrollSmoother) {
      window.G29_SMOOTHER.scrollTo(target, smooth, 'top top');
    } else {
      target.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  // ---- Anchor links vs. async layout ------------------------------------
  // With the smoother active, scroll position is virtualized (a transform
  // on #smooth-content), so the browser's native hash-jump lands wherever
  // the page happened to be BEFORE the smoother/pins finished laying out.
  // Even WITHOUT a smoother (mobile/touch), the same problem exists for a
  // different reason: the walkthrough's ScrollTrigger pin-spacer (see
  // scroll-video.js) is only created once the hero video's metadata
  // arrives, which can land after this click — a plain native anchor jump
  // computed against the page's still-shorter layout lands short of the
  // real target. Every same-page "#section" link (nav menu, footer, in-page
  // CTAs) goes through scrollToTarget() instead of native anchor navigation
  // so it always resolves against the current, settled layout.
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
    ScrollTrigger.refresh();
    scrollToTarget(target, true);
    history.pushState(null, '', hash);
  });

  // A page can also arrive with a hash already in the URL (e.g. a footer
  // link from another page lands on index.html#contact) — the browser's
  // own hash-jump on load races the pin/smoother setup, so redo it once
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
        if (initialTarget) scrollToTarget(initialTarget, false);
      });
    });
  }
})();
