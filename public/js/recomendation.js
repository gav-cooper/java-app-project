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
    document.getElementById("preference").value = "";
    document.getElementById("music").value = "";    
    document.getElementById("username").value = "";
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

// to start
window.addEventListener("load", ()=>{
    // get audio
    const audio = new Audio("music/rock/sample1.mp3");
 
    // get botton
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    const stop = document.getElementById("stop");
 
    // play
    play.addEventListener("click", ()=>{
        audio.play();
    });
 
    // pause
    pause.addEventListener("click", ()=>{
        audio.pause();
    });
 
    // stop
    stop.addEventListener("click", ()=>{
        audio.pause();
        audio.currentTime = 0;  // to move to start 
    });
});


/*the music list*/
const playlist=[
    "music/rock/sample1.mp3",
    "music/rock/sample2.mp3", 
    "music/hiphop/sample1.mp3", 
    "music/hiphop/sample2.mp3",
    "music/classic/sample1.mp3", 
    "music/classic/sample2.mp3" 
    ]
    /* audio object */
    const myaudio = new Audio(playlist);

    /* get random music */
    function randomplay(list){
        myaudio.src = list[Math.floor(Math.random()*list.length)];
        myaudio.play();
        codument.getElementById("playing").textContent = 
        "[playing]" + +myaudio.src.match( /[^\/]+$/ );
    }