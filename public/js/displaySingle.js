"use strict";

// Extract album artwork from uploaded song tags
const jsmediatags = window.jsmediatags;

const covers = document.getElementsByClassName('cover');
for (let j = 0; j < covers.length; j++){ 
    jsmediatags.read(`http://localhost:8000${covers[j].attributes.path.value}`, {
        onSuccess: function (tag) {
            const data = tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = "";
            for(let i = 0; i < data.length; i++)
                base64String += String.fromCharCode(data[i]);

            covers[j].style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
        },
        onError: function(error ){
            
        }
    })
}

const button = document.getElementById("likePost");
const likes = document.getElementById("likes")
const numLikes = document.getElementById("numLikes");

button.addEventListener("click", likeThePost);

async function likeThePost (event) {
    timeoutButton();
    if (likes.className === "liked") {
        numLikes.innerHTML = addElement(numLikes,-1);
        likes.className = "unliked";
        button.innerHTML = "Like";
    } else {
        numLikes.innerHTML = addElement(numLikes,1);
        likes.className = "liked";
        button.innerHTML = "Unlike";
    }
    try {
        const response = await fetch(`${window.location}/like`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            }
        });
    } catch(error) {
        console.log("Could not like!")
    }
}

function addElement (element, num) {
    let int = parseInt(element.innerHTML);
    int = int + num;
    return int.toString();
}

function timeoutButton() {
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 10000)
    return true;
}