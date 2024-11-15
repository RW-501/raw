
const styles = ` 
  #loadingContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  #cameraSpinner {
    position: relative;
    width: 120px;
    height: 120px;
  }

  /* DSLR Camera Body */
  .camera-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 60px;
    background-color: #333;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  /* Shutter button on the camera */
  .camera-icon::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 10px;
    width: 10px;
    height: 10px;

    border-radius: 50%;
  }

  /* Flash on the camera */
  .camera-icon::after {
    content: '';
    position: absolute;
    top: -15px;
    left: 15px;
    width: 6px;
    height: 10px;
    background-color: #999;
    border-radius: 2px;
            animation: flash 0.3s ease-in-out infinite;
        }

        /* Smooth flash effect */
        @keyframes flash {
            from {
                background-color: rgba(255, 255, 255, 0.2);
            }
            to {
                   background-color: rgb(233 224 93);
                    box-shadow: 0 6px 12px rgb(242 229 42);
            }
        }

  /* Lens     background-color: #222;  */
  .lens {
    width: 35px;
    height: 35px;
    border: 5px solid #666;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3) inset;
    position: relative;
    animation: lensSpin 1s linear infinite;

  }

  @keyframes lensSpin {
    0% {
      transform: rotate(0deg);
border: 5px solid rgb(126 126 126);

    }
    100% {
      transform: rotate(90deg);
        border: 5px solid rgb(135 135 135);
    }
  }



  /* Inner lens glass effect */
.lens::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    animation: lensGradientAnimation 100;
    border-radius: 50%;
    animation-duration: 5000ms;
    top: 5px;
    left: 5px;
}
   @keyframes lensGradientAnimation {
            from {
        background: linear-gradient(180deg,  #2575fc, #6a11cb);
                    box-shadow: 0 6px 12px rgb(242 229 42);
                 transform: rotate(0deg);
opacity: 0;
              }
            to {
        background: linear-gradient(90deg, #6a11cb, #2575fc);
                    box-shadow: 0 6px 12px rgb(242 229 42);
                          transform: rotate(360deg);
opacity: 1;
            }
        }


        
  /* Spinner Circle to simulate rotating lens */
  .spinner-circle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 6px solid transparent;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: -1;

  }




  @keyframes spin {
    0% {
      transform: rotate(0deg);
       border-top-color rgba(255, 255, 255, 0.2);

    }
    100% {
      transform: rotate(360deg);
                    border-top-color rgb(132 173 234);
                   box-shadow: 0 6px 12px rgb(242 229 42);
    }
  }
`;

// Create a style element and add the CSS to the document head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Create the main loading container
const loadingContainer = document.createElement('div');
loadingContainer.id = 'loadingContainer';

// Create the camera icon with spinner
const cameraSpinner = document.createElement('div');
cameraSpinner.id = 'cameraSpinner';
cameraSpinner.innerHTML = `
  <div class="camera-icon">
    <div class="lens"></div>
  </div>
  <div class="spinner-circle"></div>
`;

// Append camera spinner to loading container
loadingContainer.appendChild(cameraSpinner);

// Add the loading container to the body
document.body.appendChild(loadingContainer);

// Optionally, set display to none initially if you want it hidden by default
loadingContainer.style.display = 'none';

// Define and call the function to apply spinner colors
async function applyLoadingSpinnerColors(data) {
  // Check if data is defined
  if (!data) {
      console.log("User Data is not set");
      return; // Exit the function if data is not valid
  }

  // Utility function to set style properties with a fallback
  const setStyle = (element, property, value) => {
      if (value) {
          element.style[property] = value;
      }
  };

  // Select DOM elements
  const loadingContainer = document.querySelector("#loadingContainer");
  const cameraIcon = document.querySelector(".camera-icon");
  const lens = document.querySelector(".lens");
  const spinnerCircle = document.querySelector(".spinner-circle");

  // Apply styles using the utility function
  setStyle(loadingContainer, 'backgroundColor', data.backgroundColor);
  setStyle(cameraIcon, 'backgroundColor', data.cameraBodyColor);
  setStyle(lens, 'backgroundColor', data.lensColor);
  setStyle(lens, 'borderColor', data.lensBorderColor);
  setStyle(spinnerCircle, 'borderTopColor', data.spinnerCircleColor);

  // Add class to camera icon if it exists
  if (cameraIcon) {
      cameraIcon.classList.add("apply-spinner-colors");
  }

  // Set CSS variables with fallbacks
  const setCssVariable = (variable, value, defaultColor) => {
      const finalValue = value || defaultColor;
      document.documentElement.style.setProperty(variable, finalValue);
      if (!value) {
          console.warn(`${variable} is null or undefined, using default: ${defaultColor}`);
      }
  };

  setCssVariable("--shutter-button-color", data.shutterButtonColor, "#defaultShutterColor"); // Replace with actual default
  setCssVariable("--flash-color", data.flashColor, "#defaultFlashColor"); // Replace with actual default
}

  window.showLoadingSpinner = function(automatic = true) {

// Function to show the loading spinner on page load
  const loadingContainer = document.querySelector("#loadingContainer");
  //console.log("Loading Container:", loadingContainer);
    loadingContainer.style.display = 'flex';


    if (automatic.isTrusted == true || automatic == true) {
      setTimeout(() => {
            hideLoadingSpinner();
        }, 700); // 3000 milliseconds = 3 seconds
    }
}
window.hideLoadingSpinner = function() {
  const loadingContainer = document.querySelector("#loadingContainer"); // Example selector
  loadingContainer.style.display = 'none';
}

  // Call the function when the page loads
  window.addEventListener('load', showLoadingSpinner);
  

function setUpdateFooterContent(){
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
}

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

 // Define the  function to check if a specific keyword is in the URL
 window.checkUrl = function(keyword) {
  // Get the current URL
  const currentUrl = window.location.href;
  console.log("currentUrl:", currentUrl);
  //console.log("keyword:", keyword);

  // Return true if the keyword is found in the URL, otherwise false
  return currentUrl.includes(keyword);
};


if (window.checkUrl("/admin/") || window.checkUrl("/admin")) {
  console.log("Admin View");


} else {
  //console.log("User View");
  
  setUpdateFooterContent();
  // Run the function on load and on resize
window.addEventListener('load', adjustFooterForMobile);
window.addEventListener('resize', adjustFooterForMobile);
  
// Run the function when the page loads
window.addEventListener('load', applyBackgroundEffect);
  
// Load the film effect on window load
window.addEventListener('load', applyFilmStripEffect);
}















































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
        
// Auto move to next input (if applicable) on Enter key press
function viewDidLoad() {
  const form = document.querySelector('form'); // Select the form or parent container
  const inputs = form.querySelectorAll('input'); // Only select inputs within the form
  
  inputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
          // Check if the Enter key was pressed
          if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission or default Enter behavior
              
              // Find the next input in the NodeList
              const nextInput = inputs[index + 1];
              
              // Focus on the next input, if available
              if (nextInput) {
                  nextInput.focus();
              } else {
                  // If there are no more inputs, optionally submit the form or do nothing
                  form.submit();  // This is optional; remove if not needed
                  // Or do nothing, if you don't want automatic form submission
                  // console.log('All inputs filled, ready to submit');
              }
          }
      });
  });
}

// Run viewDidLoad when the document is ready
document.addEventListener('DOMContentLoaded', viewDidLoad);

          
  
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
  
      toast.className = `toast toast-${type}`; // Add classes for styling
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