/*
  Property matcher pop-up + launcher — included on every page except
  find-property.html.

  - 5 seconds after load the matcher opens as a dialog (once per browser
    session; later pages skip straight to the launcher).
  - Closing it shrinks the dialog into a floating "Find my property"
    launcher that takes the floating contact button's spot (the contact
    button moves up above it). Clicking the launcher re-opens the dialog.
  - The matcher itself (assets/js/property-finder.js) and the listing data
    are loaded the first time the dialog opens, so pages stay light.
*/
(function () {
  if (document.getElementById('finderRoot')) return; // the matcher page itself

  const DELAY = 5000;
  const SEEN_KEY = 'g29FinderSeen';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get() { try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; } },
    set() { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ } }
  };

  const spark = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M12 14l.9 2 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none"/></svg>';

  const markup = `
    <button type="button" class="finder-launcher" id="finderLauncher" aria-label="Find my property" hidden>
      ${spark}<span>Find my property</span>
    </button>
    <div class="finder-pop" id="finderPop" hidden>
      <div class="finder-pop__backdrop" data-close></div>
      <div class="finder-pop__dialog" role="dialog" aria-modal="true" aria-label="G29 Property Matcher" tabindex="-1">
        <button type="button" class="finder-pop__close" data-close aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div class="finder-pop__body">
          <div class="finder__card finder-pop__card" id="finderPopRoot" aria-live="polite"><p class="finder__hint">Loading&hellip;</p></div>
        </div>
      </div>
    </div>`;

  let launcher, pop, dialog, mounted = false, loading = null, autoTimer = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = reject;
      document.body.appendChild(el);
    });
  }

  function ensureMatcher() {
    if (mounted) return Promise.resolve();
    if (loading) return loading;
    loading = (async () => {
      if (!window.G29_PROPERTIES) await loadScript('assets/js/properties-data.js');
      if (!window.G29_mountFinder) await loadScript('assets/js/property-finder.js');
      window.G29_mountFinder(document.getElementById('finderPopRoot'), { popup: true, intro: true, onClose: close });
      mounted = true;
    })().catch(() => {
      document.getElementById('finderPopRoot').innerHTML = '<p class="finder__hint">Sorry, the matcher could not load. <a href="find-property.html">Open it on its own page</a>.</p>';
    });
    return loading;
  }

  function open() {
    clearTimeout(autoTimer);
    store.set();
    launcher.hidden = true;
    pop.hidden = false;
    document.documentElement.classList.add('finder-open');
    ensureMatcher();

    // Grow out of the launcher if it's on screen, otherwise fade/scale in.
    const from = launcher.getBoundingClientRect();
    requestAnimationFrame(() => {
      const to = dialog.getBoundingClientRect();
      if (!reduce && from.width) {
        const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
        const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
        dialog.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0 },
          { transform: 'none', opacity: 1 }
        ], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      } else if (!reduce) {
        dialog.animate([{ transform: 'translateY(24px) scale(0.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'ease-out' });
      }
      pop.querySelector('.finder-pop__backdrop').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      dialog.focus({ preventScroll: true });
    });
  }

  function close() {
    if (pop.hidden) return;
    store.set();
    document.documentElement.classList.remove('finder-open');
    // Show the launcher first so we can measure where to shrink to.
    launcher.hidden = false;
    document.body.classList.add('has-finder-launcher');
    const to = launcher.getBoundingClientRect();
    const from = dialog.getBoundingClientRect();

    const finish = () => {
      pop.hidden = true;
      if (!reduce) launcher.animate([{ transform: 'scale(0.6)', opacity: 0.4 }, { transform: 'scale(1.08)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 360, easing: 'ease-out' });
      launcher.focus({ preventScroll: true });
    };

    if (reduce) { finish(); return; }
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    pop.querySelector('.finder-pop__backdrop').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, fill: 'forwards' });
    const anim = dialog.animate([
      { transform: 'none', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.2 }
    ], { duration: 460, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' });
    launcher.style.visibility = 'hidden';
    anim.onfinish = () => { launcher.style.visibility = ''; finish(); };
  }


  // ---- Draggable launcher (phones) — like iOS AssistiveTouch -----------
  // Drag it anywhere; on release it glides to the nearest screen edge and
  // remembers its spot. A tap (no real movement) still opens the matcher.
  function makeLauncherDraggable() {
    const mq = window.matchMedia('(max-width: 640px)');
    const KEY = 'g29FinderLauncherPos';
    const SIZE = 56, EDGE = 12, TOP_MIN = 76; // keep clear of the nav bar
    let pos = null, drag = null, suppressClick = false;
    try { pos = JSON.parse(localStorage.getItem(KEY)); } catch (e) { pos = null; }

    const clampY = (y) => Math.max(TOP_MIN, Math.min(window.innerHeight - SIZE - EDGE - 8, y));
    const clearPos = () => { ['left', 'top', 'right', 'bottom'].forEach((k) => launcher.style.removeProperty(k)); };
    function applyPos() {
      if (!mq.matches || !pos) { clearPos(); return; }
      launcher.style.right = 'auto';
      launcher.style.bottom = 'auto';
      launcher.style.top = clampY(pos.y * window.innerHeight) + 'px';
      launcher.style.left = (pos.side === 'left' ? EDGE : window.innerWidth - SIZE - EDGE) + 'px';
    }

    // Registered before the open() click handler so a drag-release never opens it.
    launcher.addEventListener('click', (e) => {
      if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopImmediatePropagation(); }
    });

    launcher.addEventListener('pointerdown', (e) => {
      if (!mq.matches || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const r = launcher.getBoundingClientRect();
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false };
    });
    launcher.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < 8) return;
        drag.moved = true;
        try { launcher.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        launcher.classList.add('is-dragging');
        launcher.style.right = 'auto';
        launcher.style.bottom = 'auto';
      }
      const x = Math.max(EDGE, Math.min(window.innerWidth - SIZE - EDGE, drag.ox + dx));
      launcher.style.left = x + 'px';
      launcher.style.top = clampY(drag.oy + dy) + 'px';
      e.preventDefault();
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const wasMoved = drag.moved;
      drag = null;
      if (!wasMoved) return;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 350);
      const r = launcher.getBoundingClientRect();
      pos = { side: r.left + SIZE / 2 < window.innerWidth / 2 ? 'left' : 'right', y: clampY(r.top) / window.innerHeight };
      try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch (err) { /* ignore */ }
      launcher.classList.remove('is-dragging');
      applyPos(); // CSS transition glides it to the edge
    }
    launcher.addEventListener('pointerup', endDrag);
    launcher.addEventListener('pointercancel', endDrag);

    window.addEventListener('resize', applyPos);
    if (mq.addEventListener) mq.addEventListener('change', applyPos);
    applyPos();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', markup);
    launcher = document.getElementById('finderLauncher');
    pop = document.getElementById('finderPop');
    dialog = pop.querySelector('.finder-pop__dialog');

    // The page's smooth-scroll layer listens for wheel/touch on the document
    // and would swallow them; keep them local to the dialog's own scroller.
    const scroller = pop.querySelector('.finder-pop__body');
    scroller.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
    // Wheel is scrolled by hand so it works even when a page-level
    // smooth-scroll handler is calling preventDefault on wheel events.
    scroller.addEventListener('wheel', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : (e.deltaMode === 2 ? scroller.clientHeight : 1);
      scroller.scrollTop += e.deltaY * unit;
    }, { passive: false });

    makeLauncherDraggable();
    launcher.addEventListener('click', open);
    pop.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) close(); });

    // Homepage: pops up on every visit/reload. Other pages: only if the
    // visitor hasn't already opened or closed it this session. Either way
    // `?finder=1` forces it (handy for testing).
    const isHome = /(^|\/)(index\.html)?$/.test(window.location.pathname);
    const forced = /[?&]finder=1\b/.test(window.location.search);
    if (forced || isHome || !store.get()) {
      autoTimer = setTimeout(open, DELAY);
      if (store.get()) { launcher.hidden = false; document.body.classList.add('has-finder-launcher'); }
    } else {
      launcher.hidden = false;
      document.body.classList.add('has-finder-launcher');
    }
  });
})();
