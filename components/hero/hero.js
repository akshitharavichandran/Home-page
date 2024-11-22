class HeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const response = await fetch("http://127.0.0.1:5500/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Log the entire JSON
      const heroSection = data.pages.home.sections.find(
        (section) => section.type === "hero"
      );

      console.log("Hero section data:", heroSection); // Log the hero section
      if (heroSection) {
        this.render(heroSection);
      } else {
        this.shadowRoot.innerHTML = `<p>Hero section data not found.</p>`;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      this.shadowRoot.innerHTML = `<p>Failed to load hero section. Please try again later.</p>`;
    }
  }

  async loadStyles() {
    try {
      const response = await fetch("./components/hero/hero.css");
      if (!response.ok) {
        throw new Error(`Failed to load CSS: ${response.statusText}`);
      }
      const styles = await response.text();
      console.log("Loaded styles:", styles); 
      return styles;
    } catch (error) {
      console.error("Error loading styles:", error);
      return "";
    }
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
