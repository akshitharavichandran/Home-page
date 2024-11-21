class BlogsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadBlogs();
  }
  async loadStyles() {
    const response = await fetch("./components/blogs/blogs.css");
    if (!response.ok) {
      console.error("Failed to load CSS file.", err);
      return "";
    }
    return await response.text();
  }
  async loadBlogs() {
    try {
      const response = await fetch("blogs.json");
      const data = await response.json();
      this.render(data.blogsPage);
    } catch (error) {
      console.error("Error loading blogs:", error);
      this.shadowRoot.innerHTML = `<p>Error loading blogs. Please try again later.</p>`;
    }
  }

  async render({ description, blogs }) {
    const content = `
    <div class="main">
        <p class="description">${description}</p>
        <div class="blogs-grid">
          ${blogs
            .map(
              (blog) => `
              <div class="blog-card">
                <img src="${blog.image}" alt="${blog.title}" class="blog-image">
                <div class="blog-content">
                  <h2 class="blog-title">${blog.title}</h2>
                  <p class="blog-meta">By ${blog.author} on ${new Date(
                blog.date
              ).toLocaleDateString()}</p>
                  <p class="blog-summary">${blog.summary}</p>
                  <a href="${blog.contentUrl}" class="read-more">Read More</a>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
        </div>
      `;
    const styles = await this.loadStyles();

    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    ${styles}${content}`;
  }
}

customElements.define("blogs-section", BlogsSection);
