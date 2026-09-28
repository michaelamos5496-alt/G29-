/*
  Shared draggable card gallery — GSAP Draggable + InertiaPlugin
  drag-to-scroll with momentum and snap-to-card, plus Prev/Next buttons.
  Used by both the homepage's "Browse by Category" rail and the
  properties-category.html listing gallery.

  Falls back to native CSS scroll-snap (still swipeable, just no
  inertia/rubber-banding) if Draggable isn't available. Call
  G29_initDraggableGallery() again after re-rendering the `<li>` cards
  (e.g. on filter change) — it tears down any previous instance on the
  same cardsEl first.

  Optional 5th arg `onProgress(progress)` — called with the actual
  horizontal scroll progress (0 at the first card, 1 at the last) on
  every drag/throw/goTo/resize update. Used by the "Browse by Category"
  scrubber dot, which used to be driven by vertical scroll position
  instead (see cinematic.js) — completely decoupled from which card was
  actually in view, so the dot could read as almost-finished while the
  very first card was still showing.
*/
(function () {
  var instances = new WeakMap();

  window.G29_destroyDraggableGallery = function (cardsEl) {
    var previous = instances.get(cardsEl);
    if (previous) {
      previous.destroy();
      instances.delete(cardsEl);
    }
  };

  window.G29_initDraggableGallery = function (cardsEl, containerEl, prevBtn, nextBtn, onProgress) {
    var previous = instances.get(cardsEl);
    if (previous) previous.destroy();

    var cards = Array.from(cardsEl.children);
    if (!cards.length) return null;

    var canDraggable = typeof gsap !== 'undefined' && typeof Draggable !== 'undefined' && typeof InertiaPlugin !== 'undefined';

    if (!canDraggable) {
      cardsEl.classList.add('cards--native-scroll');
      var nativeStep = function () {
        return cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(cardsEl).columnGap || 0);
      };
      var onPrev = function () { cardsEl.scrollBy({ left: -nativeStep(), behavior: 'smooth' }); };
      var onNext = function () { cardsEl.scrollBy({ left: nativeStep(), behavior: 'smooth' }); };
      prevBtn.addEventListener('click', onPrev);
      nextBtn.addEventListener('click', onNext);

      var onNativeScroll = function () {
        if (!onProgress) return;
        var maxScroll = cardsEl.scrollWidth - cardsEl.clientWidth;
        onProgress(maxScroll > 0 ? gsap.utils.clamp(0, 1, cardsEl.scrollLeft / maxScroll) : 0);
      };
      if (onProgress) {
        cardsEl.addEventListener('scroll', onNativeScroll, { passive: true });
        onNativeScroll();
      }

      var nativeController = {
        destroy: function () {
          cardsEl.classList.remove('cards--native-scroll');
          prevBtn.removeEventListener('click', onPrev);
          nextBtn.removeEventListener('click', onNext);
          if (onProgress) cardsEl.removeEventListener('scroll', onNativeScroll);
        }
      };
      instances.set(cardsEl, nativeController);
      return nativeController;
    }

    gsap.registerPlugin(Draggable, InertiaPlugin);
    gsap.set(cardsEl, { x: 0 });

    var gap = parseFloat(getComputedStyle(cardsEl).columnGap) || 0;
    var step = cards[0].getBoundingClientRect().width + gap;
    var contentWidth = cardsEl.scrollWidth;
    var containerWidth = containerEl.clientWidth;
    var minX = Math.min(0, containerWidth - contentWidth);
    var maxX = 0;

    var recheckLazyBg = function () { if (window.G29_recheckLazyBg) window.G29_recheckLazyBg(); };
    var reportProgress = function () {
      if (!onProgress) return;
      var x = gsap.getProperty(cardsEl, 'x');
      onProgress(minX < 0 ? gsap.utils.clamp(0, 1, x / minX) : 0);
    };
    var onUpdateTick = function () { recheckLazyBg(); reportProgress(); };

    var draggable = Draggable.create(cardsEl, {
      type: 'x',
      bounds: { minX: minX, maxX: maxX },
      inertia: true,
      edgeResistance: 0.85,
      cursor: 'grab',
      activeCursor: 'grabbing',
      snap: {
        x: function (value) { return gsap.utils.clamp(minX, maxX, Math.round(value / step) * step); }
      },
      onDrag: onUpdateTick,
      onThrowUpdate: onUpdateTick
    })[0];

    reportProgress();

    function goTo(index) {
      var maxIndex = Math.round(-minX / step);
      var clampedIndex = Math.max(0, Math.min(maxIndex, index));
      var targetX = gsap.utils.clamp(minX, maxX, -clampedIndex * step);
      gsap.to(cardsEl, { x: targetX, duration: 0.6, ease: 'power2.out', onUpdate: function () { draggable.update(); onUpdateTick(); } });
    }

    var onPrevDrag = function () { goTo(Math.round(-gsap.getProperty(cardsEl, 'x') / step) - 1); };
    var onNextDrag = function () { goTo(Math.round(-gsap.getProperty(cardsEl, 'x') / step) + 1); };
    prevBtn.addEventListener('click', onPrevDrag);
    nextBtn.addEventListener('click', onNextDrag);

    gsap.fromTo(cards, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.04 });

    // Card width, gap and container width are all read once at init — a
    // mobile orientation change (or any resize) leaves `step`/`minX` stale,
    // so the drag bounds and snap points silently drift out of sync with
    // the actual layout. Recomputing on resize keeps swipe-to-snap accurate.
    var onResize = function () {
      gap = parseFloat(getComputedStyle(cardsEl).columnGap) || 0;
      step = cards[0].getBoundingClientRect().width + gap;
      contentWidth = cardsEl.scrollWidth;
      containerWidth = containerEl.clientWidth;
      minX = Math.min(0, containerWidth - contentWidth);
      draggable.applyBounds({ minX: minX, maxX: maxX });
      var currentX = gsap.getProperty(cardsEl, 'x');
      var clamped = gsap.utils.clamp(minX, maxX, currentX);
      if (clamped !== currentX) gsap.set(cardsEl, { x: clamped });
      reportProgress();
    };
    window.addEventListener('resize', onResize);

    var controller = {
      destroy: function () {
        draggable.kill();
        window.removeEventListener('resize', onResize);
        prevBtn.removeEventListener('click', onPrevDrag);
        nextBtn.removeEventListener('click', onNextDrag);
        gsap.set(cardsEl, { clearProps: 'x' });
      }
    };
    instances.set(cardsEl, controller);
    return controller;
  };
})();
