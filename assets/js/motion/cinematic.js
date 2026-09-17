/*
  Scrub-driven cinematics for everything below the hero.

  The hero/walkthrough owns its own timeline (scroll-video.js) and is
  deliberately untouched here. Everything in this file hangs off
  ScrollTrigger with scrub:true — scroll position *is* the playhead, so
  these read as "the page moving" rather than "things animating at you."
  Ease is 'none' throughout for that reason: with a scrub, an eased curve
  fights the user's scroll instead of tracking it.

  Entrance-style (non-scrub) reveals live in reveal.js. The one utility
  added here, .reveal-up, is the escape hatch for markup that shouldn't
  carry a data-reveal attribute.

  All of it is skipped under prefers-reduced-motion.
*/
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var M = window.G29_MOTION || {
    duration: { cinematic: 0.8 },
    ease: { cinematic: 'power3.out', linear: 'none' },
    reducedMotion: false,
    mobileScale: 1
  };

  if (M.reducedMotion) return;

  /* ----------------------------------------------------------------------
     Manifesto word reveal — the About paragraph brightens word by word.
     stagger:1 is not a one-second delay here: under a scrub, the stagger
     is spread across the trigger's scroll range, so it becomes a strictly
     sequential reveal keyed to how far you've scrolled.
     -------------------------------------------------------------------- */
  function splitWords(root) {
    var words = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function (node) {
      // Split on whitespace but keep it, so the original spacing (and any
      // inline markup like .about__highlight) survives the rewrite.
      var parts = node.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();

      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        var span = document.createElement('span');
        span.className = 'mm-word';
        span.textContent = part;
        frag.appendChild(span);
        words.push(span);
      });

      node.parentNode.replaceChild(frag, node);
    });

    return words;
  }

  function manifesto() {
    var block = document.querySelector('.about__body');
    if (!block) return;

    var words = splitWords(block);
    if (!words.length) return;

    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1,
      stagger: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: block,
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: true
      }
    });
  }

  /* ----------------------------------------------------------------------
     Curtain reveal — the contact backdrop opens from a letterbox slit to
     full bleed as the section arrives.
     -------------------------------------------------------------------- */
  function curtain() {
    var img = document.getElementById('expand-img');
    if (!img) return;

    gsap.set(img, { clipPath: 'inset(38% 0 38% 0)' });
    gsap.to(img, {
      clipPath: 'inset(0% 0 0% 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('section') || img,
        start: 'top bottom',
        end: 'center center',
        scrub: true
      }
    });
  }

  /* ----------------------------------------------------------------------
     Video zoom-out — the About clip starts overscaled and settles to 1:1
     as it crosses the viewport, so the frame breathes with the scroll.
     -------------------------------------------------------------------- */
  function videoZoom() {
    var video = document.getElementById('aboutVideo');
    if (!video) return;

    gsap.fromTo(video,
      { scale: 1.2 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: video.closest('.about__video') || video,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  /* ----------------------------------------------------------------------
     Progress line — a fixed rail whose fill height tracks page scroll,
     plus the (previously static) dot on the properties scrubber track.
     -------------------------------------------------------------------- */
  function progressLine() {
    var fill = document.getElementById('progressFill');
    if (fill) {
      gsap.set(fill, { height: '0%' });
      gsap.to(fill, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }

    var dot = document.querySelector('.property-grid__dot');
    var track = document.querySelector('.property-grid__track');
    if (dot && track) {
      gsap.to(dot, {
        left: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.querySelector('.property-grid-section'),
          start: 'top 70%',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }
  }

  /* ----------------------------------------------------------------------
     Footer wordmark descend — the oversized brand watermark drifts down
     into its clipped frame as the footer comes into view.
     -------------------------------------------------------------------- */
  function footerWordmark() {
    var mark = document.getElementById('wordmark');
    if (!mark) return;

    gsap.from(mark, {
      yPercent: -45,
      ease: 'none',
      scrollTrigger: {
        trigger: mark.parentElement,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }

  /* ----------------------------------------------------------------------
     Generic reveal-up utility — one-shot entrance for anything tagged
     .reveal-up. Deliberately separate from reveal.js's data-reveal system
     so it can be dropped onto markup without touching attributes.
     -------------------------------------------------------------------- */
  function revealUp() {
    gsap.utils.toArray('.reveal-up').forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: 40 * M.mobileScale,
        duration: M.duration.cinematic,
        ease: M.ease.cinematic,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    manifesto();
    curtain();
    videoZoom();
    progressLine();
    footerWordmark();
    revealUp();
    ScrollTrigger.refresh();
  });
})();
