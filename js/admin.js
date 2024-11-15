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
