class AboutUs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.loadAndRenderAboutUs();
  }

  async fetchAboutUsData() {
    try {
      const response = await fetch("http://127.0.0.1:5500/about.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch about us data: ${response.statusText}`);
      }
      const data = await response.json();
      const aboutUsSection = data.aboutPage;
      return aboutUsSection;
    } catch (error) {
      console.error("Error fetching about us data:", error);
      return null;
    }
  }

  async loadStyles() {
    try {
      const response = await fetch("./components/about/about.css");
      if (!response.ok) {
        throw new Error("Failed to load CSS file.");
      }
      return await response.text();
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  async loadAndRenderAboutUs() {
    const aboutUsData = await this.fetchAboutUsData();
    if (!aboutUsData) {
      console.error("No About Us data to render");
      return;
    }
    this.render(aboutUsData);
  }

  async render(aboutUsData) {
    try {
      // Fetch the template HTML for the About Us section
      const templateResponse = await fetch("./components/about/about.html");
      const templateText = await templateResponse.text();
      const templateElement = document.createElement('div');
      templateElement.innerHTML = templateText;
      const template = templateElement.querySelector('#about-us-template');

      if (!template) {
        throw new Error("About Us section template not found in the HTML file.");
      }

      const aboutUsContent = document.importNode(template.content, true);

      // Fill in the title and description
      aboutUsContent.querySelector('.about-title').textContent = aboutUsData.title;
      aboutUsContent.querySelector('.about-description').textContent = aboutUsData.description;

      // Render each section (team, contact, etc.)
      const sectionsHTML = aboutUsData.sections.map((section) => {
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
            <div class="section" id="${section.id}">
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
      }).join("");

      // Inject sections into the content
      aboutUsContent.querySelector('.sections-container').innerHTML = sectionsHTML;

      // Load and inject CSS styles
      const styles = await this.loadStyles();
      this.shadowRoot.innerHTML = `
        <style>
          ${styles}
        </style>
      `;
      
      // Append the content to the shadow DOM
      this.shadowRoot.appendChild(aboutUsContent);
    } catch (error) {
      console.error('Error rendering About Us section:', error);
    }
  }
}

customElements.define("about-us", AboutUs);
