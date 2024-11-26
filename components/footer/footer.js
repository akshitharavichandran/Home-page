class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadAndRenderFooter();
  }

  async fetchFooterData() {
    try {
      const response = await fetch("http://127.0.0.1:5500/data.json");  
      if (!response.ok) {
        throw new Error(`Failed to fetch footer data: ${response.statusText}`);
      }
      const data = await response.json();
      return data.footer;  
    } catch (error) {
      console.error("Error fetching footer data:", error);
      return null;
    }
  }

  async loadStyles() {
    try {
      const response = await fetch("./components/footer/footer.css");
      if (!response.ok) {
        throw new Error("Failed to load CSS file.");
      }
      return await response.text();
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  async loadAndRenderFooter() {
    const footerData = await this.fetchFooterData();
    if (!footerData) {
      console.error("No footer data to render");
      return;
    }
    this.render(footerData); 
  }

  async render(footerData) {
    const templateResponse = await fetch("./components/footer/footer.html");
    const templateText = await templateResponse.text();
    const templateElement = document.createElement('div');
    templateElement.innerHTML = templateText;
    const template = templateElement.querySelector('#footer-template');

    const footerContent = document.importNode(template.content, true);

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

    footerContent.querySelector('.sitemap-links').innerHTML = sitemapLinks;
    footerContent.querySelector('.social-media-links').innerHTML = socialMediaLinks;

    const styles = await this.loadStyles();

    this.shadowRoot.innerHTML = `
      <style>
        ${styles}
      </style>
    `;
    this.shadowRoot.appendChild(footerContent);
  }
}

customElements.define("footer-component", FooterComponent);
