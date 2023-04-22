"use strict";

const option = document.getElementById("choice-select");
const file_wrapper = document.querySelector(".file");

option.addEventListener("change", (event) => {
    console.log(true)
    if (event.target.value === "file") {
        document.querySelector(".link-wrapper").style.display = "None";
        document.querySelector(".file-wrapper").style.display = "flex";
    }
    if (event.target.value === "link") {
        document.querySelector(".file-wrapper").style.display = "None";
        document.querySelector(".link-wrapper").style.display = "flex";
    }
});

const fileForm = document.getElementById("fileForm");

fileForm.addEventListener("submit", submitFileForm);

async function submitFileForm (event) {
    event.preventDefault();
    const errorsContainer = document.getElementById("errors");
    errorsContainer.innerHTML = "";
    
    const body = getFileInputs();
    const file = getFile(); 

    try {
        const response = await fetch(`/songs/file`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        console.log(response);
        if (response.ok) {      // Account logged in
            window.location.href="/post"; 

        } else if (response.status === 400) {   // Input parameter error
            clearFileInputs();
            appendData(errorsContainer, "Must be a youtube link!", "error");
        } else if( response.status === 404) {  // Invalid account info
            clearFileInputs();
            appendData(errorsContainer, "Invalid file type!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

const urlForm = document.getElementById("URLForm");

urlForm.addEventListener("submit", submitURLForm);

async function submitURLForm (event) {
    event.preventDefault();
    const errorsContainer = document.getElementById("errors");
    errorsContainer.innerHTML = "";
    
    const body = getURLInputs();

    try {
        const response = await fetch(`/songs/link`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        console.log(response);
        if (response.ok) {      // Account logged in
            window.location.href="/post"; 

        } else if (response.status === 400) {   // Input parameter error
            clearURLInputs();
            appendData(errorsContainer, "Must be a youtube link!", "error");
        } else if( response.status === 404) {  // Invalid account info
            clearURLInputs();
            appendData(errorsContainer, "Invalid file type!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

function getURLInputs() {
    const name = document.getElementById("name").value;
    const artist = document.getElementById("genre").value;
    const genre = document.getElementById("genre").value;
    const path = document.getElementById("path").value;
    
    return {
        name,
        artist,
        genre,
        path
    }
}

function clearURLInputs() {
    document.getElementById("name").value = "";
    document.getElementById("artist").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("path").value = "";
}


function getFileInputs() {
    const name = document.getElementById("fname").value;
    const genre = document.getElementById("fgenre").value;

    return {
        name,
        genre
    }
}

function getFile() {
    const music = document.getElementById("file").value;
    return music;
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}

function clearFileInputs() {
    document.getElementById("fname").value = "";
    document.getElementById("fgenre").value = "";
}