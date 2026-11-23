/*
  Scroll-video controller — translates scroll progress into video
  playback position (scroll-scrubbed cinematic walkthrough), plus a
  scroll-drawn G29 flower logo mark and a section progress indicator.

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
  var petalEls = wordmarkEl ? Array.prototype.slice.call(wordmarkEl.querySelectorAll('.wm-petal')) : [];
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

  // ---- Logo mark "draw-on": each of the 5 flower petals outlines in,
  // staggered like a bloom, then the whole mark solidifies to a filled
  // white flower — replacing the old "G29" text write-on. Each petal is
  // one path combining its outer boundary and inner hole (fill-rule:
  // evenodd — see index.html/.wm-petal), so getTotalLength() measures
  // both subpaths together and the stroke-dasharray reveal draws both
  // the outer AND inner edge of the ring at once.
  var PETAL_STAGGER = 0.09;
  var PETAL_DRAW_DURATION = 0.24;
  var DRAW_END = (petalEls.length - 1) * PETAL_STAGGER + PETAL_DRAW_DURATION; // 0.6 for 5 petals
  var petalLengths = petalEls.map(function (petal) {
    var len = 0;
    if (petal.getTotalLength) {
      try { len = petal.getTotalLength(); } catch (e) { len = 0; }
    }
    if (len) {
      petal.style.strokeDasharray = len;
      petal.style.strokeDashoffset = len;
    }
    return len;
  });

  function setWordmarkProgress(progress) {
    if (!petalEls.length) return;
    // Snaps to fully invisible at progress 0 and ramps in over the first
    // 2% of scroll — stroke-dasharray alone doesn't guarantee a perfectly
    // empty first frame across multiple petal subpaths, so opacity is the
    // hard guarantee that nothing shows until scrolling actually begins.
    if (wordmarkEl) wordmarkEl.style.opacity = Math.min(progress / 0.02, 1);

    var fillProgress = Math.max(0, Math.min((progress - DRAW_END) / (1 - DRAW_END), 1));
    // Stroke fades from white (the draw-on "ink" color) to the same brand
    // teal as the fill, so nothing is left white once fully solidified —
    // '#59C2BF' must match --color-accent in style.css.
    var strokeColor = typeof gsap !== 'undefined'
      ? gsap.utils.interpolate('rgba(255,255,255,0.9)', '#59C2BF', fillProgress)
      : null;

    petalEls.forEach(function (petal, i) {
      var len = petalLengths[i];
      if (!len) return;
      var start = i * PETAL_STAGGER;
      var drawProgress = Math.max(0, Math.min((progress - start) / PETAL_DRAW_DURATION, 1));
      petal.style.strokeDashoffset = len * (1 - drawProgress);
      petal.style.fillOpacity = fillProgress;
      if (strokeColor) petal.style.stroke = strokeColor;
    });

    // "G29 PROPERTY CONSULTS" writes in underneath during the last
    // stretch, as the flower finishes solidifying.
    if (wordmarkSub) {
      var subProgress = Math.max(0, Math.min((progress - 0.65) / 0.35, 1));
      wordmarkSub.style.opacity = subProgress;
      wordmarkSub.style.transform = 'translateY(' + (10 * (1 - subProgress)) + 'px)';
    }
  }

  function setFadeOutProgress(progress) {
    if (!fadeOutEl) return;
    // No fade, dim or zoom: the hero stays exactly as-is to the last frame
    // and the properties section (rounded top edge, see .discover in
    // style.css) simply slides up over it as the pin releases.
    void progress;
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

    // ---- Timeline (all values are fractions of the pin's scroll length;
    // the video itself plays 0 -> 1 across the whole pin, so it never
    // finishes before the page moves on) --------------------------------
    // Total scroll distance of the hero, in viewport heights. The video is
    // ~16.7s, so ~43vh of scroll per second on desktop (~36 on phones).
    // The hero clip is slowed to 70% speed (see assets/videos/hero-final*.mp4,
    // 16.7s instead of 11.7s). Giving it 1/0.7 the scroll distance keeps the
    // same ~43vh of scroll per clip-second, so the camera really does travel
    // at 70% of the original speed per scroll on desktop. Set SLOWMO to 1 to undo.
    var SLOWMO = 0.7;
    // Phones get a shorter hero scroll than desktop (the footage is a sideways glide, and a very long
    // scroll made it look frozen) — but not so short that the hero can't finish before the sheet arrives.
    var scrollLengthVh = M.isMobile ? 380 : 500 / SLOWMO;
    // The properties section (.discover in style.css, margin-top: -100svh)
    // starts sliding up over the still-playing video for the last 100vh of
    // scroll = roughly the final 2.4s of the video (3s on phones).
    // Retime the logo + name here:
    var WORDMARK_START = 0.15; // logo starts drawing in (~1.8s into the video)
    var WORDMARK_END = 0.52;   // logo solid + name fully written (~6.4s), then it
                               // stays on for ~3.4s before the next page slides in at 0.80
    var VIDEO_END = 1;
    var SHEET_RADIUS = 56; // px, rounded top edge of the sheet as it first appears
    var discoverEl = document.getElementById('properties');

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

    // ---- Smooth scrubbing --------------------------------------------
    // Assigning video.currentTime on every scroll tick starts a new decode
    // before the last one has finished; on slower phones those pile up and
    // the picture stutters. Instead there is only ever ONE seek in flight:
    // scroll just updates the target, and each time a seek completes
    // ('seeked') or the screen refreshes, we jump to the newest target.
    var seekTarget = 0;
    var FRAME = 1 / 23.33; // the hero clip is ~23.3fps
    var seekStarted = 0;
    function pumpSeek() {
      var now = performance.now();
      if (video.seeking) {
        // Watchdog: a seek that never completes (stalled decode/network) must not freeze the hero.
        if (now - seekStarted > 500) { seekStarted = now; video.currentTime = seekTarget; }
        return;
      }
      if (Math.abs(video.currentTime - seekTarget) > FRAME * 0.5) {
        seekStarted = now;
        video.currentTime = seekTarget;
      }
    }
    video.addEventListener('seeked', pumpSeek);
    gsap.ticker.add(pumpSeek);
    try { video.pause(); } catch (e) { /* ignore */ }

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

        var videoProgress = Math.min(self.progress / VIDEO_END, 1);
        // Stop just short of `duration` so the final decoded frame stays
        // on screen (seeking to the exact end can show nothing).
        seekTarget = videoProgress >= 1 ? Math.max(0, duration - 0.04) : videoProgress * duration;
        pumpSeek();

        // Once the properties sheet has fully landed, the hero is entirely
        // behind it — hide the pin so no strip of video/buttons can peek out
        // from under the sheet's bottom edge while it scrolls away.
        pinTarget.style.visibility = self.progress >= 0.999 ? 'hidden' : '';

        // Curved -> sharp: the properties sheet enters with a rounded top
        // edge that flattens to a straight edge as it lands over the video.
        // The sheet starts sliding up at progress (1 - overlap).
        // Scroll distance that maps to progress 0 -> 1: the whole pin on desktop (GSAP pin), but one screen
        // less on touch devices, where the hero is a sticky section and its last screen is just the exit.
        var travelPx = window.innerHeight * (scrollLengthVh / 100 - (isDesktopPointer ? 0 : 1));
        var overlap = (window.innerHeight + 100) / travelPx; // fraction of the scroll the sheet travels over
        if (discoverEl) {
          var sheet = Math.max(0, Math.min((self.progress - (1 - overlap)) / overlap, 1));
          var r = Math.round(SHEET_RADIUS * (1 - sheet));
          discoverEl.style.borderRadius = r + 'px ' + r + 'px 0 0';
        }

        // The hero's own content (logo, name, section markers, buttons) is
        // timed against `hp`: its progress up to the moment the properties
        // sheet starts to arrive. So whatever the scroll length, the logo,
        // name and buttons are always fully shown BEFORE the second page
        // begins to cover them — the video keeps playing underneath it.
        var heroEnd = Math.max(0.3, 1 - overlap);
        var hp = Math.min(self.progress / heroEnd, 1);
        var wm = Math.max(0, Math.min((hp - WORDMARK_START) / (WORDMARK_END - WORDMARK_START), 1));
        setWordmarkProgress(wm);
        updateSection(sectionForProgress(hp));
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
