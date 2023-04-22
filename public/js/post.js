"use strict";

const urlForm = document.getElementById("URLForm");
const fileForm = document.getElementById("fileForm");


form.addEventListener("submit",submitURLForm);
form.addEventListener("submit", submitFileForm);

async function submitURLForm (event) {
    event.preventDefault();
    const errorsContainer = document.getElementById("errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch("/users/<%= user.userID %>/file", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // Account logged in
            window.location.href="/post"; 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } else if( response.status === 404) {  // Invalid account info
            clearInputs();
            appendData(errorsContainer, "Invalid username/email or password!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}