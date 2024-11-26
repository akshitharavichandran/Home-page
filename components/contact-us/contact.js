class ContactUs extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    async connectedCallback() {
      try {
        const response = await fetch("http://127.0.0.1:5500/about.json"); 
        const data = await response.json();
  
        const contactSection = data.aboutPage.sections.find(
          (section) => section.id === "contact"
        );
  
        if (contactSection) {
          this.render(contactSection);
        } else {
          this.shadowRoot.innerHTML = `<p>Contact information not found.</p>`;
        }
      } catch (error) {
        console.error("Error fetching the contact data:", error);
        this.shadowRoot.innerHTML = `<p>Error loading content. Please try again later.</p>`;
      }
    }
  
    async loadStyles() {
      try {
        const response = await fetch("./components/contact-us/contact.css");
        if (!response.ok) throw new Error("Failed to load CSS file.");
        return await response.text();
      } catch (error) {
        console.error(error.message);
        return ""; 
      }
    }
  
    async render({ title, info }) {
        const styles = await this.loadStyles();
      
        this.shadowRoot.innerHTML = `
          <style>
            ${styles}
          </style>
          <div class="main">
          <div class="about-header">
            <h2>${title}</h2>
            <p>Questions, feedbacks, bugs - we are here for it all!</p>
          </div>
          <div class="contact-container">
            <div class="contact-info">
              <p>Email: <a href="mailto:${info.email}">${info.email}</a></p>
              <p>Phone: <a href="tel:${info.phone}">${info.phone}</a></p>
              <p>Address: ${info.address}</p>
              <p><a href="${info.map}" target="_blank">View on Map</a></p>
            </div>
            <div class="mapouter">
              <iframe 
                width="100%" 
                height="300" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0"
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Coimbatore,+Tamil+Nadu&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
              </iframe>
            </div>
          </div>
          </div>
          
        `;
      }
    }      
  
  customElements.define("contact-us", ContactUs);
  