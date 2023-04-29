"use strict";

const option = document.getElementById("choice-select");
const file_wrapper = document.querySelector(".file");

option.addEventListener("change", (event) => {
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

    const formData = new FormData();
    formData.append('name',document.getElementById("fname").value);
    formData.append('genre',document.getElementById("fgenre").value);
    formData.append('music', fileForm.elements.file.files[0]);
    
    try {
        const response = await fetch('/songs/file', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {      // File uploaded
            window.location.href="/post"; 

        } else if (response.status === 400) {   // Invalid data
            clearFileInputs();
            appendData(errorsContainer, "Must be a youtube link!", "error");
        } else if( response.status === 404) {  // Invalid file type
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
        if (response.ok) {      // Link uploaded
            window.location.href="/post"; 

        } else if (response.status === 400) {   // Invalid data
            clearURLInputs();
            appendData(errorsContainer, "Must be a youtube link!", "error");
        } else if( response.status === 404) {  // Invalid file type
            clearURLInputs();
            appendData(errorsContainer, "Invalid file type!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

function getURLInputs() {
    const name = document.getElementById("name").value;
    const artist = document.getElementById("artist").value;
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
    const file = document.querySelector('input[type="file"]')

    var data = new FormData(fileForm);
    data.append("name",name);
    data.append("genre",genre);
    data.append("music",file.files[0]);
      
    return data;
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