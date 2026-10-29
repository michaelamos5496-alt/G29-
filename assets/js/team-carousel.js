/*
  Team — org chart. Renders the team in hierarchy order: the CEO at the
  top, branching into Administration and Facilities, with the Facility
  Officers under the Facility Supervisor. Connector lines are drawn in
  style.css (.team-org).

  Members without an `image` show a monogram of their initials — set
  `image` (square, face-centred) once the real team photos are provided.
  A member with a `photo` (4:5 portrait) gets a full photo card instead,
  with their name and role overlaid on it.
*/
(function () {
  const ceo = { name: 'Gynette Koranteng', title: 'CEO', image: 'assets/images/team/gynette-koranteng.jpg', photo: 'assets/images/team/gynette-koranteng-portrait.jpg' };

  // Each list is in rank order.
  const branches = [
    {
      label: 'Administration',
      members: [
        { name: 'Michael Ofori', title: 'Accounts and Administration Officer', image: null, photo: 'assets/images/team/michael-ofori-portrait.jpg' },
        { name: 'Estherphine Arthur', title: 'Administrative Assistant / Facility Officer', image: null, photo: 'assets/images/team/estherphine-arthur-portrait.jpg' }
      ]
    },
    {
      label: 'Facilities',
      members: [
        { name: 'John Emmanuel Forde', title: 'Facility Supervisor', image: null, photo: 'assets/images/team/john-emmanuel-forde-portrait.jpg' }
      ],
      reports: [
        { name: 'Richmond Odoom', title: 'Facility Coordinator', image: null, photo: 'assets/images/team/richmond-odoom-portrait.jpg' },
        { name: 'Belinda Yiadom', title: 'Facility Officer', image: null, photo: 'assets/images/team/belinda-yiadom-portrait.jpg' },
        { name: 'Emmanuel Idi Dowuona', title: 'Facility Officer', image: null, photo: 'assets/images/team/emmanuel-idi-dowuona-portrait.jpg' },
        { name: 'Isaac Lamptey', title: 'Facility Officer', image: null, photo: 'assets/images/team/isaac-lamptey-portrait.jpg' },
        { name: 'Patrick Sampson', title: 'General Services Officer', image: null, photo: 'assets/images/team/patrick-sampson-portrait.jpg' },
        { name: 'Kobena Coleman', title: 'Facility Assistant', image: null, photo: 'assets/images/team/kobena-coleman-portrait.jpg' }
      ]
    }
  ];

  const chartEl = document.getElementById('teamChart');
  if (!chartEl) return;

  const initials = (m) => {
    const parts = m.name.split(' ');
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  function card(m, modifier) {
    // Portrait photo fills the whole card, name/role overlaid at the bottom.
    if (m.photo) {
      return `
        <article class="org-card org-card--photo${modifier ? ' org-card--' + modifier : ''}" data-bg="${m.photo}" data-reveal="glance" data-reveal-group="team-org" role="img" aria-label="${m.name}, ${m.title}">
          <div class="org-card__text">
            <h3 class="org-card__name">${m.name}</h3>
            <span class="org-card__role">${m.title}</span>
          </div>
        </article>
      `;
    }
    const avatar = m.image
      ? `<span class="org-card__avatar" data-bg="${m.image}" role="img" aria-label="${m.name}"></span>`
      : `<span class="org-card__avatar org-card__avatar--monogram" aria-hidden="true">${initials(m)}</span>`;
    return `
      <article class="org-card${modifier ? ' org-card--' + modifier : ''}" data-reveal="glance" data-reveal-group="team-org">
        ${avatar}
        <div class="org-card__text">
          <h3 class="org-card__name">${m.name}</h3>
          <span class="org-card__role">${m.title}</span>
        </div>
      </article>
    `;
  }

  chartEl.innerHTML = `
    <div class="org-top">${card(ceo, 'lead')}</div>
    <div class="org-branches">
      ${branches.map((b) => `
        <div class="org-branch org-branch--${b.label.toLowerCase()}">
          <span class="org-branch__label">${b.label}</span>
          <div class="org-branch__cards">${b.members.map((m) => card(m)).join('')}</div>
          ${b.reports ? `<div class="org-reports">${b.reports.map((m) => card(m, 'small')).join('')}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  if (window.G29_lazyLoadBg) window.G29_lazyLoadBg(chartEl);
})();
