import { saveSessionDataLocally, uploadData } from './db.js';
import { getData } from './sessionDataManager.js'

let data = null

window.onload = function() {
    const rawData = getData();
    console.log("Raw data from getData:", rawData);

    // Parse data if it exists
    let data = null;
    try {
        data = JSON.parse(rawData);
        console.log("Parsed data:", data);
    } catch (e) {
        console.error("Error parsing data:", e);
    }

    if (data) {
        console.log("Data exists, proceed to next step");
        loadScreen();
    } else {
        console.log('No data found. Redirecting.');
     //   window.location.href = "page1.html"; // Redirect if no data found
    }
};

function loadScreen() {

    const textElement = document.getElementById("text1");
    const updateSection = document.querySelector(".update-section");

    if (data && data.name) {
        // If name is provided, show a welcome message
        console.log("Name already provided.");
        updateSection.style.display = "none";  // Hide the name prompt
        textElement.textContent = `Welcome back, ${data.name}.`;
        setTimeout(() => {
            clickToContinue();  // Enable touch listener to proceed with steps after touch
            // console.log("click now")
        }, 4000); 
    } else {
        console.log("Prompting name. Not yet provided.");
        textElement.textContent = "Please enter your name:";
        updateSection.style.display = "block"; // Show the name prompt
    }
}

function clickToContinue() {
    document.getElementById("clickToContinue").style.display = 'flex';
    

    document.addEventListener('click', function onTouch() {

        // console.log("clicked")

        // Add fade-out class to both #welcomeScreen and #loadingSpinner
        document.getElementById("welcomeScreen").classList.add('fadeOut');
        document.getElementById("loadingSpinner").classList.add('fadeOut');

        // Wait for the transition to complete before hiding and calling steps()
        setTimeout(function() {
            steps();
            document.getElementById("welcomeScreen").style.display = 'none';  // Hide after fade-out
            document.getElementById("loadingSpinner").style.display = 'none';  // Hide the spinner too
            // window.location.href = "page2.html";
            // window.location.href = "page\page2.html"
        }, 3000);  // Adjust this timeout to match the fade-out duration (1s)

        document.removeEventListener('click', onTouch);
    });
}




document.getElementById("updateButton").addEventListener("click", async function() {
    const field = document.getElementById("updateData").value;

    const newData = {
        name: field,
        step: 0
    };

    await uploadData(newData);

    await saveSessionDataLocally()

    data = JSON.parse(getData())

    
    loadScreen()

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
