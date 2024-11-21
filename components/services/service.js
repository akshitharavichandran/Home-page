class ServicesSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const data = await this.loadServices();
    if (data) {
      this.render(data.servicesPage);
    }
  }

  async loadStyles() {
    try {
      const response = await fetch("./components/services/services.css");
      if (!response.ok) {
        throw new Error(`Failed to load CSS: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error loading styles:", error);
      return "";
    }
  }

  async loadServices() {
    try {
      const response = await fetch("services.json");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch services.json: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error loading services:", error);
      this.shadowRoot.innerHTML = `<p>Error loading services. Please try again later.</p>`;
      return null;
    }
  }

  async render({ description, services }) {
    const styles = await this.loadStyles();
    const servicesHTML = services
      .map(
        (service) => `
        <div class="service-card">
          <img src="${service.icon}" alt="${
          service.title
        }" class="service-icon">
          <div class="service-content">
            <h2 class="service-title">${service.title}</h2>
            <p class="service-description">${service.description}</p>
            <ul class="service-features">
              ${service.features
                .map((feature) => `<li>${feature}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
      `
      )
      .join("");

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="main">
        <p class="description">${description}</p>
        <div class="services-grid">
          ${servicesHTML}
        </div>
      </div>
    `;
  }
}

customElements.define("services-section", ServicesSection);
