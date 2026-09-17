/*
  Lifestyle Storytelling — pinned-stack scroll sequence. Each .lifestyle-panel
  pins at the top of the viewport (pinSpacing:false, so no extra scroll
  distance is reserved for it); the next panel, sitting later in normal
  document flow, then scrolls up and covers it. No z-index management is
  needed — later DOM order already paints on top of earlier siblings.

  Pattern: https://codepen.io/BrianCross/pen/PoWapLP

  Each panel's background also gets a slow Ken Burns zoom-out (scale 1.15 -> 1)
  scrubbed to the same pin range, so the image is still settling into place
  as the panel arrives.

  Reduced motion: no pin, no zoom — panels render as plain stacked
  full-height sections (see the prefers-reduced-motion rule in style.css)
  and read fine on their own via normal scroll.
*/
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', function () {
    var panels = gsap.utils.toArray('.lifestyle-panel');
    if (panels.length < 2) return;

    panels.forEach(function (panel, i) {
      var bg = panel.querySelector('.lifestyle-panel__bg');

      // Last panel doesn't need to pin — nothing scrolls up to cover it,
      // so pinning it would just hold the final panel in place forever.
      if (i < panels.length - 1) {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false
        });
      }

      if (bg) {
        gsap.fromTo(bg,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          }
        );
      }
    });

    ScrollTrigger.refresh();
  });
})();
