class BlogsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Attach Shadow DOM
  }

  connectedCallback() {
    this.loadBlogs(); // Fetch and render blog content
  }

  // Load external styles
  async loadStyles() {
    try {
      const response = await fetch('./components/blogs/blogs.css');
      if (response.ok) {
        return await response.text(); // Return CSS as text
      }
      console.error('Failed to load CSS file.');
      return ''; // Fallback: Empty styles
    } catch (err) {
      console.error('Error loading CSS:', err);
      return '';
    }
  }

  // Load blogs data
  async loadBlogs() {
    try {
      const response = await fetch('blogs.json');
      if (response.ok) {
        const data = await response.json();
        this.render(data.blogsPage); // Pass data to render method
      } else {
        throw new Error('Failed to load blogs data');
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      this.shadowRoot.innerHTML = `<p>Error loading blogs. Please try again later.</p>`;
    }
  }

  // Render the blogs content and styles
  async render({ title, description, blogs }) {
    // Generate blogs grid content
    const blogsContent = blogs
      .map(
        (blog) => `
        <div class="blog-card">
          <img src="${blog.image}" alt="${blog.title}" class="blog-image">
          <div class="blog-content">
            <h2 class="blog-title">${blog.title}</h2>
            <p class="blog-meta">By ${blog.author} on ${new Date(blog.date).toLocaleDateString()}</p>
            <p class="blog-summary">${blog.summary}</p>
            <a href="${blog.contentUrl}" class="read-more">Read More</a>
          </div>
        </div>
      `
      )
      .join('');

    const styles = await this.loadStyles();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="main">
        <div class="about-header">
          <h1 class="header">${title}</h1>
          <p class="description">${description}</p>
        </div>
        <div class="blogs-grid">
          ${blogsContent}
        </div>
      </div>
    `;
  }
}

customElements.define('blogs-section', BlogsSection);
