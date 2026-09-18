/*
  Insight detail template — renders a full article from ?slug=, looked up
  against assets/js/insights-data.js. Mirrors service-detail.js.
*/
(function () {
  const insights = window.G29_INSIGHTS || [];
  const root = document.getElementById('insightDetailRoot');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const article = insights.find((a) => a.slug === slug);

  if (!article) {
    root.innerHTML = `
      <div class="container property-not-found">
        <h1>Article not found</h1>
        <p>We couldn't find the article you're looking for.</p>
        <a href="insights.html" class="btn btn-primary">Back to Insights</a>
      </div>
    `;
    return;
  }

  document.title = `${article.title} | G29 Property Consult`;
  const metaDesc = document.getElementById('pageDescription');
  if (metaDesc) {
    metaDesc.setAttribute('content', article.excerpt);
  }

  const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const related = insights
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => (a.category === article.category ? -1 : 0) - (b.category === article.category ? -1 : 0))
    .slice(0, 3);

  root.innerHTML = `
    <div class="container property-breadcrumb">
      <a href="index.html">Home</a> <span aria-hidden="true">/</span>
      <a href="insights.html">Insights</a> <span aria-hidden="true">/</span>
      <span>${article.title}</span>
    </div>

    <section class="service-hero-banner insight-hero" data-reveal="scale" style="background-image: url('${article.heroImage}');">
      <div class="container service-hero-banner__content">
        <span class="eyebrow">${article.category}</span>
        <h1>${article.title}</h1>
        <p>${dateFormatter.format(new Date(article.date))} &middot; ${article.readTime}</p>
      </div>
    </section>

    <section class="property-overview container">
      <div class="property-overview__main">
        <div class="property-section insight-body" data-reveal="fade-up">
          ${article.body.map((block) => block.type === 'h3' ? `<h3>${block.text}</h3>` : `<p>${block.text}</p>`).join('')}
        </div>
      </div>

      <aside class="property-inquiry">
        <div class="property-inquiry__card" data-reveal="right">
          <h3>Have a question for a G29 advisor?</h3>
          <p>Get in touch and we'll walk you through your options.</p>
          <a href="index.html#contact" class="btn btn-primary">Request a Consultation</a>
          <div class="property-inquiry__direct">
            <a href="tel:+233246381172">&#128222; +233 24 638 1172</a>
            <a href="mailto:info@g29propertyconsult.com">&#9993; info@g29propertyconsult.com</a>
          </div>
        </div>
      </aside>
    </section>

    <section class="service-related container" data-reveal="fade-up">
      <h2>More Insights</h2>
      <div class="service-related-links">
        ${related.map((a) => `<a href="${window.G29_insightDetailUrl(a.slug)}">${a.title} <span aria-hidden="true">&#8594;</span></a>`).join('')}
      </div>
    </section>
  `;
})();
