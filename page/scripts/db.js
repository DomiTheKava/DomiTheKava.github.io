import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, onValue, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { saveData, saveUserID, loadUserRef } from './sessionDataManager.js'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIiNoUYRHYUZJC93VObnFDeiQo3lub310",
  authDomain: "crypticpuzzel.firebaseapp.com",
  projectId: "crypticpuzzel",
  storageBucket: "crypticpuzzel.firebasestorage.app",
  messagingSenderId: "1003346594295",
  appId: "1:1003346594295:web:363517e0646750331286f2",
  measurementId: "G-WCY015MY6B",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database
const auth = getAuth(app);
const db = getDatabase(app);

// Firebase reference for user data
let userReference;

let loggedIn = false

// Function to set user reference based on UID after sign in or sign up
export function setUserRef(userId) {
  userReference = ref(db, 'users/' + userId);
  saveUserID(userId) // save user ID -------
  onValue(userReference, (snapshot) => {
    const data = snapshot.val();
    // (Handle user data updates here)
  });
}

// Function to create a new user with email and password
function createUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("status").innerHTML = "successfully signed up User";
      setUserRef(user.uid);
      initializeUser(user.uid, email, password);
      console.log("User signed up with UID:", user.uid);
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
    });
}

// Function to sign in a user with email and password
async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in with UID:", user.uid);
    document.getElementById("status").innerHTML = "User Logged in";
    setUserRef(user.uid);

    await checkUserData(user.uid); // Await the user data check
    await saveSessionDataLocally(); // Await the data saving process

    document.getElementById("status").innerHTML = "Data saved. Redirecting..."; // Show status before redirect
    window.location.href = "page1.html"; // Only redirect after data is saved

  } catch (error) {
    console.error("Error signing in:", error.code, error.message);
    document.getElementById("status").innerHTML = "Error signing in: " + error.message;

    if (error.code === 'auth/invalid-login-credentials') {
      document.getElementById("status").innerHTML = "Account not found, creating new account...";
      createUser(email, password);
    }
  }
}

// Function to initialize user data in the database
async function initializeUser(email, password) {
    await set(userReference, {
      email: email, // TODO:
      password: password, // ignore this for data flaws TODO:
    }).then(() => {
      console.log("User data initialized successfully!");
    }).catch((error) => {
      console.error("Error writing data:", error);
    });
}

// Function to check if user data exists after sign in
async function checkUserData(userId) {
  await get(userReference)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // User data exists
      } else {
        console.log("User first time login... Creating account...");
        document.getElementById("status").innerHTML = "Account created!";
        initializeUser(userId, userId, userId);  // Create user if data doesn't exist
      }
    })
    .catch((error) => {
      console.error("Error checking user data:", error);
      document.getElementById("status").innerHTML = "Error checking user data";
    });
}

// Log in or create a new user
export function login(email, password) {
  signInUser(email, password);
  loggedIn = true
}

// export function getDaata() {
//   return loggedIn
// }

async function saveSessionDataLocally() {
  try {
    const snapshot = await get(userReference);

    document.getElementById("status").innerHTML = "Retrieving data...";

    if (snapshot.exists()) {

      document.getElementById("status").innerHTML = "Storing Data...";

      const data = snapshot.val();
      console.log("User data exists:", data);

      // sessionStorage.setItem("userData", JSON.stringify(data)); // save data
      saveData(JSON.stringify(data))

      console.log("Data saved successfully!");

      document.getElementById("status").innerHTML = "Data saved...";

    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error getting or saving data:", error);
  }
}

export function uploadData(userData) {
  const userRef = loadUserRef();
  if (userRef) {
    update(userRef, userData)
      .then(() => {
        console.log("User data updated successfully!");
      })
      .catch((error) => {
        console.error("Error writing data:", error);
      });
  } else {
    console.log("Reference not found");
  }
}

