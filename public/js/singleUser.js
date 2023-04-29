"use strict";

let button = document.getElementsByClassName("button");
for (let i = 0; i < button.length; i++) {
    button[i].addEventListener("click", deletePost);
}

/*  Deletes a user's post by extracting the ID from the event and sending a
    delete request
*/
async function deletePost(event) {
    // get post id from the event
    const musicID = event.target.attributes.path.value;
    const id = event.target.attributes.id.value;
    console.log(event);
    try {
        const response = await fetch(`/music/${musicID}/${id}`, {
            "method": "DELETE",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        // reload the page
        if (response.ok)
            location.reload();
    } catch(error) {
        console.log("Could not like")
        location.reload();
    }
}

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

let likeButton = document.getElementsByClassName("likeButton");
for (let i = 0; i < likeButton.length; i++) {
    likeButton[i].addEventListener("click", likePost);
}

/*  Deletes a user's post by extracting the ID from the event and sending a
    delete request
*/
async function likePost(event) {
    // get post id from the event
    const musicID = event.target.attributes.path.value;
    console.log(event);
    try {
        const response = await fetch(`/post/${musicID}/like`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        // reload the page
        if (response.ok)
            location.reload();
    } catch(error) {
        console.log("Could not like")
        location.reload();
    }
}