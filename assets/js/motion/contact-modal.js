/*
  Contact CTA -> modal form. Opens on any [data-contact-trigger] element
  (there can be more than one per page — hero CTA, mobile sticky bar,
  property inquiry buttons, etc.), closes on the close button, backdrop
  click, or Escape. A trigger can carry data-contact-message to prefill the
  modal's message field with context (e.g. which property was clicked).
  Uses a small GSAP entrance (overlay fade, modal scale+fade, no bounce)
  when GSAP is available, falling back to the CSS opacity transition on
  .contact-modal-overlay.is-open otherwise.
*/
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var triggers = document.querySelectorAll('[data-contact-trigger]');
    var overlay = document.getElementById('contactModalOverlay');
    var modal = document.getElementById('contactModal');
    var closeBtn = document.getElementById('contactCloseBtn');
    var messageField = document.getElementById('contactModalMessage');
    if (!triggers.length || !overlay || !modal || !closeBtn) return;

    var hasGsap = typeof gsap !== 'undefined';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lastTrigger = null;

    function open(trigger) {
      lastTrigger = trigger || lastTrigger;

      if (messageField) {
        var prefill = trigger && trigger.dataset ? trigger.dataset.contactMessage : '';
        messageField.value = prefill || '';
      }

      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      if (hasGsap && !reducedMotion) {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.fromTo(modal,
          { opacity: 0, scale: 0.96, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: 0.05 }
        );
      }

      closeBtn.focus();
    }

    function close() {
      if (hasGsap && !reducedMotion) {
        gsap.to(modal, { opacity: 0, scale: 0.96, y: 12, duration: 0.2, ease: 'power2.in' });
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          delay: 0.05,
          onComplete: function () {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
          }
        });
      } else {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      }

      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () { open(trigger); });
    });

    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  });
})();
