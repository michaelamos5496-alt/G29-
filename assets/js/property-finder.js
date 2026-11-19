/*
  Property matcher — asks a handful of questions, then scores every
  available listing in window.G29_PROPERTIES against the answers and shows
  the best three with a "why this fits" line. No backend and no AI service:
  it's a transparent scoring pass that runs in the browser, so it can only
  ever recommend real listings.

  NOTE: rent prices in the listing data are treated as monthly (Vida Villa
  is per day) — NEEDS INPUT: confirm the rent period with G29.
*/
(function () {
  // Mounts the matcher into `root`. Used by find-property.html (#finderRoot)
  // and by the pop-up (assets/js/finder-popup.js) via window.G29_mountFinder.
  function mount(root, opts) {
  opts = opts || {};
  const all = window.G29_PROPERTIES || [];
  if (!root || !all.length) return;

  const WHATSAPP = '233549933727';
  const listings = all.filter((p) => p.availability === 'Available now');

  // ---- listing helpers -------------------------------------------------
  const shortArea = (sub) => sub.replace(/,\s*(Accra|Eastern Region)$/, '');
  const nums = (s) => (s.match(/[\d,]+(?:\.\d+)?/g) || []).map((n) => parseFloat(n.replace(/,/g, '')));
  const range = (label, fallback) => {
    const found = nums(String(label || fallback).replace(/Studio/i, '0'));
    return found.length ? [Math.min(...found), Math.max(...found)] : [fallback, fallback];
  };
  const bedRange = (p) => range(p.bedsLabel, p.beds);
  const bathRange = (p) => range(p.bathsLabel, p.baths);

  function priceInfo(p) {
    const label = p.priceLabel || '';
    if (/application|n\/a/i.test(label)) return { min: null, max: null, daily: false };
    const v = nums(label);
    return { min: v[0], max: v[v.length - 1], daily: /per day/i.test(label) };
  }

  // Every question below is built from the listings' own Details and
  // Features, so the choices on offer are always things that actually
  // differ between the properties currently available.
  const detailsOf = (p) => {
    const out = {};
    (p.details || []).forEach((d) => { const i = d.indexOf(': '); if (i > 0) out[d.slice(0, i)] = d.slice(i + 2); });
    return out;
  };

  // Collapse near-duplicate feature wording into one choice.
  function normFeature(a) {
    if (/pool/i.test(a)) return 'Swimming pool';
    if (/hob|burner|stove/i.test(a)) return 'Electric hob / burner';
    if (/smart tv/i.test(a)) return 'Smart TV';
    if (/walk-in|wardrobe/i.test(a)) return 'Walk-in closets';
    if (/^closets?$/i.test(a)) return 'Closets';
    if (/clubhouse|bar/i.test(a)) return 'Clubhouse / bar';
    if (/fire (alarm|fighting)/i.test(a)) return 'Fire safety system';
    if (/^balcony/i.test(a)) return null; // asked via the Details question instead
    return a;
  }
  const featuresOf = (p) => new Set((p.amenities || []).map(normFeature).filter(Boolean));

  // Detail labels that are answered elsewhere or aren't a preference.
  const SKIP_DETAILS = ['Type', 'Lease term', 'Stay', 'Stories'];
  const DETAIL_Q = {
    'Furnishing': 'Furnished or unfurnished?',
    'View': 'What kind of view would you like?',
    'Balcony / patio': 'Do you want a balcony or patio?',
    'Parking': 'Do you need parking?',
    'Parking Area': 'Do you need parking?'
  };
  const detailTokens = (label, value) => (label === 'Furnishing'
    ? value.split(/\s+and\s+/i).map((t) => t.trim().replace(/^./, (c) => c.toUpperCase()))
    : [value]);

  const quantile = (arr, q) => arr[Math.min(arr.length - 1, Math.floor(q * arr.length))];

  // Does this listing fit the requested purpose (rent / buy / short stay)?
  function fitsPurpose(p) {
    const daily = priceInfo(p).daily;
    if (answers.purpose === 'Stay') return (p.purpose || []).includes('Rent') && daily;
    if (answers.purpose === 'Rent') return (p.purpose || []).includes('Rent') && !daily;
    if (answers.purpose === 'Buy') return (p.purpose || []).includes('Buy');
    return true;
  }

  // ---- questions (rebuilt from the current pool each time) -----------------
  const answers = {};
  let stepIndex = 0;
  const anyOpt = { v: 'Any', label: 'No preference' };

  function buildSteps() {
    const pool = listings.filter(fitsPurpose);
    const steps = [];

    // Purpose: only the kinds of listing that actually exist.
    const rent = listings.filter((p) => (p.purpose || []).includes('Rent') && !priceInfo(p).daily);
    const buy = listings.filter((p) => (p.purpose || []).includes('Buy'));
    const stay = listings.filter((p) => priceInfo(p).daily);
    const purposeOpts = [];
    if (rent.length) purposeOpts.push({ v: 'Rent', label: 'To rent', sub: detailsOf(rent[0])['Lease term'] ? 'Lease term: ' + detailsOf(rent[0])['Lease term'] : 'Long-term lease' });
    if (buy.length) purposeOpts.push({ v: 'Buy', label: 'To buy', sub: 'Purchase a property' });
    if (stay.length) purposeOpts.push({ v: 'Stay', label: 'Short stay', sub: detailsOf(stay[0])['Stay'] ? 'Stay: ' + detailsOf(stay[0])['Stay'] : 'A few days away' });
    steps.push({ id: 'purpose', q: 'What are you looking for?', type: 'single', opts: purposeOpts, summ: (v) => ({ Rent: 'To rent', Buy: 'To buy', Stay: 'Short stay' }[v]) });

    // Area
    const areaCount = {};
    pool.forEach((p) => { areaCount[p.subtitle] = (areaCount[p.subtitle] || 0) + 1; });
    steps.push({ id: 'area', q: 'Where would you like to be?', hint: 'Pick as many areas as you like.', type: 'multi', anyLabel: 'Anywhere',
      opts: Object.keys(areaCount).map((a) => ({ v: a, label: shortArea(a), sub: areaCount[a] + ' available' })),
      summ: (v) => (v && v.length ? v.map(shortArea).join(' / ') : 'Anywhere') });

    // Bedrooms: every count some available listing offers.
    const bedSet = new Set();
    pool.forEach((p) => { const [lo, hi] = bedRange(p); for (let n = Math.ceil(lo); n <= Math.floor(hi); n += 1) bedSet.add(n); });
    steps.push({ id: 'beds', q: 'How many bedrooms do you need?', type: 'single',
      opts: [...bedSet].sort((a, b) => a - b).map((n) => ({ v: n, label: n === 0 ? 'Studio' : String(n) })),
      summ: (v) => (v === 0 ? 'Studio' : v + ' bedroom' + (v === 1 ? '' : 's')) });

    // Bathrooms: "at least", up to what the listings offer.
    const maxBath = Math.max(0, ...pool.map((p) => Math.floor(bathRange(p)[1])));
    const bathOpts = [];
    for (let n = 1; n <= maxBath; n += 1) if (pool.some((p) => bathRange(p)[1] >= n)) bathOpts.push({ v: n, label: n + ' +' });
    steps.push({ id: 'baths', q: 'How many bathrooms do you need?', hint: 'At least this many.', type: 'single', opts: bathOpts,
      summ: (v) => v + '+ bathrooms' });

    // Budget: buckets cut from the real price spread (monthly rent only).
    if (answers.purpose === 'Rent') {
      const prices = [];
      pool.forEach((p) => { const i = priceInfo(p); if (i.min != null) { prices.push(i.min, i.max); } });
      prices.sort((a, b) => a - b);
      const cuts = [...new Set([0.2, 0.4, 0.6, 0.8].map((q) => Math.round(quantile(prices, q) / 250) * 250))].filter((c) => c > 0);
      const top = prices[prices.length - 1] || 0;
      const fmt = (n) => '$' + n.toLocaleString('en-US');
      const budgetOpts = [];
      if (cuts.length >= 2) {
        budgetOpts.push({ v: cuts[0], label: 'Under ' + fmt(cuts[0]) });
        for (let i = 0; i < cuts.length - 1; i += 1) budgetOpts.push({ v: cuts[i + 1], label: fmt(cuts[i]) + ' – ' + fmt(cuts[i + 1]) });
        budgetOpts.push({ v: Math.max(top, cuts[cuts.length - 1]), label: fmt(cuts[cuts.length - 1]) + ' +' });
        budgetOpts.push({ v: 0, label: 'Flexible' });
      }
      steps.push({ id: 'budget', q: 'What is your monthly budget?', hint: 'In US dollars, based on current rents.', type: 'single', opts: budgetOpts,
        summ: (v) => (v ? 'Up to $' + v.toLocaleString('en-US') + '/mo' : 'Flexible budget') });
    }

    // Property type: only the kinds present.
    const cats = [...new Set(pool.map((p) => p.category))];
    steps.push({ id: 'type', q: 'What kind of home?', type: 'single', needs: 2,
      opts: cats.length >= 2 ? cats.map((c) => ({ v: c, label: c })).concat([anyOpt]) : [],
      summ: (v) => (v === 'Any' ? null : v) });

    // One question per Detail that differs between the listings.
    const byLabel = {};
    pool.forEach((p) => {
      const d = detailsOf(p);
      Object.keys(d).forEach((label) => {
        if (SKIP_DETAILS.includes(label)) return;
        (byLabel[label] = byLabel[label] || new Set());
        detailTokens(label, d[label]).forEach((t) => byLabel[label].add(t));
      });
    });
    Object.keys(byLabel).forEach((label) => {
      let toks = [...byLabel[label]];
      if (toks.length < 2) return;
      const yesNo = toks.length === 2 && toks.includes('Yes') && toks.includes('No');
      if (yesNo) toks = ['Yes'];
      steps.push({ id: 'd:' + label, detail: label, yesNo, q: DETAIL_Q[label] || (label + '?'), type: 'single',
        opts: toks.map((t) => ({ v: t, label: yesNo ? 'Yes, please' : t })).concat([anyOpt]),
        summ: (v) => (v === 'Any' ? null : (yesNo ? label : v + (label === 'Furnishing' ? '' : ''))) });
    });

    // Features that only some of the listings have.
    const count = {};
    pool.forEach((p) => featuresOf(p).forEach((f) => { count[f] = (count[f] || 0) + 1; }));
    const featOpts = Object.keys(count).filter((f) => count[f] < pool.length)
      .sort((a, b) => count[b] - count[a] || a.localeCompare(b)).slice(0, 18)
      .map((f) => ({ v: f, label: f }));
    steps.push({ id: 'features', q: 'Anything you must have?', hint: 'Optional — choose any that matter.', type: 'multi', opts: featOpts, minOpts: 1,
      summ: (v) => (v && v.length ? v.join(', ') : null) });

    return steps;
  }

  // Steps with nothing to choose between are skipped automatically.
  function activeSteps() {
    const list = buildSteps().filter((st) => st.opts.length >= (st.minOpts || 2) || st.id === 'purpose');
    const purpose = list.find((st) => st.id === 'purpose');
    if (purpose && purpose.opts.length === 1 && !answers.purpose) answers.purpose = purpose.opts[0].v;
    return list.filter((st) => !(st.id === 'purpose' && st.opts.length < 2));
  }

  // ---- scoring ---------------------------------------------------------------
  function score(p) {
    let pts = 0;
    let max = 0;
    const why = [];
    const warn = [];
    const det = detailsOf(p);

    // Area (25)
    if (answers.area && answers.area.length) {
      max += 25;
      if (answers.area.includes(p.subtitle)) { pts += 25; why.push(`In ${shortArea(p.subtitle)}`); }
      else warn.push(`Not in your chosen area (${shortArea(p.subtitle)})`);
    }

    // Bedrooms (20)
    if (answers.beds != null) {
      max += 20;
      const [lo, hi] = bedRange(p);
      const want = answers.beds;
      const wantLabel = want === 0 ? 'a studio' : want + ' bedroom' + (want === 1 ? '' : 's');
      if (want >= lo && want <= hi) { pts += 20; why.push(`${p.bedsLabel || p.beds} bedroom${hi > 1 ? 's' : ''} available`); }
      else { if (want === lo - 1 || want === hi + 1) pts += 8; warn.push(`${p.bedsLabel || p.beds} bedrooms (you asked for ${wantLabel})`); }
    }

    // Bathrooms (10)
    if (answers.baths != null) {
      max += 10;
      const hi = bathRange(p)[1];
      if (hi >= answers.baths) { pts += 10; why.push(`Up to ${p.bathsLabel ? p.bathsLabel.split(' – ').pop() : p.baths} bathrooms`); }
      else { if (hi >= answers.baths - 1) pts += 4; warn.push(`${p.bathsLabel || p.baths} bathrooms (you wanted ${answers.baths}+)`); }
    }

    // Budget (20) — monthly rent only
    if (answers.purpose === 'Rent' && answers.budget != null) {
      max += 20;
      const info = priceInfo(p);
      const budget = answers.budget;
      if (!budget) { pts += 20; }
      else if (info.min == null) { pts += 10; warn.push('Price on application'); }
      else if (info.max <= budget) { pts += 20; why.push(`Within budget (${p.priceLabel})`); }
      else if (info.min <= budget) { pts += 14; why.push(`Starts within budget (${p.priceLabel})`); }
      else if (info.min <= budget * 1.15) { pts += 6; warn.push(`Slightly above budget (${p.priceLabel})`); }
      else warn.push(`Above budget (${p.priceLabel})`);
    }

    // Type (10)
    if (answers.type && answers.type !== 'Any') {
      max += 10;
      if (p.category === answers.type) { pts += 10; why.push(p.category); }
      else warn.push(`It's ${/^[aeiou]/i.test(p.category) ? 'an' : 'a'} ${p.category.toLowerCase()}`);
    }

    // Details the visitor cared about (8 each)
    Object.keys(answers).filter((k) => k.indexOf('d:') === 0).forEach((k) => {
      const want = answers[k];
      if (!want || want === 'Any') return;
      const label = k.slice(2);
      const value = det[label];
      max += 8;
      const has = value != null && detailTokens(label, value).includes(want);
      if (has) { pts += 8; why.push(label === 'Furnishing' ? `${want} option available` : (want === 'Yes' ? label : value)); }
      else warn.push(want === 'Yes' ? `No ${label.toLowerCase()}` : `${label}: ${value || 'not listed'} (you wanted ${want})`);
    });

    // Must-have features (20 shared)
    const wanted = answers.features || [];
    if (wanted.length) {
      max += 20;
      const mine = featuresOf(p);
      const hit = wanted.filter((f) => mine.has(f));
      pts += Math.round((hit.length / wanted.length) * 20);
      if (hit.length) why.push(hit.join(', '));
      const miss = wanted.filter((f) => !mine.has(f));
      if (miss.length) warn.push(`No ${miss.map((f) => f.toLowerCase()).join(', ')}`);
    }

    return { p, pct: max ? Math.round((pts / max) * 100) : 100, why, warn };
  }

  // Returns { best, alternatives }. `best` are the closest listings of the
  // requested kind; `alternatives` are other AVAILABLE listings that could
  // still work (including ones of a different purpose, clearly labelled).
  function results() {
    const scored = listings.map((p) => {
      const m = score(p);
      if (!fitsPurpose(p)) {
        const label = { Rent: 'Not a long-term rental', Buy: 'Not currently for sale (available to rent)', Stay: 'Not a short-stay property' }[answers.purpose];
        const daily = priceInfo(p).daily;
        m.warn.unshift(daily && answers.purpose === 'Rent' ? 'Priced per night, minimum 1–3 day stay' : label);
        m.pct = Math.max(0, m.pct - 20);
        m.offPurpose = true;
      }
      return m;
    }).sort((a, b) => b.pct - a.pct);

    const inPurpose = scored.filter((m) => !m.offPurpose);
    const exact = inPurpose.filter((m) => !m.warn.length).slice(0, 3);
    const best = exact.length ? exact : inPurpose.filter((m) => m.pct >= 35).slice(0, 3);
    const shown = new Set(best.map((m) => m.p.slug));
    const alternatives = scored.filter((m) => !shown.has(m.p.slug) && m.pct >= 45).slice(0, 3);
    return { best, alternatives, exact: exact.length > 0 };
  }

  // ---- rendering ---------------------------------------------------------------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderIntro() {
    root.innerHTML = `
      <div class="finder-intro">
        <span class="finder-intro__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M12 14l.9 2 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none"/></svg>
        </span>
        <span class="eyebrow">G29 Property Matcher</span>
        <h2 class="finder__q">Let&rsquo;s find the right place for you</h2>
        <p class="finder__hint">Answer a few quick questions about what you&rsquo;re looking for and we&rsquo;ll suggest the best properties to rent or buy &mdash; plus alternatives if nothing fits exactly.</p>
        <ul class="finder-intro__points">
          <li>About a minute</li>
          <li>Only currently available properties</li>
          <li>No sign-up needed</li>
        </ul>
        <div class="finder-intro__actions">
          <button type="button" class="btn btn-primary finder-intro__start">Start matching <span aria-hidden="true">&rarr;</span></button>
          ${opts.onClose ? '<button type="button" class="finder__back finder-intro__later">Maybe later</button>' : ''}
        </div>
      </div>`;
    root.querySelector('.finder-intro__start').addEventListener('click', () => { stepIndex = 0; renderStep(); });
    const later = root.querySelector('.finder-intro__later');
    if (later) later.addEventListener('click', opts.onClose);
  }

  function renderStep() {
    const list = activeSteps();
    const step = list[stepIndex];
    const total = list.length;
    const stepOpts = step.opts;
    const current = answers[step.id];
    const isSelected = (v) => (step.type === 'multi' ? (current || []).includes(v) : current === v);
    const anyOn = step.type === 'multi' && step.anyLabel && (!current || !current.length) && answers['__any:' + step.id];

    root.innerHTML = `
      <div class="finder__progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${stepIndex + 1}">
        <span style="width:${((stepIndex + 1) / total) * 100}%"></span>
      </div>
      <p class="finder__step">Question ${stepIndex + 1} of ${total}</p>
      <h2 class="finder__q">${esc(step.q)}</h2>
      ${step.hint ? `<p class="finder__hint">${esc(step.hint)}</p>` : ''}
      <div class="finder__opts">
        ${step.anyLabel ? `<button type="button" class="finder__opt${anyOn ? ' is-on' : ''}" data-any="1"><strong>${esc(step.anyLabel)}</strong></button>` : ''}
        ${stepOpts.map((o) => `<button type="button" class="finder__opt${isSelected(o.v) ? ' is-on' : ''}" data-v="${esc(o.v)}"><strong>${esc(o.label)}</strong>${o.sub ? `<span>${esc(o.sub)}</span>` : ''}</button>`).join('')}
      </div>
      <div class="finder__nav">
        <button type="button" class="finder__back" ${stepIndex === 0 && !opts.intro ? 'hidden' : ''}>&larr; Back</button>
        ${step.type === 'multi' ? `<button type="button" class="btn btn-primary finder__next">${stepIndex === total - 1 ? 'Show my matches' : 'Next'}</button>` : ''}
      </div>
    `;

    root.querySelectorAll('.finder__opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.any) {
          answers[step.id] = [];
          answers['__any:' + step.id] = true;
          renderStep();
          return;
        }
        const raw = btn.dataset.v;
        const value = stepOpts.find((o) => String(o.v) === raw).v;
        if (step.type === 'multi') {
          const set = new Set(answers[step.id] || []);
          set.has(value) ? set.delete(value) : set.add(value);
          answers[step.id] = [...set];
          answers['__any:' + step.id] = false;
          btn.classList.toggle('is-on');
          const any = root.querySelector('[data-any]');
          if (any) any.classList.remove('is-on');
        } else {
          if (step.id === 'purpose' && answers.purpose !== value) {
            Object.keys(answers).forEach((k) => { delete answers[k]; });
          }
          answers[step.id] = value;
          setTimeout(advance, 180);
        }
      });
    });
    root.querySelector('.finder__back').addEventListener('click', () => { if (stepIndex === 0 && opts.intro) { renderIntro(); return; } stepIndex = Math.max(0, stepIndex - 1); renderStep(); });
    const next = root.querySelector('.finder__next');
    if (next) next.addEventListener('click', () => {
      advance();
    });
  }

  function advance() {
    const list = activeSteps();
    if (stepIndex < list.length - 1) { stepIndex += 1; renderStep(); }
    else renderResults();
  }

  const summary = () => activeSteps().map((st) => {
    const v = answers[st.id];
    if (v == null || (Array.isArray(v) && !v.length && st.id !== 'area')) return null;
    return st.summ ? st.summ(v) : null;
  }).filter(Boolean);

  function whatsappLink(matches, single) {
    const lines = ["Hi G29, I used the property matcher on your website.", '', 'What I\'m looking for:', ...summary().map((b) => '• ' + b), ''];
    lines.push(single ? `I'd like to request a viewing of ${single.title} (${single.location}).` : 'Top matches: ' + matches.map((m) => m.p.title).join(', ') + '. Please help me with next steps.');
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function resultCard(m, i, kind, allShown) {
    const badge = kind === 'alt' ? '<span class="finder-result__best finder-result__best--alt">Alternative</span>' : (i === 0 ? '<span class="finder-result__best">Best match</span>' : '');
    return `
          <article class="finder-result">
            <a class="finder-result__img" href="${window.G29_propertyDetailUrl(m.p.slug)}" style="background-image:url('${m.p.image}')" aria-label="${esc(m.p.title)}">${badge}</a>
            <div class="finder-result__body">
              <div class="finder-result__top">
                <h3>${esc(m.p.title)}</h3>
                <span class="finder-result__pct">${m.pct}% match</span>
              </div>
              <p class="finder-result__loc">&#128205; ${esc(m.p.subtitle)} &middot; ${esc(m.p.priceLabel)} &middot; <span class="finder-result__avail">Available now</span></p>
              ${m.why.length ? `<ul class="finder-result__why">${m.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
              ${m.warn.length ? `<ul class="finder-result__warn">${m.warn.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
              <div class="finder-result__actions">
                <a class="btn btn-primary" href="${window.G29_propertyDetailUrl(m.p.slug)}">View details</a>
                <a class="finder-result__link" href="${whatsappLink(allShown, m.p)}" target="_blank" rel="noopener">Request a viewing</a>
              </div>
            </div>
          </article>`;
  }

  function renderResults() {
    const { best, alternatives, exact } = results();
    const allShown = best.concat(alternatives);
    let heading = 'Here&rsquo;s what we suggest';
    let lead = '';
    if (!best.length) { heading = 'No exact matches right now'; lead = 'Nothing available is for exactly that, but these could work instead.'; }
    else if (!exact) { heading = 'No exact match — here are the closest'; lead = 'Nothing fits every answer, so these are the nearest available options.'; }

    // Phone pop-up: one swipeable row of cards instead of a long scrolling list,
    // so the dialog never needs to scroll vertically.
    const phoneRail = !!opts.popup && window.matchMedia('(max-width: 640px)').matches && allShown.length > 0;
    const railCards = phoneRail
      ? best.map((m, i) => resultCard(m, i, 'best', allShown)).concat(alternatives.map((m, i) => resultCard(m, i, 'alt', allShown)))
      : [];

    root.innerHTML = `
      <p class="finder__step">Your matches</p>
      <h2 class="finder__q">${heading}</h2>
      ${lead ? `<p class="finder__hint">${lead}</p>` : ''}
      <ul class="finder__summary">${summary().map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      ${phoneRail ? `
        <div class="finder__rail" tabindex="0" aria-label="Matching properties — swipe sideways">${railCards.join('')}</div>
        ${railCards.length > 1 ? `<p class="finder__pager"><span data-cur>1</span> of ${railCards.length} &middot; swipe for more</p>` : ''}` : `
      ${best.length ? `<div class="finder__results">${best.map((m, i) => resultCard(m, i, 'best', allShown)).join('')}</div>` : ''}
      ${alternatives.length ? `
        <h3 class="finder__sub">${best.length ? 'Other available options that could also work' : 'Available options that could work'}</h3>
        <div class="finder__results">${alternatives.map((m, i) => resultCard(m, i, 'alt', allShown)).join('')}</div>` : ''}`}
      ${!allShown.length ? `<p class="finder__hint">Tell us what you need and we&rsquo;ll look for something that does.</p>` : ''}
      <div class="finder__nav finder__nav--end">
        <button type="button" class="finder__back finder__restart">&larr; Start over</button>
        <a class="btn btn-primary" href="${whatsappLink(allShown)}" target="_blank" rel="noopener">Talk to an advisor</a>
      </div>
      <p class="finder__note">Suggestions are based on our current available listings. Prices are indicative &mdash; confirm with an advisor.</p>
    `;
    const rail = root.querySelector('.finder__rail');
    const cur = root.querySelector('.finder__pager [data-cur]');
    if (rail && cur) rail.addEventListener('scroll', () => { cur.textContent = String(Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth)) + 1); }, { passive: true });
    root.querySelector('.finder__restart').addEventListener('click', () => {
      Object.keys(answers).forEach((k) => delete answers[k]);
      stepIndex = 0;
      renderStep();
    });
    if (opts.popup) { const body = root.closest('.finder-pop__body'); if (body) body.scrollTo({ top: 0, behavior: 'smooth' }); }
    else root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (opts.intro) renderIntro(); else renderStep();
  }

  window.G29_mountFinder = mount;
  const auto = document.getElementById('finderRoot');
  if (auto) mount(auto);
})();
