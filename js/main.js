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
  

  function adjustFooterForMobile() {
    const footerLinks = document.querySelectorAll('#Main_Footer_Top ul li a');
    const screenWidth = window.innerWidth;
  
    footerLinks.forEach(link => {
      if (screenWidth <= 767) {
        // Hide text on mobile, but show icons
        link.querySelector('small').style.display = 'none';
      } else {
        // Show text on larger screens
        link.querySelector('small').style.display = 'inline';
      }
    });
  }
  
  // Run the function on load and on resize
  window.addEventListener('load', adjustFooterForMobile);
  window.addEventListener('resize', adjustFooterForMobile);
  

  function applyBackgroundEffect() {
    const header = document.getElementById('Main_Header');
    
    // Set initial background as image with shadow/fade
    header.style.transition = "background 1s ease-in-out";  // Add smooth transition
    header.style.backgroundImage = "url('https://rw-501.github.io/raw/images/main.jpg')";
    header.style.backgroundSize = "cover";
    header.style.backgroundPosition = "center";
    header.style.position = "relative";
    
    // Create overlay div for shadow/fade effect
    const overlay = document.createElement('div');
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.background = "rgba(0, 0, 0, 0.5)"; // Black fade effect
    overlay.style.transition = "background 1s ease-in-out"; // Smooth fade effect
    overlay.style.zIndex = "1"; // Place overlay on top of the background
    header.appendChild(overlay);
    
    // Optionally add a gradient instead of an image after 5 seconds for example (can be toggled as needed)
    setTimeout(() => {
      header.style.backgroundImage = "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://rw-501.github.io/raw/images/main.jpg')";
      overlay.style.background = "rgba(0, 0, 0, 0.3)"; // Lighter fade effect for gradient
    }, 5000);  // Change background after 5 seconds, you can adjust this as needed
  }
  
  // Run the function when the page loads
  window.addEventListener('load', applyBackgroundEffect);
  

  function createFilm() { 
    const header = document.getElementById('Main_Header');
    header.style.position = "relative";
    header.style.overflow = "hidden";

    const filmImages = [
        'https://rw-501.github.io/raw/images/main.jpg',
        'https://rw-501.github.io/raw/images/main.png',
        'https://rw-501.github.io/raw/images/main.jpg',
        'https://rw-501.github.io/raw/images/main.png'
    ];
    let currentImageIndex = 0;

    // Create overlay to hold the film strip and sprocket holes
    const overlay = document.createElement('div');
    overlay.className = 'film-strip-overlay';

    // Loop through each film image to create a film overlay for each
    filmImages.forEach((src) => {
        // Create the main film strip container for each image
        const filmStrip = document.createElement('div');
        filmStrip.className = 'film-strip';

        const img = document.createElement('img');
        img.src = src;
        img.className = 'film-image';
        filmStrip.appendChild(img);

        // Create a film overlay for each image in the film strip
        const filmOverlay = document.createElement('div');
        filmOverlay.className = 'film-overlay';

        // Create sprocket holes for top and bottom for each film strip
        const topSprockets = createSprockets();
        const bottomSprockets = createSprockets();

        // Add the sprockets and the film strip to the film overlay
        filmOverlay.appendChild(topSprockets);
        filmOverlay.appendChild(filmStrip);
        filmOverlay.appendChild(bottomSprockets);

        // Append the film overlay to the main overlay
        overlay.appendChild(filmOverlay);
    });

    // Append the overlay to the header
    header.appendChild(overlay);

    // Function to create sprockets with holes for each film strip
    function createSprockets() {
        const sprockets = document.createElement('div');
        sprockets.className = 'sprocket-holes';
        for (let i = 0; i < 6; i++) {
            const hole = document.createElement('div');
            hole.className = 'sprocket-hole';
            sprockets.appendChild(hole);
        }
        return sprockets;
    }

    // Animate the film strip and sprockets movement
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % filmImages.length;
// container_CTA opc

        // Find the current film overlay and animate it
        const filmOverlays = document.querySelectorAll('.film-overlay');
        filmOverlays.forEach((overlay) => {
            overlay.style.transform = `translateX(-${currentImageIndex * 100}%)`;
        });
    }, 5000);
}

function applyFilmStripEffect() {
    let useFilmStripEffect = true;

    if (useFilmStripEffect) {
        createFilm();
    }
}

// Load the film effect on window load
window.addEventListener('load', applyFilmStripEffect);

















































        // Sanitize user input to escape HTML characters
        window.sanitizeInput = function(input) {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(input));
            return div.innerHTML;
        }
        
        // Function to check if input contains potential script injection characters
          window.isSafeInput = function(input) {
            const dangerousPatterns = /(<|>|"|;|&|\$|\(|\)|\*|\\|\/|script|SELECT|UPDATE|DELETE|INSERT|DROP|TABLE|ALTER)/i;
            return !dangerousPatterns.test(input);
        }
        
          // Auto move to next input (if applicable)
          const inputs = document.querySelectorAll('input');
          inputs.forEach((input, index) => {
              input.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter') {
                    //  console.log("Pressed Enter on:", input);
                      
                      // Prevent form submission if Enter is pressed
                      e.preventDefault();
          
                      // Find the next input in the NodeList
                      const nextInput = inputs[index + 1];
                      
                      if (nextInput) {
                          nextInput.focus();
                         // console.log("Focused on next input:", nextInput);
                      }
                  }
              });
          });
          
  
  // Toast Notification Function
  //function showToast(message, type = 'info', duration = 3000) {
    window.showToast = function(message, type = 'info', duration = 3000) {
  
      // Create a div for the toast
      const toast = document.createElement('div');
      
      toast.setAttribute('role', 'alert'); // Accessibility
  
      // Add styles to the toast
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.padding = '15px 20px';
      toast.style.margin = '10px';
      toast.style.borderRadius = '5px';
      toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      toast.style.color = '#fff';
      toast.style.zIndex = '9999999999999999';
      toast.style.transition = 'opacity 0.5s ease-in-out';
      toast.style.opacity = '1';
  
      // Set background color based on toast type
      switch (type) {
          case 'success':
              toast.style.backgroundColor = '#4CAF50'; // Green for success
              break;
          case 'error':
              toast.style.backgroundColor = '#F44336'; // Red for error
              break;
          case 'info':
              toast.style.backgroundColor = '#2196F3'; // Blue for info
              break;
          case 'warning':
              toast.style.backgroundColor = '#FF9800'; // Orange for warning
              break;
          default:
              toast.style.backgroundColor = '#2196F3'; // Default to info
      }
  
               // Implement your toast display logic here
               console.log(`${type.toUpperCase()}: ${message}`);
  
      toast.className = `toast toast-${type}  noCopy`; // Add classes for styling
      toast.innerText = message; // Set the message text
  
      // Append the toast to the body
      document.body.appendChild(toast);
  
      // Set a timer to remove the toast after the specified duration
      setTimeout(() => {
        toast.style.opacity = '0'; // Start fade-out
          toast.classList.add('fade-out'); // Add fade-out effect
          setTimeout(() => {
              document.body.removeChild(toast); // Remove toast from DOM
          }, 500); // Time to wait for fade-out animation
      }, duration);
  }
  
  // Example usage: Replace alerts with showToast
  // showToast('This is a success message!', 'success');
  // showToast('This is an error message!', 'error', duration);
  // showToast('This is an info message!', 'info');
  // showToast('This is a warning message!', 'warning');
  
  
  
  function formatCurrency(value, options = {}) {  
    const { locale = "en-US", currency = "USD", decimals = 0 } = options;
  
    // Convert to string if value is a number
    let cleanValue = typeof value === "number" ? value.toString() : String(value);
  
    // Remove any non-numeric characters except dots and commas
    cleanValue = cleanValue.replace(/[^0-9.,-]/g, "");
  
    // Remove commas and convert to number
    cleanValue = cleanValue.replace(/,/g, "");
    let number = parseFloat(cleanValue);
  
    // Handle invalid numbers
    if (isNaN(number)) {
        return "$0.00"; // Return default if value is invalid
    }
  
    // Manually format the number as currency (with commas)
    let formattedNumber = number
        .toFixed(decimals)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return `$${formattedNumber}`;
  }
  
  window.updateCurrency = function(input) {
    // Format the current input value
    const formattedValue = formatCurrency(input.value, { decimals: 0 });
    // Update the input value with formatted currency or "Negotiable"
    input.value = formattedValue;
  
    // If using type="text", you can uncomment the line below
    // const position = formattedValue.length; // Cursor position at the end
    // input.setSelectionRange(position, position);
  };
  
  window.restrictKeys = function(event) {
    const allowedKeys = [
        "Backspace",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Enter",
        "Escape"
    ];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }
  };
  
  
  
  window.truncateText = function(text, maxLength, href) {
    // Check if the text length exceeds maxLength
    if (text.length > maxLength) {
        // If href is provided, add the "See More" link
        if (href) {
            return text.substring(0, maxLength) + `... <a href="${href}">See More</a>`;
        } else {
            // If no href is provided, just add ellipsis
            return text.substring(0, maxLength) + "...";
        }
    }
    // If text length does not exceed maxLength, return text as is
    return text;
  };
  
  window.cleanAndShortenFileName = function(fileName, maxLength = 20) {
    // Remove special characters (except for letters, numbers, hyphens, and underscores)
    const cleanedFileName = fileName.replace(/[^\w\s.-]/g, '');
    
    // Truncate the file name if it exceeds the max length, keeping the file extension intact
    const nameWithoutExtension = cleanedFileName.substring(0, cleanedFileName.lastIndexOf('.'));
    const extension = cleanedFileName.substring(cleanedFileName.lastIndexOf('.'));
    
    let shortenedFileName = nameWithoutExtension.substring(0, maxLength);
    
    // Ensure that the file name does not exceed the max length including the extension
    if (shortenedFileName.length + extension.length > maxLength) {
        shortenedFileName = shortenedFileName.substring(0, maxLength - extension.length);
    }
    
    // Combine the shortened name with the extension
    return shortenedFileName + extension;
  }
  
  
  /*
  // Example usage:
  const fileName = "Very_Long_File_Name_With_Special_Characters!@#.jpg";
  const shortenedFileName = cleanAndShortenFileName(fileName, 15);
  console.log(shortenedFileName);  // Output: "Very_Long_File.jpg"
  
  */