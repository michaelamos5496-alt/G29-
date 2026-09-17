/*
  Cinematic polish for property-detail.html, layered on top of the base
  scroll-reveal system (reveal.js): a count-up animation on the spec
  numbers as they scroll into view.
*/
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', function () {
    // Count-up the spec numbers (Bedrooms/Bathrooms/Floor Area/Year Built)
    // once they scroll into view, preserving any unit suffix (e.g. "m²").
    document.querySelectorAll('.property-specs__item strong').forEach(function (el) {
      var match = el.textContent.match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      var counter = { val: 0 };
      el.textContent = '0' + suffix; // reset to 0 so there's something to count up from

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(counter, {
            val: target,
            duration: 1.3,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(counter.val) + suffix;
            }
          });
        }
      });
    });
  });
})();
