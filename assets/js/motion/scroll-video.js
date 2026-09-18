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

    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=' + scrollLengthVh + '%',
      pin: pinTarget,
      // See the matching comment in motion/lifestyle-stack.js — without a
      // ScrollSmoother running (touch devices), this would otherwise pin
      // via position:fixed, a known iOS Safari jank/stutter source during
      // fast touch swipes. Transform-based pinning composites on the GPU
      // instead.
      pinType: 'transform',
      scrub: 0.4, // slight smoothing only — stays responsive, avoids seek stutter
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
    });

    // This pin-spacer is created asynchronously (only once the video's
    // metadata arrives), and it adds a large chunk of height at the very
    // top of the page. Every ScrollTrigger below it on the page (lifestyle-
    // stack.js's panels in particular — see its own ScrollTrigger.refresh())
    // was already created and measured against the shorter layout that
    // existed before this pin existed, so without this, their cached
    // start/end positions desync from the real, final layout — visible as
    // a gap or an early/late pin release while scrolling through them.
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
