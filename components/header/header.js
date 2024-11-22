class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  connectedCallback() {
    this.loadAndRenderHeader();
  }

  disconnectedCallback() {
    const hamburger = this.querySelector(".hamburger");
    const closeButton = this.querySelector(".close-btn");
    const links = this.querySelectorAll("nav a");

    if (hamburger) {
      hamburger.removeEventListener("click", this.toggleMenu);
    }
    if (closeButton) {
      closeButton.removeEventListener("click", this.closeMenu);
    }
    if (links) {
      links.forEach((link) =>
        link.removeEventListener("click", this.handleLinkClick)
      );
    }
  }

  setupEventListeners() {
    const hamburger = this.querySelector(".hamburger");
    const closeButton = this.querySelector(".close-btn");
    const links = this.querySelectorAll("nav a"); // Select links in both desktop and sidebar menus

    if (hamburger) {
      hamburger.addEventListener("click", this.toggleMenu);
    }
    if (closeButton) {
      closeButton.addEventListener("click", this.closeMenu);
    }
    if (links) {
      links.forEach((link) =>
        link.addEventListener("click", this.handleLinkClick)
      );
    }
  }

  handleLinkClick(event) {
    event.preventDefault(); // Prevent default browser navigation
    const targetHref = event.target.getAttribute("href");

    if (targetHref) {
      window.history.pushState({}, "", targetHref); // Update URL without reloading
      handleLocation(); // Handle routing dynamically
    }

    // Close the sidebar if it's open
    const sidebar = document.querySelector(".sidebar");
    if (sidebar && sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
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
      const response = await fetch("./components/header/header.css");
      if (!response.ok) {
        throw new Error(`Failed to load CSS: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error loading styles:", error);
      return "";
    }
  }

  async fetchHeaderData() {
    try {
      const response = await fetch("https://akshmagic.netlify.app/data.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch header data: ${response.statusText}`);
      }
      const data = await response.json();
      return data.header;
    } catch (error) {
      console.error("Error fetching header data:", error);
      return null;
    }
  }

  async loadAndRenderHeader() {
    const headerData = await this.fetchHeaderData();
    if (!headerData) {
      console.error("No header data to render");
      return;
    }

    const styles = await this.loadStyles();

    this.innerHTML = `
      <style>
        ${styles}
      </style>
      <div class="header">
        <a href="/">
          <img src="${headerData.brandLogo}" alt="${
      headerData.brandName
    } Logo" />
        </a>
        <h1>${headerData.brandName}</h1>
        <div class="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav class="desktop-nav">
          ${headerData.navmenu
            .map(
              (menu) =>
                `<a href="${menu.url}" title="${menu.desc}">${menu.label}</a>`
            )
            .join("")}
          <a href="${headerData.cta.url}" title="${
      headerData.cta.desc
    }" class="cta-button">
            ${headerData.cta.label}
          </a>
        </nav>
      </div>
      <div class="sidebar">
        <button class="close-btn">&times;</button>
        <nav>
          ${headerData.navmenu
            .map(
              (menu) =>
                `<a href="${menu.url}" title="${menu.desc}">${menu.label}</a>`
            )
            .join("")}
        </nav>
        <a href="${headerData.cta.url}" title="${
      headerData.cta.desc
    }" class="cta-button">
          ${headerData.cta.label}
        </a>
      </div>
    `;

    this.setupEventListeners();
  }
}

customElements.define("header-component", HeaderComponent);
