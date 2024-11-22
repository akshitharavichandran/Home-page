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
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    // Handle 404 or fallback logic
    document.getElementById("main-page").innerHTML = "<h1>Page not found</h1>";
    return;
  }

  try {
    // Fetch the HTML content for the route
    const response = await fetch(route.html);
    if (!response.ok) {
      throw new Error(
        `Failed to load content: ${response.status} ${response.statusText}`
      );
    }
    const html = await response.text();

    // Render the fetched HTML content inside the target container
    const mainPage = document.getElementById("main-page");
    if (mainPage) {
      mainPage.innerHTML = html;
    } else {
      console.error("No container found with ID 'main-page'");
    }

    // Dynamically load the associated script (if any)
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
  } catch (error) {
    console.error("Error loading page content:", error);
    document.getElementById("main-page").innerHTML =
      "<h1>Something went wrong while loading the page</h1>";
  }
};

// Listen for back/forward navigation
window.onpopstate = handleLocation;
window.route = route;

// Initialize routing
handleLocation();
