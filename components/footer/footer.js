class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(footerData) {
    this.render(footerData);
  }
  async loadStyles() {
    const response = await fetch("./components/footer/footer.css");
    if (!response.ok) {
      console.error("Failed to load CSS file.", err);
      return "";
    }
    return await response.text();
  }
  async render(footerData) {
    const sitemapLinks = footerData.sitemap
      .map(
        (item) => `
      <li><a href="${item.url}">${item.label}</a></li>
    `
      )
      .join("");

    const socialMediaLinks = footerData.socialmedia
      .map(
        (item) => `
      <li><a href="${item.url}" target="_blank">${item.platform}</a></li>
    `
      )
      .join("");
    const styles = await this.loadStyles();

    this.shadowRoot.innerHTML = `
      <style>
      ${styles}
      </style>
      <footer>
        <h2>Site Map</h2>
        <ul>${sitemapLinks}</ul>
        <h2>Follow Us</h2>
        <ul>${socialMediaLinks}</ul>
      </footer>
    `;
  }
}

customElements.define("footer-component", FooterComponent);
