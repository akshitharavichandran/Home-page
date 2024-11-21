class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  disconnectedCallback() {
    const hamburger = this.querySelector(".hamburger");
    const closeButton = this.querySelector(".close-btn");
    if (hamburger) {
      hamburger.removeEventListener("click", this.toggleMenu);
    }
    if (closeButton) {
      closeButton.removeEventListener("click", this.closeMenu);
    }
  }

  setupEventListeners() {
    const hamburger = this.querySelector(".hamburger");
    const closeButton = this.querySelector(".close-btn");

    if (hamburger) {
      hamburger.addEventListener("click", this.toggleMenu);
    }
    if (closeButton) {
      closeButton.addEventListener("click", this.closeMenu);
    }
  }

  toggleMenu() {
    const sidebar = this.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("active");
    }
  }

  closeMenu() {
    const sidebar = this.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.remove("active");
    }
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

  async renderHeader(value) {
    const styles = await this.loadStyles();

    this.innerHTML = `
      <style>
        ${styles}
      </style>
      <div class="header">
        <img src="${value.brandLogo}" alt="${value.brandName} Logo" />
        <h1>${value.brandName}</h1>
        <div class="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav class="desktop-nav">
          ${value.navmenu
            .map(
              (menu) =>
                `<a href="${menu.url}" title="${menu.desc}">${menu.label}</a>`
            )
            .join("")}
          <a href="${value.cta.url}" title="${
      value.cta.desc
    }" class="cta-button">
            ${value.cta.label}
          </a>
        </nav>
      </div>
      <div class="sidebar">
        <button class="close-btn">&times;</button>
        <nav>
          ${value.navmenu
            .map(
              (menu) =>
                `<a href="${menu.url}" title="${menu.desc}">${menu.label}</a>`
            )
            .join("")}
        </nav>
        <a href="${value.cta.url}" title="${value.cta.desc}" class="cta-button">
          ${value.cta.label}
        </a>
      </div>
    `;
    this.setupEventListeners();
  }

  set data(value) {
    this.renderHeader(value);
  }
}

customElements.define("header-component", HeaderComponent);
