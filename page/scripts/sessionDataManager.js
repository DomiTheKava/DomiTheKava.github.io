import {ref, getDatabase} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyCIiNoUYRHYUZJC93VObnFDeiQo3lub310",
    authDomain: "crypticpuzzel.firebaseapp.com",
    projectId: "crypticpuzzel",
    storageBucket: "crypticpuzzel.firebasestorage.app",
    messagingSenderId: "1003346594295",
    appId: "1:1003346594295:web:363517e0646750331286f2",
    measurementId: "G-WCY015MY6B",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

export function saveData (data) {
    data = JSON.stringify(data)
    sessionStorage.setItem("userData", data)
}

export function getData() {
    let data = sessionStorage.getItem("userData");

    if (data) {
        let openedData = JSON.parse(data);
        return openedData;
    } else {
        return null;
    }
}

export function saveUserID(userID) {
    // alert(userID)
    sessionStorage.setItem("userId", userID);
    // alert(sessionStorage.getItem("userID"));
}

export function loadUserRef() {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
        // console.log("returning ref")
        return ref(db, 'users/' + userId); 
       
    } else {
        console.log("No userId found in sessionStorage.");
        return null;
    }
}