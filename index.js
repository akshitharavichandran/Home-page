fetch("http://127.0.0.1:5500/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    document.addEventListener("DOMContentLoaded", () => {
      const headerComponent = document.querySelector("header-component");
      if (headerComponent) {
        headerComponent.data = data.header;
      }

      const footerComponent = document.querySelector("footer-component");
      if (footerComponent) {
        footerComponent.data = data.footer;
      }

      const homeComponent = document.querySelector("home-component");
      if (homeComponent) {
        homeComponent.data = data.pages.home.sections;
      }
    });
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
