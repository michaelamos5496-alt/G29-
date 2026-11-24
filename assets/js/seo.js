/*
  SEO helper for the JS-rendered pages (listing, service and category pages).
  Sets the title, description, canonical URL, social-share tags and JSON-LD
  structured data once the page knows which listing/service it is showing.
*/
(function () {
  var BASE = 'https://g29.vercel.app/';
  var NAME = 'G29 Property Consults';

  function meta(attr, key, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  }
  function abs(p) { return /^https?:/.test(p) ? p : BASE + p.replace(/^\//, ''); }

  window.G29_SEO = {
    BASE: BASE,
    set: function (o) {
      if (o.title) {
        document.title = o.title;
        meta('property', 'og:title', o.title);
        meta('name', 'twitter:title', o.title);
      }
      if (o.description) {
        meta('name', 'description', o.description);
        meta('property', 'og:description', o.description);
        meta('name', 'twitter:description', o.description);
      }
      if (o.path) {
        var link = document.head.querySelector('link[rel="canonical"]');
        if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
        link.href = abs(o.path);
        meta('property', 'og:url', abs(o.path));
      }
      if (o.image) {
        meta('property', 'og:image', abs(o.image));
        meta('name', 'twitter:image', abs(o.image));
      }
      if (o.jsonld) {
        var s = document.getElementById('seo-jsonld');
        if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'seo-jsonld'; document.head.appendChild(s); }
        s.textContent = JSON.stringify(o.jsonld);
      }
    },
    org: { '@type': 'RealEstateAgent', '@id': BASE + '#business', name: NAME, url: BASE }
  };
})();
