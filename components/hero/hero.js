class HeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.loadAndRenderHero();
  }

  async fetchHeroData() {
    try {
      const response = await fetch("http://127.0.0.1:5500/data.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch hero data: ${response.statusText}`);
      }
      const data = await response.json();
      const heroSection = data.pages.home.sections.find(
        (section) => section.type === "hero"
      );
      return heroSection;  
    } catch (error) {
      console.error("Error fetching hero data:", error);
      return null;
    }
  }

  async loadStyles() {
    try {
      const response = await fetch("./components/hero/hero.css");
      if (!response.ok) {
        throw new Error("Failed to load CSS file.");
      }
      return await response.text();
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  async loadAndRenderHero() {
    const heroData = await this.fetchHeroData();
    if (!heroData) {
      console.error("No hero data to render");
      return;
    }
    this.render(heroData); 
  }

  async render(heroData) {
    try {
      const templateResponse = await fetch("./components/hero/hero.html");
      const templateText = await templateResponse.text();
      const templateElement = document.createElement('div');
      templateElement.innerHTML = templateText;
      const template = templateElement.querySelector('#hero-section-template');

      if (!template) {
        throw new Error("Hero section template not found in the HTML file.");
      }

      const heroContent = document.importNode(template.content, true);

      heroContent.querySelector('.section-heading').textContent = heroData.heading;
      heroContent.querySelector('.section-caption').textContent = heroData.caption;
      heroContent.querySelector('.section-description').textContent = heroData.description;
      heroContent.querySelector('.hero-image').setAttribute('src', heroData.imageUrl);
      const ctaButton = heroContent.querySelector('.cta-button', heroData.cta);
      ctaButton.setAttribute('href', heroData.cta.url);
      ctaButton.setAttribute('title', heroData.cta.desc);
      ctaButton.textContent = heroData.cta.label;

      const styles = await this.loadStyles();
      this.shadowRoot.innerHTML = `
        <style>
          ${styles}
        </style>
      `;
      this.shadowRoot.appendChild(heroContent);
    } catch (error) {
      console.error('Error rendering hero section:', error);
    }
  }
}

customElements.define("hero-section", HeroSection);
