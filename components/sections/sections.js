class Sections extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.loadAndRenderSections();
  }

  async loadStyles() {
    try {
      const response = await fetch("./components/sections/sections.css");
      if (!response.ok) {
        throw new Error(`Failed to load CSS: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error loading styles:", error);
      return "";
    }
  }

  async fetchSectionsData() {
    try {
      const response = await fetch("http://127.0.0.1:5500/data.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch sections data: ${response.statusText}`);
      }
      const data = await response.json();
      return data.pages.home.sections.filter((section) => section.type !== "hero");
    } catch (error) {
      console.error("Error fetching sections data:", error);
      return [];
    }
  }

  async loadAndRenderSections() {
    const sectionsData = await this.fetchSectionsData();
    if (!sectionsData || sectionsData.length === 0) {
      console.error("No sections data to render");
      return;
    }

    const styles = await this.loadStyles();

    const templateResponse = await fetch('./components/sections/sections.html');
    if (!templateResponse.ok) {
      console.error("Failed to load template.");
      return;
    }
    const templateText = await templateResponse.text();
    const template = new DOMParser().parseFromString(templateText, 'text/html').querySelector('#sections-template');

    if (!template) {
      console.error("Template with id 'sections-template' not found.");
      return;
    }

    const templateContent = template.content.cloneNode(true);
    const mainElement = templateContent.querySelector("main");

    sectionsData.forEach((section) => {
      const sectionElement = document.createElement("section");
      sectionElement.classList.add("section");
      sectionElement.id = section.id;

      sectionElement.innerHTML = `
        <img src="${section.imageUrl}" alt="${section.heading}" class="section-image" />
        <h2 class="section-heading">${section.heading}</h2>
        <p class="section-description">${section.description}</p>
        <a href="${section.cta.url}" class="cta-button">${section.cta.label}</a>
      `;

      mainElement.appendChild(sectionElement);
    });

    this.innerHTML = `
      <style>
        ${styles}
      </style>
    `;
    this.appendChild(templateContent);
  }
}

customElements.define("other-sections", Sections);
