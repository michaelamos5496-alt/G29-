/*
  Lazy background-image loader. Elements carry `data-bg="URL"` instead of
  an inline `background-image`; this checks their actual on-screen position
  and only sets the real `background-image` once they're within `MARGIN`px
  of the viewport.

  Uses a scroll/resize listener + getBoundingClientRect rather than
  IntersectionObserver: this site wraps all content in ScrollSmoother's
  `#smooth-wrapper` (position:fixed, overflow:hidden) with the actual
  content transformed inside it, and IntersectionObserver's default-root
  intersection math does not reliably report `isIntersecting` for elements
  in that setup even when their real getBoundingClientRect is on-screen —
  reading geometry directly sidesteps that entirely.

  Auto-runs once on DOMContentLoaded for any [data-bg] already in the
  static HTML (service tiles, testimonials, footer banner, etc). For
  content rendered later by JS (featured cards, category tiles, gallery
  cards), call window.G29_lazyLoadBg(container) right after you set its
  innerHTML.

  Above-the-fold hero/gallery images should keep a plain inline
  background-image and skip this entirely — lazy-loading something the
  user sees immediately only delays it and hurts LCP.
*/
(function () {
  var MARGIN = 600;
  var pending = [];
  var ticking = false;

  function applyBg(el) {
    var url = el.dataset.bg;
    if (!url) return;
    el.style.backgroundImage = "url('" + url + "')";
    el.removeAttribute('data-bg');
  }

  function isNear(el) {
    var rect = el.getBoundingClientRect();
    var verticallyNear = rect.bottom > -MARGIN && rect.top < window.innerHeight + MARGIN;
    var horizontallyNear = rect.right > -MARGIN && rect.left < window.innerWidth + MARGIN;
    return verticallyNear && horizontallyNear;
  }

  function checkPending() {
    ticking = false;
    if (!pending.length) return;
    pending = pending.filter(function (el) {
      if (!document.body.contains(el)) return false; // re-rendered away (e.g. filter change)
      if (isNear(el)) {
        applyBg(el);
        return false;
      }
      return true;
    });
  }

  function requestCheck() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(checkPending);
  }

  window.G29_lazyLoadBg = function (root) {
    var scope = root || document;
    var els = scope.querySelectorAll('[data-bg]');
    els.forEach(function (el) { pending.push(el); });
    requestCheck();
  };

  // Draggable galleries (assets/js/motion/draggable-gallery.js) move cards
  // via a GSAP transform, not native scroll — nothing else would tell this
  // module a card just got dragged into view, so it calls this directly.
  window.G29_recheckLazyBg = requestCheck;

  window.addEventListener('scroll', requestCheck, { passive: true });
  window.addEventListener('resize', requestCheck);

  document.addEventListener('DOMContentLoaded', function () {
    window.G29_lazyLoadBg(document);
  });
})();
