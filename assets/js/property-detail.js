/*
  Property detail template — renders a full listing page from ?slug=,
  looked up against the shared data in assets/js/properties-data.js.
*/
(function () {
  const properties = window.G29_PROPERTIES || [];
  const root = document.getElementById('propertyDetailRoot');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    root.innerHTML = `
      <div class="container property-not-found">
        <h1>Property not found</h1>
        <p>We couldn't find the listing you're looking for.</p>
        <a href="index.html#properties" class="btn btn-primary">Browse Properties</a>
      </div>
    `;
    return;
  }

  document.title = `${property.title} — ${property.subtitle} | G29 Property Consult`;
  const metaDesc = document.getElementById('pageDescription');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${property.title} in ${property.subtitle}. Available through G29 Property Consult.`);
  }

  const gallery = property.gallery && property.gallery.length ? property.gallery : [property.image];

  root.innerHTML = `
    <div class="container property-breadcrumb">
      <a href="index.html">Home</a> <span aria-hidden="true">/</span>
      <a href="index.html#properties">Properties</a> <span aria-hidden="true">/</span>
      <span>${property.title}</span>
    </div>

    <section class="property-gallery container" aria-label="Property photos">
      <div class="property-gallery__main" id="galleryMain" data-reveal="scale" style="background-image: url('${gallery[0]}');"></div>
      <div class="property-gallery__thumbs" id="galleryThumbs">
        ${gallery.map((img, i) => `
          <button type="button" class="property-gallery__thumb${i === 0 ? ' is-active' : ''}" data-image="${img}" style="background-image: url('${img}');" aria-label="Photo ${i + 1}"></button>
        `).join('')}
      </div>
    </section>

    <section class="property-overview container">
      <div class="property-overview__main">
        <div class="property-overview__head">
          <div data-reveal="fade-up">
            <span class="tag-pill">${property.category}</span>
            <span class="tag-pill">${property.status}</span>
            <h1>${property.title}</h1>
            <p class="property-overview__location">&#128205; ${property.location}</p>
          </div>
          <div class="property-overview__price">${property.priceLabel || 'Price on Application'}</div>
        </div>

        <div class="property-specs" data-reveal="fade-up">
          <div class="property-specs__item"><strong>${property.beds}</strong><span>${property.category === 'Commercial' ? 'Office Units' : 'Bedrooms'}</span></div>
          <div class="property-specs__item"><strong>${property.baths}</strong><span>${property.category === 'Commercial' ? 'Restrooms' : 'Bathrooms'}</span></div>
          <div class="property-specs__item"><strong>${property.floorArea}</strong><span>Floor Area</span></div>
          <div class="property-specs__item"><strong>${property.yearBuilt}</strong><span>Year Built</span></div>
        </div>

        <div class="property-section" data-reveal="fade-up" data-reveal-group="property-sections">
          <h2>About this property</h2>
          ${property.description.map((p) => `<p>${p}</p>`).join('')}
        </div>

        <div class="property-section" data-reveal="fade-up" data-reveal-group="property-sections">
          <h2>Amenities</h2>
          <ul class="property-amenities">
            ${property.amenities.map((a) => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="property-section" data-reveal="fade-up" data-reveal-group="property-sections">
          <h2>Location</h2>
          <p class="property-overview__location">${property.location}</p>
          <div class="property-map">
            <iframe
              title="Map of ${property.location}"
              src="https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      <aside class="property-inquiry">
        <div class="property-inquiry__card" data-reveal="right">
          <h3>Interested in this property?</h3>
          <p>Speak with a G29 advisor about viewings, pricing, or financing options.</p>
          <form onsubmit="return false;">
            <input type="text" placeholder="Full Name" required>
            <input type="email" placeholder="Email Address" required>
            <input type="tel" placeholder="Phone Number">
            <textarea rows="3" placeholder="I'm interested in ${property.title}..."></textarea>
            <button type="submit" class="btn btn-primary">Request Viewing</button>
          </form>
          <div class="property-inquiry__direct">
            <a href="tel:+233246381172">&#128222; +233 24 638 1172</a>
            <a href="mailto:info@g29propertyconsult.com">&#9993; info@g29propertyconsult.com</a>
          </div>
        </div>
      </aside>
    </section>

    <section class="property-related container" data-reveal="fade-up">
      <h2>Other properties you may like</h2>
      <a href="index.html#properties" class="property-related__link">View all properties <span aria-hidden="true">&#8594;</span></a>
    </section>
  `;
})();
