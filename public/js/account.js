"use strict";

const pfpForm = document.getElementById("profile");

pfpForm.addEventListener("submit", submitPfpForm);

async function submitPfpForm (event) {
    event.preventDefault();

    const errorsContainer = document.getElementById("errors");
    errorsContainer.innerHTML = "";
    
    const formData = new FormData();
    formData.append('pfp', pfpForm.elements.file.files[0]);
    
    try {
        const response = await fetch(`${window.location.href}/pfp`, {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {      // File uploaded successfully
            location.reload();
        }  else if (response.status === 404) {
            appendData(errorsContainer, "Invalid file type!", "error");
        }   
    } catch (err) {
        console.error(err);
    }
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}