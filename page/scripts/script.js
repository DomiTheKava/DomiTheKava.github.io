import { login, setUserRef } from './db.js';
// import { saveData, getData } from './sessionDataManager.js'

let loggedIn = false;

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // prevents refreshing page

    if (!loggedIn) {
        loggedIn = true;
        console.log("clicked");

        let email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        console.log("Attempting to log in with email:", email);
        
        login(email, password);

        setTimeout(() => {
            loggedIn = false;
        }, 3000); 
    } else {
        console.log("Stop clicking!!!");
        document.getElementById("status").innerHTML = "Stop clicking login nerd";
    }
});
