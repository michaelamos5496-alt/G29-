/*
  Team — minimalist roster. Every person is one line of large type with a
  small round portrait, grouped Leadership / Administration / Facilities
  (the Facility team is shown under their Supervisor).

  Faces are always visible (small round portraits). Mouse devices: hovering
  (or keyboard-focusing) a person floats their full portrait beside their name
  — never on top of it — while the other names fade back.
  Touch / narrow screens: each name is an accordion — tap to open the portrait.

  Members without a `photo` show a monogram (their initials) — add `photo`
  (4:5 portrait) and a small copy in assets/images/team/thumbs/ when provided.
*/
(function () {
  const IMG = 'assets/images/team/';
  const groups = [
    {
      label: 'Leadership',
      members: [
        { name: 'Gynette Koranteng', role: 'Chief Executive Officer', photo: IMG + 'gynette-koranteng-portrait.jpg' },
        { name: 'Samuel Koranteng', role: 'Director', photo: null }
      ]
    },
    {
      label: 'Administration',
      members: [
        { name: 'Michael Ofori', role: 'Accounts and Administration Officer', photo: IMG + 'michael-ofori-portrait.jpg' },
        { name: 'Estherphine Arthur', role: 'Administrative Assistant', photo: IMG + 'estherphine-arthur-portrait.jpg' },
        { name: 'Owuraku Achampong Forkuo-Kyei', role: 'Operations Officer', photo: null },
        { name: 'Gladys Dsane', role: 'Administrator, FD Concepts', photo: null }
      ]
    },
    {
      label: 'Facilities',
      members: [
        { name: 'John Emmanuel Forde', role: 'Facilities Supervisor', photo: IMG + 'john-emmanuel-forde-portrait.jpg' },
        // the rest of the facility team reports to the Supervisor — shown indented beneath
        { name: 'Richmond Odoom', role: 'Facilities Coordinator', photo: IMG + 'richmond-odoom-portrait.jpg', sub: true },
        { name: 'Belinda Konadu Yiadom', role: 'Facility Officer', photo: IMG + 'belinda-yiadom-portrait.jpg', sub: true },
        { name: 'Emmanuel Idi Dowuona', role: 'Facility Officer', photo: IMG + 'emmanuel-idi-dowuona-portrait.jpg', sub: true },
        { name: 'Isaac Lamptey', role: 'Facility Officer', photo: IMG + 'isaac-lamptey-portrait.jpg', sub: true },
        { name: 'Patrick Sampson', role: 'General Services and Facility Officer', photo: IMG + 'patrick-sampson-portrait.jpg', sub: true },
        { name: 'Kobena Essandoh Coleman', role: 'Facility Assistant', photo: IMG + 'kobena-coleman-portrait.jpg', sub: true }
      ]
    }
  ];

  const root = document.getElementById('roster');
  if (!root) return;

  const pad = (n) => String(n).padStart(2, '0');
  const initials = (m) => { const p = m.name.split(' '); return (p[0][0] + p[p.length - 1][0]).toUpperCase(); };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const thumb = (p) => p.replace('/team/', '/team/thumbs/');

  const people = [];
  let n = 0;
  root.innerHTML = groups.map((g, gi) => `
    <section class="roster__group" aria-label="${g.label}">
      <header class="roster__label" data-reveal="fade-up">
        <span><b>${pad(gi + 1)}</b>${g.label}</span>
        <span>${pad(g.members.length)} ${g.members.length === 1 ? 'person' : 'people'}</span>
      </header>
      <ul class="roster__list">
        ${g.members.map((m) => {
          const i = n++;
          people.push(m);
          const avatar = m.photo
            ? `<span class="roster__avatar"><img src="${thumb(m.photo)}" alt="" width="220" height="275" decoding="async"></span>`
            : `<span class="roster__avatar roster__avatar--mono" aria-hidden="true">${initials(m)}</span>`;
          const fig = m.photo
            ? `<img src="${m.photo}" alt="${esc(m.name)}" width="720" height="900" loading="lazy" decoding="async">`
            : `<span class="roster__mono" aria-hidden="true">${initials(m)}</span>`;
          const cls = 'roster__item' + (gi === 0 ? ' roster__item--lead' : '') + (m.sub ? ' roster__item--sub' : '') + (m.name.length > 24 ? ' roster__item--long' : '');
          return `
        <li class="${cls}" data-i="${i}" data-reveal="fade-up" data-reveal-group="roster">
          <button type="button" class="roster__row" aria-expanded="false" aria-controls="roster-panel-${i}">
            <span class="roster__no">${pad(i + 1)}</span>
            ${m.sub ? '<span class="roster__tree" aria-hidden="true"></span>' : ''}
            ${avatar}
            <span class="roster__name"><span class="roster__name-t">${esc(m.name)}</span></span>
            <span class="roster__role">${esc(m.role)}</span>
            <span class="roster__icon" aria-hidden="true"></span>
          </button>
          <div class="roster__panel" id="roster-panel-${i}">
            <div class="roster__panel-inner"><figure class="roster__fig">${fig}</figure></div>
          </div>
        </li>`;
        }).join('')}
      </ul>
    </section>`).join('');

  // The floating portrait lives on <body>, outside the smooth-scroll layer: `position: fixed` inside a
  // transformed ancestor would be measured from that ancestor instead of the screen.
  document.body.insertAdjacentHTML('beforeend', `
    <div class="roster__float" id="rosterFloat" aria-hidden="true">
      <div class="roster__float-card">
        <img alt="" width="720" height="900">
        <span class="roster__mono"></span>
        <div class="roster__float-cap"><b></b><i></i></div>
      </div>
    </div>`);

  const countEl = document.getElementById('teamCount');
  if (countEl) countEl.textContent = String(people.length);

  const items = Array.from(root.querySelectorAll('.roster__item'));
  const floatEl = document.getElementById('rosterFloat');
  const card = floatEl.querySelector('.roster__float-card');
  const fImg = floatEl.querySelector('img');
  const fMono = floatEl.querySelector('.roster__mono');
  const fName = floatEl.querySelector('.roster__float-cap b');
  const fRole = floatEl.querySelector('.roster__float-cap i');

  const touchMode = () => window.matchMedia('(hover: none), (max-width: 820px)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Touch / narrow: accordion ---------- */
  items.forEach((li) => {
    const btn = li.querySelector('.roster__row');
    btn.addEventListener('click', () => {
      if (!touchMode()) return;
      const open = !li.classList.contains('is-open');
      items.forEach((o) => { o.classList.remove('is-open'); o.querySelector('.roster__row').setAttribute('aria-expanded', 'false'); });
      if (open) { li.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Mouse: floating portrait, placed beside the name (never over it) ---------- */
  let active = -1;
  let tx = 0, ty = 0, x = 0, y = 0, rot = 0, raf = 0, placed = false, anchorX = 0;
  const W = () => card.offsetWidth || 240;
  const H = () => card.offsetHeight || 300;

  // Where the active person's name ends (plus the 20px it slides on hover).
  function measureAnchor(li) {
    const t = li.querySelector('.roster__name-t');
    anchorX = t ? t.getBoundingClientRect().right + 20 : 0;
  }
  function aim(clientY) {
    const w = W(), h = H();
    tx = Math.min(Math.max(16, anchorX + 44), window.innerWidth - w - 16);   // right of the name; tucks back in on narrow desktops
    ty = Math.min(Math.max(88, clientY - h / 2), window.innerHeight - h - 16);
    if (!placed || reduce) { x = tx; y = ty; placed = true; }
  }

  function show(i) {
    if (touchMode()) return;
    const m = people[i];
    active = i;
    items.forEach((li, k) => li.classList.toggle('is-active', k === i));
    root.classList.add('is-hovering');
    if (m.photo) { fImg.src = m.photo; fImg.style.display = 'block'; fMono.style.display = 'none'; }
    else { fImg.removeAttribute('src'); fImg.style.display = 'none'; fMono.style.display = 'grid'; fMono.textContent = initials(m); }
    fName.textContent = m.name;
    fRole.textContent = m.role;
    floatEl.classList.add('is-on');
    if (!raf) loop();
  }
  function hide() {
    active = -1;
    items.forEach((li) => li.classList.remove('is-active'));
    root.classList.remove('is-hovering');
    floatEl.classList.remove('is-on');
  }
  function loop() {
    const px = x;
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    const vy = y - (loop.py || y); loop.py = y;
    rot += ((Math.max(-5, Math.min(5, vy * 0.35))) - rot) * 0.18;     // leans slightly as it follows the cursor up and down
    floatEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${reduce ? 0 : rot.toFixed(2)}deg)`;
    raf = floatEl.classList.contains('is-on') || Math.abs(tx - x) > 0.4 ? requestAnimationFrame(loop) : 0;
  }

  items.forEach((li, i) => {
    li.addEventListener('pointerenter', (e) => { if (e.pointerType === 'touch') return; measureAnchor(li); aim(e.clientY); show(i); });
    li.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') aim(e.clientY); });
    li.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') hide(); });
    // keyboard: show the portrait beside the focused row
    li.querySelector('.roster__row').addEventListener('focus', () => {
      if (touchMode()) return;
      const r = li.getBoundingClientRect();
      measureAnchor(li); aim(r.top + r.height / 2); show(i);
    });
    li.querySelector('.roster__row').addEventListener('blur', hide);
  });
  window.addEventListener('scroll', () => { if (active > -1 && !raf) loop(); }, { passive: true });

  // warm the full portraits on first approach so the card never waits on the network
  let warmed = false;
  root.addEventListener('pointerenter', () => {
    if (warmed || touchMode()) return; warmed = true;
    people.forEach((m) => { if (m.photo) { const im = new Image(); im.src = m.photo; } });
  }, { once: true });

  if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(root);
})();
