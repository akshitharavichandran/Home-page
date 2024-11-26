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
    const links = this.querySelectorAll("nav a");

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
    event.preventDefault();
    const targetHref = event.target.getAttribute("href");

    if (targetHref) {
      window.history.pushState({}, "", targetHref);
      handleLocation(); 
    }

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
      const response = await fetch("http://127.0.0.1:5500/data.json");
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

    const templateResponse = await fetch('./components/header/header.html');
    if (!templateResponse.ok) {
      console.error("Failed to load template.");
      return;
    }
    const templateText = await templateResponse.text();
    const template = new DOMParser().parseFromString(templateText, 'text/html').querySelector('#header-template');
  
    if (!template) {
      console.error("Template with id 'header-template' not found.");
      return;
    }
  
    const templateContent = template.content.cloneNode(true);
    const brandLogo = templateContent.querySelector(".brand-logo");
    const brandName = templateContent.querySelector(".brand-name");
    const desktopNav = templateContent.querySelector(".desktop-nav");
    const mobileNav = templateContent.querySelector(".mobile-nav");
    const ctaButtonDesktop = document.createElement("a"); 
    const ctaButtonMobile = templateContent.querySelector(".cta-button");  

    brandLogo.src = headerData.brandLogo;
    brandName.textContent = headerData.brandName;

    desktopNav.innerHTML = headerData.navmenu
      .map(
        (menu) => `<a href="${menu.url}" title="${menu.desc}">${menu.label}</a>`
      )
      .join("");

    mobileNav.innerHTML = headerData.navmenu
      .map(
        (menu) => `<a href="${menu.url}" title="${menu.desc}">${menu.label}</a>`
      )
      .join("");

    ctaButtonDesktop.href = headerData.cta.url;
    ctaButtonDesktop.title = headerData.cta.desc;
    ctaButtonDesktop.textContent = headerData.cta.label;
    ctaButtonDesktop.classList.add("cta-button"); 
    desktopNav.appendChild(ctaButtonDesktop);  

    ctaButtonMobile.href = headerData.cta.url;
    ctaButtonMobile.title = headerData.cta.desc;
    ctaButtonMobile.textContent = headerData.cta.label;

    this.innerHTML = `
      <style>
        ${styles}
      </style>
    `;
    this.appendChild(templateContent);

    this.setupEventListeners();
  }
}

customElements.define("header-component", HeaderComponent);
