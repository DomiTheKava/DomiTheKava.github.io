import { uploadData } from './db.js';
import { getData } from './sessionDataManager.js'

let data = null

window.onload = function() {
    // load data
    data = getData()

    // Display the data if it exists
    if (data) {
        console.log(data);
    } else {
        console.log('No data found.');
    }
}

document.getElementById("updateButton").addEventListener("click", function() {
    const field = document.getElementById("updateData").value;

    const data = {
        name: field
    };

    uploadData(data);

});
