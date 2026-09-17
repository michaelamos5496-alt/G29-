/*
  Service detail template — renders a full service page from ?slug=,
  looked up against assets/js/services-data.js. Mirrors property-detail.js.
*/
(function () {
  const services = window.G29_SERVICES || [];
  const root = document.getElementById('serviceDetailRoot');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    root.innerHTML = `
      <div class="container property-not-found">
        <h1>Service not found</h1>
        <p>We couldn't find the service you're looking for.</p>
        <a href="index.html#services" class="btn btn-primary">View Our Services</a>
      </div>
    `;
    return;
  }

  document.title = `${service.name} | G29 Property Consult`;
  const metaDesc = document.getElementById('pageDescription');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${service.name} from G29 Property Consult: ${service.tagline}.`);
  }

  const otherServices = services.filter((s) => s.slug !== service.slug);

  root.innerHTML = `
    <div class="container property-breadcrumb">
      <a href="index.html">Home</a> <span aria-hidden="true">/</span>
      <a href="index.html#services">Services</a> <span aria-hidden="true">/</span>
      <span>${service.name}</span>
    </div>

    <section class="service-hero-banner" data-reveal="scale" style="background-image: url('${service.heroImage}');">
      <div class="container service-hero-banner__content">
        <span class="eyebrow">Services</span>
        <h1>${service.name}</h1>
        <p>${service.tagline}</p>
      </div>
    </section>

    <section class="property-overview container">
      <div class="property-overview__main">
        <div class="property-section" data-reveal="fade-up">
          <h2>Overview</h2>
          ${service.intro.map((p) => `<p>${p}</p>`).join('')}
        </div>

        <div class="property-section" data-reveal="fade-up" data-reveal-group="service-sections">
          <h2>What's Included</h2>
          <ul class="property-amenities">
            ${service.features.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div class="property-section" data-reveal="fade-up" data-reveal-group="service-sections">
          <h2>How It Works</h2>
          <ol class="service-process">
            ${service.process.map((step, i) => `
              <li class="service-process__step">
                <span class="service-process__num">${String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>${step.title}</h3>
                  <p>${step.desc}</p>
                </div>
              </li>
            `).join('')}
          </ol>
        </div>
      </div>

      <aside class="property-inquiry">
        <div class="property-inquiry__card" data-reveal="right">
          <h3>Interested in ${service.name.toLowerCase()}?</h3>
          <p>Speak with a G29 advisor about how we can help.</p>
          <a href="index.html#contact" class="btn btn-primary">Request a Consultation</a>
          <div class="property-inquiry__direct">
            <a href="tel:+233246381172">&#128222; +233 24 638 1172</a>
            <a href="mailto:info@g29propertyconsult.com">&#9993; info@g29propertyconsult.com</a>
          </div>
        </div>
      </aside>
    </section>

    <section class="service-related container" data-reveal="fade-up">
      <h2>Other Services</h2>
      <div class="service-related-links">
        ${otherServices.map((s) => `<a href="service-detail.html?slug=${s.slug}">${s.name} <span aria-hidden="true">&#8594;</span></a>`).join('')}
      </div>
    </section>
  `;
})();
