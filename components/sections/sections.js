class Sections extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const response = await fetch("http://127.0.0.1:5500/data.json");
    const data = await response.json();
    const otherSections = data.pages.home.sections.filter(
      (section) => section.type !== "hero"
    );
    this.render(otherSections);
  }

  async loadStyles() {
    const response = await fetch("./components/sections/sections.css");
    if (!response.ok) {
      console.error("Failed to load CSS file.", err);
      return "";
    }
    return await response.text();
  }

  async render(sections) {
    const sectionsHTML = sections
      .map((section) => {
        return `
          <section id="${section.id}" class="section">
            <img src="${section.imageUrl}" alt="${section.heading}" class="section-image" />
            <h2 class="section-heading">${section.heading}</h2>
            <p class="section-description">${section.description}</p>
            <a href="${section.cta.url}" class="cta-button">${section.cta.label}</a>
          </section>
        `;
      })
      .join("");

    const styles = await this.loadStyles();
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <main>
        ${sectionsHTML}
      </main>
    `;
  }
}

customElements.define("other-sections", Sections);
