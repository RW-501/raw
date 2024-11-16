
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
// Firestore imports
import { 
    getFirestore, 
    doc, 
    getDoc, 
    query, 
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
    OAuthProvider, signInAnonymously ,
    signOut, RecaptchaVerifier,
    onAuthStateChanged, 
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

        
          // You can now use `auth`, `db`, `storage`, and `analytics` as needed in your app.
        

     //   console.log("Firebase initialized successfully.");
      //  console.log("Firestore initialized:", db);

        // Export your Firebase instances if needed

    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}

// Load Firebase SDKs when the DOM is fully loaded
//document.addEventListener('DOMContentLoaded', loadFirebaseSDKs);
document.addEventListener('DOMContentLoaded', initializeFirebase);

// Export Firestore, Storage, and Auth instances for use in other modules
export { db,getStorage, ref, uploadBytes, getDownloadURL,
     doc,arrayUnion, RecaptchaVerifier ,increment, getDoc ,
      query, updateDoc, setDoc, addDoc,signInAnonymously , orderBy,
       signInWithPopup,FacebookAuthProvider, GoogleAuthProvider,
        OAuthProvider, signOut, onAuthStateChanged, deleteDoc, getFirestore,
         createUserWithEmailAndPassword, signInWithEmailAndPassword,
          where, getDocs, storage, collection, auth, analytics };


  //console.log("Page loaded Module ?????????????");
  



// Utility variables
let viewStartTime;
let locationData;
let ipAddress;

window.userLocationService = (function () {
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
})();

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

  if (window.checkUrl("/admin/") || window.checkUrl("/admin")) {
    console.log("Admin View");


  } else {
    console.log("User View");
    attachTrackingListeners();
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
  
  
  // Fetch HomePage Data
  window.fetchGalleryAndSiteInfo = async function (mainTextArea, galleryImagesContainer, Collection) {
    try {
        // Get collection reference
        const querySnapshot = await getDocs(collection(db, Collection));
        console.log("mainTextArea, galleryImagesContainer, Collection", mainTextArea, galleryImagesContainer, Collection);

        // Define default images
        const defaultImages = [
            "https://shutterworx.co/images/default_1.gif",
            "https://shutterworx.co/images/default_2.gif",
            "https://shutterworx.co/images/default_3.gif",
            "https://shutterworx.co/images/default_4.gif",
            "https://shutterworx.co/images/placeholder1.gif",
            "https://shutterworx.co/images/placeholder2.gif",
            "https://shutterworx.co/images/placeholder3.gif",
            "https://shutterworx.co/images/placeholder4.gif"
        ];

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
            const thumbnailUrl = data.thumbnailUrl || getRandomDefaultImage();

            // Create and append image element with dynamic image URL
            const imageElement = `
                <div class="col gallery-item">
                    <a href="#" class="d-block gallery-link" data-bs-toggle="modal" data-bs-target="#imageModal" 
                        data-bs-image="${imageUrl}" 
                        data-bs-title="${sanitizeInput(data.title || 'Untitled')}" 
                        data-bs-description="${sanitizeInput(data.description || 'No description available')}">
                        <img src="${thumbnailUrl}" class="img-fluid gallery-thumbnail" alt="${sanitizeInput(data.title || 'Untitled')}" loading="lazy">
                    </a>
                </div>`;
            
            // Add the image element to the gallery container
            galleryImagesContainer.innerHTML += imageElement;
        });

        // Call the styleGalleryImages function to adjust the layout
        const galleryContainer = document.getElementById('gallery-images');
        styleGalleryImages(galleryContainer);

    } catch (error) {
        console.error("Error fetching gallery and site info: ", error);
        galleryImagesContainer.innerHTML = `<p class="text-danger">Failed to load gallery. Please try again later.</p>`;
    }
};
  