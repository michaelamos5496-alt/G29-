/*
  Walkthrough section timeline — kept separate from the controller logic
  (assets/js/motion/scroll-video.js) so the narrative can be edited
  without touching playback code. Progress ranges are fractions of the
  video's total duration (0-1), not scroll distance.

  `label` drives the 01..05 progress markers; `cta` marks which section
  reveals the "Explore Properties" button. `title`/`description` document
  the narrative beat each range represents (used for the progress markers'
  aria-labels — see below — not rendered as on-screen copy).
*/
window.G29_WALKTHROUGH_SECTIONS = [
  {
    start: 0,
    end: 0.18,
    label: '01',
    title: 'Arrival',
    description: 'A first impression shaped by space and light.'
  },
  {
    start: 0.18,
    end: 0.40,
    label: '02',
    title: 'Living',
    description: 'Open-plan living designed around natural light.'
  },
  {
    start: 0.40,
    end: 0.58,
    label: '03',
    title: 'Kitchen',
    description: 'Contemporary interiors built for everyday living.'
  },
  {
    start: 0.58,
    end: 0.78,
    label: '04',
    title: 'The Suite',
    description: 'A private retreat designed for quiet moments.'
  },
  {
    start: 0.78,
    end: 1.0,
    label: '05',
    title: 'The View',
    description: 'Discover what G29 Property Consult has to offer.',
    cta: true
  }
];
