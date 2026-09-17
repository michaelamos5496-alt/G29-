/*
  Motion tokens — single source of truth for durations and easing curves.
  Every animation in the site (GSAP or CSS) should trace back to one of
  these values rather than inventing a new number inline.
*/
window.G29_MOTION = (function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 768px)').matches;

  return {
    duration: {
      fast: 0.2,       // 150-250ms — micro-interactions (icon nudge, small state change)
      standard: 0.4,    // 300-500ms — default UI transitions (reveal, card settle)
      cinematic: 0.8,   // 600-1000ms — large visual moments (hero image, section reveal)
      long: 1.2         // 1000-1400ms — full hero entrance timelines
    },
    ease: {
      standard: 'power2.out',     // smooth, physical deceleration — default for most motion
      cinematic: 'power3.out',    // slower start, confident settle — large reveals
      emphatic: 'power4.out',     // strongest deceleration — hero/typography entrances
      linear: 'none'               // continuous motion (background dolly, marquee-style)
    },
    reducedMotion: reducedMotion,
    isMobile: isMobile,
    // Scale factor applied to distances/stagger on mobile so motion reads
    // as simplified rather than just "the same animation, smaller screen."
    mobileScale: isMobile ? 0.6 : 1
  };
})();
