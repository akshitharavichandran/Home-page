const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  const targetHref = event.target.href;

  if (targetHref) {
    window.history.pushState({}, "", targetHref);
    handleLocation();
  }
};

const routes = {
  "/": {
    html: "/components/hero/hero.html",
    script: "/components/hero/hero.js",
  },
  "/about": {
    html: "/components/about/about.html",
    script: "/components/about/about.js",
  },
  "/services": {
    html: "/components/services/services.html",
    script: "/components/services/service.js",
  },
  "/blogs": {
    html: "/components/blogs/blogs.html",
    script: "/components/blogs/blogs.js",
  },
  "/contact": {
    html: "/components/contact-us/contact.html",
    script: "/components/contact-us/contact.js",
  },
};
const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path];
  const otherSections = document.getElementById("other-sections");

  if (!route) {
    document.getElementById("main-page").innerHTML = "<h1>Page not found</h1>";
    if (otherSections) otherSections.innerHTML = ""; 
    return;
  }

  try {
    const response = await fetch(route.html);
    if (!response.ok) {
      throw new Error(
        `Failed to load content: ${response.status} ${response.statusText}`
      );
    }
    const html = await response.text();

    const mainPage = document.getElementById("main-page");
    if (mainPage) {
      mainPage.innerHTML = html;
    } else {
      console.error("No container found with ID 'main-page'");
    }

    if (route.script) {
      const existingScript = document.querySelector(
        `script[src="${route.script}"]`
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = route.script;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
    if (path === "/") {
      const mainPage = document.getElementById("main-page");
      if (mainPage) {
        mainPage.innerHTML = `<hero-section></hero-section>`;
      }
      if (otherSections) {
        otherSections.innerHTML = `
          <other-sections></other-sections>
        `;
      }
    }
    
    else {
      if (otherSections) otherSections.innerHTML = ""; 
    }
  } catch (error) {
    console.error("Error loading page content:", error);
    document.getElementById("main-page").innerHTML =
      "<h1>Something went wrong while loading the page</h1>";
    if (otherSections) otherSections.innerHTML = "";
  }
};


window.onpopstate = handleLocation;
window.route = route;

handleLocation();


