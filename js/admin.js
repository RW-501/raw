


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
      toast.className = `toast toast-${type}`; // Add classes for styling
      toast.innerText = message; // Set the message text

    //  const main = document.getElementById("main-content");

      // Append the toast to the body
      document.body.appendChild(toast);
  
      // Set a timer to remove the toast after the specified duration
      setTimeout(() => {
        toast.style.opacity = '0'; // Start fade-out
          toast.classList.add('fade-out'); // Add fade-out effect
          setTimeout(() => {
            document.body.removeChild(toast); // Remove toast from DOM
          }, 50000); // Time to wait for fade-out animation
      }, duration);
  }
  
  // Example usage: Replace alerts with showToast
  // showToast('This is a success message!', 'success');
  // showToast('This is an error message!', 'error', duration);
  // showToast('This is an info message!', 'info');
  // showToast('This is a warning message!', 'warning');
  
  
  //window.showToast = showToast;
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
     
  

// DOM Elements 
const messageText = document.getElementById("message-text");
const messageActions = document.getElementById("message-actions");

// Helper: Fetch Messages from External JSON
async function fetchMessages() {
  try {
    const response = await fetch("../admin/myMessages.json");
    const data = await response.json();
    return data.messages; // Assuming messages are stored in a "messages" field
  } catch (error) {
    console.error("Failed to load messages:", error);
    return [];
  }
}

// Helper: Get Seen IDs from Local Storage
function getSeenIds() {
  return JSON.parse(localStorage.getItem("seenMessageIds")) || [];
}

// Helper: Save Seen IDs to Local Storage
function saveSeenIds(ids) {
  localStorage.setItem("seenMessageIds", JSON.stringify(ids));
}

// Helper: Reset Seen IDs
function resetSeenIds() {
  localStorage.removeItem("seenMessageIds");
}

// Helper: Get Priority Sorted Messages
function sortMessagesByPriority(messages) {
  return messages.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

// Helper: Remove Duplicate Links
function removeDuplicateLinks(messages) {
  const linkSet = new Set();
  return messages.map((msg) => {
    if (msg.meta?.links) {
      msg.meta.links = msg.meta.links.filter((link) => {
        const unique = !linkSet.has(link.url);
        if (unique) linkSet.add(link.url);
        return unique;
      });
    }
    return msg;
  });
}

// Helper: Filter Expired Messages (Also handles missing expiryDate)
function filterExpiredMessages(messages) {
  const now = new Date();
  return messages.filter((msg) => {
    const isNotExpired = !msg.meta?.expiryDate || new Date(msg.meta.expiryDate) > now;
    return isNotExpired && msg.active !== false; // Only show active messages
  });
}

// Helper: Pick a Random Unseen Message
function getRandomUnseenMessage(messages) {
  const seenIds = getSeenIds();
  const unseenMessages = messages.filter((msg) => !seenIds.includes(msg.id) && msg.active !== false);
  if (unseenMessages.length === 0) {
    resetSeenIds(); // Reset if all messages are seen
    return getRandomUnseenMessage(messages); // Recursively pick a message
  }
  const randomIndex = Math.floor(Math.random() * unseenMessages.length);
  return unseenMessages[randomIndex];
}

// Helper: Create Button
function createButton(text, onClick, ariaLabel = "") {
  const button = document.createElement("button");
  button.innerText = text;
  button.className = "message-btn";
  button.setAttribute("aria-label", ariaLabel);
  button.onclick = onClick;
  return button;
}

// Function: Display Message
function displayMessage(message) {
  // Mark message as seen
  const seenIds = getSeenIds();
  if (!seenIds.includes(message.id)) {
    seenIds.push(message.id);
    saveSeenIds(seenIds);
  }

  // Fade out current message
  messageText.classList.remove("fade-in");
  messageText.classList.add("fade-out");

  setTimeout(() => {
    // Update message text and actions
    let linksHTML = "";
    if (message.meta?.links && message.meta.links.length > 0) {
      linksHTML = message.meta.links
        .filter((link) => link.url && link.url !== "NA" && link.url !== "")  // Filter out invalid links
        .map((link) => `<a href="${link.url}" target="_blank">${link.label}</a>`)
        .join(" | ");
    }

    // Add type class to message for styling
    messageText.classList.add("msg_"+message.type || 'msg_default');  // Default class if type is not provided

    messageText.innerHTML = `${message.icon ? `<span>${message.icon}</span> ` : ""}${message.text}${linksHTML}`;
    messageActions.innerHTML = "";

    // Handle question type with options
    if (message.type === "question" && message.options) {
      message.options.forEach((option) => {
        const button = createButton(option.text, () => {
          showToast(option.correct ? "Correct! 🎉" : "Try again. 📷", option.correct ? "success" : "error");
       
          if(option.correct){

          }
       
        });
        messageActions.appendChild(button);
      });
    }

    // Fade in new message
    messageText.classList.remove("fade-out");
    messageText.classList.add("fade-in");
  }, 1000); // Match animation duration
}

// Function: Initialize Messages
async function initMessages() {
  let messages = await fetchMessages();

  // Apply Enhancements
  messages = sortMessagesByPriority(messages);
  messages = removeDuplicateLinks(messages);
  messages = filterExpiredMessages(messages);

  // Rotate Messages Every 5 Seconds
  setInterval(() => {
    const message = getRandomUnseenMessage(messages);
    displayMessage(message);
  }, 50000);

  // Initial Message Display
  displayMessage(getRandomUnseenMessage(messages));
}

// Initialize on Page Load
initMessages();







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


function formatDate(timestamp) {
  if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString(); // Firestore Timestamp
  }
  return new Date(timestamp).toLocaleString(); // Plain date
}

window.formatDate = formatDate;


   
    
document.addEventListener("DOMContentLoaded", () => {
  // Add click listener to lazy-image elements
  document.body.addEventListener("click", event => {
      const target = event.target;

      // Check if the clicked element is a lazy-image
      if (target.classList.contains("view-image")) {
        const imageSrc = target.src || target.getAttribute("data-src");
        const imageId = target.src || target.getAttribute("data-image-id");

          // Create the full-screen popup
          createImagePopup(imageSrc, imageId);
      }
  });

  // Function to create the full-screen popup
  const createImagePopup = (imageSrc, imageId) => {
      // Create the overlay
      const overlay = document.createElement("div");
      overlay.classList.add("fullscreen-popup");

      // Set the inner HTML of the overlay
      overlay.innerHTML = `
          <img src="${imageSrc}"  data-image-id='${imageId}' class="popup-image" alt="Full-size image">
          <button class="close-button">&times;</button>
          <button class="more-images-button">More Details</button>
      `;

      // Append the overlay to the body
      document.body.appendChild(overlay);

      // Add functionality to the close button
      const closeButton = overlay.querySelector(".close-button");
      closeButton.addEventListener("click", () => overlay.remove());

      // Add functionality to the "More Videos" button
      const moreVideosButton = overlay.querySelector(".more-images-button");
      moreVideosButton.addEventListener("click", () => {
        const imageId = overlay.getAttribute("data-image-id");

     
        showTabContent('Manage_Events');
        const target = document.getElementById(`media-item-${imageId}`);
        if (target) {
            target.scrollIntoView({
                behavior: "smooth", // Optional: smooth scrolling
                block: "start"      // Optional: aligns to the top of the viewport
            });
          }
       // window.location.href = "/events"
       //   alert("Redirect to videos or perform another action here.");
      });
  };
});



// Function to dynamically create and append the scroll button
function createScrollButton() {
  // Create the button element
  const scrollButton = document.createElement('div');
  scrollButton.id = 'scrollButton';
  scrollButton.textContent = 'Top';

  // Add styles dynamically
  const styles = `
      position: fixed;
      bottom: 5%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none; /* Initially hidden */
      background: linear-gradient(135deg, #5f7fff, #7b81fe);
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      z-index: 10;
      animation: scrollFadeIn 1s ease-out, scrollPulse 2s infinite;
  `;
  scrollButton.style.cssText = styles;

  // Add hover effect using inline styles
  scrollButton.addEventListener('mouseenter', () => {
      scrollButton.style.background = 'linear-gradient(135deg, #7bd7fe, #5f77ff)';
      scrollButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
  });

  scrollButton.addEventListener('mouseleave', () => {
      scrollButton.style.background = 'linear-gradient(135deg, #5f7fff, #7b81fe)';
      scrollButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
  });

  // Attach the button to the body
  document.body.appendChild(scrollButton);

  // Scroll to top on click
  scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return scrollButton;
}

// Create the scroll button and use it in the scroll listener
const scrollButton = createScrollButton();

// Scroll listener to toggle button visibility
window.addEventListener('scroll', () => {
  const pageHeight = document.body.scrollHeight;
  const viewportHeight = window.innerHeight;
  const scrollDistance = window.scrollY;

  const isPageTallEnough = pageHeight > viewportHeight * 1.5;
  const showAfter = pageHeight * 0.50;

  if (isPageTallEnough && scrollDistance > showAfter) {
      scrollButton.style.display = 'block';
  } else {
      scrollButton.style.display = 'none';
  }
});
