/*
  Scroll-video controller — translates scroll progress into video
  playback position (scroll-scrubbed cinematic walkthrough), plus a
  scroll-drawn "G29" outline wordmark and a section progress indicator.

  Architecture note: this project is static HTML/CSS/JS (no React/Next.js
  build step), so this is a plain-JS controller rather than a component
  class hierarchy, but it follows the same separation of concerns:
  - assets/js/motion/walkthrough-sections.js  -> narrative/config data
  - assets/js/motion/scroll-video.js          -> playback + pin + wordmark logic
  - assets/css/style.css (.walkthrough*)      -> presentation

  Scroll position -> video.currentTime, via GSAP ScrollTrigger's `scrub`
  (already interpolates smoothly — no separate rAF loop needed, no second
  scrolling system introduced).
*/
(function () {
  var root = document.getElementById('walkthrough');
  if (!root) return;

  var video = document.getElementById('walkthroughVideo');
  var pinTarget = document.getElementById('walkthroughPin');
  var progressEl = document.getElementById('walkthroughProgress');
  var hintEl = document.getElementById('walkthroughHint');
  var ctaEl = document.getElementById('walkthroughCtaGroup');
  var wordmarkEl = document.getElementById('walkthroughWordmark');
  var wordmarkText = document.getElementById('walkthroughWordmarkText');
  var wordmarkSub = document.getElementById('walkthroughWordmarkSub');
  var fadeOutEl = document.getElementById('walkthroughFadeOut');
  var sections = window.G29_WALKTHROUGH_SECTIONS || [];

  var M = window.G29_MOTION || { reducedMotion: false, isMobile: false };

  // ---- Progress indicator (01..0N markers) ---------------------------
  progressEl.innerHTML = sections.map(function (s) {
    return '<span class="walkthrough__progress-item" data-label="' + s.label + '" title="' +
      s.title + ' — ' + s.description + '">' + s.label + '</span>';
  }).join('');
  var progressItems = progressEl.querySelectorAll('.walkthrough__progress-item');

  // ---- Wordmark "write-on": one continuous motion across the whole
  // scroll — the outline draws AND fills solid white together, both
  // completing exactly at 100% scroll (not draw-then-pause-then-fill).
  var wordmarkLength = 0;
  if (wordmarkText && wordmarkText.getComputedTextLength) {
    try { wordmarkLength = wordmarkText.getComputedTextLength(); } catch (e) { wordmarkLength = 0; }
  }
  if (wordmarkLength) {
    wordmarkText.style.strokeDasharray = wordmarkLength;
    wordmarkText.style.strokeDashoffset = wordmarkLength;
  }
  function setWordmarkProgress(progress) {
    if (!wordmarkLength) return;
    // Snaps to fully invisible at progress 0 and ramps in over the first
    // 2% of scroll — stroke-dasharray alone doesn't guarantee a perfectly
    // empty first frame across multiple glyph subpaths, so opacity is the
    // hard guarantee that nothing shows until scrolling actually begins.
    if (wordmarkEl) wordmarkEl.style.opacity = Math.min(progress / 0.02, 1);
    wordmarkText.style.strokeDashoffset = wordmarkLength * (1 - progress);
    wordmarkText.style.fillOpacity = progress;

    // "PROPERTY CONSULT" writes in underneath during the last stretch,
    // as G29 finishes turning solid white.
    if (wordmarkSub) {
      var subProgress = Math.max(0, Math.min((progress - 0.65) / 0.35, 1));
      wordmarkSub.style.opacity = subProgress;
      wordmarkSub.style.transform = 'translateY(' + (10 * (1 - subProgress)) + 'px)';
    }
  }

  function setFadeOutProgress(progress) {
    if (!fadeOutEl) return;
    fadeOutEl.style.opacity = progress;
  }

  // ---- Fallback: video fails to load ---------------------------------
  function showFallback() {
    root.classList.add('is-fallback');
    if (hintEl) hintEl.style.display = 'none';
  }
  video.addEventListener('error', showFallback);

  // ---- Reduced motion: no pin, no scrub, static editorial content ----
  if (M.reducedMotion) {
    root.classList.add('is-static');
    return;
  }

  // ---- Scroll hint: fades on first scroll, never returns --------------
  var hintDismissed = false;
  function dismissHint() {
    if (hintDismissed) return;
    hintDismissed = true;
    hintEl.classList.add('is-hidden');
  }

  // ---- Progress markers + end-of-walkthrough CTA ----------------------
  var activeSection = null;
  function updateSection(section) {
    if (!section || section === activeSection) return;
    activeSection = section;

    progressItems.forEach(function (item) {
      item.classList.toggle('is-active', item.dataset.label === section.label);
    });

    if (ctaEl) ctaEl.classList.toggle('is-visible', !!section.cta);
  }

  function sectionForProgress(progress) {
    for (var i = 0; i < sections.length; i++) {
      if (progress >= sections[i].start && progress < sections[i].end) return sections[i];
    }
    return sections[sections.length - 1];
  }

  // ---- Wait for real metadata before wiring currentTime ---------------
  function whenReady(cb) {
    if (video.readyState >= 1 && video.duration) {
      cb();
    } else {
      video.addEventListener('loadedmetadata', cb, { once: true });
    }
  }

  whenReady(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // No GSAP available — fall back to a normal (non-scrubbed) hero video.
      root.classList.add('is-fallback-playback');
      video.play().catch(function () {});
      updateSection(sections[0]);
      setWordmarkProgress(1);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    var duration = video.duration;
    var contentVh = M.isMobile ? 350 : 500; // scroll distance the walkthrough narrative itself uses

    // The write-on (draw + fill + subline) finishes at CONTENT_FRACTION of
    // the *total* pin distance, leaving a genuine hold — the fully-solid
    // wordmark just sits there, unchanging — before FADE_START begins the
    // dissolve into the next section. Both are extra scroll distance, not
    // a re-timing of the existing content, so nothing feels rushed.
    var CONTENT_FRACTION = 0.72;
    var FADE_START = 0.90;
    var scrollLengthVh = contentVh / CONTENT_FRACTION;

    // Matches the media query gating .walkthrough__pin's `position: sticky`
    // in style.css. Desktop (mouse/trackpad, ScrollSmoother running) keeps
    // GSAP's JS-driven pin, which has always worked fine there. Touch
    // devices instead rely on native CSS sticky to stay in place — no
    // pin-spacer, no JS-computed transform, nothing that can desync from
    // real scroll/resize timing. That JS pin (even forced to
    // pinType:'transform', even with ignoreMobileResize on) kept producing
    // a visible wobble on real phones that headless testing here never
    // reproduced; sticky is handled entirely by the browser's own
    // compositor and sidesteps that whole category of bug.
    var isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var triggerConfig = {
      trigger: root,
      start: 'top top',
      // scrub is an eased "catch up to the scroll position" tween, not a
      // 1:1 mapping — on mobile, real touch-scroll input arrives in bursts
      // (momentum, rubber-banding) rather than the mouse wheel's steadier
      // deltas, so a 0.4s catch-up window has enough lag to visibly
      // overshoot/settle on every burst, which reads as the video wobbling.
      // A much shorter window on touch keeps just enough smoothing to
      // filter raw touchmove jitter without that lag being long enough to
      // perceive.
      scrub: M.isMobile ? 0.15 : 0.4,
      onUpdate: function (self) {
        if (self.progress > 0.001) dismissHint();

        var targetTime = self.progress * duration;
        // Guard against redundant seeks (video.currentTime setter is not free).
        if (Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime;
        }

        var contentProgress = Math.min(self.progress / CONTENT_FRACTION, 1);
        setWordmarkProgress(contentProgress);
        updateSection(sectionForProgress(contentProgress));

        var fadeProgress = Math.max(0, Math.min((self.progress - FADE_START) / (1 - FADE_START), 1));
        setFadeOutProgress(fadeProgress);
      }
    };

    if (isDesktopPointer) {
      triggerConfig.end = '+=' + scrollLengthVh + '%';
      triggerConfig.pin = pinTarget;
      triggerConfig.pinType = 'transform';
    } else {
      // No GSAP pin at all — .walkthrough__pin's own `position: sticky`
      // (see style.css) keeps it in place while .walkthrough scrolls past
      // underneath it. Since there's no pin-spacer reserving that scroll
      // distance for us here, .walkthrough needs an explicit height doing
      // the same job.
      root.style.height = scrollLengthVh + 'svh';
      triggerConfig.end = 'bottom bottom';
    }

    ScrollTrigger.create(triggerConfig);

    // Either branch above adds a large chunk of height at the very top of
    // the page (a pin-spacer, or .walkthrough's own explicit height), but
    // only once the video's metadata arrives — asynchronously, well after
    // other triggers further down the page. Every ScrollTrigger below this
    // one (lifestyle-stack.js's panels in particular — see its own
    // ScrollTrigger.refresh()) was already created and measured against
    // the shorter layout that existed before this height existed, so
    // without this, their cached start/end positions desync from the real,
    // final layout — visible as a gap or an early/late pin release while
    // scrolling through them.
    ScrollTrigger.refresh();

    updateSection(sections[0]);
  });

  video.addEventListener('waiting', function () {
    root.classList.add('is-buffering');
  });
  video.addEventListener('canplay', function () {
    root.classList.remove('is-buffering');
  });
})();
