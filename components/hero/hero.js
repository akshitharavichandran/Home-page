class HeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const response = await fetch("data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const heroSection = data.pages.home.sections.find(
        (section) => section.type === "hero"
      );

      if (heroSection) {
        this.render(heroSection);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  async loadStyles() {
    const response = await fetch("./components/hero/hero.css");
    if (!response.ok) {
      console.error("Failed to load CSS file.", err);
      return "";
    }
    return await response.text();
  }
  async render(section) {
    const styles = await this.loadStyles();

    this.shadowRoot.innerHTML = `
      <style>
       ${styles}
      </style>
      <section class="hero-section">
        <h2 class="section-heading">${section.heading}</h2>
        <h3 class="section-caption">${section.caption}</h3>
        <p class="section-description">${section.description}</p>
        <a href="${section.cta.url}" title="${section.cta.desc}" class="cta-button">${section.cta.label}</a>
      </section>
    `;
  }
}

customElements.define("hero-section", HeroSection);
