"use strict";

const form = document.getElementById("reccomendationForm");
import { recommend } from "../Models/recomandationModel";

form.addEventListener("submit", submitReccoemdationForm);


// Submits the recommendation form
async function submitReccoemdationForm (event) {
    event.preventDefault();
    const errorsContainer = document.getElementById("errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch("/recomendation", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // to set the reccomendation in count
            window.location.href="/recommendation"; 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } else if( response.status === 404) {  // Invalid account info
            clearInputs();
            appendData(errorsContainer, "Invalid number of counts", "error");
        }
    } catch (err) {
        console.error(err);
    }
}


function getInputs() {
    const preference = document.getElementById("preference").value;
    const music = document.getElementById("music").value;
    const user = document.getElementById("username").value;
    return {
        music,
        preference,
        user
    }
}


function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}

function clearInputs() {
    document.getElementById("rock").value = "";
    document.getElementById("classic").value = "";    
    document.getElementById("hiphop").value = "";
}

let myaudio = document.querySelector('audio')
let mybutton = document.querySelector('button')

window.addEventListener('DOMContentLoaded', function(){
    const audioElement = document.querySelector("audio");
    audioElement.addEventListener("loadstart", (e) => {

    })
})

myaudio.onloadstart = () => {
    recommend()
}
