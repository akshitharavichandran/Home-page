class AboutUs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const response = await fetch("https://akshmagic.netlify.app/about.json");
      const data = await response.json();
      this.render(data.aboutPage);
    } catch (error) {
      console.error("Error fetching the about data:", error);
      this.shadowRoot.innerHTML = `<p>Error loading content. Please try again later.</p>`;
    }
  }
  async loadStyles() {
    const response = await fetch("./components/about/about.css");
    if (!response.ok) {
      console.error("Failed to load CSS file.", err);
      return "";
    }
    return await response.text();
  }

  async render({ title, description, sections }) {
    const sectionsHTML = sections.map((section) => {
      if (section.id === "team") {
        const membersHTML = section.members
          .map(
            (member) => ` 
              <div class="team-member">
                <img src="${member.image}" alt="${member.name}" />
                <h3>${member.name}</h3>
                <p>${member.position}</p>
                <p>${member.bio}</p>
              </div>
            `
          )
          .join("");
        return ` 
            <div class="section" id="${section.id}">
              <h2>${section.title}</h2>
              <div class="team-members">${membersHTML}</div>
            </div>
          `;
      } else if (section.id === "contact") {
        return ` 
          <div class="section2" id="${section.id}">
            <h2>${section.title}</h2>
            <div class="contact-container">
              <div class="contact-info">
                <p>Email: <a href="mailto:${section.info.email}">${section.info.email}</a></p>
                <p>Phone: <a href="tel:${section.info.phone}">${section.info.phone}</a></p>
                <p>Address: ${section.info.address}</p>
                <p><a href="${section.info.map}" target="_blank">View on Map</a></p>
              </div>
              <div class="mapouter">
                <iframe width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Graftohttps://www.google.com/maps/place/Coimbatore,+Tamil+Nadu/@11.0139689,76.967235,12z/data=!3m1!4b1!4m6!3m5!1s0x3ba859af2f971cb5:0x2fc1c81e183ed282!8m2!3d11.0168445!4d76.9558321!16zL20vMDE5ZmM0?entry=ttu&amp;g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%253D%253Dn%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                </iframe>
              </div>
            </div>
          </div>
        `;
      } else {
        return ` 
            <div class="section" id="${section.id}">
              <h2>${section.title}</h2>
              <p>${section.content}</p>
            </div>
          `;
      }
    });
    const styles = await this.loadStyles();
    this.shadowRoot.innerHTML = `
    <style>
      
      ${styles}
    </style>
    <div class="about-container">
      <header class="about-header">
        <h1>${title}</h1>
        <p>${description}</p>
      </header>
      ${sectionsHTML.join("")}
    </div>
    `;
  }
}

customElements.define("about-us", AboutUs);
