import { uploadData } from './db.js';
import { getData } from './sessionDataManager.js'

let data = null

window.onload = function() {
    // load data
    data = JSON.parse(getData())

    // Display the data if it exists
    if (data) {
        console.log(data);
    } else {
        console.log('No data found.');
    }

    const textElement = document.getElementById("text1");
    const updateSection = document.querySelector(".update-section");

    if (data && data.name) {
        // If name is provided, show a welcome message
        console.log("Name already provided.");
        updateSection.style.display = "none";  // Hide the name prompt
        textElement.textContent = `Welcome back, ${data.name}.`;
        setTimeout(() => {
            clickToContinue();  // Enable touch listener to proceed with steps after touch
        }, 4000); 
    } else {
        console.log("Prompting name. Not yet provided.");
        textElement.textContent = "Please enter your name:";
        updateSection.style.display = "block"; // Show the name prompt
    }
}

function clickToContinue() {
    document.getElementById("clickToContinue").style.display = 'block';

    document.body.addEventListener('click', function onTouch() {

        // Add fade-out class to both #welcomeScreen and #loadingSpinner
        document.getElementById("welcomeScreen").classList.add('fadeOut');
        document.getElementById("loadingSpinner").classList.add('fadeOut');

        // Wait for the transition to complete before hiding and calling steps()
        setTimeout(function() {
            steps();
            document.getElementById("welcomeScreen").style.display = 'none';  // Hide after fade-out
            document.getElementById("loadingSpinner").style.display = 'none';  // Hide the spinner too
        }, 2000);  // Adjust this timeout to match the fade-out duration (1s)

        document.body.removeEventListener('click', onTouch);
    });
}




document.getElementById("updateButton").addEventListener("click", function() {
    const field = document.getElementById("updateData").value;

    const data = {
        name: field,
        step: 0
    };

    uploadData(data);

    const textElement = document.getElementById("text1");
    const newText = document.createElement("p");
    newText.textContent = field;
    textElement.appendChild(newText);

    // document.getElementById("text1").innerHTML += field

});


function showLoading() {
    document.getElementById("loadingSpinner").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingSpinner").style.display = "none";
}

function steps() {

    // need to verfy user is actually on proper step prior to moving to a new step (can just modify code and move on)

    switch (data.step) {
        case 0:
            console.log("step 0");
            break;
        case 1:
            break;
        default:
            break;
    }
}
