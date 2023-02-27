"use strict";

const { addUser } = require("../../Models/usersModel");

const form = document.getElementById("registerForm");

form.addEventListener("submit", submitRegisterForm);

// Submits the register form
async function submitRegisterForm (event) {
    event.preventDefault();
    const errorsContainer = document.getElementById("errors");
    errorsContainer.innerHTML = "";
    
    registerUser();

    try {
        const response = await fetch("/login", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // Account created succsessful
            window.location.href="/login"; 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } else if( response.status === 404) {  // Username/Email already in DB
            clearInputs();
            appendData(errorsContainer, "Invalid username/email or password!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

function registerUser() {
    const name = document.getElementById("Username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    addUser(name, email, password);
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}

function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";    
}