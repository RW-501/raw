
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


  // Scroll to the top of the page when the window is loaded

  setTimeout(() => {
      window.scrollTo(0, 0);
  
      if (window.checkUrl("/admin/") || window.checkUrl("/admin")) {
        console.log("Admin View");
      } else {
        console.log("window.onload setUpdateFooterContent");
  
        setUpdateFooterContent();
        // Run the function on load and on resize
        window.addEventListener("load", adjustFooterForMobile);
        window.addEventListener("resize", adjustFooterForMobile);
      }
    }, 1000); // Delay of 1 second (1000 ms)
  
  

function setUpdateFooterContent() {
  // Get all anchor tags inside the nav-links
  const links = document.querySelectorAll('.nav-links a');

  links.forEach(link => {
      console.log("Nav link:", link.href);
      console.log("Window location:", window.location.pathname);

      // Check if the link's href matches the current page URL
      if (link.getAttribute('href').includes(window.location.pathname)) {
          link.classList.add('active');
      } else {
          link.classList.remove('active'); // Remove active class from non-matching links
      }
  });

  // Update the footer content if necessary
  const pageName = getPageNameFromPath(window.location.pathname);
  console.log("Page name for footer:", pageName);
  updateFooterContent(pageName);
}

// Helper function to extract the page name from the path
function getPageNameFromPath(path) {
  return path.replace('/', '').toUpperCase() || 'HOME'; // Default to 'HOME' if root
}


window.setUpdateFooterContent = setUpdateFooterContent;

  // Function to update the footer content based on the page name
  function updateFooterContent(pageName) {
    // Define the footer texts for different pages
    const footerTexts = {
      HOME: {
        text: "Let’s focus on your RAW Beauty and book your session today!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      ABOUT: {
        text: "Learn more about the passion behind RAW Photography and our unique approach.",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      GALLERY: {
        text: "Explore our stunning photography collection and see our work in action!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      EVENTS: {
        text: "Stay updated with our upcoming photo shoots and special events!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      CONTACT: {
        text: "Get in touch with RAW Photography to book your session or ask any questions.",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      },
      CART: {
        text: "Review your cart and finalize your booking for the perfect photoshoot!",
        year: new Date().getFullYear(),
        copyWrite: "RAW Photography - Capturing Your Moments Right!"
      }
    };
  
    // Check if the page name exists in the footerTexts object, otherwise default to 'home'
    const pageData = footerTexts[pageName] || footerTexts['HOME'];
  
    // Check if the elements exist before attempting to update them
    const footerTextElement = document.getElementById('footer-text');
    const footerCopyWriteElement = document.getElementById('Footer_CopyWrite');
    
    if (footerTextElement) {
      footerTextElement.textContent = pageData.text;
    }
    
    if (footerCopyWriteElement) {
      footerCopyWriteElement.innerHTML = `&copy; ${pageData.year} ${pageData.copyWrite}`;
    }
  }
  window.updateFooterContent = updateFooterContent;

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
  
 // Define the  function to check if a specific keyword is in the URL
 window.checkUrl = function(keyword) {
  // Get the current URL
  const currentUrl = window.location.href;
  console.log("currentUrl:", currentUrl);
  //console.log("keyword:", keyword);

  // Return true if the keyword is found in the URL, otherwise false
  return currentUrl.includes(keyword);
};
















      // Format date to a specific format (including time)
      function formatDate(dateString) { 
        // Convert the input string to a Date object
        const date = new Date(dateString);
        
        // Format the date
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long', // Full month name
            day: 'numeric'
        }).format(date);
    }
    










// Sanitize the input to prevent XSS or other malicious inputs
function sanitizeInput2(input) {
  // Use a regular expression to remove any unwanted characters, keeping only alphanumeric and basic symbols.
  return input.replace(/[^a-zA-Z0-9-_]/g, '');
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

  // Check if the form exists before proceeding
  if (!form) {
  //    console.error('Form element not found');
      return; // Exit the function if no form is found
  }

  const inputs = form.querySelectorAll('input'); // Only select inputs within the form
  
  inputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
          // Check if the Enter key was pressed and the input is not empty or invalid
          if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission or default Enter behavior
              
              // Check if the current input is valid (optional, depending on your needs)
              if (input.checkValidity()) {
                  // Find the next input in the NodeList
                  const nextInput = inputs[index + 1];
                  
                  // Focus on the next input, if available
                  if (nextInput && nextInput.type !== 'checkbox' && nextInput.type !== 'radio') {
                      nextInput.focus();
                  } else {
                      // If there are no more inputs or next is a checkbox/radio, optionally submit the form
                      if (index + 1 === inputs.length) {
                          form.submit();  // Submit the form when the last input is reached
                      }
                  }
              } else {
                  // Optionally, highlight invalid inputs or display a message
                  input.classList.add('is-invalid');
                  console.log('Please fill out this field');
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
            //   `${type.toUpperCase()}: ${message}`);
          //  console.log("?????????/");
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


  
// Handle Image Modal
document.addEventListener("DOMContentLoaded", () => {
  const imageModal = document.getElementById("imageModal");
  
  if (imageModal) {
    imageModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;

      // Get data attributes from the button that triggered the modal
      const imageUrl = button?.getAttribute("data-bs-image");
      const title = button?.getAttribute("data-bs-title");
      const description = button?.getAttribute("data-bs-description");

      // Update modal content
      const modalImage = document.getElementById("modal-image");
      const modalDescription = document.getElementById("modal-description");
      const modalLabel = document.getElementById("imageModalLabel");

      if (modalImage) modalImage.src = imageUrl || "";
      if (modalDescription) modalDescription.innerText = description || "No description provided.";
      if (modalLabel) modalLabel.innerText = title || "Untitled";

      // Make sure the modal is visible
      imageModal.style.display = "block"; // Attach display block
    });

    imageModal.addEventListener("hide.bs.modal", () => {
      // Optionally reset the display property when the modal is hidden
      imageModal.style.display = "none"; // Revert to hidden when modal is closed
    });
  }
});

