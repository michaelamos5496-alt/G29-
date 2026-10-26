/*
  Contact — full-bleed map behind the contact card (Leaflet + OpenStreetMap
  tiles, inverted and tinted to the brand teal in style.css), plus the
  contact form.

  The map is only created once the section is within ~1 viewport of the
  screen, then "flies in" from a city-wide view to the office the first
  time it's actually on screen. It's a backdrop, not a map app: scroll-wheel
  zoom is off everywhere and one-finger dragging is off on touch so it never
  hijacks page scrolling (the "Get directions" chip hands off to Google Maps).

  The office pin is placed off-centre so the card never covers it: right of
  centre beside the card on desktop, in the band above the card on
  mobile/tablet (must match the 1024px breakpoint in style.css).

  The form opens WhatsApp with the message pre-filled, same as the
  property page's Request Viewing form (see property-detail.js).
*/
(function () {
  // Acacia Court, King Hassan Road, Osu (OpenStreetMap node 6051355022).
  const OFFICE = [5.56121, -0.19308];
  const PHONE_WHATSAPP = '233246381172'; // wa.me format: no plus, no leading zero

  const sectionEl = document.getElementById('contact');
  const mapEl = document.getElementById('contactMap');
  const formEl = document.getElementById('contactForm');

  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(formEl);
      const lines = [
        `Hello G29, my name is ${data.get('name')}.`,
        '',
        String(data.get('message')),
        '',
        `Email: ${data.get('email')}`
      ];
      window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
  }

  if (!mapEl || typeof L === 'undefined') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactMq = window.matchMedia('(max-width: 1024px)');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const ZOOM = 15;

  let map = null;
  let flown = false;

  // Pixel offset that moves the office from the map's centre to where it
  // should sit on screen.
  function pinOffset() {
    const w = mapEl.clientWidth;
    const h = mapEl.clientHeight;
    if (compactMq.matches) {
      // Pin in the middle of the band above the card (padding-top in
      // style.css is max(46svh, 340px)).
      const band = Math.max(window.innerHeight * 0.46, 340);
      return [0, h * 0.5 - band * 0.5];
    }
    return [-(w * 0.68 - w * 0.5), 0];
  }

  function centreFor(zoom) {
    const [dx, dy] = pinOffset();
    const point = map.project(OFFICE, zoom).add([dx, dy]);
    return map.unproject(point, zoom);
  }

  function createMap() {
    map = L.map(mapEl, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: !isTouch,
      tap: false,
      keyboard: false,
      zoomSnap: 0.25
    });

    // Standard OSM tiles (no API key); style.css inverts and tints them.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(OFFICE, {
      keyboard: false,
      icon: L.divIcon({
        className: 'contact-pin',
        iconSize: [0, 0],
        html: `
          <span class="contact-pin__pulse"></span>
          <span class="contact-pin__pulse contact-pin__pulse--late"></span>
          <span class="contact-pin__dot"><img src="assets/images/g29-icon.png" alt=""></span>
          <span class="contact-pin__label"><strong>G29 Property Consult</strong>Acacia Court, Osu</span>
        `
      })
    }).addTo(map);

    // Start city-wide; flyIn() zooms to the office once it's on screen.
    const startZoom = reducedMotion ? ZOOM : 12;
    map.setView(OFFICE, startZoom, { animate: false });
    map.setView(centreFor(startZoom), startZoom, { animate: false });
    if (reducedMotion) flown = true;

    window.addEventListener('resize', () => {
      map.invalidateSize();
      if (flown) map.setView(centreFor(map.getZoom()), map.getZoom(), { animate: false });
    });
  }

  function flyIn() {
    flown = true;
    map.flyTo(centreFor(ZOOM), ZOOM, { duration: 2.4, easeLinearity: 0.2 });
  }

  // ScrollTrigger when available: it reads ScrollSmoother's real position
  // on desktop, where plain window scroll events fire before the smoothed
  // content has actually moved.
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top bottom+=100%',
      once: true,
      onEnter: () => { if (!map) createMap(); }
    });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        if (!map) createMap();
        if (!flown) flyIn();
      }
    });
    return;
  }

  // Fallback: plain scroll/rect checks (see lazy-bg.js for why not IO).
  function check() {
    const r = sectionEl.getBoundingClientRect();
    const vh = window.innerHeight;
    if (!map && r.top < vh * 2 && r.bottom > -vh) createMap();
    if (map && !flown && r.top < vh * 0.6 && r.bottom > vh * 0.3) flyIn();
    if (map && flown) window.removeEventListener('scroll', check);
  }

  window.addEventListener('scroll', check, { passive: true });
  check();
})();
