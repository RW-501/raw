
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
// Firestore imports
import { 
    getFirestore, 
    doc, 
    getDoc, 
    query, startAfter ,
    updateDoc,orderBy, 
    setDoc,    
    addDoc, deleteDoc ,
    getDocs, increment,
    where, arrayUnion,
    collection 
} from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

// Authentication imports
import { 
    getAuth,
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    OAuthProvider, signInAnonymously  ,
    signOut, RecaptchaVerifier,
    onAuthStateChanged, signInWithPhoneNumber,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';

// Storage import
import { getDownloadURL,uploadBytes, ref, getStorage } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js';

// Analytics import
import { initializeAnalytics } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js';

let auth;
let db;
let storage;
let analytics;

// Function to initialize Firebase
function initializeFirebase() {

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2bb6osv0jnvpnETCVoG6bvBynGGsOVaw",
    authDomain: "raw-photography-12616.firebaseapp.com",
    databaseURL: "https://raw-photography-12616-default-rtdb.firebaseio.com",
    projectId: "raw-photography-12616",
    storageBucket: "raw-photography-12616.firebasestorage.app",
    messagingSenderId: "1078385378836",
    appId: "1:1078385378836:web:bb8f9611bfbdac1e480901",
    measurementId: "G-0DLEHE7DEK"
  };

    try {
        const app = initializeApp(firebaseConfig);
         auth = getAuth(app); // Initialize auth
         db = getFirestore(app); // Initialize Firestore
         storage = getStorage(app); // Initialize Storage
         analytics = initializeAnalytics(app);

    //  console.log("Firestore initialized:", db);

    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}


document.addEventListener('DOMContentLoaded', initializeFirebase);



 // console.log("Page loaded Module ?????????????");
  


// Function to check if the user is logged in
function checkUserLoginStatus() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('User is logged in:', user);
      } else {
        // No user is signed in
        console.log('No user is logged in.');
      }
    });
  }

window.checkUserLoginStatus = checkUserLoginStatus;


// Logout function
function logout() {    // Clear auto logout timer
    clearTimeout(autoLogoutTimer);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('autoLogoutTime');
    showToast('You have been logged out.');
    // Redirect to login or home page
    window.location.href = '../';
}


  window.logout = logout;

  
  // Check if user is logged in and handle admin area access
  function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
    // Redirect to home if user is not logged in and is in the admin area
    if (window.location.pathname.includes('/admin/')) {
        if (!isLoggedIn) {
            if (window.location.pathname.includes('/admin/index')) {
                showToast('You need to log in to access the Admin area.');
            } else {
                // Redirect to login page or main admin page
                window.location.href = '/admin/index';
            }
        } else if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/admin/index') || window.location.pathname.includes('/admin/')) {
            showToast('Admin Logged In');
            let firebaseLogin = document.getElementById("firebaseLogin");
            let dashboardContent = document.getElementById("dashboardContent");
        
            if(firebaseLogin){
                firebaseLogin = firebaseLogin.style.display = "none";
                dashboardContent = dashboardContent.style.display = "block";

            }
        
        }
    }
  }
  
  window.checkLogin = checkLogin;
  
  let autoLogoutTimer = null;

// Initialize auto logout on page load
function initializeAutoLogout() {
    const savedMinutes = localStorage.getItem('autoLogoutTime');
    if (savedMinutes && !isNaN(savedMinutes)) {
        // Set the timer using the saved setting
        autoLogoutTimer = setTimeout(() => {
            logout();
        }, parseInt(savedMinutes) * 60 * 1000);


        showToast(`Auto logout initialized for ${savedMinutes} minutes.`);
    } else {
       // showToast('Auto logout is disabled.');
    }
}

window.initializeAutoLogout = initializeAutoLogout;



  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    checkLogin(); // Ensure login is valid on page load

      
  if (window.checkUrl("/admin/") || window.checkUrl("/admin")) {
    console.log("Admin View");
    checkUserLoginStatus();
    initializeAutoLogout();
  } else {
    console.log("User View");
    attachTrackingListeners();
  }


  });
  
  
  
  


  // Export Firestore, Storage, and Auth instances for use in other modules
export {  db,getStorage, ref, uploadBytes, getDownloadURL,
    doc,arrayUnion, RecaptchaVerifier ,increment, getDoc   ,signInWithPhoneNumber,
     query, updateDoc, setDoc, addDoc,signInAnonymously , orderBy,
      signInWithPopup,FacebookAuthProvider, GoogleAuthProvider,startAfter ,
       OAuthProvider, signOut, onAuthStateChanged, deleteDoc, getFirestore,
        createUserWithEmailAndPassword, signInWithEmailAndPassword,
         where, getDocs, storage, getAuth, collection, auth, analytics };


// Utility variables
let viewStartTime;
let locationData;
let ipAddress;



window.userLocationService = function() {

//window.userLocationService = (function () {
    const ipAPI = 'https://api.ipify.org?format=json';
    const locationAPI = 'https://ipapi.co';

    // Fetch the user's IP address
    const getUserIP = async () => {
        try {
            const response = await fetch(ipAPI);
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return null;
        }
    };

    // Fetch the user's location based on IP address
    const getUserLocationByIP = async (ip) => {
        try {
            const response = await fetch(`${locationAPI}/${ip}/json/`);
            const data = await response.json();
            return {
                city: data.city || 'N/A',
                state: data.region || 'N/A',
                zip: data.postal || 'N/A',
                country: data.country_name || 'N/A'
            };
        } catch (error) {
            console.error('Error fetching location by IP:', error);
            return null;
        }
    };

    // Main function to get IP and location together
    const getUserIPAndLocation = async () => {
        try {
            ipAddress = sessionStorage.getItem('userIP');
            locationData = JSON.parse(sessionStorage.getItem('userLocation'));

            // If IP or location are not cached, fetch them
            if (!ipAddress || !locationData) { // Fixed condition here
                ipAddress = await getUserIP();
                locationData = await getUserLocationByIP(ipAddress);

                // Cache in session storage for the current session
                if (ipAddress && locationData) {
                    sessionStorage.setItem('userIP', ipAddress);
                    sessionStorage.setItem('userLocation', JSON.stringify(locationData));
                }
            }

            return { ipAddress, locationData };
        } catch (error) {
            console.error('Error retrieving user IP and location:', error);
            return null;
        }
    };

    // Expose only the main function
    return {
        getUserIPAndLocation
    };
}();

// Function to set the last internal page
function setInternalPageSource() {
    sessionStorage.setItem('lastInternalPage', window.location.href);
}

// Function to start tracking the view time
function startViewTimer() {
    viewStartTime = Date.now();
}

// Determine the source of the visit
const getViewSource = () => {
    const externalSource = document.referrer && !document.referrer.includes(window.location.origin)
        ? document.referrer
        : null;
    const internalSource = sessionStorage.getItem('lastInternalPage');
    return externalSource || internalSource || 'Direct Visit';
};

// Function to initialize user IP and location data
async function attachTrackingListeners() {
    try {
        const { ipAddress: ip, locationData: location } = await userLocationService.getUserIPAndLocation(); // Fixed destructuring
        ipAddress = ip;
        locationData = location;

        setTrackingListeners(ipAddress);
    } catch (error) {
        console.error("Error fetching user IP and location:", error);
    }
}

// Function to determine the correct `ViewedBy` field based on the URL
// Function to determine the correct `ViewedBy` field based on the URL
function getViewedByField() {
    const path = window.location.pathname;
    const page = path === '/' || path === '/index.html' ? 'home' : path.split('/').filter(Boolean).pop();
    
    return `${page}ViewedBy`;
}


// Function to update view data on unload or visibility change
 async function updateViewData(ipAddress) {
    const viewEndTime = Date.now();
    const durationOfView = (viewEndTime - viewStartTime) / 1000;
    const viewedByField = getViewedByField();

    console.log(`${ipAddress} ipAddress ???????? .`);

    if (!ipAddress) {
        console.error("Missing IP address. View data not recorded.");
        return;
    }

    // Dynamically set the field for the viewed page
    const viewData = {
        [viewedByField]: {
            viewDate: new Date().toISOString(),
            viewMethod: navigator.userAgentData?.mobile ? "mobile" : "desktop",
            durationOfView: durationOfView,
            contactViews: increment(1),
            viewSource: getViewSource()
        },
        ipAddress,
        ...locationData,
        lastViewDate: new Date().toISOString(),
        userActivitiesCount: increment(1),
        totalDuration: increment(durationOfView),
        userBlocked: false
    };

    try {
        await setDoc(doc(db, 'Analytics', ipAddress), viewData, { merge: true });
        console.log(`${viewedByField} data updated successfully.`);
    } catch (error) {
        console.error(`Error updating ${viewedByField} data:`, error);
    }
}

// Attach event listeners for tracking
 function setTrackingListeners(ipAddress) {
    window.addEventListener('beforeunload', setInternalPageSource);
    window.addEventListener('load', startViewTimer);
    console.log("startViewTimer");

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          console.log("TrackingListeners  last");

            updateViewData(ipAddress);
        }
    });
}


 // Define the  function to check if a specific keyword is in the URL
 window.checkUrl = function(keyword) {
    // Get the current URL
    const currentUrl = window.location.href;
   // console.log("currentUrl:", currentUrl);
    //console.log("keyword:", keyword);
  
    // Return true if the keyword is found in the URL, otherwise false
    return currentUrl.includes(keyword);
  };







  function applyBackgroundEffect() {
    const header = document.getElementById('Main_Header');
    
    // Set initial background as image with shadow/fade
    header.style.transition = "background 1s ease-in-out";  // Add smooth transition
    //header.style.backgroundImage = "url('https://rw-501.github.io/raw/images/main.jpg')";
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
    //  header.style.backgroundImage = "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://rw-501.github.io/raw/images/main.jpg')";
      overlay.style.background = "rgba(0, 0, 0, 0.3)"; // Lighter fade effect for gradient
    }, 5000);  // Change background after 5 seconds, you can adjust this as needed
  }
  
 
  async function createFilm() { 
    const header = document.getElementById('Main_Header');
    header.style.position = "relative";
    header.style.overflow = "hidden";
    let filmImages = await getHeaderImages();

    console.log("filmImages Images:", filmImages);

/*
    if(!filmImages){
    filmImages = [
        'https://rw-501.github.io/raw/images/main.jpg',
        'https://rw-501.github.io/raw/images/main.png',
        'https://rw-501.github.io/raw/images/main.jpg',
        'https://rw-501.github.io/raw/images/main.png'
    ];
}
    */
    let currentImageIndex = 0;

    // Create overlay to hold the film strip and sprocket holes
    const overlay = document.createElement('div');
    overlay.className = 'film-strip-overlay';

    // Loop through each film image to create a film overlay for each
    filmImages.forEach((src) => {
        // Create the main film strip container for each image
        const filmStrip = document.createElement('div');
        filmStrip.className = 'film-strip';
      //  console.log("filmImages Images:src    ", src);

        const img = document.createElement('img');
        img.src = src;
        img.className = 'film-image';
        filmStrip.appendChild(img);

        // Create a film overlay for each image in the film strip
        const filmOverlay = document.createElement('div');
        filmOverlay.className = 'film-overlay';



        // Add the sprockets and the film strip to the film overlay
        filmOverlay.appendChild(filmStrip);

        // Append the film overlay to the main overlay
        overlay.appendChild(filmOverlay);
    });

    // Append the overlay to the header
    header.appendChild(overlay);



    // Animate the film strip and sprockets movement
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % filmImages.length;
// container_CTA opc

        // Find the current film overlay and animate it
        const filmOverlays = document.querySelectorAll('.film-overlay'); 
        filmOverlays.forEach((overlay) => {
            overlay.style.transform = `translate(-${currentImageIndex * 100})`; // Center on X and Y
         //  overlay.style.transform = `translate(-${currentImageIndex * 150}%, -50%)`; // Center on X and Y
            overlay.style.top = '0'; // Vertically center relative to the container
            overlay.style.left = '50%'; // Horizontally center relative to the container
            overlay.style.position = 'absolute'; // Ensure positioning works as expected
            overlay.style.transition = 'transform 0.5s ease'; // Smooth transition (optional)
        });
    }, 5000);
}




function applyFilmStripEffect() {
    let useFilmStripEffect = true;

    if (useFilmStripEffect) {
        createFilm();
    }
}















// Function to get header images
async function getHeaderImages(appearOn) {
    try {
        console.log("appearOn:", appearOn);
       const showBool = false;
        // Reference the 'Media' collection
        const mainGalleryRef = collection(db, 'Media');
        
        let headerImagesQuery;

        // Build the query depending on the 'appearOn' parameter
        if (appearOn && showBool == true ) {
            if (Array.isArray(appearOn)) {
                headerImagesQuery = query(mainGalleryRef, where("appearOn", "array-contains-any", appearOn));
            } else {
                // If 'appearOn' is not an array, you can either throw an error or handle it
                console.error("'appearOn' should be an array.");
                return [];
            }
        } else {
            // Query for public images if 'appearOn' is not provided
            headerImagesQuery = query(mainGalleryRef, where("isPublic", "==", true));
        }
    //  /  console.log(`headerImagesQuery ${headerImagesQuery} .`); 

        // Execute the query and retrieve the snapshot of matching documents
        const querySnapshot = await getDocs(headerImagesQuery);
       // console.log(`Found ${querySnapshot.size} images.`); // Log the number of images found

        // Map over the documents to extract the 'watermarkedImageUrl' field, ensuring it exists
        const images = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Check if 'watermarkedImageUrl' exists before accessing it
            if (data.watermarkedImageUrl) {
                return data.watermarkedImageUrl;
            } else {
                console.warn("Missing 'watermarkedImageUrl' in document:", doc.id);
                return null; // Handle missing image URLs if necessary
            }
        }).filter(image => image !== null); // Remove any null values from the result

        return images; // Return the list of image URLs
    } catch (error) {
        console.error("Error fetching header images:", error);
        return [];
    }
}

window.getHeaderImages = getHeaderImages;

//window.displayHeaderImages = async function() {
    async function displayHeaderImages() {
        const page = "HomePage"; // Example of the appearOn value
        try {
            const images = await getHeaderImages(page); // Fetch header images
            console.log("Header Images:Main", images);
    
            // Verify images is an array
            if (!Array.isArray(images) || images.length === 0) {
                console.warn("No header images found for", page);
                return;
            }
    
            // Get the image container
            const imageContainer = document.getElementById("header-images");
            if (!imageContainer) {
                console.error("Image container not found");
                return;
            }
    
            // Clear previous images to avoid duplication
            imageContainer.innerHTML = "";
    
            // Loop through the images and add them to the DOM
            images.forEach((url) => {
                const img = document.createElement("img");
                img.src = url;
                img.alt = "Header Image"; // SEO-friendly alt text
                img.classList.add("header-image"); // Add a class for styling
                imageContainer.appendChild(img);
            });
    
            console.log(`Successfully displayed ${images.length} images.`);
        } catch (error) {
            console.error("Error displaying header images:", error);
        }
    }
    window.displayHeaderImages = displayHeaderImages;

    




if (window.checkUrl("/admin/") || window.checkUrl("/admin")) {
   // console.log("Admin View");
  
  
  } else {
   // window.onload = function() {
        setTimeout(() => {
            console.log("Running?  ");

            // Run the functions after a 3-second delay
          //  displayHeaderImages();
            applyBackgroundEffect();
            applyFilmStripEffect();
        }, 3000); // 3 seconds = 3000 milliseconds
   // }
  }
  







  // Function to dynamically style images based on their dimensions
function styleGalleryImages(galleryContainer) {
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item img');
  
    galleryItems.forEach(img => {
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
  
        // Add aspect ratio as a custom property for styling
        img.parentElement.style.setProperty('--aspect-ratio', aspectRatio.toFixed(2));
      };
    });
  }
  

  
  
// Reusable sanitize input function
function sanitizeInput(input) {
    const temp = document.createElement("div");
    temp.textContent = input;
    return temp.innerHTML;
  }
  
  // Helper for cycling default images
 // Function to get a random image from the default images
// Function to get a random default image from the array
function getRandomDefaultImage(defaultImages) {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    const image = defaultImages[randomIndex];
    defaultImages.splice(randomIndex, 1); // Remove the chosen image
    return image;
  }
  window.getRandomDefaultImage = getRandomDefaultImage;



  
  // Fetch HomePage Data
  window.fetchGalleryAndSiteInfo = async function (mainTextArea, galleryImagesContainer, Collection) {
    try {
        // Get collection reference
        const mediaQuery = query(
            collection(db, "Media"),
            where("isPublic", "==", true),
            where("status", "==", "active")
        );

        // Execute the query
        const querySnapshot = await getDocs(mediaQuery);
        console.log("mainTextArea, galleryImagesContainer, Collection", mainTextArea, galleryImagesContainer, Collection);

        let defaultImages = await getHeaderImages();

        
    if(!defaultImages){
        // Define default images
         defaultImages = [
            "https://shutterworx.co/images/default_1.gif",
            "https://shutterworx.co/images/default_2.gif",
            "https://shutterworx.co/images/default_3.gif",
            "https://shutterworx.co/images/default_4.gif",
            "https://shutterworx.co/images/placeholder1.gif",
            "https://shutterworx.co/images/placeholder2.gif",
            "https://shutterworx.co/images/placeholder3.gif",
            "https://shutterworx.co/images/placeholder4.gif"
        ];
    }

        // Helper function to get a random image from the defaultImages array
        const getRandomDefaultImage = () => {
            return defaultImages[Math.floor(Math.random() * defaultImages.length)];
        };

        // Loop through the documents in the collection
        querySnapshot.forEach(doc => {
            const data = doc.data();

            // Update main text area if the data contains mainText
            if (data?.mainText) {
                mainTextArea.innerHTML = data?.mainText || 'Default text if mainText is missing';
            }

            // Use default images if no imageUrl or thumbnailUrl is provided
            const imageUrl = data.imageUrl || getRandomDefaultImage();
            const thumbnailUrl = data.watermarkedImageUrl || getRandomDefaultImage();

            // Create and append image element with dynamic image URL   loading="lazy"
            const imageElement = `
                <div class="image-container">
                        <img src="${thumbnailUrl}" class="lazy-image" alt="${sanitizeInput(data.title || 'Untitled')}">
                </div>`;
            
            // Add the image element to the gallery container
            galleryImagesContainer.innerHTML += imageElement;
        });

        // Call the styleGalleryImages function to adjust the layout
        const galleryContainer = document.getElementById('gallery-images');
        styleGalleryImages(galleryContainer);
        
        startIntersectionObserver();

    } catch (error) {
        console.error("Error fetching gallery and site info: ", error);
        galleryImagesContainer.innerHTML = `<p class="text-danger">Failed to load gallery. Please try again later.</p>`;
    }
};
  
window.fetchGalleryAndSiteInfo = fetchGalleryAndSiteInfo;




document.addEventListener("DOMContentLoaded", () => {
    // Select the main grid for lazy loading
  
    function startIntersectionObserver(){
    const mainGrid = document.querySelector('#gallery-images');
    if (!mainGrid) return; // Exit if the grid doesn't exist
  
    const images = mainGrid.querySelectorAll('.lazy-image');
   console.log('Image already loaded:',images.length);
   
    // Observer for Lazy Loading.
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
  
                    if (src) {
                        img.src = src; // Set the source
  
                        // Handle image load success
                        img.onload = () => {
                            img.classList.add('imgLoaded'); // Add animation class
                        };
  /*
                        // Handle image load error
                        img.onerror = () => {
                            img.src = 'https://rw-501.github.io/raw/images/main.jpg';
                            img.classList.add('error'); // Add error class for fallback styling
                        };
  
                        */
                        // Preload adjacent images
                        preloadImages(images, parseInt(img.dataset.index));
  
                        // Unobserve the loaded image
                        observer.unobserve(img);
                    }else{

                        const imageContainers = document.querySelectorAll('.image-container');

                        imageContainers.forEach((container) => {
                            const img = container.querySelector('img'); // Get the <img> inside the container
                            if (!img || !img.src || img.src.trim() === '') {
                                container.remove(); // Remove the parent container if src is undefined or empty
                            }
                        });
                        
                    }
               
  
  
                  
                }
            });
        },
        {
            root: null, // Observe within viewport
            threshold: 0.5 // Trigger when 50% visible
        }
    );
  
    // Add observer to each image
    images.forEach((img, index) => {
        img.dataset.index = index; // Assign index for preloading
        observer.observe(img); // Start observing
    });
  
    // Preload function for adjacent images
    const preloadImages = (images, currentIndex) => {
        const bufferCount = 2; // Number of images to preload
        for (let i = currentIndex + 1; i <= currentIndex + bufferCount && i < images.length; i++) {
            const preloadImg = new Image();
            preloadImg.src = images[i].getAttribute('data-src');
        }
    };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    // Adjust container size dynamically
    const setContainerSize = () => {
        const imageContainers = mainGrid.querySelectorAll('.image-container');
  
        imageContainers.forEach(container => {
            const img = container.querySelector('.lazy-image');
            if (img.complete && img.naturalHeight > 0) {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                container.style.gridRowEnd = `span ${Math.ceil(aspectRatio * 10)}`;
            }
        });
    };
  
    // Adjust grid layout on window resize
    window.addEventListener('resize', setContainerSize);
  
    // Initialize grid layout
    setContainerSize();
  
  
  }
  
  window.startIntersectionObserver = startIntersectionObserver;
  
  
  });
  
  
  
  
  
  
  
  
  