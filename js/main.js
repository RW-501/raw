// Function to update the active class on the navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    // Check if the link's href matches the current page URL
    if (window.location.pathname === link.getAttribute('href')) {
      link.classList.add('active');
      
      // Pass the page name to the updateFooterContent function based on the path
      const pageName = getPageNameFromPath(window.location.pathname);
      updateFooterContent(pageName);
    }
  });
  
  // Function to update the footer content based on the page name
  function updateFooterContent(pageName) {
    // Define the footer texts for different pages
    const footerTexts = {
      home: {
        text: "Let’s focus on your RAW Beauty and book your session today!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      about: {
        text: "Learn more about the passion behind RAW Photography and our unique approach.",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      gallery: {
        text: "Explore our stunning photography collection and see our work in action!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      events: {
        text: "Stay updated with our upcoming photo shoots and special events!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      contact: {
        text: "Get in touch with RAW Photography to book your session or ask any questions.",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      cart: {
        text: "Review your cart and finalize your booking for the perfect photoshoot!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      }
    };
  
    // Check if the page name exists in the footerTexts object, otherwise default to 'home'
    const pageData = footerTexts[pageName] || footerTexts['home'];
  
    // Check if the elements exist before attempting to update them
    const footerTextElement = document.getElementById('footer-text');
    const footerCopyWriteElement = document.getElementById('Footer_CopyWrite');
    
    if (footerTextElement) {
      footerTextElement.textContent = pageData.text;
    }
    
    if (footerCopyWriteElement) {
      footerCopyWriteElement.textContent = `&copy; ${pageData.year} ${pageData.copyWrite}`;
    }
  }
  
  // Function to extract the page name from the URL path
  function getPageNameFromPath(path) {
    // Extract the page name from the URL path
    // For example, "/about" becomes "about"
    const pathParts = path.split('/');
    const pageName = pathParts[pathParts.length - 1] || 'home'; // Default to 'home' if path is empty
    
    // Handle cases where the page name might be an empty string or unexpected value
    return pageName.trim() ? pageName : 'home';
  }
  