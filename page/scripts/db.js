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


// Log in or create a new user
export function login(email, password) {
  signInUser(email, password);
  loggedIn = true
}

// sign in user or of not found create with CreateUser
async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in with UID:", user.uid);
    document.getElementById("status").innerHTML = "User Logged in";
    setUserRef(user.uid);

    await checkUserData(user.uid); // check if user exists with a get request, return error invalid login
    await saveSessionDataLocally(); // save data to device

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

// Function to create a new user with email and password
function createUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password) // create user with authentication
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("status").innerHTML = "successfully signed up User. Click login to proceed.";
      setUserRef(user.uid); // set reference to users uid
      initializeUser(email, password); // actually create user within realtime database
      console.log("User signed up with UID:", user.uid);
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
    });
}

// return the reference of the users realtime DB
export function setUserRef(userId) {
  userReference = ref(db, 'users/' + userId);
  saveUserID(userId) // save user ID -------
  onValue(userReference, (snapshot) => {
    const data = snapshot.val();
    // (Handle user data updates here)
  });
}

// add user data to the database 
async function initializeUser(email, password) {
  console.log(email, password)
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
async function checkUserData(email, password) {
  await get(userReference)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // User data exists
      } else {
        console.log("User first time login... Creating account...");
       // initializeUser(userId, userId, userId);  // Create user if data doesn't exist
        initializeUser(email, password);
        document.getElementById("status").innerHTML = "Account created!";
      }
    })
    .catch((error) => {
      console.error("Error checking user data:", error);
      document.getElementById("status").innerHTML = "Error checking user data";
    });
}



// export function getDaata() {
//   return loggedIn
// }

export async function saveSessionDataLocally() {
  try {
    const snapshot = await get(loadUserRef());

    // document.getElementById("status").innerHTML = "Retrieving data...";

    if (snapshot.exists()) {

      // document.getElementById("status").innerHTML = "Storing Data...";

      const data = snapshot.val();
      console.log("User data exists:", data);

      // sessionStorage.setItem("userData", JSON.stringify(data)); // save data
      saveData(JSON.stringify(data))

      console.log("Data saved successfully!");

      // document.getElementById("status").innerHTML = "Data saved...";

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
        // saveSessionDataLocally()
        console.log("User data updated successfully!");
      })
      .catch((error) => {
        console.error("Error writing data:", error);
      });
  } else {
    console.log("Reference not found");
  }
}

