import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
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

const alertRef = ref(db, 'alert/alert');

onValue(alertRef, (snapshot) => {
    if (snapshot.exists()) {
      const alertValue = snapshot.val();
      document.getElementById("alertHeader").innerText = alertValue;
    } else {
      console.log("No data available at 'alert'");
    }
  }, (error) => {
    console.error("Error fetching alert data: ", error);
  });