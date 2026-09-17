/*
  Floating Contact Button — expands into Call / WhatsApp options.
  Include this script on every page (see index.html) to render it consistently
  site-wide without duplicating markup per page.

  NEEDS INPUT: confirm which number is WhatsApp-enabled — currently both
  actions use the primary contact number (+233 24 638 1172). Email is a
  placeholder (info@g29propertyconsult.com) pending the real address.
*/
(function () {
  const PHONE_DISPLAY = '+233 24 638 1172';
  const PHONE_TEL = '+233246381172';
  const PHONE_WHATSAPP = '233246381172'; // wa.me format: no plus, no leading zero
  const EMAIL_ADDRESS = 'info@g29propertyconsult.com'; // placeholder — NEEDS INPUT

  const markup = `
    <div class="floating-contact" id="floatingContact">
      <div class="floating-contact__menu" id="floatingContactMenu">
        <a class="floating-contact__action" href="https://wa.me/${PHONE_WHATSAPP}" target="_blank" rel="noopener">
          <span class="floating-contact__icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.42a9.87 9.87 0 0 0 4.63 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.11c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.66-.08.18-.21.76-.89.97-1.19.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.23.57.35.07.13.07.72-.17 1.4z"/>
            </svg>
          </span>
          <span>WhatsApp Us</span>
        </a>
        <a class="floating-contact__action" href="tel:${PHONE_TEL}">
          <span class="floating-contact__icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1.1l-2.2 2.1z"/>
            </svg>
          </span>
          <span>Call ${PHONE_DISPLAY}</span>
        </a>
        <a class="floating-contact__action" href="mailto:${EMAIL_ADDRESS}">
          <span class="floating-contact__icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 6-10 7L2 6"/>
            </svg>
          </span>
          <span>Email Us</span>
        </a>
      </div>
      <button class="floating-contact__toggle" id="floatingContactToggle" aria-label="Contact us" aria-expanded="false" aria-controls="floatingContactMenu">
        <svg class="icon-open" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <svg class="icon-close" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', markup);

    const container = document.getElementById('floatingContact');
    const toggle = document.getElementById('floatingContactToggle');

    toggle.addEventListener('click', () => {
      const isOpen = container.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        container.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
